import type { MessageType } from "../../domain/types";
import type { MezonClient } from "mezon-sdk";
import type { Message } from "mezon-sdk/dist/cjs/mezon-client/structures/Message";
import type { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel";
import { MezonClientService } from "src/mezon/client.service";

export abstract class CommandBase<TMessage extends MessageType = MessageType> {
  protected client: MezonClient;

  protected _message!: Message;
  protected _channel!: TextChannel;
  constructor(
    protected clientService: MezonClientService,
    protected message: TMessage,
  ) {
    this.client = clientService.getClient();
  }

  protected async getMessage() {
    if (!this._message) {
      const { channel_id: channelId, message_id: messageId } = this.message;
      if (!channelId || !messageId) return;

      this._channel = await this.client.channels.fetch(channelId);
      this._message = await this._channel.messages.fetch(messageId);
    }
    return this._message;
  }

  protected abstract execute(args: string[]): Promise<void>;

  async handle(args: string[]): Promise<void> {
    const message = await this.getMessage();
    if (!message) return;

    await this.execute(args);
  }
}
