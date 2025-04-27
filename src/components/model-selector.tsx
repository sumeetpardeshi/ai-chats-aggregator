"use client";

import { useAppStore } from "@/lib/store";
import { AIModel } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ModelSelector() {
  const { models, selectedModels, toggleModelSelection } = useAppStore();

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModels.some((m) => m.id === model.id)}
            onToggle={toggleModelSelection}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface ModelCardProps {
  model: AIModel;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

function ModelCard({ model, isSelected, onToggle }: ModelCardProps) {
  const getBorderClass = () => {
    if (!isSelected) return "border-border";
    
    switch (model.provider) {
      case "openai":
        return "border-green-500 dark:border-green-400";
      case "anthropic":
        return "border-blue-500 dark:border-blue-400";
      case "google":
        return "border-violet-500 dark:border-violet-400";
      case "deepseek":
        return "border-yellow-500 dark:border-yellow-400";
      case "mistral":
        return "border-red-500 dark:border-red-400";
      case "cohere":
        return "border-pink-500 dark:border-pink-400";
      default:
        return "border-primary";
    }
  };

  return (
    <Card
      className={`relative overflow-hidden border-2 transition-all hover:shadow-md ${getBorderClass()} ${
        isSelected ? "shadow-lg" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px] z-0" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <span>{model.name}</span>
          <span className="text-xs uppercase bg-secondary px-2 py-1 rounded-full">
            {model.provider}
          </span>
        </CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          onClick={() => onToggle(model.id)}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardContent>
    </Card>
  );
} 