import { Injectable } from "@nestjs/common";
import type { ChannelMessage, MezonClient } from "mezon-sdk";
import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { ActionMessage, CommandMessage } from "src/domain/types";
import { getAction, getCommand } from "src/infra/storages/command.storage";
import { MezonClientService } from "src/mezon/client.service";
import { extractActionMessage, extractCommandMessage } from "src/utils";

@Injectable()
export class CommandHandler { 
  private client: MezonClient;
  constructor(private clientService: MezonClientService) {
    this.client = clientService.getClient();
  }

  async handleMessage(message: ChannelMessage) {
    const messageContent = message.content.t;
    if (!messageContent?.startsWith("*")) return;

    const { commandName, args } = extractCommandMessage(messageContent);
    if (!commandName) return;

    const Command = getCommand(commandName);
    console.log(Command)
    if (!Command) return;

    const commandMessage: CommandMessage = {
      type: "command",
      ...message,
    };
    const command = new Command(
      this.client,
      commandMessage,
    );
    return command.handle(args);
  }

  async handleMessageButtonClicked(data: MessageButtonClicked) {
    const { actionName, args } = extractActionMessage(data);

    if (!actionName) return;

    const Action = getAction(actionName);
    if (!Action) return;

    const actionMessage: ActionMessage = {
      type: "action",
      ...data,
    };
    const action = new Action(
      this.client,
      actionMessage,
    );
    return action.handle(args);
  }
}
