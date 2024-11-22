<script lang="ts" setup>
import {inject, onMounted, ref} from 'vue';
import {Axios} from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';

// Inject Axios instance
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


// Ref for the map container
const mapContainer = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let gpxLayer: L.Layer | null = null;

// Fetch and display GPX file
const displayGpxRoute = async () => {
  try {
    // Ensure map is initialized
    if (!mapContainer.value) return;

    // Remove existing GPX layer if it exists
    if (gpxLayer) {
      map?.removeLayer(gpxLayer);
    }

    // Fetch GPX file
    const response = await axios.get(`/api/public/camping_routes/gpx/${props.campingRouteId}`, {
      responseType: 'blob'
    });

    // Create a URL for the blob
    const gpxUrl = URL.createObjectURL(response.data);
    console.log(gpxUrl)

    // Create Leaflet map if not exists
    if (!map) {
      map = L.map(mapContainer.value).setView([0, 0], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

    }

    // Add GPX layer
    gpxLayer = new L.GPX(gpxUrl, {
      async: true,
      polyline_options: {
        color: 'red',
        opacity: 0.75,
      },
      marker_options: {
        startIconUrl: '/marker-start.png',
        endIconUrl: '/marker-end.png',
      }
    }).on('loaded', function(e) {
      // Fit map to GPX track
      map?.fitBounds(e.target.getBounds());
    }).addTo(map!);

  } catch (error) {
    console.error('Error fetching or displaying GPX route:', error);
  }
};

onMounted(displayGpxRoute);
</script>

<template>
  <div class="bg-gray-700 p-10 rounded-2xl m-5">
    <h1 class="font-bold text-3xl mb-4">Matkaraja kaart:</h1>
    <div ref="mapContainer" class="h-96 w-full rounded-lg"></div>
  </div>
</template>