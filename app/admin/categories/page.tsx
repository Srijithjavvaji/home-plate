"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Category } from "@/lib/supabase/types";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Trash2, Edit2, Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  const { success, error: toastError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadCategories = async () => {
    const list = await store.getCategories();
    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await store.addCategory({
        name: name.trim(),
        slug,
        description: description.trim() || "Authentic homemade selections",
        image_url:
          imageUrl.trim() ||
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        is_active: true,
      });

      setCategories((prev) => [...prev, created]);
      setIsModalOpen(false);
      setName("");
      setDescription("");
      setImageUrl("");
      success("Category Created", `${created.name} is now available on Home Plate.`);
    } catch {
      toastError("Failed to add category");
    }
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      success("Category Removed", catName);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Food Categories
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize homemade culinary specialties (Tiffins, Thalis, Grandmother Pickles, Sweets).
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Add New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-4 bg-slate-800">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-block mt-3 font-mono text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  /categories/{cat.slug}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-semibold">Active in App</span>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-slate-500 hover:text-rose-400 transition p-1"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Food Category"
          description="Create a category to group homemade foods"
        >
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              label="Category Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Regional Specialities / Podis / Snacks"
            />
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What kinds of homestyle food belong here?"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500"
              />
            </div>
            <Input
              label="Cover Image URL (Unsplash or Supabase)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />
            <Button type="submit" className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700">
              Create Category
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
