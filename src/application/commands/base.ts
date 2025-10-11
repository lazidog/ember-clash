import type { MezonClient } from "mezon-sdk";
import type { Message as MezonMessage } from "mezon-sdk/dist/cjs/mezon-client/structures/Message";
import type { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel";
import type { MezonClientService } from "src/infra/mezon/client.service";
import type { MessageType } from "../../domain/types";

export abstract class CommandBase<TMessage extends MessageType = MessageType> {
  protected client: MezonClient;

  protected mezonMessage!: MezonMessage;
  protected mezonChannel!: TextChannel;
  protected message!: TMessage;

  constructor(protected clientService: MezonClientService) {
    this.client = clientService.getClient();
  }

  protected async getMessage() {
    if (!this.mezonMessage) {
      const { channel_id: channelId, message_id: messageId } = this.message;
      if (!channelId || !messageId) return;

      this.mezonChannel = await this.client.channels.fetch(channelId);
      this.mezonMessage = await this.mezonChannel.messages.fetch(messageId);
    }
    return this.mezonMessage;
  }

  protected abstract execute(args: string[]): Promise<void>;

  async handle(message: TMessage, args: string[]): Promise<void> {
    this.message = message;
    const mezonMessage = await this.getMessage();
    if (!mezonMessage) return;

    await this.execute(args);
  }
}
