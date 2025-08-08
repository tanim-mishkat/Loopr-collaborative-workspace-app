"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

function WorkspaceItemList({ workspaceList }) {
  const router = useRouter();
  
  const OnClickWorkspaceItem = async (workspaceId) => {
    try {
      // Get the first document in the workspace
      const q = query(
        collection(db, "workspaceDocuments"),
        where("workspaceId", "==", Number(workspaceId)),
        orderBy("createdAt", "asc"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Navigate to the first document
        const firstDoc = querySnapshot.docs[0].data();
        router.push("/workspace/" + workspaceId + "/" + firstDoc.id);
      } else {
        // If no documents exist, navigate to workspace page (will show empty state)
        router.push("/workspace/" + workspaceId);
      }
    } catch (error) {
      console.error("Error fetching workspace documents:", error);
      // Fallback to workspace page
      router.push("/workspace/" + workspaceId);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {workspaceList &&
        workspaceList.map((workspace, index) => (
          <div
            key={index}
            className="border shadow-xl rounded-xl
            hover:scale-105 transition-all cursor-pointer"
            onClick={() => OnClickWorkspaceItem(workspace.id)}
          >
            <Image
              src={workspace?.coverImage}
              width={400}
              height={200}
              alt="cover"
              className="h-[150px] object-cover rounded-t-xl"
            />
            <div className="p-4 rounded-b-xl">
              <h2 className="flex gap-2">
                {workspace?.emoji} {workspace.workspaceName}
              </h2>
            </div>
          </div>
        ))}
    </div>
  );
}

export default WorkspaceItemList;
