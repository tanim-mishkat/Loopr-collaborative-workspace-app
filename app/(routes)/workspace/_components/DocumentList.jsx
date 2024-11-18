import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function DocumentList({ documentList, params }) {
  const router = useRouter();
  return (
    <div>
      {documentList.map((doc, index) => (
        <div
          key={index}
          className={`mt-3 p-2 px-3 hover:bg-gray-200 rounded-lg cursor-pointer ${
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
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
