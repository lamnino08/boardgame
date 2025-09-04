import { headers } from "next/headers";
import "../styles/globals.css";
import { AppProvider } from "@/contexts/provider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const theme = headersList.get("x-theme") || "light";
  
  return (
    <html lang="en" className={theme}>
      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
