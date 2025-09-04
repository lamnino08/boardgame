import UserDropdown from "@/components/ui/common/avatar/user-avatar";
import { UserAuthen } from "@/lib/auth";

interface NavRightAuthenticatedProps {
  userInfor: UserAuthen;
}

export const NavRightAuthenticated = ({ userInfor }: NavRightAuthenticatedProps) => {
  return (
    <>
      <UserDropdown user={userInfor} />
    </>
  );
};
