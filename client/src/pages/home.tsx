import { useQuery } from "@tanstack/react-query";
import ToolGrid from "@/components/tools/tool-grid";
import SearchTools from "@/components/tools/search-tools";
import type { Tool } from "@shared/schema";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);
  const { currentLanguage } = useLanguage();

  const { data: tools, isLoading } = useQuery({
    queryKey: ["/api/tools/language/" + currentLanguage],
    enabled: !!currentLanguage
  });

  const handleSearchResults = (results: Tool[]) => {
    setSearchResults(results);
  };

  return (
    <div className="space-y-8 max-w-[2000px] mx-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center sm:text-left">
          Discover Amazing AI Tools
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground text-center sm:text-left">
          Explore our curated collection of AI tools to enhance your productivity
          and creativity.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchTools onResults={handleSearchResults} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {searchResults ? (
          <div>
            <h2 className="mb-6 text-xl sm:text-2xl font-semibold">Search Results</h2>
            <ToolGrid tools={searchResults} />
          </div>
        ) : (
          <div>
            <h2 className="mb-6 text-xl sm:text-2xl font-semibold">Featured Tools</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <ToolGrid tools={tools || []} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}