import { BASE_URL } from "../constants/app"

export const getImage = (image) => {
    return `${BASE_URL}${image}`
}