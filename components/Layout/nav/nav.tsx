"use server";

import React from "react";
import { NavRight } from "./nav-right";
import { NavMiddle } from "./nav-middle";
import { authCheck } from "@/actions/user";

export const Navbar: React.FC = async () => {  
  const authen = authCheck();
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-card backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-text-primary cursor-pointer"
            // onClick={() => {}}
          >
            My<span className="text-green-500">♥</span>Brand
          </div>

          <NavMiddle userInforPromise={authen}/>

          <NavRight userInforPromise={authen}/>
        </div>
      </div>
    </nav>
  );
};
