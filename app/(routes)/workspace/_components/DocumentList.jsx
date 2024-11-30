"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import DocumentOptions from "./DocumentOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";

function DocumentList({ documentList, params }) {
  const router = useRouter();
  const deleteDocument = async (Id) => {
    await deleteDoc(doc(db, "WorkspaceDocuments", Id));
    toast("Document deleted successfully");
  };
  return (
    <div>
      {documentList.map((doc, index) => (
        <div
          key={doc.id}
          className={`mt-3 p-2 px-3 hover:bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer ${
            doc.id == params?.Id && "bg-white"
          }`}
          onClick={() =>
            router.push("/workspace/" + params?.workspaceid + "/" + doc?.Id)
          }
        >
          <div className="flex gap-2 items-center">
            {!doc.emoji && (
              <Image
                src={"/documenticon.svg"}
                alt="new  document svg"
                width={20}
                height={20}
              />
            )}
            <h2 className="flex gap-2">
              {doc?.emoji}
              {doc.documentName}
            </h2>
          </div>
          <DocumentOptions
            doc={doc}
            deleteDocument={(Id) => deleteDocument(Id)}
          />
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
