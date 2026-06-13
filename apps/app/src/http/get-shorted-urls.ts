export type ShortedUrl = {
  shortcode: string;
  longUrl: string;
  createdAt: Date;
};

type GetShortedUrlsRequest = {
  pageSize?: number;
  pagingState?: string;
};

type GetShortedUrlsResponse = {
  urls: ShortedUrl[];
  nextPage: string | null;
};

export async function getShortedUrls({
  pageSize,
  pagingState,
}: GetShortedUrlsRequest): Promise<GetShortedUrlsResponse> {
  const url = new URL("/api/urls", window.location.origin);

  if (pageSize) {
    url.searchParams.append("pageSize", pageSize.toString());
  }

  if (pagingState) {
    url.searchParams.append("pagingState", pagingState);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Error while searching URLs.");
  }

  const data = (await response.json()) as GetShortedUrlsResponse;

  return data;
}
