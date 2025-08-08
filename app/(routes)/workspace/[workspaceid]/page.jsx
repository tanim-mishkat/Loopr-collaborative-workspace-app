"use client";
import React, { use, useEffect, useState } from "react";
import SideNav from "../_components/SideNav";
import { Room } from "@/app/Room";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

function Workspace({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [hasDocuments, setHasDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkForDocuments();
  }, [params]);

  const checkForDocuments = async () => {
    try {
      const q = query(
        collection(db, "workspaceDocuments"),
        where("workspaceId", "==", Number(params?.workspaceid)),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Redirect to the first document
        const firstDoc = querySnapshot.docs[0].data();
        router.replace("/workspace/" + params.workspaceid + "/" + firstDoc.id);
      } else {
        setHasDocuments(false);
      }
    } catch (error) {
      console.error("Error checking documents:", error);
      setHasDocuments(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Room params={params}>
        <div className="flex">
          <SideNav params={params} />

          {/* Main content area for empty workspace */}
          <div className="flex-1 md:ml-72 p-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to your workspace
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                This workspace is empty. Create your first document to get
                started with collaborative editing.
              </p>
              <Button
                onClick={() => {
                  // The SideNav CreateNewDocument function will handle this
                  const createButton =
                    document.querySelector("[data-create-doc]");
                  if (createButton) createButton.click();
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Document
              </Button>
            </div>
          </div>
        </div>
      </Room>
    </div>
  );
}

export default Workspace;
