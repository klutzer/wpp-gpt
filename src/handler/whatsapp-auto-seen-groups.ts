import { Configs } from "@/config";
import { WhatsappHandler } from "@/handler/whatsapp-handler";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";

export class WhatsappAutoSeenGroups extends WhatsappHandler {
  private readonly autoSeenGroups = Configs.autoSeenGroups;

  constructor(client: Whatsapp) {
    super(client);
  }

  disposable(): boolean {
    return false;
  }

  async handle() {
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