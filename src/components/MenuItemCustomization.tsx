"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface AddOn {
  id: string;
  name: string;
  price: number;
  required?: boolean;
}

interface MenuItemCustomizationProps {
  item: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
  addOns?: AddOn[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: CustomizedMenuItem) => void;
}

export interface CustomizedMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  selectedAddOns: AddOn[];
  specialInstructions: string;
  quantity: number;
}

export const MenuItemCustomization: React.FC<MenuItemCustomizationProps> = ({
  item,
  addOns = [],
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  const defaultAddOns: AddOn[] = [
    { id: "extra-cheese", name: "Extra Cheese", price: 1.5 },
    { id: "extra-sauce", name: "Extra Sauce", price: 0.5 },
    { id: "no-onions", name: "No Onions", price: 0 },
    { id: "extra-spicy", name: "Extra Spicy", price: 0 },
  ];

  const availableAddOns = addOns.length > 0 ? addOns : defaultAddOns;

  const totalPrice = item.price + selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);

  const handleAddOnToggle = (addOn: AddOn) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAddToCart = () => {
    const customizedItem: CustomizedMenuItem = {
      ...item,
      selectedAddOns,
      specialInstructions,
      quantity,
    };
    onAddToCart(customizedItem);
    // Reset form
    setSelectedAddOns([]);
    setSpecialInstructions("");
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Image */}
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg" />

          {/* Add-ons */}
          {availableAddOns.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add-ons</Label>
              <div className="space-y-2">
                {availableAddOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={addOn.id}
                        checked={selectedAddOns.some((a) => a.id === addOn.id)}
                        onCheckedChange={() => handleAddOnToggle(addOn)}
                      />
                      <Label htmlFor={addOn.id} className="cursor-pointer font-normal">
                        {addOn.name}
                      </Label>
                    </div>
                    {addOn.price > 0 && (
                      <span className="text-sm font-medium">+${addOn.price.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any special requests or dietary requirements..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Quantity */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          <Separator />

          {/* Total Price */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">${(totalPrice * quantity).toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

