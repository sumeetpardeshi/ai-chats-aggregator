"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormField, FormControl, FormLabel, FormItem, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Key } from "lucide-react";

export function ApiKeysManager() {
  const [open, setOpen] = useState(false);
  const { models, apiKeys, setApiKey } = useAppStore();
  const [formReady, setFormReady] = useState(false);
  const initializedRef = useRef(false);

  // Get unique API key names
  const uniqueApiKeyNames = Array.from(
    new Set(models.map((model) => model.apiKeyName))
  );

  const formSchema = z.object(
    Object.fromEntries(
      uniqueApiKeyNames.map((keyName) => [
        keyName,
        z.string().optional(),
      ])
    )
  );

  type ApiKeyFormValues = z.infer<typeof formSchema>;

  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      uniqueApiKeyNames.map((keyName) => [keyName, apiKeys[keyName] || ""])
    ),
  });

  // Initialize form values when dialog opens
  useEffect(() => {
    if (open && !initializedRef.current) {
      const newValues = Object.fromEntries(
        uniqueApiKeyNames.map((keyName) => [keyName, apiKeys[keyName] || ""])
      );
      form.reset(newValues);
      initializedRef.current = true;
      setFormReady(true);
    }
    
    if (!open) {
      initializedRef.current = false;
    }
  }, [open, apiKeys, uniqueApiKeyNames]);

  function onSubmit(values: ApiKeyFormValues) {
    Object.entries(values).forEach(([name, value]) => {
      if (value) {
        setApiKey(name, value);
      }
    });
    setOpen(false);
  }

  // Count how many keys are configured
  const configuredKeysCount = Object.keys(apiKeys).filter(key => apiKeys[key]?.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-background/50 backdrop-blur-sm flex items-center gap-2">
          <Key className="h-4 w-4" />
          <span>API Keys</span>
          {configuredKeysCount > 0 && (
            <span className="inline-flex items-center justify-center ml-1 bg-primary/10 text-primary text-xs rounded-full w-5 h-5">
              {configuredKeysCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-md border border-border/50 shadow-lg">
        <DialogHeader>
          <DialogTitle>API Keys Configuration</DialogTitle>
        </DialogHeader>
        {formReady && (
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                {uniqueApiKeyNames.map((keyName) => {
                  const isConfigured = Boolean(apiKeys[keyName]);
                  return (
                    <FormField
                      key={keyName}
                      control={form.control}
                      name={keyName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            {keyName}
                            {isConfigured && <CheckCircle className="h-4 w-4 text-green-500" />}
                            <span className="text-xs text-muted-foreground">
                              {models.filter((m) => m.apiKeyName === keyName).map((m) => m.name).join(", ")}
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="password" 
                                placeholder={isConfigured ? "Key saved (enter to update)" : "Enter API key"} 
                                {...field} 
                                className={isConfigured ? "border-green-500/30 bg-green-500/5" : ""}
                              />
                              {isConfigured && field.value === "" && (
                                <div className="absolute inset-0 flex items-center pointer-events-none">
                                  <span className="ml-3 text-xs text-muted-foreground">●●●●●●●●●●●●●●●●●●●●</span>
                                </div>
                              )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  );
                })}
                <Button type="submit" className="w-full">Save API Keys</Button>
              </form>
            </Form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
} 