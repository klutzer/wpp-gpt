import { getEnv } from "@/envs";
import { ContactHandler } from "@/handler/contact-handler";
import { WhatsappHandler } from "@/handler/whatsapp-handler";
import { GptApi } from "@/openai";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";

const TEXT = "text: ";
const IMAGE = "image: ";

export class WhatsappAIHandler extends WhatsappHandler {
  private readonly gptApi = new GptApi();
  private readonly allowedGroups = getEnv("ALLOWED_GROUPS")?.split(",") ?? [];
  private readonly contactHandler;
  constructor(client: Whatsapp) {
    super(client);
    this.contactHandler = new ContactHandler(client);
  }

  async handle(): Promise<void> {
    this.client.onAnyMessage(async (message: Message) => {
      if (message.isGroupMsg && !message.sender.isMe && !this.allowedGroups.includes(message.chatId)) {
        return;
      }
      try {
        await this.client.startTyping(message.chatId);
        if (message.body?.startsWith(TEXT)) {
          const text = message.body.substring(TEXT.length);
          await this.printMessage(message);
          const result = await this.gptApi.complete(text);
          await this.client.sendText(message.chatId, `*AI response*:\n\n${result.trim()}`);
        }
        if (message.body?.startsWith(IMAGE)) {
          const text = message.body.substring(IMAGE.length);
          await this.printMessage(message);
          const result = await this.gptApi.generateImage(text, 2);
          await Promise.all(
            result.map((url, i) => this.client.sendImage(message.chatId, url.trim(), `image-${i}.png`)),
          );
        }
      } finally {
        await this.client.stopTyping(message.chatId);
      }
    });
  }

  private async printMessage(message: Message) {
    const sender = await this.contactHandler.displayName(message);
    console.log(`${message.chatId} (${sender}): ${message.body}`);
  }
}