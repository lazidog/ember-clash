import { Injectable } from "@nestjs/common";
import type { ChannelMessage, MezonClient } from "mezon-sdk";
import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { MezonClientService } from "src/mezon/client.service";

@Injectable()
export class CommandHandler { 
  private client: MezonClient;
  constructor(private clientService: MezonClientService) {
    this.client = clientService.getClient();
  }

  async handleMessage(message: ChannelMessage) {
    const messageContent = message.content.t;
    console.log(messageContent);
    if (!messageContent?.startsWith("*")) return;
  }

  async handleMessageButtonClicked(data: MessageButtonClicked) {
    console.log(data);
  }
}
