import { createClient } from "next-sanity"
import createImageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_TOKEN

export const config = {
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: true
}

export const sanityClient = createClient(config)
export const createUrlFor = (source) => createImageUrlBuilder(config).image(source)