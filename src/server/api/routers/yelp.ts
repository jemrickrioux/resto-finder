import { z } from "zod";
import axios from "axios";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { YelpSearchRequest } from "~/types/types";

const baseYelpUrl = "https://api.yelp.com/v3/businesses/search";
export const yelpRouter = createTRPCRouter({
  restaurant: publicProcedure
    .input(
      z.object({
        location: z.string().optional(),
        priceLevel: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let url = "";
      if (input.latitude !== undefined && input.longitude !== undefined) {
        url = `${baseYelpUrl}?longitude=${input.longitude}&latitude=${input.latitude}&price=${input.priceLevel}`;
      }
      if (input.location !== undefined) {
        url = `${baseYelpUrl}?location=${input.location}&price=${input.priceLevel}`;
      }

      const req = await axios.get<YelpSearchRequest>(url, {
        headers: {
          Authorization: "Bearer " + (process.env.YELP_API_KEY as string),
        },
      });

      return req.data;
    }),
});
