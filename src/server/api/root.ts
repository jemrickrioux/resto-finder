import { createTRPCRouter } from "~/server/api/trpc";
import { yelpRouter } from "~/server/api/routers/yelp";
import { placesRouter } from "~/server/api/routers/places";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  yelp: yelpRouter,
  places: placesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
