import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Tool } from "@shared/schema";

interface SearchToolsProps {
  onResults: (tools: Tool[]) => void;
}

export default function SearchTools({ onResults }: SearchToolsProps) {
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["/api/tools/search", query],
    enabled: query.length > 0
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (data) {
      onResults(data);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search AI tools..."
        className="pl-10"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}
