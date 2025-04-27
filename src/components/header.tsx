"use client";

// import { ModelSelectorButton } from "@/components/model-selector-button";
import { Button } from "@/components/ui/button";
import { Github, Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { clearResponses, clearSelections } = useAppStore();
  
  const handleClearAll = () => {
    clearResponses();
    clearSelections();
  };

  return (
    <header className="fixed top-0 inset-x-0 h-14 border-b bg-background/50 backdrop-blur-sm z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
      <Search className="h-7 w-7" /> <div className="font-semibold text-lg">
        
          Multi-Search</div>
        {/* <ModelSelectorButton /> */}
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
        <ThemeToggle />
       
      </div>
    </header>
  );
} 