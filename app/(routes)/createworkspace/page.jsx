"use client";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComp from "@/app/_components/EmojiPickerComp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmilePlus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover2.jpg");
  const [worspaceName, setworspaceName] = useState();
  const [emoji, setEmoji] = useState();
  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-80 py-28 px-96">
      <div className="shadow-2xl rounded-xl">
<<<<<<< HEAD
        {/*cover image*/}
=======
        {/cover image/}
>>>>>>> 851b8c25d5ab8a7843e61d640828d6eb951ee41d
        <CoverPicker setNewCover={(e) => setCoverImage(e)}>
          <div className="relative group hover:cursor-pointer h-48">
            {/* Initially hides the "Change Cover" text; displays it as a flex container centered within the image when parent is hovered */}

            <h2 className="hidden absolute group-hover:flex p-4 w-full h-full items-center justify-center ">
              Change Cover
            </h2>
            <div className="group-hover:opacity-40">
              <Image
                src={coverImage}
                width={800}
                height={800}
                className="w-full h-[200px] object-cover rounded-t-xl"
                alt="cover image"
              />
            </div>
          </div>
        </CoverPicker>
      </div>
      {/* input section*/}
      <div className="p-12 ">
        <h2 className="font-medium text-xl">Create A New Workspace</h2>
        <h2 className="mt-2text-sm">
          This is a shared space where you can collaborate with your team. You
          can always rename it later
        </h2>
        <div className="mt-8 flex gap-2 items-center">
          <EmojiPickerComp setEmojiIcon={(e) => setEmoji(e)}>
            <Button variant="outline">{emoji ? emoji : <SmilePlus />}</Button>
          </EmojiPickerComp>
          <Input
            placeholder="Workspace name"
            onChange={(e) => {
              setworspaceName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="mt-7 flex justify-end gap-4">
        <Button disabled={!worspaceName?.length}>Create</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default CreateWorkspace;
=======
export default CreateWorkspace;
>>>>>>> 851b8c25d5ab8a7843e61d640828d6eb951ee41d
