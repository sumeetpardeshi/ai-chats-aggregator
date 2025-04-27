"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIModel } from "@/lib/types";

export function ComparisonView() {
  const { responses, selectedModels } = useAppStore();

  if (selectedModels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground text-sm">
          Select models to compare their responses
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className={`grid gap-4 grid-cols-1 ${
        selectedModels.length === 1 ? 'md:grid-cols-1' : 
        selectedModels.length === 2 ? 'md:grid-cols-2' : 
        selectedModels.length >= 3 && selectedModels.length <= 4 ? 'md:grid-cols-2' : 
        'md:grid-cols-3'
      } auto-rows-[500px]`}>
        {selectedModels.map((model) => (
          <ModelResponseCard
            key={model.id}
            model={model}
            response={responses.find((r) => r.modelId === model.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ModelResponseCardProps {
  model: AIModel;
  response?: {
    content: string;
    error?: string;
    duration?: number;
  };
}

function ModelResponseCard({ model, response }: ModelResponseCardProps) {
  const getCardClass = () => {
    switch (model.provider) {
      case "openai":
        return "border-green-500/20 dark:border-green-400/20";
      case "anthropic":
        return "border-blue-500/20 dark:border-blue-400/20";
      case "google":
        return "border-violet-500/20 dark:border-violet-400/20";
      case "deepseek":
        return "border-yellow-500/20 dark:border-yellow-400/20";
      case "mistral":
        return "border-red-500/20 dark:border-red-400/20";
      case "cohere":
        return "border-pink-500/20 dark:border-pink-400/20";
      default:
        return "border-border";
    }
  };

  const getHeaderClass = () => {
    switch (model.provider) {
      case "openai":
        return "bg-green-500/10 dark:bg-green-400/10";
      case "anthropic":
        return "bg-blue-500/10 dark:bg-blue-400/10";
      case "google":
        return "bg-violet-500/10 dark:bg-violet-400/10";
      case "deepseek":
        return "bg-yellow-500/10 dark:bg-yellow-400/10";
      case "mistral":
        return "bg-red-500/10 dark:bg-red-400/10";
      case "cohere":
        return "bg-pink-500/10 dark:bg-pink-400/10";
      default:
        return "bg-muted/50";
    }
  };

  return (
    <Card className={`h-full overflow-hidden backdrop-blur-sm border ${getCardClass()} relative w-full`}>
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-[1px] z-0" />
      <CardHeader className={`relative z-10 ${getHeaderClass()} py-3`}>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{model.name}</span>
          {response?.duration && (
            <span className="text-xs text-muted-foreground">
              {(response.duration / 1000).toFixed(2)}s
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 p-0 h-[calc(100%-56px)]">
        <ScrollArea className="h-full p-4">
          {!response && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">Waiting for response...</p>
            </div>
          )}
          {response?.error && (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive-foreground">
              <p className="font-medium mb-1">Error</p>
              <p className="text-sm">{response.error}</p>
            </div>
          )}
          {response?.content && (
            <div className="whitespace-pre-wrap text-sm">{response.content}</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 