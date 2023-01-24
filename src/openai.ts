import { getEnv } from "@/envs";
import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from "openai/dist";

export class GptApi {
  private readonly api: OpenAIApi;
  constructor() {
    this.api = new OpenAIApi(new Configuration({
      apiKey: getEnv("OPENAI_API_KEY"),
    }));
  }

  async modelsId() {
    const models = await this.api.listModels();
    return models.data.data.map((model) => model.id).sort();
  }

  async complete(prompt: string, user?: string) {
    const response = await this.api.createCompletion({
      model: "text-davinci-003",
      best_of: 1,
      max_tokens: 3096,
      temperature: 0.9,
      prompt,
      user,
    })
    return response.data.choices[0].text;
  }

  async generateImage(prompt: string, imageCount = 1, size: CreateImageRequestSizeEnum = "256x256") {
    const response = await this.api.createImage({
      prompt,
      n: imageCount,
      response_format: "url",
      size,
    });
    return response.data.data.map((data) => data.url);
  };
}