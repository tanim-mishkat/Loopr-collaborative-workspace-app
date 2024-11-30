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
import { Bell, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import DocumentList from "./DocumentList";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import uuid4 from "uuid4";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import NotificationBox from "./NotificationBox";

function SideNav({ params }) {
  const { user } = useUser();
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const MAX_FILE = 5;

  useEffect(() => {
    params && getDocumentList();
  }, [params]);
  /**
   * used to fetch all the document from a workspace
   */
  const getDocumentList = () => {
    console.log("SideNav received params:", params?.workspaceid);
    const q = query(
      collection(db, "WorkspaceDocuments"),
      where("workspaceId", "==", Number(params?.workspaceid))
    );

    // setDocumentList([]);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = []; // Temporary array to collect documents
      querySnapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setDocumentList([]);
      setDocumentList(documents);
    });
  };

  /**
   * create new document
   */

  const createNewDocument = async () => {
    if (documentList.length >= MAX_FILE) {
      toast("Upgrade to create more than 5 documents", {
        description:
          "You have reached the maximum number of documents. Upgrade to create more.",
        action: {
          label: "Upgrade",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }
    if (!params?.workspaceid) {
      alert("workspaceid is missing in params");
      return;
    }
    alert(params?.documentid);
    setLoading(true);
    const docId = uuid4();
    await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
      workspaceId: params?.workspaceid,
      documentName: "Untitled Document",
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      Id: docId,
      documentOutput: [],
    });

    await setDoc(doc(db, "documentOutput", docId.toString()), {
      docId: docId,
      output: [],
    });

    setLoading(false);
    router.replace("/workspace/" + params?.workspaceid + "/" + docId);
    console.log("data inserted");
  };
  return (
    <div className="h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md ">
      <div className="flex justify-between items-center">
        <Logo />
        <NotificationBox>
          <Bell className="h-5 w-5 text-gray-500" />
        </NotificationBox>
      </div>
      <hr className="my-5"></hr>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Workspace Name</h2>
          <Button size="sm" onClick={createNewDocument}>
            {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "+"}
          </Button>
        </div>
      </div>
      {/* document list */}
      <DocumentList documentList={documentList} params={params} />

      <div className="absolute bottom-10 w-[85%]">
        <Progress value={(documentList?.length / MAX_FILE) * 100} />
        <h2 className="text-sm font-light my-2 ">
          <strong>{documentList?.length}</strong> out of 5 files used
        </h2>
        <h2 className="text-sm font-light">
          Upgrade your plan for unlimited access
        </h2>
      </div>
    </div>
  );
}

export default SideNav;
