import { ChannelMessage } from "mezon-sdk";
import { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { ActionOnlyName, CommandOnlyName } from "./domain/types";
import { idSeparator, keySeparator } from "./infra/builders/actionId.builder";

export function extractCommandMessage(message: ChannelMessage) {
  const messageContent = message.content.t;
  const userId = message.sender_id;
  if (!messageContent?.startsWith("*")) {
    return { commandName: null, userId, args: {} };
  }

  const trimmedMessage = messageContent
    .replace("\n", " ")
    .slice("*".length)
    .trim();
  const [commandName, ...args] = trimmedMessage
    .split(/\s+/)
    .map((arg) => arg.trim().toLowerCase());

  return { commandName: commandName as CommandOnlyName, args, userId };
}

export function extractActionMessage(data: MessageButtonClicked) {
  const dataFromId = data.button_id.split(idSeparator).map((v) => {
    const [key, value] = v.split(keySeparator);
    return { key, value };
  });
  const userId = data.user_id;
  const actionName = dataFromId.find((v) => v.key === "action")?.value;
  const args = Object.fromEntries(
    dataFromId.filter((v) => v.key !== "action").map((v) => [v.key, v.value]),
  );

  if (!actionName) {
    throw new Error("[extractActionMessage] no actionName");
  }

  return {
    actionName: actionName as ActionOnlyName,
    args,
    userId,
  };
}
