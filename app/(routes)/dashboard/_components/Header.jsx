"use client";

import Logo from "@/app/_components/Logo";
import { useAuth } from "@clerk/clerk-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import React from "react";

function Header() {
  const { orgId } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 shadow-sm">
      <Logo />
      <OrganizationSwitcher
        afterLeaveOrganizationUrl={"/dashboard"}
        afterCreateOrganizationUrl={"/dashboard"}
      />
      <UserButton />
    </div>
  );
}

export default Header;
