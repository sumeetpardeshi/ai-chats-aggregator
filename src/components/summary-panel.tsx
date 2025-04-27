"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryPanel() {
  const { 
    models, 
    selectedModels, 
    responses, 
    summarizationModelId, 
    setSummarizationModel, 
    generateSummary, 
    summary, 
    isSummarizing,
    clearSummary
  } = useAppStore();

  // All models are available for summarization
  const availableSummarizationModels = models;

  // Check if we have enough responses to summarize (at least 2)
  const hasEnoughResponses = responses.length >= 2;

  return (
    <Card className="border border-border/50 bg-background/80 backdrop-blur-sm shadow-md w-full h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-primary" />
          Summary
        </CardTitle>
        <CardDescription>
          Use another model to summarize and compare the responses
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-1 overflow-hidden flex flex-col">
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Summarization Model</label>
            <Select
              value={summarizationModelId || undefined}
              onValueChange={setSummarizationModel}
              disabled={isSummarizing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model for summarization" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Models</SelectLabel>
                  {availableSummarizationModels.map((model) => {
                    const isAlsoUsedForComparison = selectedModels.some(m => m.id === model.id);
                    return (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} 
                        {isAlsoUsedForComparison && <span className="text-xs text-muted-foreground ml-1">(also used for comparison)</span>}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => generateSummary()} 
            disabled={!summarizationModelId || !hasEnoughResponses || isSummarizing} 
            className="w-full"
          >
            {isSummarizing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </div>

        {summary ? (
          <div className="mt-4 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h3 className="text-sm font-medium">Summary Result</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => clearSummary()}
                className="h-8 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full border rounded-md p-3 bg-muted/30">
                <div className="text-sm whitespace-pre-wrap pr-4">{summary}</div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {!hasEnoughResponses 
              ? "Need at least two responses to generate a summary" 
              : "Select a model and generate a summary"}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 