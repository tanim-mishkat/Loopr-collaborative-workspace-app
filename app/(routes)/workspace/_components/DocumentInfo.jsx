"use client";

import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "@/app/_components/EmojiPickerComponent";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { SmilePlus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DocumentInfo({ params }) {
  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const [coverImage, setCoverImage] = useState("/cover.png");
  const [emoji, setEmoji] = useState();
  const [documentInfo, setDocumentInfo] = useState();

  useEffect(() => {
    if (params?.documentid) {
      GetDocumentInfo();
    }
  }, [params?.documentid]);

  /**
   * Used to get document info
   */
  const GetDocumentInfo = async () => {
    try {
      const docRef = doc(db, "workspaceDocuments", params?.documentid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDocumentInfo(data);
        setEmoji(data?.emoji);
        if (data?.coverImage) setCoverImage(data.coverImage);
      } else {
        toast.error("Document information not found");
      }
    } catch (err) {
      console.error("Failed to fetch document:", err);
      toast.error("Failed to fetch document information.");
    }
  };

  const updateDocumentInfo = async (key, value) => {
    try {
      const docRef = doc(db, "workspaceDocuments", params?.documentid);
      await updateDoc(docRef, { [key]: value });
      toast("Document Updated!");
    } catch (err) {
      console.error("Failed to update document:", err);
      toast.error("Failed to update document.");
    }
  };

  return (
    <div>
      {/* Cover  */}
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo("coverImage", cover);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2
            className="hidden absolute p-2 sm:p-4 w-full h-full
                    items-center group-hover:flex
                    justify-center text-sm sm:text-base font-medium"
          >
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <Image
              src={coverImage}
              width={400}
              height={400}
              className="w-full h-[120px] sm:h-[150px] md:h-[200px] object-cover"
              alt="Document cover"
              priority
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji Picker - Adjust position based on screen size */}
      <div
        className={`absolute ${
          isMobile ? "ml-3 px-2" : isTablet ? "ml-6 px-10" : "ml-10 px-20"
        } mt-[-30px] sm:mt-[-40px] cursor-pointer`}
      >
        <EmojiPickerComponent
          setEmojiIcon={(emoji) => {
            setEmoji(emoji);
            updateDocumentInfo("emoji", emoji);
          }}
        >
          <div className="bg-[#ffffffb0] p-2 sm:p-4 rounded-md shadow-sm">
            {emoji ? (
              <span className={`${isMobile ? "text-3xl" : "text-5xl"}`}>
                {emoji}
              </span>
            ) : (
              <SmilePlus
                className={`${
                  isMobile ? "h-6 w-6" : "h-10 w-10"
                } text-gray-500`}
              />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* File Name - Adjust spacing and font size based on screen size */}
      <div
        className={`mt-6 sm:mt-8 md:mt-10 ${
          isMobile ? "px-4 ml-2" : isTablet ? "px-10 ml-6" : "px-20 ml-10"
        } p-4 sm:p-6 md:p-10`}
      >
        <input
          type="text"
          placeholder="Untitled Document"
          defaultValue={documentInfo?.documentName}
          className={`font-bold ${
            isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-4xl"
          } outline-none w-full`}
          onBlur={(event) =>
            updateDocumentInfo("documentName", event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default DocumentInfo;
