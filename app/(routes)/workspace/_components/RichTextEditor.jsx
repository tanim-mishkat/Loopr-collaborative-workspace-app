import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

import Table from "@editorjs/table";

import EditorjsList from "@editorjs/list";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import GenerateAiTemplate from "./GenerateAiTemplate";

function RichTextEditor({ params }) {
  const ref = useRef();

  let editor;
  const [documentOutput, setDocumentOutput] = useState([]);
  let isFetch = false;
  const { user } = useUser();

  useEffect(() => {
    user && initEditor();
  }, [user]);

  // useEffect(() => {
  //   params && GetDocumentOutput();
  // }, [params]);

  const saveDocument = () => {
    console.log("saved document");
    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, "documentOutput", params?.docId);
      console.log("docref doc docId : ", params?.docId);
      console.log("docref doc documentId : ", params?.documentId);
      console.log("docref doc documentid : ", params?.documentid);

      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress.emailAddress,
      });
    });
  };

  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(
      doc(db, "documentOutput", params?.docId),
      (doc) => {
        if (
          isFetch === false ||
          doc.data()?.editedBy != user?.primaryEmailAddress?.emailAddress
        ) {
          isFetch = true;
          doc.data()?.output && editor.render(JSON.parse(doc.data()?.output));
        }
      }
    );
  };

  const initEditor = () => {
    if (!editor?.current) {
      editor = new EditorJS({
        onChange: (api, event) => {
          saveDocument();
        },
        onReady: () => {
          GetDocumentOutput();
        },
        holder: "editorjs",
        tools: {
          header: Header,

          table: Table,

          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
        },
      });
      ref.current = editor;
    }
  };

  return (
    <div className="lg:-ml-80  md:-ml-40">
      <div id="editorjs"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10">
        <GenerateAiTemplate
          setGenerateAiOutput={(output) => editor.render(output)}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
