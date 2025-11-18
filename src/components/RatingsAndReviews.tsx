"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface RatingsAndReviewsProps {
  restaurantId?: string;
  driverId?: string;
  type: "restaurant" | "driver";
}

export const RatingsAndReviews: React.FC<RatingsAndReviewsProps> = ({ restaurantId, driverId, type }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userId: "user1",
      userName: "Alice Smith",
      rating: 5,
      comment: "Great food and fast delivery! Highly recommend.",
      date: "2024-01-15",
      helpful: 12,
    },
    {
      id: "2",
      userId: "user2",
      userName: "Bob Johnson",
      rating: 4,
      comment: "Good quality, but delivery was a bit late.",
      date: "2024-01-10",
      helpful: 5,
    },
  ]);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 || 0,
  }));

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || user.email,
      userAvatar: user.avatar,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
    setShowForm(false);
    toast.success("Review submitted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {type === "restaurant" ? "Restaurant" : "Driver"} Reviews
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-2xl font-bold ml-1">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>
        {user && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {ratingDistribution.reverse().map(({ star, count, percentage }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-sm w-12">{star} ⭐</span>
            <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
          </div>
        ))}
      </div>

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitReview} className="w-full">
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

