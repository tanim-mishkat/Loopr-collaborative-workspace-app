import DocumentHeader from "@/app/_components/DocumentHeader";
import React, { useState } from "react";
import DocumentInfo from "./DocumentInfo";
import EditorJS from "@editorjs/editorjs";
import RichTextEditor from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import CommentBox from "./CommentBox";

function DocumentEditorSection({ params }) {
  const [openComment, setOpenComment] = useState(false);
  return (
    <div>
      <DocumentHeader />
      <DocumentInfo params={params} />
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <RichTextEditor params={params} />
        </div>
        <div className="fixed bottom-5 right-5">
          <Button onClick={() => setOpenComment(!openComment)}>
            {openComment ? <X /> : <MessageCircle />}
          </Button>
          {openComment && <CommentBox />}
        </div>
      </div>
    </div>
  );
}

export default DocumentEditorSection;
