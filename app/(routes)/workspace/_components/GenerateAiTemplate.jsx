import { Button } from "@/components/ui/button";
import { LayoutGrid, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/config/GoogleAiModel";

function GenerateAiTemplate({ setGenerateAiOutput }) {
  const [open, setOpen] = React.useState(false);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);

  const generateFromAi = async () => {
    setLoading(true);
    const PROMPT = `Generate a template for editor.js in JSON format for ${userInput}`;
    const result = await chatSession.sendMessage(PROMPT);
    console.log(result.response.text());
    try {
      const output = JSON.parse(result.response.text());
      setGenerateAiOutput(output);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        classNane="flex gap-2 "
        onClick={() => setOpen(true)}
      >
        <LayoutGrid className="h-4 w-4" />
        Generate AI Template
      </Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Ai Template</DialogTitle>
            <DialogDescription>
              <h2 className="mt-5">What would you like to generate</h2>
              <Input
                placeholder="Ex: project idea for school assignment"
                onChange={(e) => setUserInput(e?.target.value)}
              />
              <div className="mt-5 flex gap-5 justify-end">
                <Button variant="Ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!userInput || loading}
                  onClick={generateFromAi}
                >
                  {loading ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenerateAiTemplate;
