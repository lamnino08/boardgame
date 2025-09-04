"use client";

import React, { useState } from "react";
import  { Card } from "@/components/ui/Card";
import icons from "../icons";
import Button from "./common/button/button";

interface Tab {
  key: string;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActive?: string;
  className?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActive,
  className,
  contentClassName,
}) => {
  const [active, setActive] = useState(defaultActive || tabs[0]?.key);

  return (
    <Card className={`w-full ${className || ""}`}>
      {/* Tab headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            icon={tab.icon}
            onClick={() => setActive(tab.key)}
            variant="inverse"
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md
              ${active === tab.key ? "border-b-2 border-primary text-primary" : ""}
            `}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`p-4 ${contentClassName || ""}`}>
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </Card>
  );
};

export default Tabs;

export const TabsShowcase: React.FC = () => {
  const tabItems: Tab[] = [
    {
      key: "overview",
      icon: icons.add,
      label: "Overview",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Project Overview
          </h3>
          <p className="text-text-muted">
            This is a simple showcase of the Tabs component. You can switch
            between different tabs and customize styles easily.
          </p>
        </div>
      ),
    },
    {
      key: "settings",
      icon: icons.add,
      label: "Settings",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Settings
          </h3>
          <p className="text-text-muted">
            Here you can configure preferences and update your account details.
          </p>
        </div>
      ),
    },
    {
      key: "about",
      icon: icons.add,
      label: "About",
      content: (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            About This Component
          </h3>
          <p className="text-text-muted">
            This Tabs system is fully configurable. You can style headers,
            active tabs, and content areas as you like.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-4">
        Tabs Showcase
      </h2>
      <Tabs
        tabs={tabItems}
        defaultActive="overview"
        contentClassName="mt-4 text-text-primary"
      />
    </>
  );
};
