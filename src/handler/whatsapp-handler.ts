import { Message, Whatsapp } from "@wppconnect-team/wppconnect";

export abstract class WhatsappHandler {
  constructor(protected readonly client: Whatsapp) {}

  abstract disposable(): boolean;
  abstract handle(): Promise<void>;
}