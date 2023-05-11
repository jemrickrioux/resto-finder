import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Blob } from "next/dist/compiled/@edge-runtime/primitives/blob";
import type { Place as DBPlace } from "@prisma/client";
import * as fuzz from "fuzzball";
import _ from "lodash";
import {
  Client,
  Language,
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
        takeout: z.boolean().default(false),
        livraison: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const req =
        input.latitude !== undefined &&
        input.longitude !== undefined &&
        (await client.placesNearby({
          params: {
            language: "fr-CA" as Language,
            type: "restaurant",
            key: process.env.GOOGLE_PLACES_API_KEY as string,
            radius: input.distance,
            location: `${input.latitude.toString()},${input.longitude.toString()}`,
            opennow: process.env.NODE_ENV === "production" ? true : undefined,
            keyword: input.keyword !== undefined ? input.keyword : "",
            maxprice: input.priceLevel,
          },
        }));
      if (!req) {
        throw new Error("Could not find any restaurants");
      }

      const results: RestoBusiness[] = req.data.results.map((result) => {
        return {
          name: result.name!,
          address: result.vicinity!,
          types: result.types!,
          id: result.place_id!,
          rating: result.rating!,
          priceLevel: result.price_level!,
          coordinates: result.geometry!.location,
          numberOfRatings: result.user_ratings_total!,
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

      const uniques = _.uniqWith(results.reverse(), (value, other) => {
        const ratio = fuzz.ratio(value.name, other.name);
        return ratio > 60;
      });

      if (input.takeout && input.livraison) {
        return uniques.filter((result) => {
          return (
            result.types.includes("meal_takeaway") ||
            result.types.includes("meal_delivery")
          );
        });
      }
      if (input.takeout) {
        return uniques.filter((result) => {
          return result.types.includes("meal_takeaway");
        });
      }
      if (input.livraison) {
        return uniques.filter((result) => {
          console.log(result);
          return result.types.includes("meal_delivery");
        });
      }

      return uniques;
    }),
  photo: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const req: PlacePhotoResponse = await client.placePhoto({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        photoreference: input,
        maxwidth: 1200,
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
    /* const existing = await ctx.prisma.place.findUnique({
      where: {
        googlePlaceId: input,
      },
    });
    console.log("existing", existing);*/
    const req = await client.placeDetails({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        place_id: input,
      },
    });
    console.log(req.data.result);
    if (!req) {
      throw new Error("Could not find restaurant details");
    }
    console.log("req", req.data.result);
    const parsedResult: Partial<
      PlaceData & {
        delivery: boolean;
        dine_in: boolean;
        takeout: boolean;
        serves_beer: boolean;
        serves_wine: boolean;
        serves_breakfast: boolean;
        serves_lunch: boolean;
        serves_dinner: boolean;
        serves_brunch: boolean;
        reservable: boolean;
      }
    > = req.data.result;
    const results: Partial<RestoBusinessDetails> = {
      id: parsedResult.place_id,
      phone: parsedResult.international_phone_number,
      website: parsedResult.website,
      ratings: parsedResult.rating,
      url: parsedResult.url,
      delivery: parsedResult.delivery,
      dine_in: parsedResult.dine_in,
      takeout: parsedResult.takeout,
      serves_beer: parsedResult.serves_beer,
      serves_wine: parsedResult.serves_wine,
      serves_breakfast: parsedResult.serves_breakfast,
      serves_lunch: parsedResult.serves_lunch,
      serves_dinner: parsedResult.serves_dinner,
      serves_brunch: parsedResult.serves_brunch,
      reservable: parsedResult.reservable,
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
