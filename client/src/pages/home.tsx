import { useQuery } from "@tanstack/react-query";
import ToolGrid from "@/components/tools/tool-grid";
import SearchTools from "@/components/tools/search-tools";
import type { Tool } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);

  const { data: featuredTools, isLoading } = useQuery({
    queryKey: ["/api/tools/featured"]
  });

  const handleSearchResults = (results: Tool[]) => {
    setSearchResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Discover Amazing AI Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our curated collection of AI tools to enhance your productivity
          and creativity.
        </p>
      </div>

      <SearchTools onResults={handleSearchResults} />

      {searchResults ? (
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Search Results</h2>
          <ToolGrid tools={searchResults} />
        </div>
      ) : (
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Featured Tools</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <ToolGrid tools={featuredTools || []} />
          )}
        </div>
      )}
    </div>
  );
}
