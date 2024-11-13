"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { AlignLeft, LayoutGrid } from "lucide-react";
import Image from "next/image";
<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 6475feee03e86868f1ae473864986e09a5c67736
import React, { useState } from "react";

function WorkspaceList() {
  const { user } = useUser();
  const [workspaceList, setWorkspaceList] = useState([]);
  //   console.log("work", WorkspaceList);
  return (
    <div className="my-10 p-10 md:px-24 lg:px-36 xl:px-52">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Hello, {user?.fullName}</h2>
<<<<<<< HEAD
        <Button>+</Button>
=======
        <Link href={"/createworkspace"}>
          <Button>+</Button>
        </Link>
>>>>>>> 6475feee03e86868f1ae473864986e09a5c67736
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
<<<<<<< HEAD
          <Button variant="outline" className="my-3">
            New Workspace
          </Button>
=======

          <Link href={"/createworkspace"}>
            <Button className="my-3">New Workspace</Button>
          </Link>
>>>>>>> 6475feee03e86868f1ae473864986e09a5c67736
        </div>
      ) : (
        <div>
          <h2 className="font-medium text-primary">Workspace List</h2>
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default WorkspaceList;
=======
export default WorkspaceList;
>>>>>>> 6475feee03e86868f1ae473864986e09a5c67736
