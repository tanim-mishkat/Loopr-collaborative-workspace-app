import DocumentHeader from "@/app/_components/DocumentHeader";
import React from "react";
import DocumentInfo from "./DocumentInfo";
import EditorJS from "@editorjs/editorjs";
import RichTextEditor from "./RichTextEditor";

function DocumentEditorSection({ params }) {
  return (
    <div>
      <DocumentHeader />
      <DocumentInfo params={params} />
      <RichTextEditor />
    </div>
  );
}

export default DocumentEditorSection;
