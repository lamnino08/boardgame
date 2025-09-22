"use client";

import React, { act, useState } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/common/button/button";

export interface TabModel {
  key: string;
  icon?: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  nav?: {
    sidebar?: {
      align?: "left" | "right";
    };
    top?: {
      align?: "left" | "center" | "right";
    };
  };
  tabs: TabModel[];
  defaultActive?: string;
  className?: string;
  contentClassName?: string;
}

export const Tab: React.FC<TabsProps> = ({
  tabs,
  defaultActive,
  className,
  contentClassName,
  nav,
}) => {
  const [active, setActive] = useState(defaultActive || tabs[0]?.key);

  const isSideNav = nav?.sidebar != undefined;
  const topNavAlign = nav?.top?.align || "left";
  const sideNavAlign = nav?.sidebar?.align || "left";

  const getTopNavAlignClass = () => {
    switch (topNavAlign) {
      case "center":
        return "justify-center";
      case "right":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  const getCardClasses = () => {
    if (!isSideNav) return "";
    if (sideNavAlign === "right") {
      return "flex flex-row-reverse";
    }
    return "flex flex-row";
  };

  return (
    <Card className={`w-full overflow-visible relative ${getCardClasses()} ${className || ""}`}>
      {/* Tab headers */}
      <div
        className={`flex ${
          isSideNav
            ? "flex-col border-r border-border min-w-32 gap-2 pr-2"
            : `border-b border-border gap-2 ${getTopNavAlignClass()}`
        }`}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            icon={tab.icon}
            onClick={() => setActive(tab.key)}
            variant="inverse"
            className={`
              ${
                active === tab.key
                  ? `${
                      isSideNav ? "border-r-2" : "border-b-2"
                    } border-primary`
                  : ""
              }
            `}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`w-full ${isSideNav ? 'border-l-2' : 'border-t-2'} border-primary ${contentClassName || ""}`}>
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </Card>
  );
};
