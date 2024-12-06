"use client";
import Logo from "@/app/_components/Logo";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Bell, Loader2Icon, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import DocumentList from "./DocumentList";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import NotifiationBox from "./NotifiationBox";

const MAX_FILE = process.env.NEXT_PUBLIC_MAX_FILE_SIZE;

function SideNav({ params }) {
  const [documentList, setDocumentList] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const router = useRouter();

  useEffect(() => {
    params && GetDocumentList();
  }, [params]);

  /**
   * Used to get Document List
   */
  const GetDocumentList = () => {
    const q = query(
      collection(db, "workspaceDocuments"),
      where("workspaceId", "==", Number(params?.workspaceid))
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocumentList([]);

      querySnapshot.forEach((doc) => {
        setDocumentList((documentList) => [...documentList, doc.data()]);
      });
    });
  };

  /**
   * Create New Document
   */
  const CreateNewDocument = async () => {
    if (documentList?.length >= MAX_FILE) {
      toast("Upgrade to add new file", {
        description:
          "You reach max file, Please upgrade for unlimited file creation",
        action: {
          label: "Upgrade",
          onClick: () => console.log("Upgrade clicked"),
        },
      });
      return;
    }
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      toast.error("Unable to create document. User information is missing.");
      return;
    }
    setLoading(true);
    const docId = uuid4();
    await setDoc(doc(db, "workspaceDocuments", docId.toString()), {
      workspaceId: Number(params?.workspaceid),
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: "",
      emoji: "",
      id: docId,
      documentName: "Untitled Document",
      documentOutput: [],
    });

    await setDoc(doc(db, "documentOutput", docId.toString()), {
      docId: docId,
      output: [],
    });

    setLoading(false);
    router.replace("/workspace/" + params?.workspaceid + "/" + docId);
  };

  return (
    <div>
      {/* Hamburger Icon */}
      <button
        className="md:hidden fixed top-5 left-5 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar for Desktop */}
      <div
        className="h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md"
      >
        <div className="flex justify-between items-center">
          <Logo />
          <NotifiationBox>
            <Bell className="h-5 w-5 text-gray-500" />
          </NotifiationBox>
        </div>
        <hr className="my-5"></hr>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Workspace Name</h2>
            <Button size="sm" className="text-lg" onClick={CreateNewDocument}>
              {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "+"}
            </Button>
          </div>
        </div>

        {/* Document List */}
        <DocumentList documentList={documentList} params={params} />

        {/* Progress Bar */}
        <div className="absolute bottom-10 w-[85%]">
          <Progress value={(documentList?.length / MAX_FILE) * 100} />
          <h2 className="text-sm font-light my-2">
            <strong>{documentList?.length}</strong> Out of <strong>5</strong> files used
          </h2>
          <h2 className="text-sm font-light ">
            Upgrade your plan for unlimited access
          </h2>
        </div>
      </div>

      {/* Sidebar Drawer for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-[75%] h-full bg-blue-50 shadow-md p-5 z-40 md:hidden"
        >
          <div className="flex justify-between items-center">
            <Logo />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <hr className="my-5"></hr>
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Workspace Name</h2>
              <Button size="sm" className="text-lg" onClick={CreateNewDocument}>
                {loading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "+"
                )}
              </Button>
            </div>
          </div>

          {/* Document List */}
          <DocumentList documentList={documentList} params={params} />

          {/* Progress Bar */}
          <div className="absolute bottom-10 w-[85%]">
            <Progress value={(documentList?.length / MAX_FILE) * 100} />
            <h2 className="text-sm font-light my-2">
              <strong>{documentList?.length}</strong> Out of <strong>5</strong> files used
            </h2>
            <h2 className="text-sm font-light ">
              Upgrade your plan for unlimited access
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideNav;
