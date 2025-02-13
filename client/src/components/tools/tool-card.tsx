import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tool } from "@shared/schema";
import ReviewDialog from "./review-dialog";
import { useState } from "react";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const { data: ratingData } = useQuery({
    queryKey: [`/api/tools/${tool.id}/rating`],
  });

  const rating = ratingData?.rating || 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary">{tool.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold">{tool.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col gap-2">
        <Button asChild className="w-full">
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Visit Tool
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowReviewDialog(true)}
        >
          Write a Review
        </Button>
      </CardFooter>
      <ReviewDialog
        tool={tool}
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
      />
    </Card>
  );
}