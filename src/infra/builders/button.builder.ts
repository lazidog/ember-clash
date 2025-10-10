import {
  type ButtonComponent,
  EButtonMessageStyle,
  EMessageComponentType,
} from "mezon-sdk";

export class ButtonBuilder {
  private readonly _button: ButtonComponent;

  constructor() {
    this._button = {
      id: "",
      type: EMessageComponentType.BUTTON,
      component: {
        label: "",
        style: EButtonMessageStyle.PRIMARY,
      },
    };
  }

  setLabel(label: string): this {
    this._button.component.label = label;
    return this;
  }

  setStyle(style: EButtonMessageStyle): this {
    this._button.component.style = style;
    return this;
  }

  setId(id: string): this {
    this._button.id = id;
    return this;
  }

  build(): ButtonComponent {
    return this._button;
  }
}
