// RouteCardContainer.tsx

import { CardLink } from "./route-card";
export const routeCardConfig = [
  {
    title: "💰 Finance",
    content: "₫12,450,000",
    subtext: "Last transaction: -₫250,000 (Coffee)",
    href: "/finance",
  },
  {
    title: "📝 Diary",
    content: "😌 Peaceful",
    subtext: '"I felt pretty good today."',
    href: "/diary",
  },
  {
    title: "📅 Calendar",
    content: "Mom's Birthday 🎉",
    subtext: "At: 7:00 PM tonight",
    href: "/calendar",
  },
  {
    title: "🗒️ Notes",
    content: "STI",
    subtext: "Build Hathora server ...",
    href: "/notes",
  },
];

export const RouteCardContainer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full animate-fade-in-up">
      {routeCardConfig.map((card, idx) => (
        <CardLink
          key={idx}
          title={card.title}
          content={card.content}
          subtext={card.subtext}
          href={card.href}
        />
      ))}
    </div>
  );
};
