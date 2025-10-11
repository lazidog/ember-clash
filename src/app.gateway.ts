import { Injectable, Logger } from "@nestjs/common";
import type { MezonClient } from "mezon-sdk";
import type { MezonClientService } from "src/infra/mezon/client.service";
import type { CommandHandler } from "./infra/bot/command.handler";

@Injectable()
export class AppGateway {
  private readonly logger = new Logger(AppGateway.name);
  private client: MezonClient;

  constructor(
    private clientService: MezonClientService,
    private commandHandler: CommandHandler,
  ) {
    this.client = clientService.getClient();
  }

  initEvent() {
    this.client.on("error", (error) => console.error(`Mezon Error: ${error}`));
    this.client.on("disconnect", (reason) =>
      console.log(`Disconnected: ${reason}`),
    );
    this.client.on("ready", () =>
      console.log(`Connected: ${this.client.clans.size}`),
    );
    this.client.onChannelMessage(
      this.commandHandler.handleMessage.bind(this.commandHandler),
    );
    this.client.onMessageButtonClicked(
      this.commandHandler.handleMessageButtonClicked.bind(this.commandHandler),
    );
  }
}
