import { EButtonMessageStyle } from "mezon-sdk";
import { CommandAndActionName } from "./types";

export interface MenuNode {
  id: CommandAndActionName;
  buttons: ButtonConfig[]; // Static buttons
}

export interface ButtonConfig {
  label: string;
  command: CommandAndActionName;
  style?: EButtonMessageStyle;
}
