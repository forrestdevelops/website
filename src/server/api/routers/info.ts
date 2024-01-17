import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

let resources = [
  {
    name: "Weight Tracker",
    description: "Track your weight over time",
    url: "https://weight.forrestdevelops.com"
  }
]

export const infoRouter = createTRPCRouter({
  hello: publicProcedure
    .query(({ input }) => {
      return resources;
    }),
});
