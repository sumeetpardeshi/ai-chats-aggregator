"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { AIModel } from "@/lib/types";

interface HeaderProps {
  selectedModels: AIModel[];
  onClearSelections: () => void;
}

export function Header({ selectedModels, onClearSelections }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
      <div className="container flex h-14 items-center justify-between max-w-full px-4">
        <div className="flex">
          <h1 className="font-bold text-xl">Multi-Search</h1>
        </div>
        <div className="flex items-center justify-end space-x-4">
          {selectedModels.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={onClearSelections}
                className="text-sm text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          )}
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
} 