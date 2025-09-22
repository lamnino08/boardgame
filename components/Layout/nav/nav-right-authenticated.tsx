'use client'

import UserDropdown from "@/components/ui/common/avatar/user-avatar";
import Button from "@/components/ui/common/button/button";
import { UserAuthen } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface NavRightAuthenticatedProps {
  userInfor: UserAuthen | undefined;
}

export const NavRightAuthenticated = ({ userInfor }: NavRightAuthenticatedProps) => {
  const router = useRouter();

  return (
    <>
      {
        userInfor ? (
          <UserDropdown user={userInfor} />
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                router.push('/auth/sign-in');
              }}
            >
              Sign-in
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                router.push('/auth/sign-up');
              }}
            >
              Sign-up
            </Button>
          </div>
        )
      }
    </>
  );
};
