import { MezonClient } from "mezon-sdk";
import { Message as MezonMessage } from "mezon-sdk/dist/cjs/mezon-client/structures/Message";
import { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel";
import { MezonClientService } from "src/infra/mezon/client.service";
import { MessageType } from "../../domain/types";

export abstract class CommandBase<TMessage extends MessageType = MessageType> {
  protected client: MezonClient;

  protected mezonMessage!: MezonMessage;
  protected mezonChannel!: TextChannel;
  protected userId!: string;
  protected message!: TMessage;

  constructor(protected clientService: MezonClientService) {
    this.client = clientService.getClient();
  }

  protected async getMessage() {
    if (!this.mezonMessage) {
      const {
        channel_id: channelId,
        message_id: messageId,
        sender_id: userId,
      } = this.message;
      if (!channelId || !messageId) return;

      this.mezonChannel = await this.client.channels.fetch(channelId);
      this.mezonMessage = await this.mezonChannel.messages.fetch(messageId);
      this.userId = userId;
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
