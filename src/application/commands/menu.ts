import { IMessageActionRow } from "mezon-sdk";
import { MenuNode } from "src/domain/menu.types";
import { ActionIdBuilder } from "src/infra/builders/actionId.builder";
import { ButtonBuilder } from "src/infra/builders/button.builder";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import {
  ActionMessage,
  ActionName,
  CommandMessage,
  CommandName,
} from "../../domain/types";
import { CommandBase } from "./base";

export const mainMenu: MenuNode = {
  id: CommandName.Menu,
  buttons: [
    { label: "⚔️", command: ActionName.MenuBattle },
    { label: "🐉", command: ActionName.MenuDragons },
  ],
};

abstract class MenuBase<
  T extends CommandMessage | ActionMessage,
> extends CommandBase<T> {
  protected buildMenu(): IMessageActionRow {
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
    return menuButtonsRow;
  }
}

@Command(CommandName.Menu)
export class MenuCommand extends MenuBase<CommandMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const menuButtonsRow = this.buildMenu();

    const replyMessage = await this.mezonMessage.reply({
      components: [menuButtonsRow],
    });

    this.userInteractionManager.push(this.userId, replyMessage.message_id, {
      command: ActionName.MenuAction,
      data: _args,
    });
  }
}

@Command(ActionName.MenuAction)
export class MenuAction extends MenuBase<ActionMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const menuButtonsRow = this.buildMenu();

    const updatedMessage = await this.mezonMessage.update({
      components: [menuButtonsRow],
    });

    this.userInteractionManager.push(this.userId, updatedMessage.message_id, {
      command: ActionName.MenuAction,
      data: _args,
    });
  }
}
