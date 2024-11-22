"use client";

import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComp from "@/app/_components/EmojiPickerComp";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SmilePlus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function DocumentInfo({ params }) {
  const [coverImage, setCoverImage] = useState("/cover2.jpg");
  const [emoji, setEmoji] = useState();
  const [documntInfo, setDocumntInfo] = useState();

  const getDocumentInfo = async () => {
    const docRef = doc(db, "WorkspaceDocuments", params?.documentid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setDocumntInfo(docSnap.data());
      setEmoji(docSnap.data()?.emoji);
      docSnap.data()?.coverImage && setCoverImage(docSnap.data()?.coverImage);
    }
  };

  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, "WorkspaceDocuments", params?.documentid);
    await updateDoc(docRef, { [key]: value });
    toast("Document updated successfully");
  };

  useEffect(() => {
    params && getDocumentInfo();
  }, [params]);

  /**
   * used to get doc info
   */

  return (
    <div>
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo("coverImage", cover);
        }}
      >
        <div className="relative group hover:cursor-pointer h-48">
          <h2 className="hidden absolute group-hover:flex p-4 w-full h-full items-center justify-center ">
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <Image
              src={coverImage}
              width={800}
              height={800}
              className="w-full h-[180px] object-cover rounded-t-xl"
              alt="cover image"
            />
          </div>
        </div>
      </CoverPicker>

      <div className="absolute ml-10 mt-[-40px] cursor-pointer">
        <EmojiPickerComp
          setEmojiIcon={(emoji) => {
            setEmoji(emoji);
            updateDocumentInfo("emoji", emoji);
          }}
        >
          <div className="bg-[#ffffffb0] p-4 rounded-md">
            {emoji ? (
              <span className="text-4xl">{emoji}</span>
            ) : (
              <SmilePlus className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComp>
      </div>

      <div className="mt-10 p-10 ">
        <input
          className="font-bold text-4xl outline-none"
          type=" text"
          placeholder="untitled document"
          defaultValue={documntInfo?.documentName}
          onBlur={(e) => updateDocumentInfo("documentName", e.target.value)}
        />
      </div>
    </div>
  );
}

export default DocumentInfo;
