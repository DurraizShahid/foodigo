"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface RestaurantFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  cuisine: string;
  minRating: number;
  maxPrice: number;
  maxDistance: number;
  dietary: string[];
  sortBy: string;
}

export const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    cuisine: "all",
    minRating: 0,
    maxPrice: 100,
    maxDistance: 10,
    dietary: [],
    sortBy: "rating",
  });

  const cuisines = ["All", "Italian", "American", "Japanese", "Indian", "Mexican", "Chinese"];
  const dietaryOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Halal", "Kosher"];

  const handleFilterChange = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      cuisine: "all",
      minRating: 0,
      maxPrice: 100,
      maxDistance: 10,
      dietary: [],
      sortBy: "rating",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex-1 min-w-[220px]">
            <Input
              placeholder="Search restaurants or dishes..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full rounded-full border-border/60 bg-card"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-full"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide filters" : "Filters"}
          </Button>
        </CardContent>
      </Card>

      {showFilters && (
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Filters</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full">
                  Clear All
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Cuisine Filter */}
            <div className="space-y-2">
              <Label>Cuisine</Label>
              <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange({ cuisine: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine.toLowerCase()} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Minimum Rating: {filters.minRating.toFixed(1)} ⭐</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={([value]) => handleFilterChange({ minRating: value })}
                min={0}
                max={5}
                step={0.1}
              />
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <Label>Max Price: ${filters.maxPrice}</Label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => handleFilterChange({ maxPrice: value })}
                min={0}
                max={100}
                step={5}
              />
            </div>

            {/* Distance Filter */}
            <div className="space-y-2">
              <Label>Max Distance: {filters.maxDistance} km</Label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={([value]) => handleFilterChange({ maxDistance: value })}
                min={0}
                max={20}
                step={1}
              />
            </div>

            {/* Dietary Filters */}
            <div className="space-y-2 md:col-span-2">
              <Label>Dietary Requirements</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2 rounded-lg border border-border/60 px-3 py-2">
                    <Checkbox
                      id={option}
                      checked={filters.dietary.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange({ dietary: [...filters.dietary, option] });
                        } else {
                          handleFilterChange({ dietary: filters.dietary.filter((d) => d !== option) });
                        }
                      }}
                    />
                    <Label htmlFor={option} className="cursor-pointer font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2 md:col-span-2">
              <Label>Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange({ sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

