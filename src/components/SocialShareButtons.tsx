"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Facebook, Twitter, Share2 } from "lucide-react";

interface SocialShareButtonsProps {
  restaurantName: string;
  shareUrl?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ restaurantName, shareUrl = window.location.href }) => {
  const handleShare = (platform: "facebook" | "twitter" | "link") => {
    const message = `Craving ${restaurantName} on Foodigo!`;
    if (platform === "link") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
      return;
    }
    const url =
      platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        : `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
        <Facebook className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
        <Twitter className="h-4 w-4 mr-2" />
        Tweet
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare("link")}>
        <Share2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
};

export default SocialShareButtons;

