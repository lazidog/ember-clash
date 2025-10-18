import { IMessageActionRow } from "mezon-sdk";
import { MenuNode } from "src/domain/menu.types";
import { ActionIdBuilder } from "src/infra/builders/actionId.builder";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { ActionName, CommandMessage, CommandName } from "../../domain/types";
import { CommandBase } from "./base";

export const mainMenu: MenuNode = {
  id: CommandName.Menu,
  buttons: [
    { label: "⚔️", command: ActionName.MenuBattle },
    { label: "🐉", command: ActionName.MenuDragons },
  ],
};

@Command(CommandName.Menu)
export class MenuCommand extends CommandBase<CommandMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const menuButtonsRow: IMessageActionRow = {
      components: [],
    };
    mainMenu.buttons.map((button) => {
      const id = new ActionIdBuilder(this.userId)
        .setAction(button.command)
        .build();
      const menuButton = new ButtonBuilder()
        .setId(id)
        .setLabel(button.label)
        .build();
      menuButtonsRow.components.push(menuButton);
    });
    this.mezonMessage.reply({
      components: [menuButtonsRow],
    });
  }
}
