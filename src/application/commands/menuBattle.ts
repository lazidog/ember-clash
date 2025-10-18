import { IMessageActionRow } from "mezon-sdk";
import { MenuNode } from "src/domain/menu.types";
import { ActionMessage, ActionName } from "src/domain/types";
import { ActionIdBuilder } from "src/infra/builders/actionId.builder";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandBase } from "./base";

export const battleMenu: MenuNode = {
  id: ActionName.MenuBattle,
  buttons: [{ label: "⬅️", command: ActionName.MenuBack }],
};

@Command(ActionName.MenuBattle)
export class MenuBattleCommand extends CommandBase<ActionMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: unknown): Promise<void> {
    const actionIdBuilder = new ActionIdBuilder(this.userId);
    const menuButtonsRow: IMessageActionRow = {
      components: [],
    };
    battleMenu.buttons.map((button) => {
      actionIdBuilder.setAction(button.command);
      const id = actionIdBuilder.build();
      const menuButton = new ButtonBuilder()
        .setId(id)
        .setLabel(button.label)
        .build();
      menuButtonsRow.components.push(menuButton);
    });
    this.mezonMessage.update({
      components: [menuButtonsRow],
    });
  }
}
