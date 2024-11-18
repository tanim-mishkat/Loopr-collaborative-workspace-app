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

function SideNav({ params }) {
  const { user } = useUser();
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params && getDocumentList();
  }, [params]);
  /**
   * used to fetch all the document from a workspace
   */
  const getDocumentList = () => {
    // console.log("SideNav received params:", params?.workspaceid);
    const q = query(
      collection(db, "WorkspaceDocuments"),
      where("workspaceId", "==", Number(params?.workspaceid))
    );

    setDocumentList([]);
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
    setLoading(true);
    const docId = uuid4();
    await setDoc(doc(db, "WorkspaceDocuments", docId.toString()), {
      workspaceId: Number(params?.workspaceid),
      documentName: "new Document",
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      Id: docId,
      documentOutput: [],
    });

    setLoading(false);
    router.replace("/workspace/" + params?.workspaceid + "/" + docId);
    console.log("data inserted");
  };
  return (
    <div className="h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md ">
      <div className="flex justify-between items-center">
        <Logo />
        <Bell className="h-5 w-5 text-gray-500" />
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
    </div>
  );
}

export default SideNav;
