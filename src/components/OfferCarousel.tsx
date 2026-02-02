"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";

const OfferCarousel: React.FC = () => {
  const [offers, setOffers] = React.useState<
    Array<{ id: string; title: string; description: string | null; image_path: string | null; image_url: string | null }>
  >([]);

  React.useEffect(() => {
    let active = true;
    const loadOffers = async () => {
      const { data } = await supabase
        .from("offers")
        .select("id, title, description, image_path, image_url")
        .eq("active", true)
        .order("display_order", { ascending: true });
      if (!active) return;
      setOffers(data || []);
    };
    loadOffers();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {offers.map((offer) => (
          <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="group overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="relative flex aspect-[4/3] items-center justify-center p-0">
                  <img
                    src={resolveImageUrl("restaurants", offer.image_path, offer.image_url)}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                    Limited time
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
                    <p className="text-sm text-white/85">{offer.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default OfferCarousel;