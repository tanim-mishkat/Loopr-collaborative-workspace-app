import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DocumentOptions from "./DocumentOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DocumentList({ documentList, params }) {
  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const router = useRouter();

  // Local state to update UI on deletion
  const [docs, setDocs] = useState(documentList);

  const DeleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, "workspaceDocuments", docId));
      toast("Document Deleted!");
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document.");
    }
  };

  return (
    <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
      {docs.length > 0 ? (
        docs.map((doc) =>
          doc?.id ? (
            <div
              key={doc.id}
              onClick={() =>
                router.push(`/workspace/${params?.workspaceid}/${doc.id}`)
              }
              className={`mt-2 sm:mt-3 p-1.5 sm:p-2 px-2 sm:px-3 hover:bg-gray-200 
                rounded-lg cursor-pointer flex justify-between items-center
                ${doc.id === params?.documentid ? "bg-white shadow-sm" : ""}
                transition-all duration-200`}
            >
              <div className="flex gap-1.5 sm:gap-2 items-center overflow-hidden">
                {!doc.emoji && (
                  <Image
                    src="/loopdocument.svg"
                    width={isMobile ? 16 : 20}
                    height={isMobile ? 16 : 20}
                    alt="Document icon"
                  />
                )}
                <h2
                  className={`flex gap-1 sm:gap-2 ${
                    isMobile ? "text-sm" : "text-base"
                  } truncate`}
                >
                  {doc.emoji}
                  <span className="truncate">{doc.documentName}</span>
                </h2>
              </div>
              <DocumentOptions
                doc={doc}
                deleteDocument={() => DeleteDocument(doc.id)}
              />
            </div>
          ) : null
        )
      ) : (
        <div className="text-center text-gray-500 mt-4 p-2">
          <p className="text-sm">No documents yet</p>
          <p className="text-xs mt-1">Click + to create your first document</p>
        </div>
      )}
    </div>
  );
}

export default DocumentList;
