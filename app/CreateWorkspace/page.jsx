app > createworkspace > page.jsx;

("use client");
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComp from "@/app/_components/EmojiPickerComp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebaseConfig";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { Loader2Icon, SmilePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover2.jpg");
  const [workspaceName, setworkspaceName] = useState();
  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState();
  const { user } = useUser();
  const { orgId } = useAuth();
  const router = useRouter();

  /* 
  used to create new workspace and save data in db
*/
  const onCreateWorkspace = async () => {
    setLoading(true);
    const docId = Date.now();
    const result = await setDoc(doc(db, "Workspace", docId.toString()), {
      workspaceName: workspaceName,
      emoji: emoji || "",
      coverImage: coverImage,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      id: docId,
      orgId: orgId ? orgId : primaryEmailAddress?.emailAddress,
    });
    setLoading(false);
    router.replace("/workspace/" + docId);
    console.log("data inserted");
  };

  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-80 py-28 px-96">
      <div className="shadow-2xl rounded-xl">
        {/cover image/}
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
              setworkspaceName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="mt-7 flex justify-end gap-4">
        <Button
          disabled={!workspaceName?.length || loading}
          onClick={onCreateWorkspace}
        >
          Create {loading && <Loader2Icon className="animate-spin ml-2" />}
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

export default CreateWorkspace;
