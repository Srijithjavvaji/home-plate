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
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Calendar,
  Sparkles,
  ShieldCheck,
  Scale,
} from "lucide-react";

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
  const [allergensText, setAllergensText] = useState("");
  const [servingInfo, setServingInfo] = useState("Serves 4-6");
  const [imageUrl, setImageUrl] = useState("");

  // Compliance & Batch Specifications
  const [netWeight, setNetWeight] = useState("500g");
  const [shelfLifeDays, setShelfLifeDays] = useState("90");
  const [prepDate, setPrepDate] = useState(new Date().toISOString().split("T")[0]);
  const [packDate, setPackDate] = useState(new Date().toISOString().split("T")[0]);
  const [bestBeforeDate, setBestBeforeDate] = useState("");
  const [preparationType, setPreparationType] = useState<"freshly_prepared" | "batch_packed" | "sun_cured" | "traditional">("batch_packed");

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

  // Compute best-before date whenever packDate or shelfLifeDays change
  useEffect(() => {
    if (packDate && shelfLifeDays) {
      const p = new Date(packDate);
      if (!isNaN(p.getTime())) {
        p.setDate(p.getDate() + (parseInt(shelfLifeDays, 10) || 30));
        setBestBeforeDate(p.toISOString().split("T")[0]);
      }
    }
  }, [packDate, shelfLifeDays]);

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
    setAllergensText("");
    setServingInfo("Pack of 500g");
    setNetWeight("500g");
    setShelfLifeDays("90");
    const today = new Date().toISOString().split("T")[0];
    setPrepDate(today);
    setPackDate(today);
    setPreparationType("batch_packed");
    setImageUrl(
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80"
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
    setAllergensText(food.allergens ? food.allergens.join(", ") : "");
    setServingInfo(food.serving_info || "Pack of 500g");
    setImageUrl(food.image_url);

    // Food compliance
    setNetWeight(food.net_weight || "500g");
    setShelfLifeDays(food.shelf_life_days?.toString() || "90");
    setPrepDate(food.prep_date || new Date().toISOString().split("T")[0]);
    setPackDate(food.pack_date || new Date().toISOString().split("T")[0]);
    setBestBeforeDate(food.best_before_date || "");
    setPreparationType(food.preparation_type || "batch_packed");

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

    const allergens = allergensText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      const payload = {
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
        allergens,
        serving_info: servingInfo,
        image_url: imageUrl,
        net_weight: netWeight,
        shelf_life_days: parseInt(shelfLifeDays, 10) || 90,
        prep_date: prepDate,
        pack_date: packDate,
        best_before_date: bestBeforeDate,
        preparation_type: preparationType,
      };

      if (editingFood) {
        await store.updateFood(editingFood.id, payload);
        success("Product Updated", `${name} has been updated.`);
      } else {
        await store.addFood({
          seller_id: "11111111-aaaa-1111-aaaa-111111111111",
          ...payload,
          is_featured: false,
        });
        success("Product Added to Home Plate", `${name} is now listed for Hyderabad customers.`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch {
      toastError("Failed to save product");
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
    if (confirm(`Are you sure you want to remove "${foodName}" from your listings?`)) {
      await store.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
      success("Product Removed", `${foodName} was deleted.`);
    }
  };

  return (
    <div className="py-8 bg-[#fffdfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-orange-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                Hyderabad Kitchen Catalog
              </span>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                FSSAI Compliant Batching
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#26140e] mt-1">
              Homemade Food & Packaged Batches
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage traditional homemade snacks, sweets, pickles, podis, healthy snacks, and regional specialities.
            </p>
          </div>

          <Button
            onClick={openAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-600/20"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Product
          </Button>
        </div>

        {/* Menu Items Table */}
        <div className="mt-8 bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-orange-100 text-stone-500 uppercase font-semibold bg-orange-50/40">
                  <th className="py-3.5 px-6">Product & Story</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Portion / Weight</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Batch & Shelf Life</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50/80 font-medium text-stone-700">
                {foods.map((food) => (
                  <tr key={food.id} className="hover:bg-orange-50/30 transition">
                    {/* Dish Name & Image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-orange-100 shrink-0 border border-orange-200">
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
                            <span className="font-bold text-stone-900 text-sm">
                              {food.name}
                            </span>
                          </div>
                          <p className="text-stone-400 text-[11px] mt-0.5 line-clamp-1 max-w-xs">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-stone-600 font-medium">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                        {food.category?.name || "Homemade"}
                      </span>
                    </td>

                    {/* Weight & Prep Type */}
                    <td className="py-4 px-4 text-stone-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-stone-900 inline-flex items-center gap-1">
                          <Scale className="w-3 h-3 text-orange-600" />
                          {food.net_weight || food.serving_info || "500g"}
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium capitalize">
                          {(food.preparation_type || "small_batch").replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div>
                        <span className="text-orange-700">{formatPrice(food.price)}</span>
                        {food.original_price && food.original_price > food.price && (
                          <span className="block text-[10px] text-stone-400 line-through">
                            {formatPrice(food.original_price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Batch & Shelf Life */}
                    <td className="py-4 px-4 text-stone-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-stone-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {food.shelf_life_days ? `${food.shelf_life_days} days` : "Fresh"}
                        </span>
                        {food.best_before_date && (
                          <span className="text-[10px] text-stone-400">
                            BB: {food.best_before_date}
                          </span>
                        )}
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
                          className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food.id, food.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Product"
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
          title={editingFood ? `Edit ${editingFood.name}` : "List New Homemade Product"}
          description="Provide authentic recipe details, compliance labeling, shelf life and batch packaging"
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveFood} className="space-y-4">
            <Input
              label="Product Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grandma's Guntur Avakaya Pickle (Stone-ground)"
            />

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Heritage Story & Preparation Process
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your family recipe, raw spices used, sundrying process, cold-pressed oils, etc."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Sale Price (INR)"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249"
              />
              <Input
                label="Original MRP (Optional)"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="299"
              />
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-orange-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Food Compliance & Labeling Section */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>FSSAI Mandatory Packaging & Shelf Life</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Input
                  label="Net Quantity / Weight"
                  required
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  placeholder="e.g. 500g / 1kg / 250g"
                />
                <Input
                  label="Shelf Life (Days)"
                  type="number"
                  required
                  value={shelfLifeDays}
                  onChange={(e) => setShelfLifeDays(e.target.value)}
                  placeholder="e.g. 90"
                />
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Preparation Type
                  </label>
                  <select
                    value={preparationType}
                    onChange={(e) => setPreparationType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="batch_packed">Small Batch Packed</option>
                    <option value="freshly_prepared">Freshly Prepared</option>
                    <option value="sun_cured">Sun-Cured Traditional</option>
                    <option value="traditional">Traditional Heritage Recipe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Batch Prep Date"
                  type="date"
                  value={prepDate}
                  onChange={(e) => setPrepDate(e.target.value)}
                />
                <Input
                  label="Packaging Date"
                  type="date"
                  value={packDate}
                  onChange={(e) => setPackDate(e.target.value)}
                />
                <Input
                  label="Best Before Date"
                  type="date"
                  value={bestBeforeDate}
                  onChange={(e) => setBestBeforeDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Ingredients (Comma separated)"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Raw Mango, Cold-pressed Sesame Oil, Guntur Chili, Mustard"
              />
              <Input
                label="Allergens Declaration (Optional)"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                placeholder="Contains Peanuts / Mustard / Sesame / Dairy"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Packaging / Serving Info"
                value={servingInfo}
                onChange={(e) => setServingInfo(e.target.value)}
                placeholder="e.g. Glass Jar with Seal / Vacuum Pouch"
              />
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Dietary Classification
                </label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium text-stone-800">
                    <input
                      type="radio"
                      name="dietary"
                      checked={isVeg}
                      onChange={() => setIsVeg(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>100% Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium text-stone-800">
                    <input
                      type="radio"
                      name="dietary"
                      checked={!isVeg}
                      onChange={() => setIsVeg(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </div>
            </div>

            <Input
              label="Product Photo URL (Unsplash or Food Photo)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />

            <Button
              type="submit"
              className="w-full py-3.5 mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-md shadow-orange-600/30 text-sm"
            >
              {editingFood ? "Save Product Specifications" : "Publish Homemade Product to Home Plate"}
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
