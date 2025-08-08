"use client";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "@/app/_components/EmojiPickerComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebaseConfig";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { Loader2Icon, SmilePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import uuid4 from "uuid4";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [workspaceName, setWorkspaceName] = useState();
  const [emoji, setEmoji] = useState();
  const { user } = useUser();
  const { orgId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  /**
   * Used to create new workspace and save data in database
   */
  const OnCreateWorkspace = async () => {
    if (!workspaceName?.trim()) {
      setError("Please enter a workspace name");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const workspaceId = Date.now();
      
      // Create workspace document
      await setDoc(doc(db, "Workspace", workspaceId.toString()), {
        workspaceName: workspaceName.trim(),
        emoji: emoji || "📝",
        coverImage: coverImage,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        id: workspaceId,
        orgId: orgId || user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date().toISOString(),
      });

      // Create initial document
      const docId = uuid4();
      await setDoc(doc(db, "workspaceDocuments", docId.toString()), {
        workspaceId: workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: emoji || "📝",
        id: docId,
        documentName: "Untitled Document",
        documentOutput: [],
        createdAt: new Date().toISOString(),
      });

      // Create document output
      await setDoc(doc(db, "documentOutput", docId.toString()), {
        docId: docId,
        output: [],
        createdAt: new Date().toISOString(),
      });

      // Navigate to the new workspace
      router.replace("/workspace/" + workspaceId + "/" + docId);
      
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError("Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-96 py-28">
      <div className="shadow-2xl rounded-xl">
        {/* Cover Image  */}
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className="relative group cursor-pointer">
            <h2
              className="hidden absolute p-4 w-full h-full
                    items-center group-hover:flex
                    justify-center  "
            >
              Change Cover
            </h2>
            <div className="group-hover:opacity-40">
              <Image
                src={coverImage}
                width={400}
                height={400}
                className="w-full h-[180px] object-cover rounded-t-xl"
              />
            </div>
          </div>
        </CoverPicker>

        {/* Input Section  */}
        <div className="p-12">
          <h2 className="font-medium text-xl">Create a new workspace</h2>
          <h2 className="text-sm mt-2">
            This is a shared space where you can collaborate wth your team. You
            can always rename it later.
          </h2>
          <div className="mt-8 flex gap-2 items-center">
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant="outline">{emoji ? emoji : <SmilePlus />}</Button>
            </EmojiPickerComponent>
            <Input
              placeholder="Workspace Name"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="mt-7 flex justify-end gap-6">
            <Button
              disabled={!workspaceName?.length || loading}
              onClick={OnCreateWorkspace}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
            <Button 
              variant="outline" 
              disabled={loading}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
