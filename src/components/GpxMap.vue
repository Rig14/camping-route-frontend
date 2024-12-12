<script lang="ts" setup>
import { inject, onMounted, ref, watch, nextTick } from 'vue';
import { Axios } from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';

const axios = inject<Axios>('axios');
if (axios === undefined) {
  throw new Error("Axios is not injected");
}

const props = defineProps({
  campingRouteId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["update:hasGpxFile"]);

const mapContainer = ref<HTMLDivElement | null>(null);
const hasGpxFile = ref(false);
let map: L.Map | null = null;
let gpxLayer: L.Layer | null = null;

const displayGpxRoute = async () => {
  try {
    const response = await axios.get(`/api/public/camping_routes/gpx/${props.campingRouteId}`, {
      responseType: 'blob'
    });

    hasGpxFile.value = response.data.size > 0;

    emit("update:hasGpxFile", hasGpxFile.value);

    if (!hasGpxFile.value) return;

    await nextTick();

    if (!mapContainer.value) return;

    if (gpxLayer) {
      map?.removeLayer(gpxLayer);
    }

    const gpxUrl = URL.createObjectURL(response.data);

    if (!map) {
      map = L.map(mapContainer.value).setView([0, 0], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    }

    gpxLayer = new (L as any).GPX(gpxUrl, {
      async: true,
      marker_options: {
        startIconUrl: '/marker-start.png',
        endIconUrl: '/marker-end.png',
        shadowUrl: '/marker-shadow.png'
      }
    }).on('loaded', function(e: L.LayerEvent) {
      map?.fitBounds(e.target.getBounds());
    }).addTo(map);

    map.invalidateSize();

  } catch (error) {
    console.error('Error fetching or displaying GPX route:', error);
    hasGpxFile.value = false;
    emit("update:hasGpxFile", false);
  }
};

watch(() => props.campingRouteId, displayGpxRoute);
onMounted(displayGpxRoute);
</script>

<template>
  <div v-show="hasGpxFile" class="bg-gradient-to-tl from-green-950 to-gray-900 text-white rounded-xl shadow-md p-6">
    <h2 class="text-2xl font-semibold mb-4">Matkaraja kaart</h2>
    <div ref="mapContainer" class="h-96 w-full rounded-lg z-0"></div>
  </div>
  <div v-if="!hasGpxFile" class="text-center text-gray-500 p-4">
    Sellel matkamarsruudil pole GPX-marsruuti saadaval
  </div>
</template>
