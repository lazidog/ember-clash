import { MenuNode } from "../domain/menu.types";
import { ActionName, CommandName } from "../domain/types";

export const mainMenu: MenuNode = {
  id: CommandName.Menu,
  buttons: [
    { label: "Battle", command: ActionName.MenuBattle },
    { label: "Dragons", command: ActionName.MenuDragons },
  ],
};

export const battleMenu: MenuNode = {
  id: ActionName.MenuBattle,
  buttons: [{ label: "Go Back", command: ActionName.MenuBack }],
};

export const dragonsMenu: MenuNode = {
  id: ActionName.MenuDragons,
  buttons: [{ label: "Go Back", command: ActionName.MenuBack }],
};
