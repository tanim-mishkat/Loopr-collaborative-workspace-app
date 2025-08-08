"use client";
import { useThreads } from "@liveblocks/react";
import React from "react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function CommentBox() {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  const { threads } = useThreads();
  
  return (
    <div
      className={`${isMobile ? 'w-full' : 'w-[300px]'} ${isMobile ? 'h-[300px]' : 'h-[350px]'} 
        bg-white shadow-lg rounded-lg overflow-auto z-30 border border-gray-100`}
    >
      <div className="p-2 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-medium">Comments</h3>
      </div>
      
      <div className="p-2 overflow-y-auto" style={{ maxHeight: isMobile ? '220px' : '270px' }}>
        {threads?.length > 0 ? (
          threads.map((thread) => (
            <Thread key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm p-4">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-2">
        <Composer className="z-10">
          <Composer.Submit 
            className="btn-primary" 
            style={{ color: "#ffffff", padding: isMobile ? '4px 8px' : '6px 12px', fontSize: isMobile ? '12px' : '14px' }}
          >
            Reply
          </Composer.Submit>
        </Composer>
      </div>
    </div>
  );
}

export default CommentBox;
