import { WhatsappHandler } from "@/handler/whatsapp-handler";
import { Whatsapp } from "@wppconnect-team/wppconnect";
import { get } from "lodash";

export class WhatsappListGroups extends WhatsappHandler {
  constructor(client: Whatsapp) {
    super(client);
  }

  async handle(): Promise<void> {
    console.log("Listing groups...");
    const groups = (await this.client.getAllGroups())
      .map((group) => ({
        name: group.name ?? get(group.groupMetadata, "subject"),
        id: group.id._serialized,
      }))
      .sort((group1, group2) => group1.name.localeCompare(group2.name));
    console.table(groups);
    await this.client.close();
  }
}