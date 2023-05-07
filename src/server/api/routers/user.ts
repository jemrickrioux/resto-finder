import { z } from "zod";
import axios from "axios";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import type { Address } from "@prisma/client";

export const userRouter = createTRPCRouter({
  addresses: publicProcedure
    .input(z.string().optional())
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          lat: z.number(),
          lng: z.number(),
        })
      )
    )
    .query(async ({ ctx, input }) => {
      if (input !== undefined) {
        const req: Address[] = await ctx.prisma.address.findMany({
          where: {
            userId: input,
          },
        });
        return req;
      } else {
        throw new Error("No user id provided");
      }
    }),
  addAddress: publicProcedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.address.create({
        data: {
          name: input.name,
          user: {
            connect: {
              id: input.userId,
            },
          },
          lat: input.lat,
          lng: input.lng,
        },
      });
      return address;
    }),
});
