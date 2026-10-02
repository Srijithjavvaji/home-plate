"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Food, Category } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { VegBadge } from "@/components/food/VegBadge";
import { Plus, Edit2, Trash2, Clock, CheckCircle2, XCircle, Search } from "lucide-react";

export default function SellerFoodsPage() {
  const { success, error: toastError } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("30");
  const [ingredientsText, setIngredientsText] = useState("");
  const [servingInfo, setServingInfo] = useState("Serves 1-2");
  const [imageUrl, setImageUrl] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allFoods, allCats] = await Promise.all([
        store.getFoods(),
        store.getCategories(),
      ]);
      setFoods(allFoods);
      setCategories(allCats);
      if (allCats.length > 0 && !categoryId) {
        setCategoryId(allCats[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingFood(null);
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("");
    setIsVeg(true);
    setIsAvailable(true);
    setPrepTimeMinutes("30");
    setIngredientsText("");
    setServingInfo("Serves 1-2");
    setImageUrl(
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
    );
    setIsModalOpen(true);
  };

  const openEditModal = (food: Food) => {
    setEditingFood(food);
    setName(food.name);
    setDescription(food.description);
    setPrice(food.price.toString());
    setOriginalPrice(food.original_price ? food.original_price.toString() : "");
    setCategoryId(food.category_id || categories[0]?.id || "");
    setIsVeg(food.is_veg);
    setIsAvailable(food.is_available);
    setPrepTimeMinutes(food.prep_time_minutes.toString());
    setIngredientsText(food.ingredients ? food.ingredients.join(", ") : "");
    setServingInfo(food.serving_info || "Serves 1-2");
    setImageUrl(food.image_url);
    setIsModalOpen(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) {
      toastError("Please fill all required fields");
      return;
    }

    const ingredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      if (editingFood) {
        // Update existing food
        await store.updateFood(editingFood.id, {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          price: parseFloat(price),
          original_price: originalPrice ? parseFloat(originalPrice) : undefined,
          category_id: categoryId,
          is_veg: isVeg,
          is_available: isAvailable,
          prep_time_minutes: parseInt(prepTimeMinutes, 10) || 30,
          ingredients,
          serving_info: servingInfo,
          image_url: imageUrl,
        });
        success("Food Updated", `${name} has been updated.`);
      } else {
        // Create new food
        await store.addFood({
          seller_id: "11111111-aaaa-1111-aaaa-111111111111",
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          price: parseFloat(price),
          original_price: originalPrice ? parseFloat(originalPrice) : undefined,
          category_id: categoryId,
          is_veg: isVeg,
          is_available: isAvailable,
          prep_time_minutes: parseInt(prepTimeMinutes, 10) || 30,
          ingredients,
          allergens: [],
          serving_info: servingInfo,
          is_featured: false,
          image_url: imageUrl,
        });
        success("Dish Added to Menu", `${name} is now visible to customers.`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch {
      toastError("Failed to save dish");
    }
  };

  const handleToggleAvailability = async (food: Food) => {
    const updated = !food.is_available;
    await store.updateFood(food.id, { is_available: updated });
    setFoods((prev) =>
      prev.map((f) => (f.id === food.id ? { ...f, is_available: updated } : f))
    );
    success(
      updated ? "Marked as In Stock" : "Marked as Sold Out",
      food.name
    );
  };

  const handleDelete = async (id: string, foodName: string) => {
    if (confirm(`Are you sure you want to remove "${foodName}" from your menu?`)) {
      await store.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
      success("Dish Removed", `${foodName} was deleted.`);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-950">
              Kitchen Menu Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Add new homemade recipes, update pricing, and toggle daily portion availability.
            </p>
          </div>

          <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add New Dish
          </Button>
        </div>

        {/* Menu Items Table / Cards */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold bg-gray-50/50">
                  <th className="py-3.5 px-6">Dish</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Prep Time</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {foods.map((food) => (
                  <tr key={food.id} className="hover:bg-gray-50/50 transition">
                    {/* Dish Name & Image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={food.image_url}
                            alt={food.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <VegBadge isVeg={food.is_veg} size="sm" />
                            <span className="font-bold text-gray-900 text-sm">
                              {food.name}
                            </span>
                          </div>
                          <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1 max-w-xs">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      {food.category?.name || "Homestyle"}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {formatPrice(food.price)}
                    </td>

                    {/* Prep Time */}
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{food.prep_time_minutes} mins</span>
                      </div>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          food.is_available
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {food.is_available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food.id, food.name)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Food Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFood ? `Edit ${editingFood.name}` : "Add Homemade Dish to Menu"}
          description="Provide recipe details, pricing, and portion information"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveFood} className="space-y-4">
            <Input
              label="Dish Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gongura Pappu with Steamed Sona Masoori Rice"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Description & Story
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how you cook this dish and what makes it authentic..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (₹)"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199"
              />
              <Input
                label="Original Price (₹) (Optional)"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="240"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Preparation Time (Minutes)"
                type="number"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(e.target.value)}
              />
            </div>

            <Input
              label="Key Ingredients (Comma separated)"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Basmati Rice, Homemade Ghee, Cardamom, Paneer"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Serving Portion"
                value={servingInfo}
                onChange={(e) => setServingInfo(e.target.value)}
                placeholder="Serves 1-2 (450g)"
              />
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Dietary Classification
                </label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      checked={isVeg}
                      onChange={() => setIsVeg(true)}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      checked={!isVeg}
                      onChange={() => setIsVeg(false)}
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </div>
            </div>

            <Input
              label="Dish Photo URL (Unsplash or Supabase Storage)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />

            <Button type="submit" className="w-full py-3 mt-4">
              {editingFood ? "Save Changes" : "Publish Dish to Menu"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
