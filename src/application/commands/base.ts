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

  // need to be called on every single command to refresh the properties (channel, message, user,...)
  // otherwise they will be stale
  private async init() {
    this.userId =
      this.message.type === "action"
        ? this.message.user_id
        : this.message.sender_id;
    const { channel_id: channelId, message_id: messageId } = this.message;

    if (!channelId || !messageId) return;
    this.mezonChannel = await this.client.channels.fetch(channelId);
    this.mezonMessage = await this.mezonChannel.messages.fetch(messageId);
  }

  protected abstract execute(args: unknown): Promise<void>;

  async handle(message: TMessage, args: unknown): Promise<void> {
    this.message = message;
    await this.init();
    if (!this.mezonMessage) return;

    await this.execute(args);
  }
}
