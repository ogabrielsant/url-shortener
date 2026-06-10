import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UrlList } from "./components/url-list";
import { ShortNewUrl } from "./components/short-new-url";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="py-16 space-y-16">
        <header>
          <h1 className="text-8xl font-black text-zinc-800 dark:text-zinc-300 tracking-tighter">
            SHORT URL
          </h1>
        </header>

        <section className="px-16 space-y-4">
          <ShortNewUrl />
          <UrlList />
        </section>
      </main>
    </QueryClientProvider>
  );
}
