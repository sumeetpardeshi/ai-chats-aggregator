"use client";

import { useAppStore } from "@/lib/store";
import { Header } from "@/components/header";
import { ApiKeysManager } from "@/components/api-keys-form";
import { ModelSelector } from "@/components/model-selector";
import { PromptInput } from "@/components/prompt-input";
import { ComparisonView } from "@/components/comparison-view";
import { SummaryPanel } from "@/components/summary-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MainContent() {
  const { selectedModels, clearSelections, responses } = useAppStore();
  
  return (
    <div className="w-full">
      <Header 
        selectedModels={selectedModels} 
        onClearSelections={clearSelections} 
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">AI Model Comparison</h2>
        <div className="flex items-center gap-2">
          <ApiKeysManager />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-180px)] w-full">
        <Tabs defaultValue="compare" className="flex-1 flex flex-col h-full w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compare" className="flex-1 flex flex-col pt-4 h-full w-full overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 h-full min-h-0 overflow-hidden">
              <div className="flex flex-col min-h-0 h-full overflow-hidden">
                <div className="flex-1 overflow-auto pb-4">
                  <ComparisonView />
                </div>
                <div className="mt-auto">
                  <PromptInput />
                </div>
              </div>
              
              {responses.length > 0 && (
                <div className="h-full min-h-0 overflow-hidden">
                  <SummaryPanel />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="flex-1 pt-4 h-full overflow-hidden w-full">
            <ModelSelector />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 