import { config } from "dotenv";
import { WhatsappBot } from "@/whatsapp-bot";
import { WhatsappAIHandler } from "@/handler/whatsapp-ai-handler";

config();

// Change handler to WhatsappListGroups to list all groups with their IDs
new WhatsappBot(WhatsappAIHandler).create();
