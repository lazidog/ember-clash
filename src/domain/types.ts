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
  T extends CommandBase<TMessage> = CommandBase<TMessage>,
> = {
  new (clientService: MezonClientService, ...args: unknown[]): T;
};

export enum CommandName {
  Pika = "pika",
  Menu = "menu",
}

export enum ActionName {
  Example = "example",
  MenuBack = "menu_back",
  MenuBattle = "menu_battle",
  MenuDragons = "menu_dragons",
}

export interface CommandRegistry {
  [CommandName.Pika]: CommandClass<CommandMessage>;
  [CommandName.Menu]: CommandClass<CommandMessage>;
  [ActionName.Example]: CommandClass<ActionMessage>;
  [ActionName.MenuBack]: CommandClass<ActionMessage>;
  [ActionName.MenuBattle]: CommandClass<ActionMessage>;
  [ActionName.MenuDragons]: CommandClass<ActionMessage>;
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
