import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getShortedUrls } from "../http/get-shorted-urls";

import copyIcon from "../assets/copy-icon.svg";
import arrowLeftIcon from "../assets/arrow-left-icon.svg";
import arrowRightIcon from "../assets/arrow-right-icon.svg";

export function UrlList() {
  const [pagingState, setPagingState] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["get-urls", pagingState],
    queryFn: () => getShortedUrls({ pagingState }),
  });

  function handleFirstPage() {
    setPagingState(null);
  }

  function handleNextPage() {
    setPagingState(query.data.nextPage);
  }

  return (
    <div className="relative overflow-x-auto shadow-xs rounded-lg border border-zinc-300 dark:border-zinc-800">
      <table className="w-full text-left rtl:text-right">
        <thead className="rounded-lg dark:text-zinc-300 text-zinc-500 dark:bg-zinc-900 bg-zinc-100 border-b dark:border-zinc-800 border-zinc-300">
          <tr>
            <th className="px-6 py-3 font-medium">Shortcode</th>
            <th className="px-6 py-3 font-medium">Original URL</th>
            <th className="px-6 py-3 font-medium">Created at</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {query.data ? (
            query.data.urls.map((url) => (
              <tr
                key={url.shortcode}
                className="px-6 py-3 dark:text-zinc-300 text-zinc-600 transition-colors not-last:border-b not-last:border-b-zinc-300 not-last:dark:border-b-zinc-800 hover:dark:bg-zinc-900 hover:bg-zinc-100"
              >
                <td className="px-6 py-3 font-medium">{url.shortcode}</td>
                <td className="px-6 py-3 truncate">{url.longUrl}</td>
                <td className="px-6 py-3">
                  {new Date(url.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <button
                    type="button"
                    className="p-2 transition-colors hover:bg-zinc-200 hover:dark:bg-zinc-800 rounded-md"
                    onClick={async () => {
                      const shortedUrl = `http://localhost:3333/${url.shortcode}`;

                      try {
                        await navigator.clipboard.writeText(shortedUrl);
                      } catch {
                        window.alert("Failed to copy url!");
                      }
                    }}
                  >
                    <img
                      src={copyIcon}
                      className="size-3 select-none dark:invert"
                      alt="Copy"
                    />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <div className="text-center py-4 text-zinc-500">
                  URLs not found. Create a new one!
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="px-6 py-3 flex gap-2 justify-end items-center bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          disabled={!pagingState}
          onClick={handleFirstPage}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-900 hover:not-disabled:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded disabled:opacity-50 text-zinc-800 dark:text-zinc-200"
        >
          <img
            src={arrowLeftIcon}
            className="size-4 select-none dark:invert"
            alt="First page"
          />{" "}
        </button>

        {query.data?.nextPage && (
          <button
            type="button"
            onClick={handleNextPage}
            className="inline-flex items-center border border-zinc-200 dark:border-zinc-700 gap-2 px-3 py-1.5 text-sm text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-800"
          >
            <img
              src={arrowRightIcon}
              className="size-4 select-none dark:invert"
              alt="Next page"
            />
          </button>
        )}
      </div>
    </div>
  );
}
