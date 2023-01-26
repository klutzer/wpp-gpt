import { Whatsapp } from "@wppconnect-team/wppconnect";
import { WhatsappHandler } from "@/handler/whatsapp-handler";

export class WhatsappListContacts extends WhatsappHandler {
  constructor(client: Whatsapp) {
    super(client);
  }

  disposable(): boolean {
    return true;
  }

  async handle(): Promise<void> {
    console.log("Listing contacts...");
    const contacts = (await this.client.getAllContacts())
      .filter((contact) => contact.isUser && !contact.isMyContact)
      .map((contact) => ({
        name: contact.name ?? `${contact.formattedName} - ${contact.pushname}`,
        id: contact.id._serialized,
        isMyContact: contact.isMyContact,
      }))
      .sort((contact1, contact2) => contact1.name?.localeCompare(contact2.name));
    console.table(contacts);
  }
}