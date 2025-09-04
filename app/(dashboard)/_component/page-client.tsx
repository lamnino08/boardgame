'use client'

import { ApiResponse } from "@/lib/api/api-helper";
import { AuthCheck } from "@/lib/auth";
import { useEffect, useState } from "react";
import { ASCIILoading } from "@/components/ui/spinner";
import { Prototype } from "@/constant/prototype/prototype";
import Avatar from "@/components/ui/common/avatar/avatar";
import { RouteCardContainer } from "./route-card-container";

interface HomePageClientProps {
  userInforPromise: Promise<ApiResponse<AuthCheck>>;
}

export const HomePageClient = ({ userInforPromise }: HomePageClientProps) => {
  const [userInfor, setUserInfor] = useState<AuthCheck | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await userInforPromise;
      setUserInfor(res.data);
    };

    fetchUser();
  }, [userInforPromise]);

  if (!userInfor) {
    return (
      <div>
        <ASCIILoading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full text-center mx-auto mt-16 px-4">
      {/* Avatar with glowing border */}
      <div className="mx-auto w-fit mb-4 relative animate-fade-in-up">
        <div className="rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-xl">
          <Avatar
            src={`https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/200/200`}
            name={userInfor?.user?.username}
            size={128}
            className="border-[3px] border-background"
          />
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-primary animate-fade-in-up">
        {Prototype.home.greeting()}, {userInfor?.user?.username}!
      </h1>

      {/* Motivational Quote */}
      <p className="mt-3 text-muted-foreground italic text-base animate-fade-in-up">
        "{Prototype.home.motivationQuote()}"
      </p>

      {/* Dashboard Cards */}
      <RouteCardContainer />
    </div>
  );
};
