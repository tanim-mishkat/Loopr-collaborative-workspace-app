"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Paragraph from "@editorjs/paragraph";

import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import GenerateAITemplate from "./GenerateAITemplate";
import { Loading } from "@/components/ui/loading";

function RichDocumentEditor({ params }) {
  const editorRef = useRef(null);
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const SaveDocument = useCallback(async () => {
    try {
      if (!editorRef.current) return;
      setIsSaving(true);

      const outputData = await editorRef.current.save();

      const docRef = doc(db, "documentOutput", params?.documentid);

      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress?.emailAddress,
        lastUpdated: new Date().toISOString(),
      });

      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      setIsSaving(false);
      import("react-hot-toast").then(({ toast }) =>
        toast.error(`Save failed: ${error.message}`)
      );
    }
  }, [params?.documentid, user]);

  const handleKeyboardShortcuts = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      SaveDocument();
    }
  };

  useEffect(() => {
    let unsubscribe;
    let editor;

    const init = async () => {
      try {
        const editorContainer = document.getElementById("editorjs");
        if (!editorContainer) {
          console.error("Missing editor container");
          return;
        }

        // Get document content first
        let initialData = { blocks: [] };
        try {
          const docSnap = await getDoc(
            doc(db, "documentOutput", params?.documentid)
          );
          if (docSnap.exists()) {
            const parsed = JSON.parse(docSnap.data().output || "{}");
            if (Array.isArray(parsed.blocks)) initialData = parsed;
          }
        } catch (err) {
          console.warn("Could not fetch existing content:", err.message);
        }

        // Now initialize EditorJS
        editor = new EditorJS({
          holder: "editorjs",
          data: initialData,
          autofocus: true,
          placeholder: "Start writing...",
          defaultBlock: "paragraph",
          onReady: async () => {
            editorRef.current = editor;
            setIsLoading(false);

            // Watch for blur auto-save
            editorContainer.addEventListener(
              "blur",
              (event) => {
                if (!editorContainer.contains(event.relatedTarget))
                  SaveDocument();
              },
              true
            );

            editorContainer.addEventListener("keydown", (event) => {
              const i = editor.blocks.getCurrentBlockIndex?.();
              if (event.ctrlKey && event.shiftKey && event.key === "D") {
                event.preventDefault();
                if (i >= 0) editor.blocks.delete(i);
              }
              if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                editor.blocks.insert("paragraph", {}, {}, i + 1, true);
              }
            });
          },
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3],
                defaultLevel: 2,
              },
            },
            delimiter: Delimiter,
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            alert: {
              class: Alert,
              inlineToolbar: true,
              config: {
                defaultType: "info",
                messagePlaceholder: "Enter your message",
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: { rows: 2, cols: 3 },
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: { defaultStyle: "unordered" },
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            image: {
              class: SimpleImage,
              inlineToolbar: true,
              config: {
                placeholder: "Paste image URL",
                captionPlaceholder: "Image caption",
              },
            },
            code: {
              class: CodeTool,
              inlineToolbar: true,
              config: { placeholder: "Write your code here..." },
            },
          },
        });

        // Optional real-time updates (disabled to prevent duplication)
        // unsubscribe = onSnapshot(doc(db, "documentOutput", params?.documentid), (docSnap) => {
        //   if (docSnap.exists()) {
        //     const data = JSON.parse(docSnap.data().output || "{}");
        //     if (editor && editor.blocks && data.blocks) {
        //       editor.blocks.render(data);
        //     }
        //   }
        // });

        document.addEventListener("keydown", handleKeyboardShortcuts);
      } catch (err) {
        console.error("Editor initialization failed:", err.message);
        import("react-hot-toast").then(({ toast }) =>
          toast.error("Failed to load editor")
        );
      }
    };

    init();

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [params?.documentid, user]);

  const getEditorWidth = () => {
    if (isMobile) return "w-full px-2";
    if (isTablet) return "w-[85%] mx-auto";
    return "w-[70%] mx-auto";
  };

  const handleGeneratedContent = (output) => {
    if (!editorRef.current || !output) return;
    try {
      if (!Array.isArray(output.blocks)) throw new Error("Invalid structure");

      const validBlocks = output.blocks.filter(
        (block) => block && block.type && block.data
      );

      if (!validBlocks.length) throw new Error("No valid blocks");

      editorRef.current.blocks.clear();
      editorRef.current.blocks.render({ blocks: validBlocks });

      SaveDocument();
    } catch (err) {
      import("react-hot-toast").then(({ toast }) =>
        toast.error(`AI Insert Error: ${err.message}`)
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <Loading
          variant="workspace"
          message="Loading document..."
          submessage="Setting up your collaborative workspace"
        />
      )}

      <div
        id="editorjs"
        className={`${getEditorWidth()} min-h-[70vh] pb-20 transition-all duration-300 ease-in-out`}
      />

      {isSaving && (
        <div className="fixed top-4 right-4 bg-white border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 3.042 
              1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Saving...</span>
        </div>
      )}

      <div
        className={`fixed bottom-10 ${
          isMobile ? "right-4" : "md:ml-80 left-0"
        } z-10`}
      >
        <GenerateAITemplate setGenerateAIOutput={handleGeneratedContent} />
      </div>
    </div>
  );
}

export default RichDocumentEditor;
