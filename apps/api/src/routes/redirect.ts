import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { urlService } from "../services/url-service";

export const redirect: FastifyPluginAsyncZod = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:shortcode",
    {
      schema: {
        summary: "Redirect to the original URL",
        tags: ["URLs"],
        params: z.object({
          shortcode: z.string().min(1),
        }),
      },
    },
    async (request, response) => {
      const { shortcode } = request.params;

      const longUrl = await urlService.resolve(shortcode);

      if (!longUrl) {
        return response.status(404).send({ error: "URL not found." });
      }

      return response.status(301).redirect(longUrl);
    },
  );
};
