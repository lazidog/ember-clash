import { Injectable } from "@nestjs/common";
import { USER_INTERACTION_TIMEOUT_MS } from "src/constants";
import { UserInteraction } from "src/domain/userInteraction.types";

type UserInteractionState = {
  stack: UserInteraction[];
  lastUpdatedAt: number | null;
  currentMessageId: string | null;
};

@Injectable()
export class UserInteractionManager {
  private states = new Map<string, UserInteractionState>();

  get(userId: string) {
    if (!this.states.has(userId)) {
      this.states.set(userId, {
        stack: [],
        lastUpdatedAt: null,
        currentMessageId: null,
      });
    }
    return this.states.get(userId) as UserInteractionState;
  }

  getCurrent<T>(userId: string) {
    const current = this.get(userId);
    return {
      currentAction: (current.stack.at(-1) as UserInteraction<T>) ?? null,
      ...current,
    };
  }

  reset(userId: string) {
    const current = this.get(userId);
    current.stack = [];
    current.lastUpdatedAt = null;
    current.currentMessageId = null;
    this.states.set(userId, current);
  }

  push(userId: string, messageId: string, interaction: UserInteraction) {
    const userState = this.get(userId);
    if (userState.currentMessageId !== messageId) {
      userState.stack = [];
    }
    userState.stack.push(interaction);
    userState.currentMessageId = messageId;
    userState.lastUpdatedAt = Date.now();
  }

  pop(userId: string): UserInteraction | null {
    const userState = this.get(userId);
    if (!userState.stack.length) return null;
    const popped = userState.stack.pop();
    userState.lastUpdatedAt = Date.now();
    return popped ?? null;
  }

  isExpired(userId: string): boolean {
    const state = this.get(userId);
    if (state.lastUpdatedAt === null) return false;
    return Date.now() - state.lastUpdatedAt > USER_INTERACTION_TIMEOUT_MS;
  }

  validateMessage(userId: string, incomingMessageId: string): boolean {
    const state = this.get(userId);
    return (
      state.currentMessageId === incomingMessageId &&
      !this.isExpired(userId) &&
      state.stack.length < 100
    );
  }
}
