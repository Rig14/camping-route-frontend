import {CampingRouteImageNamesDto} from "../types/dto/CampingRouteImageNamesDto.ts";
import {Axios} from "axios";

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