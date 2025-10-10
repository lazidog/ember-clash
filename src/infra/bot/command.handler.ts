import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import type { ChannelMessage, MezonClient } from "mezon-sdk";
import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { CommandBase } from "src/application/commands/base";
import { ActionMessage, CommandMessage } from "src/domain/types";
import { getAction, getCommand } from "src/infra/storages/command.storage";

import { extractActionMessage, extractCommandMessage } from "src/utils";

@Injectable()
export class CommandHandler {
  constructor(private moduleRef: ModuleRef) {}

  async handleMessage(message: ChannelMessage) {
    const messageContent = message.content.t;
    if (!messageContent?.startsWith("*")) return;

    const { commandName, args } = extractCommandMessage(messageContent);
    if (!commandName) return;

    const Command = getCommand(commandName);
    if (!Command) return;

    const commandMessage: CommandMessage = {
      type: "command",
      ...message,
    };
    const command = this.moduleRef.get(Command);
    if (!(command instanceof CommandBase)) return;

    return command.handle(commandMessage, args);
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
    const action = this.moduleRef.get(Action);
    if (!(action instanceof CommandBase)) return;

    return action.handle(actionMessage, args);
  }
}
