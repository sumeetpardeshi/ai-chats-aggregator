"use client";

import { useAppStore } from "@/lib/store";
import { Header } from "@/components/header";
import { ApiKeysManager } from "@/components/api-keys-form";
import { ModelSelectorButton } from "@/components/model-selector-button";
import { PromptInput } from "@/components/prompt-input";
import { ComparisonView } from "@/components/comparison-view";
import { SummaryPanel } from "@/components/summary-panel";


export function MainContent() {
  const { responses } = useAppStore();
  
  return (
    <div className="w-full">
      <Header />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 mt-16">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            
            AI Models
          </h2>
          <ModelSelectorButton />
        </div>
        <div className="flex items-center gap-2">
          <ApiKeysManager />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-180px)] w-full">
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 h-full min-h-0 overflow-hidden">
            <div className="flex flex-col min-h-0 h-full overflow-hidden">
              <div className="flex-1 overflow-auto pb-4 pr-1">
                <ComparisonView />
              </div>
              <div className="mt-auto pt-2">
                <PromptInput />
              </div>
            </div>
            
            {responses.length > 0 && (
              <div className="h-full min-h-0 overflow-hidden">
                <SummaryPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 