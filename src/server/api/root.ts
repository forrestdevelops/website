import { info } from "console";
import { infoRouter } from "~/server/api/routers/info";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  info: infoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
