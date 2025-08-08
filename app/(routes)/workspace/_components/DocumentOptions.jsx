import { Link2Icon, MoreVertical, PenBox, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function DocumentOptions({ doc, deleteDocument }) {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  
  // Prevent event propagation to avoid triggering document click
  const handleClick = (e) => {
    e.stopPropagation();
  };
  
  const openRenameDialog = () => {
    setNewDocumentName(doc?.documentName || "");
    setIsRenameDialogOpen(true);
  };
  
  const handleRename = async () => {
    if (!newDocumentName.trim()) {
      toast.error("Document name cannot be empty");
      return;
    }
    
    try {
      const docRef = doc(db, "workspaceDocuments", doc?.id);
      await updateDoc(docRef, {
        documentName: newDocumentName
      });
      toast.success("Document renamed successfully");
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error("Error renaming document:", error);
      toast.error("Failed to rename document");
    }
  };
  
  return (
    <>
      <div onClick={handleClick}>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreVertical className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-500 hover:text-gray-700`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex gap-2 text-sm py-2 cursor-pointer">
              <Link2Icon className="h-4 w-4" /> Share Link
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={openRenameDialog}
              className="flex gap-2 text-sm py-2 cursor-pointer"
            >
              <PenBox className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => deleteDocument(doc?.id)}
              className="flex gap-2 text-sm py-2 text-red-500 hover:text-red-600 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              placeholder="Enter document name"
              className="col-span-3"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentOptions;
