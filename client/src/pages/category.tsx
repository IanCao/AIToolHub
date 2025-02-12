import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ToolGrid from "@/components/tools/tool-grid";
import { categories } from "@shared/schema";
import { useLanguage } from "@/lib/language-context";

export default function Category() {
  const { category } = useParams();
  const { currentLanguage } = useLanguage();

  // Validate category
  const validCategory = categories.find(
    c => c.toLowerCase() === category?.toLowerCase()
  );

  const { data: tools, isLoading } = useQuery({
    queryKey: [`/api/tools/category/${category}/language/${currentLanguage}`],
    enabled: !!validCategory && !!currentLanguage
  });

  if (!validCategory) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid Category</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{validCategory} AI Tools</h1>
        <p className="mt-2 text-muted-foreground">
          Discover the best AI tools for {validCategory.toLowerCase()} generation and processing.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ToolGrid tools={tools || []} />
      )}
    </div>
  );
}