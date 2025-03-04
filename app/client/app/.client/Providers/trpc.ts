import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { Procedures } from "../../../../server/src/Controller/router";

export const api = createTRPCClient<Procedures>({
    links: [
        httpBatchLink({
            url: "/api",
            transformer: superjson
        })
    ]
});