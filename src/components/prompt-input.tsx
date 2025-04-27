"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

export function PromptInput() {
  const { sendPrompt, isLoading, selectedModels } = useAppStore();
  const [localPrompt, setLocalPrompt] = useState("");

  const handleSendPrompt = async () => {
    if (!localPrompt.trim() || isLoading || selectedModels.length === 0) return;
    
    await sendPrompt(localPrompt);
    setLocalPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative bg-background/80 backdrop-blur-md border border-border/50 rounded-lg p-2 flex glass w-full">
        <Textarea
          value={localPrompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedModels.length === 0 
            ? "Please select models first" 
            : `Send a prompt to ${selectedModels.length} selected model${selectedModels.length > 1 ? 's' : ''}...`
          }
          disabled={isLoading || selectedModels.length === 0}
          className="min-h-[60px] max-h-[120px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 w-full"
        />
        <Button
          onClick={handleSendPrompt}
          disabled={isLoading || !localPrompt.trim() || selectedModels.length === 0}
          className="absolute bottom-3 right-3"
          size="icon"
          variant="ghost"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      {isLoading && (
        <p className="text-xs text-primary mt-2 text-center">
          Querying {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''}...
        </p>
      )}
      {selectedModels.length === 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Please select at least one model to compare in the "Models" tab.
        </p>
      )}
    </div>
  );
} 