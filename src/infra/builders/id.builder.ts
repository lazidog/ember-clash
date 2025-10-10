import { ActionName } from "../../domain/types";

export function exampleSelectorId(): string {
  return "example_selector";
}

export function doSomethingId(exampleId: string): string {
  return `${ActionName.Example}_${exampleId}`;
}
