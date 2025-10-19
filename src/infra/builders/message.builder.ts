import {
  ButtonComponent,
  ChannelMessageContent,
  EMarkdownType,
  SelectComponent,
} from "mezon-sdk";

export class MessageBuilder {
  private readonly _message: ChannelMessageContent;

  constructor() {
    this._message = {
      components: [],
    };
  }

  addButtons(buttons: ButtonComponent[][]): this {
    for (const buttonRow of buttons) {
      this._message.components?.push({
        components: buttonRow,
      });
    }
    return this;
  }

  addSelectors(selectors: SelectComponent[]): this {
    this._message.components?.push({
      components: selectors,
    });
    return this;
  }

  addText(text: string): this {
    this._message.t = text;
    return this;
  }

  markdown(): this {
    this._message.mk = [
      { type: EMarkdownType.PRE, s: 0, e: this._message.t?.length },
    ];
    return this;
  }

  build(): ChannelMessageContent {
    return this._message;
  }
}
