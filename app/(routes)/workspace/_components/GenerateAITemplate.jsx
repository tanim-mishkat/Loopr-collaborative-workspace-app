import { Button } from "@/components/ui/button";
import { AlertCircle, LayoutGrid, Loader2Icon, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/config/GoogleAIModel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AIGenerationLoading } from "@/components/ui/loading";

function GenerateAITemplate({ setGenerateAIOutput }) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Responsive design
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Check if Gemini API key is configured
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      setApiKeyMissing(true);
    }
  }, []);

  // Function to handle retries for transient errors
  const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
    let retries = 0;
    let delay = initialDelay;

    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error) {
        // Only retry for specific error types (like 503 Service Unavailable)
        if (
          error.message.includes("503") ||
          error.message.includes("overloaded")
        ) {
          retries++;
          if (retries >= maxRetries) throw error; // Max retries reached, rethrow

          // Wait with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff

          // Update UI to show retry attempt
          setError(`API is busy. Retrying (${retries}/${maxRetries})...`);
        } else {
          throw error; // Not a retryable error, rethrow immediately
        }
      }
    }
  };

  const GenerateFromAI = async () => {
    if (apiKeyMissing) {
      setError(
        "Gemini API key is not configured. Please add your API key to the .env file."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Improved prompt for better results
      const PROMPT = `Generate a detailed template for editor.js in JSON format for: ${userInput}. 
      The output MUST be valid JSON and follow this exact structure:
      {
        "time": ${Date.now()},
        "blocks": [
          // Array of content blocks with id, type, and data fields
        ],
        "version": "2.30.2"
      }
      
      Each block in the blocks array must have an "id", "type", and "data" field.
      Valid block types include: "header", "paragraph", "list", "table", "code", "image".
      For example, a header block looks like: 
      {
        "id": "uniqueId",
        "type": "header",
        "data": {
          "text": "Your Header Text",
          "level": 2
        }
      }
      
      Return ONLY the JSON object without any explanation or markdown formatting.`;

      // Send the prompt to the Gemini API with retry mechanism
      const sendPromptWithRetry = async () => {
        const result = await chatSession.sendMessage(PROMPT);
        return result.response.text();
      };

      // Use the retry mechanism for handling transient errors
      const responseText = await retryWithBackoff(sendPromptWithRetry);

      // Process AI response

      // Extract JSON from the response (handling potential markdown code blocks)
      let jsonText = responseText;

      // If response contains markdown code blocks, extract the JSON
      if (responseText.includes("```json")) {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1];
        }
      } else if (responseText.includes("```")) {
        // Try to extract from any code block if json block not found
        const codeMatch = responseText.match(/```(?:.*?)\n([\s\S]*?)\n```/);
        if (codeMatch && codeMatch[1]) {
          jsonText = codeMatch[1];
        }
      }

      // Clean the JSON text before parsing
      jsonText = jsonText.trim();

      // Parse the JSON
      let output;
      try {
        output = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(
          "Failed to parse AI response as JSON. Please try again with a clearer prompt."
        );
      }

      // Validate that it's a proper editor.js structure
      if (!output.blocks || !Array.isArray(output.blocks)) {
        throw new Error("Invalid editor.js format: missing blocks array");
      }

      // Ensure time and version are present
      if (!output.time) {
        output.time = Date.now();
      }

      if (!output.version) {
        output.version = "2.30.2";
      }

      // Validate each block has required properties
      for (const block of output.blocks) {
        if (!block.id || !block.type || !block.data) {
          throw new Error(
            "Invalid block format: each block must have id, type, and data properties"
          );
        }

        // Generate random id if not provided or not unique
        if (!block.id) {
          block.id = Math.random().toString(36).substring(2, 15);
        }
      }

      // Pass the output to the parent component
      setGenerateAIOutput(output);
      setOpen(false);
    } catch (error) {
      console.error("Error generating AI content:", error);

      // Provide user-friendly error messages based on error type
      if (
        error.message.includes("API key not valid") ||
        error.message.includes("API key")
      ) {
        setError(
          "Invalid Gemini API key. Please check your API key configuration."
        );
      } else if (
        error.message.includes("Failed to parse") ||
        error.message.includes("JSON")
      ) {
        setError(
          "Failed to parse the AI response. The generated content was not in the expected format."
        );
      } else if (
        error.message.includes("Invalid block format") ||
        error.message.includes("Invalid editor.js format")
      ) {
        setError(error.message);
      } else if (error.name === "AbortError") {
        setError("The request was aborted. Please try again.");
      } else if (
        (error.name === "TypeError" &&
          error.message.includes("NetworkError")) ||
        error.message.includes("network") ||
        error.message.includes("connect")
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (
        error.message.includes("overloaded") ||
        error.message.includes("503")
      ) {
        setError(
          "The Gemini API is currently overloaded. We tried multiple times but couldn't get a response. Please try again in a few minutes."
        );
      } else if (
        error.message.includes("timeout") ||
        error.message.includes("timed out")
      ) {
        setError(
          "Request timed out. The Gemini API took too long to respond. Please try again."
        );
      } else if (
        error.message.includes("quota") ||
        error.message.includes("limit")
      ) {
        setError(
          "API quota exceeded. Please try again later or check your Gemini API usage limits."
        );
      } else {
        setError(
          "Failed to generate content. Please try a different prompt or try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className={`flex gap-2 ${
          isMobile ? "px-3" : "px-4"
        } shadow-sm hover:shadow-md transition-all`}
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <Sparkles className="h-4 w-4" />
        {isMobile ? "AI Template" : "Generate AI Template"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`${
            isMobile ? "w-[95%] max-w-[95%]" : "max-w-md"
          } p-4 sm:p-6`}
        >
          {loading ? (
            <AIGenerationLoading 
              message="Generating AI template..." 
              submessage="Creating your personalized content"
            />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Generate AI Template
                </DialogTitle>
                <DialogDescription>
                  Describe what you want to write about and AI will generate a
                  document template for you.
                </DialogDescription>
              </DialogHeader>

              {/* Move content outside of DialogHeader to fix HTML validation errors */}
              <div className="space-y-4 mt-4">
            {error && (
              <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="userInput" className="text-sm font-medium">
                What would you like to write about?
              </label>
              <Input
                id="userInput"
                placeholder="E.g., Project proposal, Meeting notes, Research summary..."
                value={userInput}
                onChange={(event) => setUserInput(event?.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-3"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={!userInput.trim() || loading || apiKeyMissing}
                onClick={GenerateFromAI}
                className="px-4 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate</>
                )}
              </Button>
</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenerateAITemplate;
