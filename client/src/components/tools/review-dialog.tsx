import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Star } from "lucide-react";
import type { Tool } from "@shared/schema";

interface ReviewDialogProps {
  tool: Tool;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReviewDialog({ tool, open, onOpenChange }: ReviewDialogProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertReviewSchema.omit({ toolId: true })),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (values: { rating: number; comment: string }) => {
      await apiRequest("POST", `/api/tools/${tool.id}/reviews`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tools/${tool.id}/rating`] });
      queryClient.invalidateQueries({ queryKey: [`/api/tools/${tool.id}/reviews`] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {tool.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => submitReview(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="p-1"
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => field.onChange(rating)}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              rating <= (hoveredRating || field.value)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your review here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
