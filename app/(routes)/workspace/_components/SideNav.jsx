"use client";

import React, { useEffect, useState } from "react";
import Logo from "@/app/_components/Logo";
import DocumentList from "./DocumentList";
import NotifiationBox from "./NotifiationBox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Loader2Icon, Menu, X } from "lucide-react";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_FILE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "5");

function SideNav({ params }) {
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!params?.workspaceid) return;

    const q = query(
      collection(db, "workspaceDocuments"),
      where("workspaceId", "==", Number(params.workspaceid))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => doc.data());
      setDocumentList(docs);
    });

    return () => unsubscribe();
  }, [params?.workspaceid]);

  const CreateNewDocument = async () => {
    if (documentList.length >= MAX_FILE) {
      toast("Upgrade to add new file", {
        description:
          "You've reached the maximum file limit. Please upgrade for unlimited file creation.",
        action: {
          label: "Upgrade",
          onClick: () => {
            toast.info("Upgrade feature coming soon");
          },
        },
      });
      return;
    }

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      toast.error("Unable to create document. User information is missing.");
      return;
    }

    try {
      setLoading(true);
      const docId = uuid4();

      const newDocData = {
        workspaceId: Number(params?.workspaceid),
        createdBy: user.primaryEmailAddress.emailAddress,
        coverImage: "",
        emoji: "",
        id: docId,
        documentName: "Untitled Document",
        documentOutput: [],
      };

      await Promise.all([
        setDoc(doc(db, "workspaceDocuments", docId), newDocData),
        setDoc(doc(db, "documentOutput", docId), {
          docId,
          output: [],
        }),
      ]);

      router.replace(`/workspace/${params.workspaceid}/${docId}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProgressSection = () => (
    <div className="absolute bottom-10 w-[85%]">
      <Progress value={(documentList.length / MAX_FILE) * 100} />
      <h2 className="text-sm font-light my-2">
        <strong>{documentList.length}</strong> out of{" "}
        <strong>{MAX_FILE}</strong> files used
      </h2>
      <h2 className="text-sm font-light">
        Upgrade your plan for unlimited access
      </h2>
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="flex justify-between items-center">
        <Logo />
        <NotifiationBox>
          <Bell className="h-5 w-5 text-gray-500" />
        </NotifiationBox>
      </div>
      <hr className="my-5" />
      <div className="flex justify-between items-center">
        <h2 className="font-medium">Workspace Name</h2>
        <Button
          size="sm"
          className="text-lg"
          onClick={CreateNewDocument}
          data-create-doc
        >
          {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "+"}
        </Button>
      </div>
      <DocumentList documentList={documentList} params={params} />
      {renderProgressSection()}
    </>
  );

  return (
    <div>
      {/* Hamburger (Mobile) */}
      <button
        className="md:hidden fixed top-5 left-5 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-screen w-72 bg-blue-50 p-5 shadow-md">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-[75%] h-full bg-blue-50 shadow-md p-5 z-40 md:hidden">
          <div className="flex justify-between items-center">
            <Logo />
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <hr className="my-5" />
          <SidebarContent />
        </div>
      )}
    </div>
  );
}

export default SideNav;
