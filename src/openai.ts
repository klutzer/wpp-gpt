import { Envs } from "@/envs";
import { takeRight } from "lodash";
import { ChatCompletionRequestMessage, Configuration, CreateImageRequestSizeEnum, OpenAIApi } from "openai/dist";

export class GptApi {
  private readonly api: OpenAIApi;
  private readonly previousMessages = new Map<string, ChatCompletionRequestMessage[]>();
  constructor() {
    this.api = new OpenAIApi(new Configuration({
      apiKey: Envs.ai.openaiApiKey,
    }));
  }

  async modelsId() {
    const models = await this.api.listModels();
    return models.data.data.map((model) => model.id).sort();
  }

  async complete(prompt: string, user: string) {
    const messages = [
      ...this.previousMessages.get(user) ?? [],
      {
        content: prompt,
        role: "user",
      },
    ] satisfies ChatCompletionRequestMessage[];
    const response = await this.api.createChatCompletion({
      messages,
      model: "gpt-3.5-turbo",
      temperature: 0.85,
      max_tokens: 3096,
      user,
    });
    const responseMessage = response.data.choices[0].message?.content.trim()!;
    this.previousMessages.set(user, [
      ...takeRight(messages, 2 * Envs.ai.chatHistorySize - 1),
      { content: responseMessage, role: "assistant" }
    ]);
    return responseMessage;
  }

  async generateImage(prompt: string, imageCount = 1, size: CreateImageRequestSizeEnum = "256x256") {
    const response = await this.api.createImage({
      prompt,
      n: imageCount,
      response_format: "url",
      size,
    });
    return response.data.data.map((data) => data.url!);
  };
}