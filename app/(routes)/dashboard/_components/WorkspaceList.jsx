"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { AlignLeft, LayoutGrid, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import WorkspaceItemList from "./WorkspaceItemList";
import { Loading } from "../../../../components/ui/loading";

const WorkspaceError = ({ error, onRetry }) => (
  <div className="my-10 p-6 sm:p-10 md:px-24 lg:px-36 xl:px-52">
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Failed to Load Workspaces
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        We couldn't load your workspaces. Please check your connection and try
        again.
      </p>
      {error && (
        <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded mb-4 max-w-md text-center">
          {error.message}
        </p>
      )}
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  </div>
);

function WorkspaceList() {
  const { user } = useUser();
  const { orgId } = useAuth();

  const [workspaceList, setWorkspaceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWorkspaceList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, "Workspace"),
        where("orgId", "==", orgId || user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(q);
      const workspaces = [];

      querySnapshot.forEach((doc) => {
        workspaces.push({ id: doc.id, ...doc.data() }); // add doc.id for key usage
      });

      setWorkspaceList(workspaces);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orgId, user]);

  useEffect(() => {
    if (user) {
      getWorkspaceList();
    }
  }, [user, getWorkspaceList]);

  if (loading) {
    return (
      <Loading
        variant="workspace"
        message="Loading your workspaces..."
        submessage="Fetching your collaborative spaces"
      />
    );
  }

  if (error) {
    return <WorkspaceError error={error} onRetry={getWorkspaceList} />;
  }

  return (
    <div className="my-10 p-6 sm:p-10 md:px-24 lg:px-36 xl:px-52">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4">
        <h2 className="font-bold text-xl sm:text-2xl">
          Hello, {user?.fullName}
        </h2>
        <Link href="/createworkspace" passHref>
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
      {workspaceList.length === 0 ? (
        <div className="flex flex-col items-center text-center my-10">
          <Image src="/workspace.png" width={200} height={200} alt="workspace" />
          <h2 className="mt-4 text-lg font-medium">Create a new workspace</h2>
          <Link href="/createworkspace" passHref>
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
