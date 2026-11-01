import { store } from "@/lib/data/store";
import { HomeRootClient } from "@/components/home/HomeRootClient";

export const revalidate = 60;

export default async function HomePage() {
  const [foods, categories, sellers] = await Promise.all([
    store.getFoods(),
    store.getCategories(),
    store.getSellers(),
  ]);

  return (
    <HomeRootClient
      foods={foods}
      categories={categories}
      sellers={sellers}
    />
  );
}
