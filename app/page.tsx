import { store } from "@/lib/data/store";
import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PopularFoodSection } from "@/components/home/PopularFoodSection";
import { TopCooksSection } from "@/components/home/TopCooksSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { BecomeCookCTA } from "@/components/home/BecomeCookCTA";

export const revalidate = 60;

export default async function HomePage() {
  const [foods, categories, sellers] = await Promise.all([
    store.getFoods(),
    store.getCategories(),
    store.getSellers(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <PopularFoodSection foods={foods} />
      <CategoriesSection categories={categories} />
      <TopCooksSection sellers={sellers} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <BecomeCookCTA />
    </div>
  );
}
