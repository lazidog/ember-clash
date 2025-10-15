# Grok Assistance Guidelines for EmberClash Project

This document configures Grok's behavior for tasks on the EmberClash Mezon Bot project. It defines rules, styles, and context to ensure consistent, efficient assistance. Update this file as project evolves. Reference: SRS [srs.md](srs.md), Data [data.md](data.md), Development Plan [development.md](development.md).

## Project Overview
- **Core**: RPG bot for Mezon platform. Features: Dragon catching/breeding, clan/gods management, PVP battles, events, Stripe monetization.
- **Tech Stack**: NestJS 10+, TypeScript 5+, Prisma/Postgres, Mezon SDK v2.8.20 (sockets, embeds, buttons), Vitest (>70% coverage), seedrandom (RNG), @nestjs/schedule (cron).
- **Key Flows**: Commands prefixed with `*` (e.g., `*start`, `*menu`). Interactive messages (IInteractiveMessageProps: embeds + buttons). Per-user state stack (in-memory Map, reset on new command, max depth 3, 15min timeout).
- **Balance**: Tactics > power (element counters: Fire > Earth > Water > Air > Fire; skills proc 30%). RNG seeded (userId + clanId + timestamp). No pay-to-win heavy (premium +5% edge).
- **Data Sources**: Load gods/dragons from `data/gods.json` & `data/dragons.json` (import constants). Schema: User (resources JSONB, dragons array), Dragon (stats JSONB), Clan (members array, god buffs).
- **Deployment**: PM2 + Docker (Postgres). Env: MEZON_TOKEN, BOT_ID, WILD_CHANNEL_ID.

## Detailed Project Structure: Folders and Files
Project follows NestJS modular architecture. Root includes config, tests, docs, db. Key files from current source (`ember-clash-source-code.txt`):

```
.
├── .env.test                  # Test env vars (e.g., MEZON_TOKEN, DB_URL)
├── .github/                   # GitHub workflows/PR templates
│   └── pull_request_template.md
├── .husky/                    # Git hooks (pre-commit lint-staged)
├── CHANGELOG.md               # Version history
├── Dockerfile                 # Postgres image
├── README.md                  # Project overview
├── biome.json                 # Linting/formatting config
├── docker-compose.yml         # Local Postgres setup
├── nest-cli.json              # NestJS compiler config
├── package.json               # Dependencies (NestJS, Prisma, mezon-sdk v2.8.20, Vitest)
├── prisma.config.ts           # Prisma config (schema, migrations)
├── tsconfig.json              # TS compiler options
├── tsconfig.build.json        # Build-time TS options
├── vitest.config.ts           # Vitest setup (tests)
├── docs/                      # Project docs
│   ├── data.md                # Gods/dragons JSON configs
│   ├── srs.md                 # Full SRS (requirements)
│   └── development.md         # Phases/tasks table
├── db/                        # Prisma/DB setup
│   ├── .scaffdog/             # Migration scaffolding
│   │   ├── config.js
│   │   └── data-migration.md
│   ├── prisma/                # Schema/migrations
│   │   ├── migrations/        # SQL migrations (e.g., 20251014002426_init_user/migration.sql)
│   │   │   └── migration_lock.toml
│   │   ├── data-migrations/   # Seed scripts (e.g., 20240515092014_init_user_data.ts)
│   │   └── schema.prisma      # Models (User, Dragon, Clan)
│   ├── README.md
│   └── src/                   # Generated client
│       └── __generated__/     # Prisma/Fabbrica code
│           └── fabbrica/
│               └── index.ts
├── mezon-cache/               # Local cache (SQLite)
│   └── mezon-messages-cache.db
├── test/                      # Tests (>70% coverage)
│   ├── integration/           # E2E tests
│   │   └── user.integration.test.ts  # User CRUD
│   ├── prisma.ts              # Test Prisma client
│   └── utils/
│       └── truncate.ts        # DB cleanup (TRUNCATE CASCADE)
└── src/                       # App source
    ├── app.gateway.ts         # WebSocket gateway (events: onMessage, onButtonClicked)
    ├── app.module.ts          # Root module (imports: Prisma, Mezon, Command)
    ├── application/            # Business logic
    │   └── commands/           # Command handlers
    │       ├── base.ts         # Abstract CommandBase (handle, execute)
    │       └── pika.ts         # Example command (@Command decorator)
    ├── builders/               # Message/UI factories (infra)
    │   ├── button.builder.ts
    │   ├── id.builder.ts
    │   ├── message.builder.ts
    │   └── selection.builder.ts
    ├── colors.ts               # Embed colors
    ├── command.storage.ts      # Command registry (infra/storages)
    ├── config.ts               # Zod-validated env (app, bot, db)
    ├── database/               # Prisma integration
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── decorators/             # Custom decorators (infra)
    │   └── registerCommand.decorator.ts  # @Command(CommandName)
    ├── domain/                 # Types/entities
    │   └── types.ts            # Enums (CommandName, ActionName), interfaces (MessageType)
    ├── infra/                  # Infrastructure
    │   ├── bot/                # Command handling
    │   │   ├── command.handler.ts  # Extracts commands/actions, routes to handlers
    │   │   └── command.module.ts
    │   ├── mezon/              # SDK integration
    │   │   ├── client.service.ts  # MezonClient init/login
    │   │   └── mezon.module.ts    # Dynamic module (forRootAsync)
    │   └── storages/           # Data stores
    │       └── command.storage.ts
    ├── main.ts                 # Bootstrap (NestFactory, gateway.initEvent)
    └── utils.ts                # Helpers (extractCommandMessage, extractActionMessage)
```

- **Notes**: Structure aligns with SRS (application/commands, database, domain, infra). Tests use `truncateAllTables` for isolation. Husky enforces linting on commit.

## Mezon SDK Guide (v2.8.20)
Based on official docs (https://mezon.ai/docs/mezon-sdk-docs/, https://mezon.ai/docs/mezon-interactive-message/) and source verification (GitHub mezon-js; no major doc-source mismatches noted—e.g., MezonClient constructor matches, TextChannel.send uses ChannelMessageContent). SDK enables real-time bots via WebSockets, with type-safe TS APIs. Focus: Client init, auth, channels/messages, events, interactives. Key: Use `MezonClient` as central hub; handle async fetches/errors.

### Some useful refs:

#### Mezon SDK Docs
- Mezon SDK Docs: https://mezon.ai/docs/mezon-sdk-docs/  
- Mezon Interactive Messages: https://mezon.ai/docs/mezon-interactive-message/  
- **External links** (link to source code or tool):
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/client/MezonClient.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/manager/session_manager.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/session.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/socket.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/manager/channel_manager.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/structures/TextChannel.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/structures/Message.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/manager/event_manager.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/structures/Clan.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/structures/User.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/utils/CacheManager.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/utils/AsyncThrottleQueue.ts
  - https://github.com/mezonai/mezon-js/blob/master/packages/mezon-sdk/src/mezon-client/utils/Collection.ts

### Installation & Setup
- Install: `npm install mezon-sdk` (v2.8.20).
- Init in NestJS: Dynamic module (`MezonModule.forRootAsync()`) injects `MezonClientService` (constructs client with BOT_ID, TOKEN; calls `initializeClient()` for login).
- Env: `BOT_ID`, `MEZON_TOKEN`. Host/port defaults to Mezon servers (SSL=true).

### Core Usage
#### Initializing & Events
```ts
import { MezonClient } from 'mezon-sdk';

const client = new MezonClient({
  botId: process.env.BOT_ID,
  token: process.env.MEZON_TOKEN,
  // Optional: host, port, useSSL, timeout
});

client.on('error', (error) => console.error('Mezon Error:', error));
client.on('disconnect', (reason) => console.log('Disconnected:', reason));
client.on('ready', () => {
  console.log(`Ready: ${client.clans.size} clans`);
  // Fetch example: const channel = await client.channels.fetch('channel_id');
});
```
- Login: `await client.login(token);` (auto-handles JWT session).
- Logout: `await client.closeSocket();`.
- In project: `app.gateway.ts` calls `initEvent()` to bind handlers (e.g., `client.onChannelMessage(handleMessage)`).

#### Working with Channels & Messages
- Fetch: `const channel = await client.channels.fetch(channelId);` (TextChannel).
- Send: 
  ```ts:disable-run
  await channel.send({ t: 'Text content' });  // Basic
  // With embed/attachments:
  await channel.send({
    t: 'Body',
    embed: [{ title: 'Embed Title', description: 'Desc', color: '#3498db' }],
    attachments: [{ url: 'https://example.com/img.png', filename: 'img' }]
  });
  ```
- Update: `const msg = await channel.messages.fetch(msgId); await msg.update({ t: 'New text' });`.
- Reply: `await msg.reply({ t: 'Reply' });`.
- Delete/React: `await msg.delete(); await msg.react('👍');`.
- DM: `const user = await clan.users.fetch(userId); await user.createDmChannel(); await user.sendDM({ t: 'DM' });`.
- Clan Fetch: `const clan = await client.clans.fetch(clanId);`.

#### Handling Events
- Messages: `client.onChannelMessage((msg) => { /* handle */ });`.
- Buttons: `client.onMessageButtonClicked((event: MessageButtonClicked) => { /* event: { clan_id, channel_id, message_id, sender_id, button_id } */ });`.
- Dropdowns: `client.onDropdownBoxSelected((event: DropdownBoxSelected) => { /* event: { ..., values: string[] } */ });`.
- Channel Updates: `client.onChannelUpdate((update) => { /* handle */ });`.
- In project: `app.gateway.ts` binds to `CommandHandler` (extracts via utils.ts: `extractCommandMessage` for *, `extractActionMessage` for button_id).

#### Interactive Messages (Embeds + Components)
- Embed (`IEmbedProps`): Rich blocks in `embed: IEmbedProps[]`.
  ```ts
  const embed: IEmbedProps = {
    title: 'Title',
    description: 'Desc (markdown ok)',
    color: '#e74c3c',
    fields: [{ name: 'Field', value: 'Val', inline: true }],
    thumbnail: { url: 'https://...' },
    image: { url: 'https://...' },
    footer: { text: 'Footer' },
    timestamp: new Date().toISOString()
  };
  await channel.send({ t: 'Body', embed: [embed] });
  ```
- Components: Rows of buttons/selects in `components: IMessageActionRow[]`.
  - Button (`ButtonComponent`): `{ type: EMessageComponentType.BUTTON, id: 'unique_id', component: { label: 'Click', style: EButtonMessageStyle.PRIMARY, url?: 'https://...' } }`.
  - Row: `{ components: [button1, button2] }` (max 5/row, 5 rows/msg).
  - Send: `await channel.send({ t: 'Interact', components: [row] });`.
- Handle: Use `button_id` in event to route (e.g., 'pvp_search' → action). Update: `await msg.edit({ t: 'Updated', components: [] });` (removes buttons).
- In project: Use `builders/message.builder.ts` for factories. State stack tracks nav (push/pop on button clicks).

#### Caching & Utils
- Cache: Auto via `CacheManager` (LRU for users/channels).
- Throttle: `AsyncThrottleQueue` for rate-limits (e.g., 1 msg/sec).
- Persistence: SQLite (`mezon-messages-cache.db`) for local msgs.
- Errors: Wrap in try-catch; emit 'error' event.

#### Version Notes (v2.8.20)
- Matches docs: No breaking changes noted (e.g., PB serialization stable). Source confirms `MezonClient` extends EventEmitter; `TextChannel.send` async with `ChannelMessageContent`; `Message.update` uses payload.
- Project Integration: `client.service.ts` wraps init; `command.handler.ts` routes events to commands (extend `CommandBase` in `application/commands/`).

## Communication Style
- **Concise & Structured**: Short, clear responses. Use headings, bullets, tables for structure. No fluff (e.g., avoid "I understand" unless asked).
- **Task-Focused**: For each task, confirm understanding if ambiguous, then deliver (e.g., code diffs, not full files).
- **Edits**: On revisions, send only changed sections/files (e.g., "Updated: src/app.gateway.ts – added RNG import").
- **Questions**: Ask immediately if unclear (e.g., "Clarify: Breed fail logic – refund gold?").
- **Language**: English (default); switch to Vietnamese if user specifies.
- **Citations**: Use inline citations for external refs (e.g., Mezon SDK).

## Coding Rules & Style Guide
- **Type Safety**: Strict TS. No `any` unless unavoidable (prefer generics/unions). Link types (e.g., CommandClass<TMessage>).
- **DRY**: No repetition. Extract factories/builders (e.g., `buildInteractiveEmbed` in builders/), constants to separate files (e.g., `data/constants.ts` for rarity weights).
- **Modularity**: NestJS modules per feature (e.g., DragonModule). Utils in separate files (e.g., `utils/rng.ts`, `utils/battle-sim.ts`).
- **Naming**: Kebab-case for commands/actions (e.g., `pvp_search`). CamelCase for TS. Enums for names (CommandName.Pika).
- **Error Handling**: Try-catch with error embeds + state reset. Throttle: Map<userId, counter> (1/sec).
- **Testing**: Vitest for each task (>70% coverage). Mock MezonClient/Prisma. Use `truncateAllTables` in integration tests.
- **RNG & Balance**: Seed with `seedrandom(userId + clanId + Date.now())`. Sim 100-1k runs for balance (e.g., breed fail 20%).
- **Mezon Integration**:
  - Commands: Extract via `extractCommandMessage` (utils.ts).
  - Buttons: Extract via `extractActionMessage` (actionName from button_id).
  - Updates: `channel.updateMessage({ embed, components })` for single-message flow.
  - State: Per-user Map in CommandHandler (push/pop/resetOnNewCommand).
- **Constants**: Externalize (e.g., `const RARITY_WEIGHTS = { common: 0.7, ... }` in `data/constants.ts`).
- **Commits/PRs**: Small changes. Branch: `feature/phaseX-taskY`. Include Vitest logs.

## Task Handling Process
1. **Read Source**: Always parse `ember-clash-source-code.txt` for current structure/flow before responding.
2. **Analyze**: Reference SRS FRs (e.g., FR-001 for *start). Use tools if needed (e.g., code_execution for sims).
3. **Plan**: Outline steps in response (e.g., "Steps: 1. Add entity. 2. Handler. 3. Test.").
4. **Deliver**: Code as fenced blocks (diffs for edits). Full files only if new.
5. **Verify**: Suggest Vitest snippet. Balance check if relevant (e.g., PVP sim).
6. **Next**: Suggest related tasks (e.g., "After P1-T3: Implement P1-T4 state manager.").

## Customization for Grok
- **Tool Usage**: Prioritize code_execution for tests/sims. Browse Mezon docs if SDK changes.
- **Edge Cases**: Handle timeouts (15min reset), caps (e.g., 5 catches/day), events (cron overrides).
- **Extensions**: For new features, trace to SRS (e.g., add FR-014: Event rewards). Propose JSON updates in data.md.
