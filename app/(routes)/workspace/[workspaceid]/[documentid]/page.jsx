"use client";
import React from "react";
import SideNav from "../../_components/SideNav";
import DocumentEditorSection from "../../_components/DocumentEditorSection";

function WorkspaceDocument({ params }) {
  // console.log("WorkspaceDocument params:", params);
  return (
    <div>
      {/* side navigation bar */}
      <div className="">
        <SideNav params={params} />
      </div>

      {/* document */}
      <div className="md: ml-72">
        <DocumentEditorSection params={params} />
      </div>
    </div>
  );
}

export default WorkspaceDocument;
