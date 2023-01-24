import { WhatsappHandler } from "@/handler/whatsapp-handler";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";

export class WhatsappAutoSeenGroups extends WhatsappHandler {
  private readonly autoSeenGroups = [
    "554796629398-1557803446@g.us",
    "554791224756-1474478089@g.us",
  ];
  constructor(client: Whatsapp) {
    super(client);
  }

  async handle(): Promise<void> {
    this.client.onMessage(async (message: Message) => {
      if (message.isGroupMsg && this.autoSeenGroups.includes(message.chatId)) {
        console.log("Setting seen: ", message.chatId);
        await this.forceSeen(message);
      }
    });
  }

  private async forceSeen(message: Message) {
    let unreadCount = 0;
    do {
      unreadCount = (await this.client.sendSeen(message.chatId)).unreadCount;
    } while (unreadCount === 0);
  }
}