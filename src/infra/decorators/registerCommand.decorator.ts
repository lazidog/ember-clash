import type { CommandRegistry } from "../../domain/types";
import { registerCommand } from "../storages/command.storage";

/**
 * Decorator for registering a command with the bot.
 *
 * @param commandName - The name of the command. This is what users will type to trigger the command.
 * @returns A class decorator that registers the command with the bot.
 */
export function Command<K extends keyof CommandRegistry>(commandName: K) {
  return (target: CommandRegistry[K]) => {
    registerCommand(commandName, target);
  };
}
