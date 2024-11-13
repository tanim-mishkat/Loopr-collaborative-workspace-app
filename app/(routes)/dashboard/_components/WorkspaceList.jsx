"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function WorkspaceList() {
  const { user } = useUser();
  const [workspaceList, setWorkspaceList] = useState([]);
  //   console.log("work", WorkspaceList);
  return (
    <div className="my-10 p-10 md:px-24 lg:px-36 xl:px-52">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Hello, {user?.fullName}</h2>
        <Link href={"/createworkspace"}>
          <Button>+</Button>
        </Link>
      </div>

      <div className="m-10 flex justify-between">
        <div>
          <h2 className="font-medium text-primary">Workspaces</h2>
        </div>

        <div className="flex gap-2">
          <LayoutGrid />
          <AlignLeft />
        </div>
      </div>

      {workspaceList?.length === 0 ? (
        <div className="flex flex-col justify-center items-center my-10">
          <Image
            src="/workspace.jpg"
            alt="workspace Img"
            width={200}
            height={200}
          />

          <h2 className="font-medium text-primary">Creae New Workspace</h2>

          <Link href={"/createworkspace"}>
            <Button className="my-3">New Workspace</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="font-medium text-primary">Workspace List</h2>
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;
