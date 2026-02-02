"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { supabase, resolveImageUrl } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  imagePath?: string | null;
  imageUrl?: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, menu_item_id, name, price, image_path, image_url, description, quantity")
        .eq("user_id", user.id);
      if (error) return;
      const mapped = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: resolveImageUrl("menu-items", item.image_path, item.image_url),
        description: item.description || "",
        quantity: item.quantity,
      }));
      setCartItems(mapped);
    };
    loadCart();
  }, [user]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        toast.success(`Added another ${item.name} to cart!`);
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        toast.success(`${item.name} added to cart!`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("cart_items").select("id, quantity").eq("user_id", user.id).eq("menu_item_id", item.id).maybeSingle();
      if (data?.id) {
        await supabase
          .from("cart_items")
          .update({ quantity: data.quantity + 1 })
          .eq("id", data.id);
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          image_path: item.imagePath ?? null,
          image_url: item.imageUrl ?? item.image,
          description: item.description,
          quantity: 1,
        });
      }
    })();
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast.info("Item removed from cart.");
    if (!user) return;
    supabase.from("cart_items").delete().eq("user_id", user.id).eq("menu_item_id", itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
    if (!user) return;
    if (quantity <= 0) {
      supabase.from("cart_items").delete().eq("user_id", user.id).eq("menu_item_id", itemId);
      return;
    }
    supabase.from("cart_items").update({ quantity }).eq("user_id", user.id).eq("menu_item_id", itemId);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared.");
    if (!user) return;
    supabase.from("cart_items").delete().eq("user_id", user.id);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};