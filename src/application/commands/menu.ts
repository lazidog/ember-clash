import { IMessageActionRow } from "mezon-sdk";
import { mainMenu } from "src/constants/menuTree";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { ActionIdBuilder } from "src/infra/builders/id.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandMessage, CommandName } from "../../domain/types";
import { CommandBase } from "./base";

@Command(CommandName.Menu)
export class MenuCommand extends CommandBase<CommandMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const actionIdBuilder = new ActionIdBuilder(this.userId);
    const menuButtonsRow: IMessageActionRow = {
      components: [],
    };
    mainMenu.buttons.map((button) => {
      actionIdBuilder.setAction(button.command);
      const id = actionIdBuilder.build();
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
