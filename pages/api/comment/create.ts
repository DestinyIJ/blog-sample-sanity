import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from "@sanity/client"

import { sanityClient, createUrlFor } from '../../../sanity'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { _id, name, email, comment } = JSON.parse(req.body)

    try {
        await sanityClient.create({
            _type: "comment",
            post: {
                _type: "reference",
                _ref: _id
            },
            name,
            email,
            comment
        })
    } catch (error) {
        res.status(500).json({ message: 'Could not save comment' })
    }

    res.status(200).json({ message: 'Comment added' })
 
}