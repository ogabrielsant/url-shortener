import type {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { urlService } from "../services/url-service";

export const findAllUrls: FastifyPluginAsyncZod = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/urls",
    {
      schema: {
        summary: "Find all shorted URLs",
        tags: ["URLs"],
        querystring: z.object({
          pageSize: z.coerce.number().optional().default(10),
          pagingState: z.string().optional(),
        }),
        response: {
          200: z.object({
            urls: z.array(
              z.object({
                shortcode: z.string(),
                longUrl: z.url(),
                createdAt: z.date(),
              }),
            ),
            nextPage: z.string().nullable(),
          }),
        },
      },
    },
    async (request, response) => {
      const { pageSize, pagingState } = request.query;

      const urls = await urlService.findAll(pageSize, pagingState);

      return response.status(200).send(urls);
    },
  );
};
