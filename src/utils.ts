import { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { ActionOnlyName, CommandOnlyName } from "./domain/types";

export function extractCommandMessage(message: string) {
  const trimmedMessage = message.replace("\n", " ").slice("*".length).trim();
  const [commandName, ...args] = trimmedMessage
    .split(/\s+/)
    .map((arg) => arg.trim().toLowerCase());
  return { commandName: commandName as CommandOnlyName, args };
}

export function extractActionMessage(data: MessageButtonClicked) {
  const [actionName, ...args] = data.button_id.split("_");
  const userId = data.user_id;
  return {
    actionName: actionName as ActionOnlyName,
    args,
    userId,
  };
}
