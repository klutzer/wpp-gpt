import { getEnv } from "@/envs";
import { create, defaultLogger, Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { WhatsappHandler } from "@/handler/whatsapp-handler";

type Newable<T> = new (client: Whatsapp) => T;

//defaultLogger.level = "silly";

export class WhatsappBot {
  constructor(private readonly handler: Newable<WhatsappHandler>) { }
  async create() {
    return create({
      session: getEnv("SESSION_NAME"),
    })
    .then((client) => new this.handler(client).handle())
    .catch((error) => {
      console.log(error);
    });
  }
}

