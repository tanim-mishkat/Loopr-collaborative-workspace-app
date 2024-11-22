import DocumentHeader from "@/app/_components/DocumentHeader";
import React from "react";
import DocumentInfo from "./DocumentInfo";

function DocumentEditorSection({ params }) {
  return (
    <div>
      <DocumentHeader />
      <DocumentInfo params={params} />
    </div>
  );
}

export default DocumentEditorSection;
