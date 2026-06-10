import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { createShortUrl } from "../http/create-shorted-url";

export function ShortNewUrl() {
  const [url, setUrl] = useState<string>("");

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["short-new-url"],
    mutationFn: createShortUrl,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    const { shortUrl } = await mutateAsync({
      url,
    });

    await navigator.clipboard.writeText(shortUrl);

    setUrl("");
  }

  return (
    <form className="flex gap-2" onSubmit={(event) => handleSubmit(event)}>
      <input
        className="w-full p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 hover:dark:bg-zinc-800 hover:border-zinc-200 hover:dark:border-zinc-700 transition-colors outline-none placeholder:text-zinc-500"
        id="url"
        name="url"
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Insert your long URL"
      />

      <button
        className="py-2 px-4.5 bg-zinc-800 dark:bg-zinc-900 hover:dark:bg-zinc-800 text-zinc-100 font-semibold rounded-lg transition-colors hover:bg-zinc-900"
        type="submit"
        disabled={isPending}
      >
        Short
      </button>
    </form>
  );
}
