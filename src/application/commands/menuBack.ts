import { IMessageActionRow } from "mezon-sdk";
import { ActionMessage, ActionName } from "src/domain/types";
import { ActionIdBuilder } from "src/infra/builders/actionId.builder";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandBase } from "./base";
import { mainMenu } from "./menu";

@Command(ActionName.MenuBack)
export class MenuBackCommand extends CommandBase<ActionMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: unknown): Promise<void> {
    // TODO: change to stack after implement state manager
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
    this.mezonMessage.update({
      components: [menuButtonsRow],
    });
  }
}
