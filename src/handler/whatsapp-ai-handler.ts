import { convertOggToM4a } from "@/audio/transcoder";
import { Configs } from "@/config";
import { ContactHandler } from "@/handler/contact-handler";
import { WhatsappHandler } from "@/handler/whatsapp-handler";
import { GptApi } from "@/openai";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { get, isEmpty } from 'lodash';

type ActionType = "text" | "image" | "transcript";

export class WhatsappAIHandler extends WhatsappHandler {
  private readonly gptApi = new GptApi();
  private readonly allowedGroups = Configs.ai.allowedGroups;
  private readonly whiteList = Configs.ai.whitelist;
  private readonly contactHandler;
  constructor(client: Whatsapp) {
    super(client);
    this.contactHandler = new ContactHandler(client);
  }

  private actions: { [key in ActionType]: (message: Message, text: string) => Promise<void> } = {
    text: async (message: Message, text: string) => {
      const result = await this.gptApi.complete(text, message.chatId);
      await this.client.sendText(message.chatId, `*AI response:*\n\n${result}`);
    },
    image: async (message: Message, text: string) => {
      const result = await this.gptApi.generateImage(text, 2);
      await Promise.all(
        result.map((url, i) => this.client.sendImage(message.chatId, url.trim(), `image-${i}.png`)),
      );
    },
    transcript: async (message: Message) => {
      const quotedMessage = get(message, "quotedMsg") as unknown as Message;
      if (!quotedMessage || !["ptt", "audio"].includes(quotedMessage.type)) {
        await this.client.sendText(message.chatId, `*AI transcription (no audio):* _Referencie o áudio que você quer transcrever_`);
        return;
      }
      try {
        const audio = await this.client.decryptFile(quotedMessage);
        const stream = await convertOggToM4a(audio, message.chatId);
        const result = await this.gptApi.createTranscription(stream);
        await this.client.sendText(message.chatId, `*AI transcription:*\n\n${result}`);
      } catch (error: any) {
        console.error(error);
        await this.client.sendText(message.chatId, `*AI transcription ERROR:* _${error?.message ?? error}_`);
      }
    },
  };

  disposable(): boolean {
    return false;
  }

  async handle() {
    this.client.onAnyMessage(async (message: Message) => {
      if (this.isMissingAllowedGroup(message) || this.isMissingUserInWhitelist(message)) {
        return;
      }
      try {
        await this.client.startTyping(message.chatId);
        const requestedActions = Object.getOwnPropertyNames(this.actions).filter((value) => message.body?.startsWith(`${value}:`)) as ActionType[];
        await Promise.all(requestedActions.map(async (actionType) => {
          await this.printMessage(message);
          await this.actions[actionType](message, message.body?.substring(actionType.length + 1)?.trim() ?? "");
        }));
      } finally {
        await this.client.stopTyping(message.chatId);
      }
    });
  }

  private isMissingAllowedGroup(message: Message) {
    return message.isGroupMsg && !message.sender.isMe && !this.allowedGroups.includes(message.chatId);
  }

  private isMissingUserInWhitelist(message: Message) {
    return !message.isGroupMsg
      && !message.sender.isMe
      && !isEmpty(this.whiteList)
      && !this.whiteList.includes(message.chatId);
  }

  private async printMessage(message: Message) {
    const sender = await this.contactHandler.displayName(message);
    console.log(`${message.chatId} (${sender}): ${message.body}`);
  }
}