import { NavRightAuthenticated } from "./nav-right-authenticated";
import { NavRightNotAuthenticated } from "./nav-right-notauthenticated";
import { ThemeToggle } from "@/components/ui/common/theme-toggle";
import { ApiResponse } from "@/lib/api/api-helper";
import { AuthCheck } from "@/lib/auth";

interface NavRightProps {
  userInforPromise: Promise<ApiResponse<AuthCheck>>;
}

export const NavRight = async ({ userInforPromise } : NavRightProps) => {
  const userInfor = await userInforPromise;

  return (
    <div className="flex p-4 space-x-4 items-center">
      {userInfor.data?.user ? (
        <NavRightAuthenticated userInfor={userInfor.data.user} />
      ) : (
        <NavRightNotAuthenticated />
      )}
      <ThemeToggle />
    </div>
  );
};
