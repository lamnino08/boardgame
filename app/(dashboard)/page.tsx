import { authCheck } from "@/actions/user";
import { HomePageClient } from "./_component/page-client";
import { LandingPage } from "./_component/landing-page"; // Tạo riêng component landing

export default async function Home() {
  const res = await authCheck();

  return (
    <main className="flex flex-col items-center justify-center bg-background px-4">
      {res.data?.user ? (
        <HomePageClient userInforPromise={Promise.resolve(res)} />
      ) : (
        <LandingPage />
      )}
    </main>
  );
}
