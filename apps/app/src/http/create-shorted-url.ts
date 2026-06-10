type CreateShortUrlsRequest = {
  url: string;
};

type CreateShortUrlsResponse = {
  shortUrl: string;
};

export async function createShortUrl({
  url,
}: CreateShortUrlsRequest): Promise<CreateShortUrlsResponse> {
  const response = await fetch("http://localhost:3333/shorten", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ url: url }),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Error while creating URL.");
  }

  const data = (await response.json()) as CreateShortUrlsResponse;

  return data;
}
