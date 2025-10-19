import { USER_INTERACTION_TIMEOUT_MS } from "src/constants";
import { ActionName } from "src/domain/types";
import { UserInteraction } from "src/domain/userInteraction.types";
import { UserInteractionManager } from "src/infra/storages/userInteractionManager";
import { beforeEach, describe, expect, it, vi } from "vitest";

const manager = new UserInteractionManager();

describe("UserInteractionManager", () => {
  const userId1 = "test_user_1";
  const userId2 = "test_user_2";
  const messageId1 = "message_1";
  const messageId2 = "message_2";
  const clickMenuBattle: UserInteraction = {
    command: ActionName.MenuBattle,
    data: {},
  };
  const clickMenuDragons: UserInteraction = {
    command: ActionName.MenuDragons,
    data: {},
  };

  beforeEach(() => {
    manager.reset(userId1);
    manager.reset(userId2);
  });

  it("should reset the state for a user", () => {
    manager.push(userId1, messageId1, clickMenuDragons);
    manager.push(userId1, messageId1, clickMenuBattle);
    manager.reset(userId1);
    const userState = manager.getCurrent(userId1);
    expect(userState?.currentAction).toBeNull();
    expect(userState?.currentMessageId).toBeNull();
    expect(userState?.lastUpdatedAt).toBeNull();
    expect(userState?.stack?.length).eq(0);
  });

  it("should push an interaction and get the current one", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    const current = manager.getCurrent(userId1);
    expect(current?.currentAction?.command).toBe(ActionName.MenuBattle);
    expect(current?.currentMessageId).toBe(messageId1);
  });

  it("should pop an interaction and return the previous one", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    manager.push(userId1, messageId1, clickMenuDragons);

    const popped = manager.pop(userId1);
    expect(popped?.command).toBe(ActionName.MenuDragons);

    const current = manager.getCurrent(userId1);
    expect(current.currentAction.command).toBe(ActionName.MenuBattle);
  });

  it("should return null when popping from an empty stack", () => {
    const popped = manager.pop(userId1);
    expect(popped).toBeNull();
  });

  it("should empty stack after pop all", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    manager.push(userId1, messageId1, clickMenuDragons);
    manager.pop(userId1);
    manager.pop(userId1);
    const current = manager.getCurrent(userId1);
    expect(current?.currentAction).toBeNull();
    expect(current?.stack.length).toBe(0);
  });

  it("should correctly identify an expired state & reset user interaction", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    vi.useFakeTimers();
    vi.advanceTimersByTime(USER_INTERACTION_TIMEOUT_MS + 1);
    expect(manager.isExpired(userId1)).toBe(true);
    manager.reset(userId1);
    const userState = manager.getCurrent(userId1);
    expect(userState?.stack.length).toBe(0);
    expect(userState?.lastUpdatedAt).toBeNull();
    vi.useRealTimers();
  });

  it("should correctly identify a non-expired state", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    expect(manager.isExpired(userId1)).toBe(false);
  });

  it("should handle multiple users independently", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    manager.push(userId2, messageId2, clickMenuDragons);

    const current1 = manager.getCurrent(userId1);
    const current2 = manager.getCurrent(userId2);

    expect(current1?.currentAction.command).toBe(ActionName.MenuBattle);
    expect(current2?.currentAction.command).toBe(ActionName.MenuDragons);

    manager.pop(userId1);
    const userState1 = manager.getCurrent(userId1);
    const userState2 = manager.getCurrent(userId2);

    expect(userState1?.currentAction).toBeNull();
    expect(userState2?.currentAction).toBe(clickMenuDragons);
  });

  it("should ensure default state for new user", () => {
    const newUser = "new_user";
    const state = manager.get(newUser);
    expect(state.stack.length).toBe(0);
    expect(state.lastUpdatedAt).toBeNull();
    expect(state.currentMessageId).toBeNull();
  });

  it("should not expire state with null lastUpdatedAt", () => {
    expect(manager.isExpired(userId1)).toBe(false); // Fresh state
  });

  it("should validate messageId match", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    expect(manager.validateMessage(userId1, messageId1)).toBe(true);
    expect(manager.validateMessage(userId1, messageId2)).toBe(false);
  });

  it("should invalidate on expiration", () => {
    manager.push(userId1, messageId1, clickMenuBattle);
    vi.useFakeTimers();
    vi.advanceTimersByTime(USER_INTERACTION_TIMEOUT_MS + 1);
    expect(manager.validateMessage(userId1, messageId1)).toBe(false);
    vi.useRealTimers();
  });

  it("should invalidate an old message after a new command is issued", () => {
    // User gets the first interactive message
    manager.push(userId1, "message_1", clickMenuBattle);
    expect(manager.validateMessage(userId1, "message_1")).toBe(true);

    // A new command is issued, which should reset the user's state.
    // In the real application, the CommandHandler calls reset().
    manager.reset(userId1);
    manager.push(userId1, "message_2", clickMenuDragons);

    // Now, any interaction with the old message should be invalid
    expect(manager.validateMessage(userId1, "message_1")).toBe(false);
  });
});
