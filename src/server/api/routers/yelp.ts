import { z } from "zod";
import axios from "axios";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

export type YelpBusiness = {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: { alias: string; title: string }[];
  rating: number;
  coordinates: { latitude: number; longitude: number };
  transactions: string[];
  price: string;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  };
  phone: string;
  display_phone: string;
  distance: number;
};

type YelpSearchRequest = {
  businesses: YelpBusiness[];
  total: number;
  region: {
    center: {
      longitude: number;
      latitude: number;
    };
  };
};
