import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function WorkspaceitemList({ workspaceList }) {
  const onClickWorkspaceItem = (id) => {
    const router = useRouter();
    const onClickWorkspaceItem = (id) => {
      router.push(`/workspace/${id}`);
    };
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {workspaceList &&
        workspaceList.map((workspace, id) => (
          <div
            key={id}
            className="border shadow-xl rounded-xl gap-6 mt-6 hover:scale-105 transition-all cursor-pointer"
            onClick={() => onClickWorkspaceItem(workspace.id)}
          >
            <Image
              src={workspace?.coverImage}
              width={400}
              height={200}
              className="h-[150px] object-cover rounded-t-xl"
            />
            <div className="p-4 rounded-b-xl">
              <h2 className="flex-gap-2">
                {workspace?.emoji}
                {workspace.workspaceName}
              </h2>
            </div>
          </div>
        ))}
    </div>
  );
}

export default WorkspaceitemList;
