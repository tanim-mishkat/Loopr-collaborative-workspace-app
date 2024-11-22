import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

import Table from "@editorjs/table";

import EditorjsList from "@editorjs/list";

function RichTextEditor() {
  const ref = useRef();
  const saveDocument = () => {
    ref.current.save().then((outputData) => {
      console.log(outputData);
    });
  };
  let editor;

  useEffect(() => {
    initEditor();
  }, []);

  const initEditor = () => {
    if (!editor?.current) {
      editor = new EditorJS({
        onChange: (api, event) => {
          saveDocument();
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
    }
    ref.current = editor;
  };

  return (
    <div className="-ml-80">
      <div id="editorjs"></div>
    </div>
  );
}

export default RichTextEditor;
