import {
  ActionOnlyName,
  CommandAndActionName,
  CommandOnlyName,
  CommandRegistry,
} from "../../domain/types";

const commands: Partial<CommandRegistry> = {};

export function registerCommand<K extends CommandAndActionName>(
  commandName: K,
  commandClass: CommandRegistry[K],
) {
  commands[commandName] = commandClass;
}

export function getCommand<K extends CommandOnlyName>(
  commandName: K,
): CommandRegistry[K] | undefined {
  return commands[commandName];
}

export function getAction<K extends ActionOnlyName>(
  commandName: K,
): CommandRegistry[K] | undefined {
  return commands[commandName];
}
