import {} from "mezon-sdk";
import { CommandAndActionName } from "src/domain/types";

export const idSeparator = "|";
export const keySeparator = ":";

export class ActionIdBuilder {
  private map: Map<string, string> = new Map();

  constructor(private readonly userId: string) {
    this.map.set("userId", this.userId);
  }

  setAction(action: CommandAndActionName): this {
    this.map.set("action", action);
    return this;
  }

  build(): string {
    return Array.from(this.map.entries())
      .map(([key, value]) => `${key}${keySeparator}${value}`)
      .join(idSeparator);
  }
}
