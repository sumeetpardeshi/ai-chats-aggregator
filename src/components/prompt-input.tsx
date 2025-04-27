"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquarePlus } from "lucide-react";

export function PromptInput() {
  const { sendPrompt, isLoading, selectedModels } = useAppStore();
  const [localPrompt, setLocalPrompt] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const [pulsing, setPulsing] = useState(true);

  // Stop pulsing after a few seconds or when the user interacts
  useEffect(() => {
    const timer = setTimeout(() => setPulsing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
    setPulsing(false);
  };

  return (
    <div className="w-full mx-auto py-3 sticky bottom-0 z-10">
      <div 
        className={`
          relative 
          bg-background 
          backdrop-blur-md 
          border 
          rounded-xl 
          p-3 
          flex 
          w-full
          transition-all
          duration-200
          ${hasFocus ? 'border-primary shadow-primary/20' : 'border-primary/30'} 
          ${pulsing ? 'input-pulse' : 'shadow-lg'}
        `}
      >
        <div className="flex items-center text-muted-foreground pr-2">
          <MessageSquarePlus className="h-5 w-5" />
        </div>
        <Textarea
          value={localPrompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setHasFocus(true);
            setPulsing(false);
          }}
          onBlur={() => setHasFocus(false)}
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
          className={`
            absolute 
            bottom-3 
            right-3
            transition-all
            ${!localPrompt.trim() ? 'opacity-70' : 'opacity-100'}
          `}
          size="icon"
          variant={localPrompt.trim() ? "default" : "ghost"}
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
          Please select at least one model to compare in the &quot;Models&quot; tab.
        </p>
      )}
    </div>
  );
} 