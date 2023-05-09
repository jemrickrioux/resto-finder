import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Blob } from "next/dist/compiled/@edge-runtime/primitives/blob";
import type { Place as DBPlace } from "@prisma/client";

import {
  Client,
  Place,
  PlaceData,
  PlacePhotoResponse,
} from "@googlemaps/google-maps-services-js";
import * as process from "process";
import { calculateDistance } from "~/utils/distance";
import { RestoBusiness, RestoBusinessDetails } from "~/types/types";

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
          address: result.vicinity!,
          types: result.types!,
          id: result.place_id!,
          rating: result.rating!,
          priceLevel: result.price_level!,
          lat: result.geometry!.location.lat,
          lng: result.geometry!.location.lng,
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
    const existing = await ctx.prisma.place.findUnique({
      where: {
        googlePlaceId: input,
      },
    });
    console.log("existing", existing);
    const req = await client.placeDetails({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        place_id: input,
      },
    });
    if (!req) {
      throw new Error("Could not find restaurant details");
    }
    const parsedResult: Partial<PlaceData> = req.data.result;
    const results: RestoBusinessDetails = {
      id: req.data.result.place_id!,
      phone: req.data.result.international_phone_number!,
      website: req.data.result.website!,
      ratings: req.data.result.rating!,
    };
    return results;
  }),
  addPlace: publicProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        types: z.array(z.string()),
        id: z.string(),
        rating: z.number(),
        priceLevel: z.number(),
        lat: z.number(),
        lng: z.number(),
        phone: z.string(),
        website: z.string(),
        image: z.string().nullable(),
        googlePlaceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.prisma.place.findUnique({
        where: {
          googlePlaceId: input.googlePlaceId,
        },
      });
      const place: DBPlace = !exists
        ? await ctx.prisma.place.create({
            data: {
              name: input.name,
              address: input.address,
              types: JSON.stringify(input.types),
              lat: input.lat,
              lng: input.lng,
              id: input.id,
              ratings: input.rating,
              priceLevel: input.priceLevel,
              phone: input.phone,
              website: input.website,
              image: input.image,
              googlePlaceId: input.googlePlaceId,
            },
          })
        : { ...exists };
      return place;
    }),
});
