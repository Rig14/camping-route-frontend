import {CampingRouteImageNamesDto} from "../types/dto/CampingRouteImageNamesDto.ts";
import {Axios} from "axios";
import {ImageUrl} from "../types/ImageUrl.ts";

export async function getImageUrlsForId(id: string | number, axios: Axios): Promise<string[]> {
    try {
        const campingRouteImageURLs: string[] = []
        const responseNames = await axios.get<CampingRouteImageNamesDto>(`/api/public/camping_routes/images/${id}`)
        responseNames.data.imageNames.forEach((name => {
            campingRouteImageURLs.push(`/api/public/camping_routes/images/${id}/${name}`)
        }))
        return campingRouteImageURLs;
    } catch (error) {
        console.error("Error when fetching camping route image names", error)
    }
    return [];
}

export async function getImageUrlsAndDeleteUrlsForCampingRouteId(id: string | number, axios: Axios): Promise<ImageUrl[]> {
    try {
        const names = await axios.get<CampingRouteImageNamesDto>(`/api/public/camping_routes/images/${id}`)

        return names.data.imageNames.map(name => ({
            imageUrl: `/api/public/camping_routes/images/${id}/${name}`,
            deleteUrl: `/api/camping_routes/images/${id}/${name}`
        }))
    } catch (error) {
        console.error("Error when fetching camping route image names", error)
    }

    return [];
}