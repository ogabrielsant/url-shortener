import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { urlService } from "../services/url-service";

export const shorten: FastifyPluginAsyncZod = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/shorten",
    {
      schema: {
        summary: "Generate a new shorted URL",
        tags: ["URLs"],
        body: z.object({
          url: z.url(),
        }),
        response: {
          201: z.object({
            shortUrl: z.url(),
          }),
        },
      },
    },
    async (request, response) => {
      const { url } = request.body;

      const shortUrl = await urlService.shorten(url);

      console.log(shortUrl);

      return response.status(201).send({
        shortUrl,
      });
    },
  );
};
