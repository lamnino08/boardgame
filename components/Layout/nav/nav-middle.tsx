import { ApiResponse } from "@/lib/api/api-helper";
import { AuthCheck } from "@/lib/auth";

interface NavMiddleProps {
  userInforPromise: Promise<ApiResponse<AuthCheck>>;
}

export const NavMiddle = async ({ userInforPromise } : NavMiddleProps) => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const linksAuthenticated = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/finance" },
    { label: "Diary", href: "/diary" },
    { label: "Calender", href: "/calender" },
    { label: "Note", href: "/note" },
  ];

  const userInfor = await userInforPromise;

  let navRoute;
  if (userInfor.data?.isAuthenticated) {
    navRoute = linksAuthenticated;
  } else {
    navRoute = links;
  }

  return (
    <div className="hidden md:flex bg-card border border-border rounded-full shadow-sm px-6 py-2 space-x-6 animate-fade-in-up">
      {navRoute.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={`text-text-primary transition-all duration-300 hover:scale-110 hover:text-primary`}
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};
