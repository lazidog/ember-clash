import { IMessageActionRow } from "mezon-sdk";
import { MenuNode } from "src/domain/menu.types";
import { ActionMessage, ActionName } from "src/domain/types";
import { ActionIdBuilder } from "src/infra/builders/actionId.builder";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandBase } from "./base";

export const dragonsMenu: MenuNode = {
  id: ActionName.MenuDragons,
  buttons: [{ label: "⬅️", command: ActionName.MenuBack }],
};

@Command(ActionName.MenuDragons)
export class MenuDragonsCommand extends CommandBase<ActionMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: unknown): Promise<void> {
    const menuButtonsRow: IMessageActionRow = {
      components: [],
    };
    dragonsMenu.buttons.map((button) => {
      const id = new ActionIdBuilder(this.userId)
        .setAction(button.command)
        .build();
      const menuButton = new ButtonBuilder()
        .setId(id)
        .setLabel(button.label)
        .build();
      menuButtonsRow.components.push(menuButton);
    });

    const updatedMessage = await this.mezonMessage.update({
      components: [menuButtonsRow],
    });

    this.userInteractionManager.push(this.userId, updatedMessage.message_id, {
      command: ActionName.MenuDragons,
      data: _args,
    });
  }
}
