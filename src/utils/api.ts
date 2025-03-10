import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";

export type AppRouter = {
  // We'll define our router types here later
};

export const api = createTRPCReact<AppRouter>();

export const trpcClient = api.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export const queryClient = new QueryClient(); 