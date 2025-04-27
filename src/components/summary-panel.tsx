"use client";

import { useAppStore } from "@/lib/store";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, X } from "lucide-react";

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

  // Allow any model to be used for summarization
  const availableSummarizationModels = models;

  // Check if we have enough responses to summarize
  const canSummarize = responses.length >= 2 && summarizationModelId;

  // Check if we're displaying a summary
  const hasSummary = summary !== null;

  // Get the name of the selected summarization model
  const modelName = models.find(m => m.id === summarizationModelId)?.name || "Select a model";

  const handleModelSelect = (value: string) => {
    setSummarizationModel(value);
  };

  const handleGenerateSummary = () => {
    if (canSummarize) {
      generateSummary();
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm border border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-[1px] z-0" />
      <CardHeader className="relative z-10 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Summarize Responses</CardTitle>
            <CardDescription>
              Use another model to analyze and compare the responses
            </CardDescription>
          </div>
          {hasSummary && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSummary}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-4">
        {!hasSummary ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="summarization-model" className="text-sm font-medium">
                Select a model to summarize responses:
              </label>
              <Select value={summarizationModelId || ""} onValueChange={handleModelSelect}>
                <SelectTrigger id="summarization-model" className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableSummarizationModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                      {selectedModels.some(m => m.id === model.id) && " (also used for comparison)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerateSummary}
              disabled={!canSummarize || isSummarizing}
              className="w-full"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
            {responses.length < 2 && (
              <p className="text-sm text-muted-foreground">
                You need at least 2 model responses to generate a summary.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Summary by {modelName}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isSummarizing}
                className="h-8"
              >
                {isSummarizing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="whitespace-pre-wrap text-sm">
                {summary}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      {hasSummary && (
        <CardFooter className="relative z-10 flex justify-between border-t bg-muted/10 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {responses.length} model responses analyzed
          </p>
        </CardFooter>
      )}
    </Card>
  );
} 