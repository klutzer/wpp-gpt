import { Configs } from "@/config";
import { create,  defaultLogger, Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { WhatsappHandler } from "@/handler/whatsapp-handler";

type Newable<T> = new (client: Whatsapp) => T;

defaultLogger.level = "info";

export class WhatsappBot {
  constructor(private readonly handlers: Newable<WhatsappHandler>[]) {}

  async create() {
    const handlersName = new Intl.ListFormat("en", { style: "long", type: "conjunction" })
      .format(this.handlers.map((handler) => handler.name));
    console.log(`Registered handler(s): ${handlersName}`)
    return create({
      session: Configs.sessionName,
    })
    .then(this.startAllHandlers.bind(this))
    .catch((error) => {
      console.log(error);
    });
  }

  private async startAllHandlers(client: Whatsapp) {
    let allDisposable = true;
    await Promise.all(this.handlers.map((handler) => {
      const instance = new handler(client);
      allDisposable = allDisposable && instance.disposable();
      return instance.handle();
    })).finally(async () => {
      if (allDisposable) {
        await client.close();
      }
    });
  }
}

