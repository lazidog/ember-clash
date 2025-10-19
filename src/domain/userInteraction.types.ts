import { ActionOnlyName } from "./types";

export interface UserInteraction<TData = unknown> {
  command: ActionOnlyName;
  data: TData;
}
