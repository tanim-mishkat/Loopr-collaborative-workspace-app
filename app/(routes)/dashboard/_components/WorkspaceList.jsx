"use client";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import WorkspaceItemList from "./_components/WorkspaceItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import WorkspaceItemList from "./WorkspaceItemList";

function WorkspaceList() {
  const { user } = useUser();
  const { orgId } = useAuth();
  const [workspaceList, setWorkspaceList] = useState([]);

  useEffect(() => {
    user && getWorkspaceList();
  }, [orgId, user]);

  const getWorkspaceList = async () => {
    const q = query(
      collection(db, "Workspace"),
      where(
        "orgId",
        "==",
        orgId ? orgId : user?.primaryEmailAddress?.emailAddress
      )
    );
    const querySnapshot = await getDocs(q);
    setWorkspaceList([]);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setWorkspaceList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <div className="my-10 p-6 sm:p-10 md:px-24 lg:px-36 xl:px-52">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4">
        <h2 className="font-bold text-xl sm:text-2xl">
          Hello, {user?.fullName}
        </h2>
        <Link href="/createworkspace">
          <Button>+ New</Button>
        </Link>
      </div>

      {/* Workspaces Section */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4">
        <div>
          <h2 className="font-medium text-primary">Workspaces</h2>
        </div>
        <div className="flex gap-2 text-gray-500">
          <LayoutGrid className="w-5 h-5 cursor-pointer hover:text-primary" />
          <AlignLeft className="w-5 h-5 cursor-pointer hover:text-primary" />
        </div>
      </div>

      {/* Workspace Content */}
      {workspaceList?.length === 0 ? (
        <div className="flex flex-col items-center text-center my-10">
          <Image
            src="/workspace.png"
            width={200}
            height={200}
            alt="workspace"
          />
          <h2 className="mt-4 text-lg font-medium">Create a new workspace</h2>
          <Link href="/createworkspace">
            <Button className="mt-3">+ New Workspace</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <WorkspaceItemList workspaceList={workspaceList} />
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;
