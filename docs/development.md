## Development Phases & Tasks
Project divided into 4 phases (total ~177h, micro-tasks max 6h for granularity). Each task with Vitest verify. Git branch per phase/task.

### Phase 1: Base Structure (Oct 13-17, ~27h)
|     | Task  |                                                                                                                                                                                                   |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ] | P1-T1 | Setup TypeORM: Create base User entity (mezonId unique, resources JSONB, trophies=0, stateStack JSONB=[]).                                                                                        |
| [ ] | P1-T2 | Setup Vitest vitest.config.ts (testMatch: ['**/*.test.ts'], coverage) and run test entities (test get/set user data)                                                                              |
| [ ] | P1-T3 | Create `buildInteractiveEmbed` factory (`IInteractiveMessageProps` sample main menu buttons ['pvp', 'dragons', 'clan']).                                                                          |
| [ ] | P1-T4 | State manager: In-memory `Map<userId, {stack: [{name, data, buttons, timestamp}], currentMessageId?}>`. Methods `push`/`pop`/`resetOnNewCommand` (clear stack + timestamp). Validate button.      |
| [ ] | P1-T5 | Update gateway: On "*command", reset state + send/update main embed. On button: Check state top + userId match, push + updateMessage({embed, components}). Ignore mismatch (error embed + reset). |
| [ ] | P1-T6 | "Go Back"/"Menu" logic: Pop/update prev state; reset + main embed. Timeout check (>15min → force reset embed).                                                                                    |
| [ ] | P1-T7 | RNG & Cron: seedrandom util. Cron spawns (env `WILD_CHANNEL_ID`).                                                                                                                                 |
| [ ] | P1-T8 | Error/Throttle: Try-catch error embed + "Menu" reset. Per-user throttle (Map counter).                                                                                                            |

### Phase 2: Core Features (Oct 18-31, ~60h)
#### Feature 1: Onboarding & Menu
|     | Task  |                                                                                                                                                        |
| --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ ] | F1-T1 | *start: Check/create User; Grant free common dragon (create Dragon entity, push to user.dragons); Send interactive main menu embed, push 'main' state. |
| [ ] | F1-T2 | *menu: Reset state + update/send main embed (buttons: PVP, Dragons, Clan).                                                                             |
| [ ] | F1-T3 | Main menu buttons: E.g., "Dragons" → push 'dragons' state, update sub-buttons (Inventory, Catch, Go Back).                                             |
#### Feature 2: Dragon Catching & Inventory
|     | Task  |                                                                                                                                                 |
| --- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F2-T1 | Integrate spawn cron: Send interactive embed ("[Dragon] appeared! Catch?") + temp state 5min. Load from dragons.json.                           |
| [ ] | F2-T2 | Catch button: Gems check/cap; RNG roll (rarity weights); Success: Create Dragon entity, push user.dragons; Update "Caught!" + Inventory button. |
| [ ] | F2-T3 | Fail: Update "Missed!" + Try Again (deduct gems only final).                                                                                    |
| [ ] | F2-T4 | Inventory button: Update embed list (emojis/stats from dragons.json); Buttons: Feed, Breed, Go Back.                                            |
#### Feature 3: Dragon Feed & Breed
|     | Task  |                                                                                                                                                                 |
| --- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F3-T1 | Feed button: Select amount; Absorb elixir; Lv up at 500 (scale stats * mult); Update "Leveled!" + Inventory.                                                    |
| [ ] | F3-T2 | Breed button: Select pair (Lv1+); Gold check; Roll prob (avg lvl + element bonus, 20% Goblin fail); Create new Lv0 Dragon; Update "Born [rarity]!" + Inventory. |
| [ ] | F3-T3 | Breed fail: Update "Failed—Goblin!" (no Go Back, Menu reset).                                                                                                   |
#### Feature 4: Clan Basics
|     | Task  |                                                                                                                                                      |
| --- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F4-T1 | *createclan <name>: Buttons select common god (load gods.json); Create Clan entity (chosen god); Update user.clanId; Embed "Created!" + sub-buttons. |
| [ ] | F4-T2 | *joincclan <id>: DM leader approve/reject buttons; Approve: Push user to clan.members; Update "Joined!" + clan menu.                                 |
| [ ] | F4-T3 | Leave/Kick button (admin): Remove members; Partial donate refund; Update "Left" + Menu (no Go Back).                                                 |

#### Feature 5: Clan Donate & Gods
|     | Task  |                                                                                                                              |
| --- | ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F5-T1 | Donate button: Select amount (elixir); Add pool; Upgrade godLevel at threshold; Notify channel; Apply buff (load gods.json). |
| [ ] | F5-T2 | God buff util: effectiveStats = base * (1 + lvl*0.1 + premium?0.05:0); Factor skills/elements.                               |
#### Feature 6: PVP Attack & Assign
|     | Task  |                                                                                                                                  |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F6-T1 | PVP button: Update sub-embed "Assign team?" + slots 1-5 buttons (Lv1+ check).                                                    |
| [ ] | F6-T2 | Assign: Select from inventory; Save user.assignments.attack[slot]; Update team list embed.                                       |
| [ ] | F6-T3 | Search button: 100 gold; Progressive queue (±50 → expand >10s to ±100/200); Exclude clan.                                        |
| [ ] | F6-T4 | Attack button: Sim 5 rounds (damage formula + skills proc 30% + elements); Loot/trophies (diff adjust). Update "Won!" + history. |
| [ ] | F6-T5 | History button: Update last 10 embed (win% table). Auto defense (use assignments.defense). Menu reset.                           |
#### Feature 7: Leaderboards & Events Base
|     | Task  |                                                                                                                              |
| --- | ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| [ ] | F7-T1 | *leaderboard personal: Aggregate top 10 trophies; Update embed table + Menu.                                                 |
| [ ] | F7-T2 | *leaderboard clan: Sum members * godLevel; From clan state, update embed.                                                    |
| [ ] | F7-T3 | Events cron base: Weekly trigger (e.g., Olympus: double rare spawn, element twist); Notify channel embed + override weights. |
| [ ] | F7-T4 | Event rewards: E.g., top donate free god trial; Integrate underdog (force higher match).                                     |
### Phase 4: Monetization/Deploy (Nov 8-15, ~50h)
#### Feature 8: Premium Gods
|     | Task  |                                                                                       |
| --- | ----- | ------------------------------------------------------------------------------------- |
| [ ] | F8-T1 | Shop button: Update premium list embed (load gods.json, prices); Buttons "Buy [god]". |
| [ ] | F8-T2 | Buy button: Create Stripe intent (199 cents, metadata); Update embed payment link.    |
| [ ] | F8-T3 | Webhook: Express /webhook; Verify sig, update clan.god + flat buff; Notify.           |

#### Final Tasks
|     | Task   |                                                                              |
| --- | ------ | ---------------------------------------------------------------------------- |
| [ ] | Fin-T1 | Full integration: Route all to gateway; Rate-limit AsyncThrottleQueue.       |
| [ ] | Fin-T2 | QA: Vitest units/integration; Balance sim (1k breeds/attacks/events); Fixes. |
| [ ] | Fin-T3 | Deploy: PM2 ecosystem; Docker prod; Optional Redis cache state/leaderboards. |
