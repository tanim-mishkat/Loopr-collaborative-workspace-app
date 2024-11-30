"use client";

import Logo from "@/app/_components/Logo";
import { db } from "@/config/firebaseConfig";
import { useAuth, useUser } from "@clerk/clerk-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore"; // Include doc
import React, { useEffect } from "react";

function Header() {
  const { orgId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user]);

  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, "LoopUsers", docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

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
