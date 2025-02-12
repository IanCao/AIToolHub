import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Tool } from "@shared/schema";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge variant="secondary">{tool.category}</Badge>
        </div>
        <h3 className="text-xl font-semibold">{tool.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Visit Tool
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
