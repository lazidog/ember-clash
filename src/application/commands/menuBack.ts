import { ModuleRef } from "@nestjs/core";
import { ActionMessage, ActionName } from "src/domain/types";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { getAction } from "src/infra/storages/command.storage";
import { CommandBase } from "./base";

@Command(ActionName.MenuBack)
export class MenuBackCommand extends CommandBase<ActionMessage> {
  constructor(
    protected clientService: MezonClientService,
    private moduleRef: ModuleRef,
  ) {
    super(clientService);
  }

  async execute(_args: unknown): Promise<void> {
    // remove current interaction
    this.userInteractionManager.pop(this.userId);
    // get previous state
    const prevState = this.userInteractionManager.getCurrent(this.userId);
    if (!prevState?.currentAction || !prevState.currentMessageId) {
      return;
    }

    const { command: actionName, data } = prevState.currentAction;

    const Action = getAction(actionName);
    if (!Action) return;

    const action = this.moduleRef.get(Action);
    if (!(action instanceof CommandBase)) return;
    // pop previous interaction before executing so that it doesn't duplicate
    this.userInteractionManager.pop(this.userId);

    await action.handle(this.message, data);
  }
}
