import "source-map-support/register";

import { Envs } from "@/envs";
import { WhatsappBot } from "@/whatsapp-bot";
import * as handlers from "@/handler";
import { chain, isEmpty, isUndefined } from "lodash";

const handlersClasses = 
  chain(Envs.handlers)
  .map((handlerName) => handlers[handlerName as keyof typeof handlers])
  .filter((value) => !isUndefined(value))
  .value();

if (isEmpty(handlersClasses)) {
  console.error("No valid handler found. Please check HANDLERS env variable.");
  console.log("Available handlers: ", Object.keys(handlers));
  process.exit(1);
}

new WhatsappBot(handlersClasses).create();
