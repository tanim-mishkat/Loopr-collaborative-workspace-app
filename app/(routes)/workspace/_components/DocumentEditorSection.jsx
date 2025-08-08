import React, { useState } from "react";
import DcoumentHeader from "./DcoumentHeader";
import DocumentInfo from "./DocumentInfo";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import CommentBox from "./CommentBox";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DocumentEditorSection({ params }) {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  // Dynamically import RichDocumentEditor with SSR disabled
  const RichDocumentEditor = dynamic(
    () => import("../_components/RichDocumentEditor"),
    { ssr: false }
  );
  
  const [openComment, setOpenComment] = useState(false);
  
  return (
    <div className="relative min-h-screen">
      {/* Header  */}
      <DcoumentHeader />

      {/* Document Info  */}
      <DocumentInfo params={params} />

      {/* Rich Text Editor  */}
      <RichDocumentEditor params={params} />

      {/* Comment Button - Adjust position based on screen size */}
      <div className={`fixed ${isMobile ? 'right-4 bottom-20' : 'right-10 bottom-10'} z-20`}>
        <Button 
          onClick={() => setOpenComment(!openComment)}
          size={isMobile ? "sm" : "default"}
          className="rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {openComment ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </Button>
        
        {/* Comment Box - Adjust size based on screen size */}
        {openComment && (
          <div className={`${isMobile ? 'w-[280px] right-0' : 'w-[320px]'} absolute bottom-12`}>
            <CommentBox />
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentEditorSection;
