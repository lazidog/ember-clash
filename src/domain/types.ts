import { ChannelMessage } from "mezon-sdk";
import { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandBase } from "../application/commands/base";

/**
 * Represents the constructor type of a Command class.
 *
 * This ensures that the class passed to decorators (like @Command)
 * must be instantiable with a MezonClient and a MessageType = CommandMessage | ActionMessage,
 * and must extend CommandBase.
 *
 * Generic <T> allows preserving specific subclass types if needed.
 */
export type CommandClass<
  TMessage extends MessageType = MessageType,
  T extends CommandBase = CommandBase,
> = {
  new (clientService: MezonClientService, message: TMessage): T;
};

export enum CommandName {
  Pika = "pika",
}

export enum ActionName {
  Example = "example",
}

export interface CommandRegistry {
  [CommandName.Pika]: CommandClass<CommandMessage>;
  [ActionName.Example]: CommandClass<ActionMessage>;
}

export interface CommandMessage extends ChannelMessage {
  type: "command";
}

export interface ActionMessage extends MessageButtonClicked {
  type: "action";
}

export type MessageType = CommandMessage | ActionMessage;

export type CommandOnlyName = {
  [K in keyof CommandRegistry]: CommandRegistry[K] extends CommandClass<CommandMessage>
    ? K
    : never;
}[keyof CommandRegistry];

export type ActionOnlyName = {
  [K in keyof CommandRegistry]: CommandRegistry[K] extends CommandClass<ActionMessage>
    ? K
    : never;
}[keyof CommandRegistry];

export type CommandAndActionName = CommandOnlyName | ActionOnlyName;
