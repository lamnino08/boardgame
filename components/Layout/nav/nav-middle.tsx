import { ApiResponse } from "@/lib/api/api-helper";
import { AuthCheck } from "@/lib/auth";
import { UserRole } from "@/model/user/user";

interface NavMiddleProps {
  userInforPromise: Promise<ApiResponse<AuthCheck>>;
}

export const NavMiddle = async ({ userInforPromise } : NavMiddleProps) => {
  let links = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
    { label: "Term of service", href: "/tos" },
    { label: "Privacy policy", href: "/privacy-policy" },
    
  ];

  const userInfor = await userInforPromise;

  if (userInfor.data?.user?.role === UserRole.Admin) {
    links.push({ label: "Admin", href: "/admin" })
  }

  return (
    <div className="hidden md:flex bg-card border border-border rounded-full shadow-sm px-6 py-2 space-x-6 animate-fade-in-up">
      {links.map((link, index) => (
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
