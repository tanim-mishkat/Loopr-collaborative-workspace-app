"use client";
import React from "react";
import SideNav from "../../_components/SideNav";

function WorkspaceDocument({ params }) {
  // console.log("WorkspaceDocument params:", params);
  return (
    <div>
      {/* side navigation bar */}
      <div className="">
        <SideNav params={params} />
      </div>

      {/* document */}
      <div className="md: ml-72">Document</div>
    </div>
  );
}

export default WorkspaceDocument;
