import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { connectCassandra } from "./lib/cassandra";
import { connectRedis } from "./lib/redis";
import { redirect } from "./routes/redirect";
import { shorten } from "./routes/shorten";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

async function start() {
  await connectCassandra();
  await connectRedis();

  await app.register(redirect);
  await app.register(shorten);

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
