

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const resources = [
  {
    id: 1,
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
