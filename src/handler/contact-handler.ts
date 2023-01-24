import { Contact, Message, Whatsapp } from "@wppconnect-team/wppconnect";

export class ContactHandler {
  constructor(
    private readonly client: Whatsapp,
    private readonly groups = new Map<string, Contact>(),
  ) {}

  async friendlyName(message: Message) {
    const group = await this.getGroup(message);
    return group ? group.formattedName : message.sender.name ?? message.sender.formattedName;
  }

  async displayName(message: Message) {
    const group = await this.getGroup(message);
    const groupName = group ? ` (${group.formattedName})` : "";
    return `${message.sender.name ?? message.sender.formattedName + ' - ' + message.sender.pushname}${groupName}`;
  }

  async getGroup(message: Message) {
    if (!message.isGroupMsg) {
      return undefined;
    }
    return this.groups.get(message.chatId) ??
      this.groups.set(message.chatId, (await this.client.getContact(message.chatId))).get(message.chatId);
  }
}