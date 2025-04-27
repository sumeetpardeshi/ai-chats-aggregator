"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AIModel } from "@/lib/types";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ModelSelectorButton() {
  const { models, selectedModels, toggleModelSelection } = useAppStore();
  const [open, setOpen] = useState(false);

  const handleToggleModel = (modelId: string) => {
    toggleModelSelection(modelId);
  };
  
  // Group models by provider
  const groupedModels = models.reduce((acc, model) => {
    const provider = model.provider.charAt(0).toUpperCase() + model.provider.slice(1);
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(model);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 rounded-full bg-background/50 backdrop-blur-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Model</span>
          {selectedModels.length > 0 && (
            <span className="inline-flex items-center justify-center bg-primary/10 text-primary text-xs rounded-full h-5 w-5">
              {selectedModels.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Models to Compare</DialogTitle>
          <DialogDescription>
            Choose which AI models you want to compare. You can select multiple models.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 py-3">
          {selectedModels.map(model => (
            <div 
              key={model.id} 
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
            >
              {model.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent hover:text-destructive"
                onClick={() => handleToggleModel(model.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <ScrollArea className="h-[350px] border rounded-md">
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider} className="p-1">
              <h3 className="text-sm font-medium mx-3 mt-3 mb-1">{provider}</h3>
              <div className="space-y-1">
                {providerModels.map((model) => {
                  const isSelected = selectedModels.some(m => m.id === model.id);
                  return (
                    <div
                      key={model.id}
                      className={`
                        flex items-center justify-between px-3 py-2 mx-1 rounded-md cursor-pointer
                        ${isSelected ? 'bg-primary/10' : 'hover:bg-muted'}
                      `}
                      onClick={() => handleToggleModel(model.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 