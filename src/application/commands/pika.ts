import { type CommandMessage, CommandName } from "../../domain/types";
import { TypeMessage } from "mezon-sdk";
import { CommandBase } from "./base";
import { MezonClientService } from "src/infra/mezon/client.service";
import { Command } from "src/infra/decorators/registerCommand.decorator";

@Command(CommandName.Pika)
export class PikaCommand extends CommandBase<CommandMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const dmClan = await this.client.clans.fetch("0");
    const recipientUserId =
      this.mezonMessage.references?.at(0)?.message_sender_id ||
      this.message.mentions?.at(0)?.user_id;

    if (!recipientUserId) return;
    const user = await dmClan.users.fetch(recipientUserId);
    if (!user) return;

    if (!user.dmChannelId) {
      await user.createDmChannel();
    }

    await Promise.all(
      Array.from(
        { length: 15 },
        () =>
          new Promise<void>((resolve) =>
            setTimeout(
              async () => {
                await user.sendDM(
                  {
                    t: "Pikaaaaaaa!!",
                  },
                  TypeMessage.MessageBuzz,
                );
                resolve();
              },
              Math.floor(Math.random() * 2000),
            ),
          ),
      ),
    );
  }
}
