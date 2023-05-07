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
        userId: z.string().nullable(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === null) throw new Error("No user id provided");
      const address = await ctx.prisma.address.create({
        data: {
          name: input.name,
          favoriteFor: {
            connect: {
              id: input.userId,
            },
          },
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
  likePlace: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session === null) {
        throw new Error("No user id provided");
      }
      const likeExists = await ctx.prisma.action.findUnique({
        where: {
          placeId_userId_type: {
            placeId: input,
            userId: ctx.session.user.id,
            type: "LIKE",
          },
        },
      });
      const dislikeExists = await ctx.prisma.action.findUnique({
        where: {
          placeId_userId_type: {
            placeId: input,
            userId: ctx.session.user.id,
            type: "DISLIKE",
          },
        },
      });
      if (likeExists) {
        if (!dislikeExists) {
          await ctx.prisma.action.create({
            data: {
              place: {
                connect: {
                  id: input,
                },
              },
              type: "DISLIKE",
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
        }
        return await ctx.prisma.action.delete({
          where: {
            id: likeExists.id,
          },
        });
      } else {
        if (dislikeExists) {
          await ctx.prisma.action.delete({
            where: {
              id: dislikeExists.id,
            },
          });
        }
        return await ctx.prisma.action.create({
          data: {
            place: {
              connect: {
                id: input,
              },
            },
            type: "LIKE",
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }
    }),
  dislikePlace: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session === null) {
        throw new Error("No user id provided");
      }
      const likeExists = await ctx.prisma.action.findUnique({
        where: {
          placeId_userId_type: {
            placeId: input,
            userId: ctx.session.user.id,
            type: "LIKE",
          },
        },
      });
      const dislikeExists = await ctx.prisma.action.findUnique({
        where: {
          placeId_userId_type: {
            placeId: input,
            userId: ctx.session.user.id,
            type: "DISLIKE",
          },
        },
      });
      if (dislikeExists) {
        if (!likeExists) {
          await ctx.prisma.action.create({
            data: {
              place: {
                connect: {
                  id: input,
                },
              },
              type: "LIKE",
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
        }
        return await ctx.prisma.action.delete({
          where: {
            id: dislikeExists.id,
          },
        });
      } else {
        if (likeExists) {
          await ctx.prisma.action.delete({
            where: {
              id: likeExists.id,
            },
          });
        }
        return await ctx.prisma.action.create({
          data: {
            place: {
              connect: {
                id: input,
              },
            },
            type: "DISLIKE",
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }
    }),
  actions: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (ctx.session === null) {
      throw new Error("No user id provided");
    }

    return await ctx.prisma.action.findMany({
      where: {
        userId: ctx.session.user.id,
        placeId: input,
      },
    });
  }),
});
