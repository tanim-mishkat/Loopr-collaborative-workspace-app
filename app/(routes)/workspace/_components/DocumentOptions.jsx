import { Link2Icon, MoreVertical, PenBox, Trash2Icon } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function DocumentOptions() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className=" h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex  gap-2">
            <Link2Icon className="h-4 w-4" /> Share link
          </DropdownMenuItem>
          <DropdownMenuItem className="flex  gap-2">
            <PenBox className="h-4 w-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="flex  gap-2 text-red-500">
            <Trash2Icon className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DocumentOptions;
