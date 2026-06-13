import fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { connectCassandra } from "./lib/cassandra";
import { connectRedis } from "./lib/redis";
import { redirect } from "./routes/redirect";
import { shorten } from "./routes/shorten";
import { findAllUrls } from "./routes/find-all-urls";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

async function start() {
  await connectCassandra();
  await connectRedis();

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost",
    methods: ["GET", "POST"],
  });

  await app.register(
    async (api) => {
      await api.register(shorten);
      await api.register(findAllUrls);
    },
    {
      prefix: "/api",
    },
  );

  await app.register(redirect);

  app.get("/health", async () => ({ status: "ok" }));

  await app.listen({
    host: "0.0.0.0",
    port: 3333,
  });

  console.log("Server is running!");
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
