import { initTRPC } from '@trpc/server';
import { createContext } from './context';
import { coursesRouter } from "./courses";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  courses: coursesRouter,
});

export type AppRouter = typeof appRouter; 