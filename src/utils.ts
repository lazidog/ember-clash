import { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime";
import { ActionOnlyName, CommandOnlyName } from "./domain/types";
import { idSeparator, keySeparator } from "./infra/builders/actionId.builder";

export function extractCommandMessage(message: string) {
  const trimmedMessage = message.replace("\n", " ").slice("*".length).trim();
  const [commandName, ...args] = trimmedMessage
    .split(/\s+/)
    .map((arg) => arg.trim().toLowerCase());
  return { commandName: commandName as CommandOnlyName, args };
}

export function extractActionMessage(data: MessageButtonClicked) {
  const dataFromId = data.button_id.split(idSeparator).map((v) => {
    const [key, value] = v.split(keySeparator);
    return { key, value };
  });
  const userId = dataFromId.find((v) => v.key === "userId")?.value;
  const actionName = dataFromId.find((v) => v.key === "action")?.value;
  const args = Object.fromEntries(
    dataFromId
      .filter((v) => v.key !== "userId" && v.key !== "action")
      .map((v) => [v.key, v.value]),
  );

  if (!userId) {
    throw new Error("[extractActionMessage] no userId");
  }
  if (!actionName) {
    throw new Error("[extractActionMessage] no actionName");
  }

  return {
    actionName: actionName as ActionOnlyName,
    args,
    userId,
  };
}
