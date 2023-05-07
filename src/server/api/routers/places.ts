import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Blob } from "next/dist/compiled/@edge-runtime/primitives/blob";

import {
  Client,
  PlaceData,
  PlacePhotoResponse,
} from "@googlemaps/google-maps-services-js";
import * as process from "process";
import { calculateDistance } from "~/utils/distance";

const client = new Client({});

export const placesRouter = createTRPCRouter({
  restaurant: publicProcedure
    .input(
      z.object({
        location: z.string().optional(),
        priceLevel: z.number(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        distance: z.number(),
        keyword: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const req =
        input.latitude !== undefined &&
        input.longitude !== undefined &&
        (await client.placesNearby({
          params: {
            type: "restaurant",
            key: process.env.GOOGLE_PLACES_API_KEY as string,
            radius: input.distance,
            location: `${input.latitude.toString()},${input.longitude.toString()}`,
            //opennow: true,
            keyword: input.keyword !== undefined ? input.keyword : "",
            maxprice: input.priceLevel,
          },
        }));
      console.log(req);
      if (!req) {
        throw new Error("Could not find any restaurants");
      }
      console.log(req.data.results);

      const results: RestoBusiness[] = req.data.results.map((result) => {
        return {
          name: result.name!,
          phone: result.formatted_phone_number!,
          address: result.vicinity!,
          types: result.types!,
          id: result.place_id!,
          website: result.website!,
          rating: result.rating!,
          priceLevel: result.price_level!,
          distance: calculateDistance(
            { lat: input.latitude!, lng: input.longitude! },
            {
              lat: result.geometry!.location.lat,
              lng: result.geometry!.location.lng,
            }
          ),
          image:
            result.photos !== undefined
              ? result.photos[0]!.photo_reference
              : null,
        };
      });

      return results;
    }),
  photo: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const req: PlacePhotoResponse = await client.placePhoto({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        photoreference: input,
        maxwidth: 800,
      },
      responseType: "arraybuffer",
    });
    if (req) {
      const blob = new Blob([req.data], { type: "image/jpeg" });
      const source = URL.createObjectURL(blob);
      return source;
    }
  }),
  details: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const req = await client.placeDetails({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        place_id: input,
        fields: [
          "place_id",
          "serves_beer",
          "serves_wine",
          "takeout",
          "delivery",
        ],
      },
    });
    if (!req) {
      throw new Error("Could not find restaurant details");
    }
    console.log(req.data.result);
    const parsedResult: Partial<
      PlaceData & {
        serves_beer: boolean;
        serves_wine: boolean;
      }
    > = req.data.result;
    const results: RestoBusinessDetails = {
      id: req.data.result.place_id!,
      beer: parsedResult.serves_beer ? parsedResult.serves_beer : false,
      wine: parsedResult.serves_wine ? parsedResult.serves_wine : false,
    };
    return results;
  }),
});

export type RestoBusinessDetails = {
  id: string;
  beer: boolean;
  wine: boolean;
};
export type RestoBusiness = {
  id: string;
  name: string;
  phone: string;
  types: string[];
  address: string;
  image: null | string;
  website: string;
  distance: number;
  rating: number;
  priceLevel: number;
};
