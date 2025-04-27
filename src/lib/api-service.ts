"use client";

import { AIModel } from "./types";

export async function generateCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    switch (model.provider) {
      case "openai":
        return await generateOpenAICompletion(model, prompt, apiKey);
      case "anthropic":
        return await generateAnthropicCompletion(model, prompt, apiKey);
      case "google":
        return await generateGoogleCompletion(model, prompt, apiKey);
      case "deepseek":
        return await generateDeepseekCompletion(model, prompt, apiKey);
      case "mistral":
        return await generateMistralCompletion(model, prompt, apiKey);
      case "cohere":
        return await generateCohereCompletion(model, prompt, apiKey);
      default:
        throw new Error(`Provider ${model.provider} not supported`);
    }
  } catch (error) {
    console.error(`Error generating completion for ${model.name}:`, error);
    throw error;
  }
}

async function generateOpenAICompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(model.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.maxTokens || 2000,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "OpenAI API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateAnthropicCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(model.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.maxTokens || 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Anthropic API error");
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generateGoogleCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(`${model.apiEndpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: model.temperature || 0.7,
        maxOutputTokens: model.maxTokens || 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Google API error");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function generateDeepseekCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(model.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.maxTokens || 2000,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Deepseek API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateMistralCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(model.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: model.maxTokens || 2000,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Mistral API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateCohereCompletion(
  model: AIModel,
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(model.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.id,
      prompt,
      max_tokens: model.maxTokens || 2000,
      temperature: model.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Cohere API error");
  }

  const data = await response.json();
  return data.generations[0].text;
} 