import { Metadata } from 'next';
import { authCheck } from "@/actions/user";
import { HomePageClient } from "./_component/page-client";
import { LandingPage } from "./_component/landing-page"; // Tạo riêng component landing
import { ListPost } from "@/components/app/dashboard/tst/post/listPost";

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Home() {
  const res = authCheck();

  return (
    <div className="flex flex-col max-w-7xl mx-auto">
      <ListPost userInforPromise={res}/>
    </div>
  );
}
