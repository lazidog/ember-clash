import { TypeMessage } from "mezon-sdk";
import { Command } from "src/infra/decorators/registerCommand.decorator";
import { MezonClientService } from "src/infra/mezon/client.service";
import { CommandMessage, CommandName } from "../../domain/types";
import { CommandBase } from "./base";

@Command(CommandName.Pika)
export class PikaCommand extends CommandBase<CommandMessage> {
  constructor(protected clientService: MezonClientService) {
    super(clientService);
  }

  async execute(_args: string[]): Promise<void> {
    const dmClan = this.client.clans.get("0");
    const recipientUserId =
      this.mezonMessage.references?.at(0)?.message_sender_id ||
      this.message.mentions?.at(0)?.user_id;

    if (!recipientUserId || !dmClan) return;
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
