import { EMessageComponentType, type SelectComponent } from "mezon-sdk";

export class SelectionBuilder {
  private readonly _selection: SelectComponent;

  constructor() {
    this._selection = {
      id: "",
      type: EMessageComponentType.SELECT,
      component: {
        options: [],
      },
    };
  }

  setOptions(options: { label: string; value: string }[]): this {
    // @ts-ignore
    this._selection.component.options = options;
    return this;
  }

  setId(id: string): this {
    this._selection.id = id;
    return this;
  }

  build(): SelectComponent {
    return this._selection;
  }
}
