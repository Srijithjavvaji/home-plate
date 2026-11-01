import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { store } from "@/lib/data/store";
import { WelcomeLoginScreen } from "@/components/auth/WelcomeLoginScreen";
import { HomeRootClient } from "@/components/home/HomeRootClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("homeplate_session")?.value;

  let session: { id: string; role: string; email: string; sellerStatus?: string } | null = null;
  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      session = null;
    }
  }

  // 1. Unauthenticated visitors see dedicated First Screen: Welcome / Login & Signup
  if (!session) {
    return <WelcomeLoginScreen />;
  }

  // 2. Authenticated Home Cook automatically redirected to Seller Dashboard
  if (session.role === "seller") {
    redirect("/seller/dashboard");
  }

  // 3. Authenticated Admin automatically redirected to Admin Dashboard
  if (
    session.role === "admin" ||
    session.role === "super_admin" ||
    session.role === "operations_admin" ||
    session.role === "seller_support"
  ) {
    redirect("/admin");
  }

  // 4. Authenticated Customer: Fetch marketplace data and render customer marketplace
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
