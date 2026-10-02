import React from "react";
import { notFound } from "next/navigation";
import { store } from "@/lib/data/store";
import FoodDetailClient from "./FoodDetailClient";

interface FoodDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function FoodDetailsPage({ params }: FoodDetailsPageProps) {
  const { id } = await params;
  const food = await store.getFoodById(id);

  if (!food) {
    notFound();
  }

  const [reviews, relatedFoods] = await Promise.all([
    store.getReviews(food.id),
    store.getFoodsByCategory(food.category_id || ""),
  ]);

  return (
    <FoodDetailClient
      food={food}
      initialReviews={reviews}
      relatedFoods={relatedFoods.filter((f) => f.id !== food.id).slice(0, 4)}
    />
  );
}
