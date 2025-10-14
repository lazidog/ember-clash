# Software Requirements Specification (SRS) for EmberClash Mezon Bot

**Project Name**: EmberClash Mezon Bot  
**Version**: 1.0  
**Date**: October 12, 2025  
**Authors**: Lazidog, Grok (AI Assistant for Refinement)  
**References**: Mezon SDK Docs, IEEE 830-1998 SRS Template  

## 1. Introduction

### 1.1 Purpose
This SRS defines the requirements for EmberClash Mezon Bot, an interactive RPG bot for the Mezon platform (similar to Discord bots). Inspired by FakeRPG (PVP/collections), TurnipRPG (community farming), Dragon City (breeding), and Clash of Clans (clan warfare/trophies), the bot enables players to train dragons, manage clans with Greek mythology gods, breed hybrids, and compete in PVP battles. It emphasizes community interaction, randomness for engagement, and fair monetization. The bot uses Mezon SDK for real-time events, embeds, and buttons, ensuring manual engagement without timers or auto-generation.

This document serves as a blueprint for development, traceable to objectives, and modular for freelancer implementation.

### 1.2 Scope
**In-Scope**: Dragon spawning/catching, breeding, clan management/gods (with selection from common gods), PVP simulations (progressive matchmaking), leaderboards, resource economy, Stripe monetization, events (e.g., Olympus Festival). Backend: NestJS with Prisma/Postgres. Integrations: Mezon SDK (sockets/events), Stripe (payments).  
**Out-of-Scope**: Base-building, upgrade timers, auto-resource generation, custom UI beyond Mezon embeds/buttons, multi-language support, advanced AI opponents.  
**Assumptions**: Mezon SDK v1.x stable; freelancers have NestJS experience; Postgres (Docker local) for DB; VPS for deployment.  
**Dependencies**: npm packages (NestJS, @nestjs/websockets, prisma, pg, stripe, seedrandom, cron, dotenv, vitest).

### 1.3 Definitions, Acronyms, and Abbreviations
- **Mezon SDK**: Library for Mezon platform integration (sockets, channels, embeds).  
- **RNG**: Random Number Generator (seeded for fairness).  
- **PVP**: Player vs. Player battles.  
- **SRS**: Software Requirements Specification.  
- **NestJS**: Node.js framework for modular backend.  
- **Prisma**: ORM for Postgres relations/migrations.  
- **IInteractiveMessageProps**: Mezon embed + components (buttons/selects) for updates.

### 1.4 References

#### Mezon SDK Docs
- https://mezon.ai/docs/mezon-sdk-docs/  
  - ## Overview: https://mezon.ai/docs/mezon-sdk-docs/#overview
  - ## Features: https://mezon.ai/docs/mezon-sdk-docs/#features
  - ## Project Structure: https://mezon.ai/docs/mezon-sdk-docs/#project-structure
  - ## Getting Started: https://mezon.ai/docs/mezon-sdk-docs/#getting-started
    - ### Prerequisites: https://mezon.ai/docs/mezon-sdk-docs/#prerequisites
    - ### Installation: https://mezon.ai/docs/mezon-sdk-docs/#installation
  - ## Core Concepts: https://mezon.ai/docs/mezon-sdk-docs/#core-concepts
    - ### MezonClient: https://mezon.ai/docs/mezon-sdk-docs/#mezonclient
    - ### Authentication (Sessions): https://mezon.ai/docs/mezon-sdk-docs/#authentication-sessions
    - ### Real-time Communication (Sockets): https://mezon.ai/docs/mezon-sdk-docs/#real-time-communication-sockets
    - ### Channels: https://mezon.ai/docs/mezon-sdk-docs/#channels
    - ### Messages: https://mezon.ai/docs/mezon-sdk-docs/#messages
    - ### Events: https://mezon.ai/docs/mezon-sdk-docs/#events
    - ### Clans & Users: https://mezon.ai/docs/mezon-sdk-docs/#clans-users
    - ### Caching and Data Management: https://mezon.ai/docs/mezon-sdk-docs/#caching-and-data-management
  - ## Usage / API Examples: https://mezon.ai/docs/mezon-sdk-docs/#usage-api-examples
    - ### Initializing the Client: https://mezon.ai/docs/mezon-sdk-docs/#initializing-the-client
      - #### Find clan and channel: https://mezon.ai/docs/mezon-sdk-docs/#find-clan-and-channel
    - ### Authentication: https://mezon.ai/docs/mezon-sdk-docs/#authentication
      - #### Login with Token: https://mezon.ai/docs/mezon-sdk-docs/#login-with-token
      - #### Logout: https://mezon.ai/docs/mezon-sdk-docs/#logout
    - ### Working with Channels: https://mezon.ai/docs/mezon-sdk-docs/#working-with-channels
      - #### Initiating a Channel: https://mezon.ai/docs/mezon-sdk-docs/#initiating-a-channel
      - #### Send a Message to a Channel: https://mezon.ai/docs/mezon-sdk-docs/#send-a-message-to-a-channel
    - ### Working with Messages: https://mezon.ai/docs/mezon-sdk-docs/#working-with-messages
      - #### Initiating a Message: https://mezon.ai/docs/mezon-sdk-docs/#initiating-a-message
      - #### Replying to a Message: https://mezon.ai/docs/mezon-sdk-docs/#replying-to-a-message
      - #### Updating a Message: https://mezon.ai/docs/mezon-sdk-docs/#updating-a-message
      - #### Reacting to a Message: https://mezon.ai/docs/mezon-sdk-docs/#reacting-to-a-message
      - #### Deleting a Message: https://mezon.ai/docs/mezon-sdk-docs/#deleting-a-message
    - ### Working with Users: https://mezon.ai/docs/mezon-sdk-docs/#working-with-users
      - #### Initiating a User: https://mezon.ai/docs/mezon-sdk-docs/#initiating-a-user
      - #### Sending a Direct Message: https://mezon.ai/docs/mezon-sdk-docs/#sending-a-direct-message
    - ### Working with Clans: https://mezon.ai/docs/mezon-sdk-docs/#working-with-clans
      - #### Fetching Clan Data: https://mezon.ai/docs/mezon-sdk-docs/#fetching-clan-data
    - ### Handling Events: https://mezon.ai/docs/mezon-sdk-docs/#handling-events
      - #### Listening to New Messages: https://mezon.ai/docs/mezon-sdk-docs/#listening-to-new-messages
      - #### Listening to Channel Updates: https://mezon.ai/docs/mezon-sdk-docs/#listening-to-channel-updates
  - ## API Reference (Key Components): https://mezon.ai/docs/mezon-sdk-docs/#api-reference-key-components
    - ### MezonClient ( `MezonClient.ts`): https://mezon.ai/docs/mezon-sdk-docs/#mezonclient-mezonclientts
    - ### Session ( `session.ts`, `session_manager.ts`): https://mezon.ai/docs/mezon-sdk-docs/#session-sessionts-sessionmanagerts
    - ### TextChannel ( `TextChannel.ts`): https://mezon.ai/docs/mezon-sdk-docs/#textchannel-textchannelts
    - ### Message ( `Message.ts`): https://mezon.ai/docs/mezon-sdk-docs/#message-messagets
    - ### User ( `User.ts`): https://mezon.ai/docs/mezon-sdk-docs/#user-userts
    - ### Clan ( `Clan.ts`): https://mezon.ai/docs/mezon-sdk-docs/#clan-clants
  - ## Testing: https://mezon.ai/docs/mezon-sdk-docs/#testing
  - ## Contributing: https://mezon.ai/docs/mezon-sdk-docs/#contributing
  - ## License: https://mezon.ai/docs/mezon-sdk-docs/#license
  - ## Acknowledgments: https://mezon.ai/docs/mezon-sdk-docs/#acknowledgments
- **External links** (liên kết đến source code hoặc công cụ):
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

- Mezon Interactive Messages: https://mezon.ai/docs/mezon-interactive-message/  
  - # Interactive Messages and Components: https://mezon.ai/docs/mezon-interactive-message/#interactive-messages-and-components
    - ## Messages with Embeds ( `IEmbedProps`): https://mezon.ai/docs/mezon-interactive-message/#messages-with-embeds--IEmbedProps-
      - Example: Creating a Comprehensive Embed: https://mezon.ai/docs/mezon-interactive-message/#example-creating-a-comprehensive-embed
    - ## Messages with Interactive Components: https://mezon.ai/docs/mezon-interactive-message/#messages-with-interactive-components
      - ### Interactive Components Structure: https://mezon.ai/docs/mezon-interactive-message/#interactive-components-structure
        - #### Component Type: Button: https://mezon.ai/docs/mezon-interactive-message/#component-type-button
          - Example: Creating a Message with Buttons: https://mezon.ai/docs/mezon-interactive-message/#example-creating-a-message-with-buttons
        - #### Other Component Types: https://mezon.ai/docs/mezon-interactive-message/#other-component-types
    - ## Listening for Component Interactions: https://mezon.ai/docs/mezon-interactive-message/#listening-for-component-interactions
      - ### Listening for Button Clicks: `onMessageButtonClicked`: https://mezon.ai/docs/mezon-interactive-message/#listening-for-button-clicks-onmessagebuttonclicked
        - Example: Handling a Button Click: https://mezon.ai/docs/mezon-interactive-message/#example-handling-a-button-click
      - ### Listening for Dropdown Selections: `onDropdownBoxSelected`: https://mezon.ai/docs/mezon-interactive-message/#listening-for-dropdown-selections-ondropdownboxselected
        - Example: Handling a Select Menu Selection: https://mezon.ai/docs/mezon-interactive-message/#example-handling-a-select-menu-selection

- NestJS WebSockets Guide: https://docs.nestjs.com/websockets/gateways  
- Stripe Node.js Integration: https://stripe.com/docs/api?lang=node  
- Inspirations: FakeRPG (top.gg/bot/726245823389892699), Dragon City (play.google.com/store/apps/details?id=es.socialpoint.DragonCity)

### 1.5 Overview
Section 2 describes overall system behavior. Section 3 details specific requirements. Section 4 covers supporting information.

## 2. Overall Description

### 2.1 Product Perspective
EmberClash fills a gap in Mezon's clan ecosystem by providing casual, collaborative RPGs with competitive edges. Players act as dragon trainers in clan channels, fostering retention through unpredictable spawns and clan synergies. Monetization is minor (premium gods: +5% buffs) to avoid pay-to-win.

### 2.2 Product Functions
- **Onboarding**: *start creates profile with free common dragon.  
- **Core Loop**: Catch spawns → Feed/level → Breed for hybrids → Attack for loot/trophies → Donate to clan gods.  
- **Interactions**: *commands (prefix "*"), embeds with buttons (e.g., *menu → buttons: PVP, Dragons).  
- **Real-Time**: Random spawns (5-10/hour) in #wild-dragons; socket events for battles.  
- **Economy**: Gold/Elixir from loot/donations; Gems for catches/shop.  
- **Events**: Weekly/seasonal (e.g., Olympus Festival) for rewards and tactics.

### 2.3 User Classes and Characteristics
- **Casual Players**: New users in Mezon clans; seek quick fun (catch/breed).  
- **Clan Leaders**: Manage members/gods; need admin tools (approve joins).  
- **Competitive Users**: Focus on PVP/leaderboards; expect fair matchmaking (± progressive spread).

### 2.4 Operating Environment
- Backend: Node.js v20+, NestJS v10+, Postgres v15+.  
- Deployment: VPS with PM2; HTTPS for Stripe; Docker for local Postgres.  
- Client: Mezon app (iOS/Android/Web) for embeds/buttons.

### 2.5 Design and Implementation Constraints
- Use NestJS modules/gateways for modularity.  
- Seeded RNG (seedrandom) for reproducible fairness.  
- Per-user state stack (in-memory Map, reset on new *command to avoid cross-channel leaks).  
- Interactive updates via message.update() (single-thread UX). Prefix "*". Vitest for testing.

### 2.6 Assumptions and Dependencies
- Users have Mezon accounts; bot token provided.  
- 1 clan per player (DB enforced).  
- Scale: Handle 1,000 users (Postgres indexes, AsyncThrottleQueue from Mezon SDK).

## 3. Specific Requirements

### 3.1 External Interfaces
- **User Interfaces**: Mezon embeds (IInteractiveMessageProps) with buttons/selects for menus (e.g., *menu → buttons: PVP, Dragons). Updates via channel.updateMessage() for single-message flow. State stack per-user (push/pop, max depth 3, reset on new *command).  
- **Hardware Interfaces**: N/A.  
- **Software Interfaces**: Mezon SDK (client.on('message'), channel.send({embed})); Stripe API.  
- **Communication Interfaces**: WebSockets for real-time (NestJS Gateways).

### 3.2 Functional Requirements
Prioritized by MoSCoW method. Each FR traceable to objectives (e.g., OBJ-001: Core Loop).

| ID     | Requirement                                                                                                                                                                                        | Priority | Acceptance Criteria                                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| FR-001 | Onboard user via *start: Create DB profile, grant free common dragon, send menu embed with god selection if new clan.                                                                              | Must     | Vitest: Simulate *start → Verify DB insert + embed sent.              |
| FR-002 | Spawn wild dragons randomly (cron: 5-15min) in #wild channel; announce embed with Catch button.                                                                                                    | Must     | Vitest: Run cron → Check embed payload + rarity weights (70% common). |
| FR-003 | Handle Catch button: Deduct 10 gems (daily cap 5), roll RNG (seeded), add dragon to inventory if success.                                                                                          | Must     | Vitest: 100 rolls → Verify distribution (e.g., 2% legendary).         |
| FR-004 | *feed <dragon_id> <amount>: Absorb elixir; level up at 500/elixir (instant, scale stats).                                                                                                          | Must     | Vitest: Simulate feed → Check level/stats update.                     |
| FR-005 | Breed <d1> <d2> (Lv1+): Cost 200 gold; new Lv0 dragon with rarity prob (20% fail: Goblin); element match bonus.                                                                                    | Should   | Vitest: 100 breeds → Verify 20% fail + element bonus.                 |
| FR-006 | *createclan <name>: Select common god via buttons (Zeus/Hades/Athena); insert DB, notify channel.                                                                                                  | Must     | Vitest: Simulate → Clan doc + god selected.                           |
| FR-007 | *joincclan <id>: Leader approves via DM button; add to members.                                                                                                                                    | Must     | Simulate button → Members array update.                               |
| FR-008 | *donate <amount elixir>: Add to pool; upgrade god at thresholds (+10% buff); notify channel.                                                                                                       | Should   | Vitest: Multiple donates → Buff calc (e.g., ATK *1.1).                |
| FR-009 | *attack: Cost 100 gold; progressive search (±50 → ±100 → ±200 trophies); sim battle (5 rounds, team 5 dragons, skill proc 30%). Trophy: Base ± diff factor (win higher: +more, lose lower: -less). | Must     | Vitest: Sim battle → Win/loss loot (+20/-10 adjusted).                |
| FR-010 | *buypremiumgod <god>: Stripe intent ($1.99); webhook updates clan.god (+5% flat).                                                                                                                  | Could    | Mock Stripe → DB update + buff.                                       |
| FR-011 | *leaderboard <personal/clan>: Embed top 10 (trophies * god mult).                                                                                                                                  | Should   | Aggregate query → Embed fields.                                       |
| FR-012 | *inventory: Embed dragon list (emojis, stats); buttons Feed/Breed/Go Back.                                                                                                                         | Must     | Fetch dragons → Embed format.                                         |
| FR-013 | Events (cron): E.g., Olympus Festival (double rares, element twist); reward gems/free god trial.                                                                                                   | Should   | Vitest: Trigger event → Spawn rate double + notify.                   |

### 3.3 Non-Functional Requirements
- **Performance**: <500ms response (Vitest benchmarks).  
- **Security**: Mezon sessions for auth; Stripe signatures; rate-limit *commands (1/sec/user).  
- **Reliability**: 99% uptime; error embeds on failures.  
- **Scalability**: Postgres indexes (e.g., {mezonId:1}); handle 1,000 concurrent via NestJS.  
- **Usability**: WCAG-compliant embeds (high contrast); intuitive buttons with back navigation (per-user stack reset).

### 3.4 Data Requirements
**Schema** (Prisma):
- **User**: { mezonId: string (unique), clanId: number, resources: JSONB {gold:100, elixir:50, gems:10}, trophies: number=0, dragons: Dragon[], stateStack: JSONB=[] }  
- **Dragon**: { id: number, ownerId: string, name: string, type: string, rarity: enum['common','rare','epic','legendary'], level:0, stats: JSONB {hp,atk,def}, absorbedElixir:0, element: string, skills: string[] }  
- **Clan**: { mezonId: string (unique), leaderId: string, members: User[], god: string (e.g., 'zeus'), godLevel:1, donationsPool:0, trophies:0 }  

Relations: User 1:M Dragon, Clan 1:M User. Migrations per feature (e.g., AddDragonRelation).

Dragon/God data modular (JSON configs in `data/` for easy extension).

## 4. Supporting Information

### 4.1 Design and Architecture
**High-Level**: NestJS AppModule → Feature Modules (DragonModule, ClanModule, BattleModule). Gateways for Mezon events (e.g., @WebSocketGateway() for onMessage). Services for logic (BreedService). Utils: battle.js (simulate with skills/elements), rng.js (seedrandom), state.manager.ts (per-user Map, reset on *command). Matchmaking: Queue with timer expand bracket.

**Text UML Diagram**:
```
[Mezon SDK (Sockets)] --> [NestJS Gateway (Events: onMessage, onButtonClick)] --> [Modules: DragonService] --> [Prisma Entities] --> [Postgres]
[Stripe Webhook] --> [PaymentService] --> [ClanEntity Update]
```

### 4.2 UI/UX Guidelines
- Embeds: Use IInteractiveMessageProps for rich displays (e.g., dragon stats table).  
- Wireframes: Text-based, e.g., "Main Menu Embed: Title: EmberClash, Buttons: [PVP, Dragons, Clan]".  
- Flows: *menu updates to sub-embeds on click (push state); Go Back pops, Menu resets. Timeout: 15min force reset.

### 4.3 Timeline and Milestones
- **MVP Launch**: November 15, 2025 (6 weeks from Oct 12).  
- **Phases**: 1: Base Structure (Oct 13-17, ~27h). 2: Core Features (Oct 18-31, ~60h). 3: PVP/Events (Nov 1-7, ~40h). 4: Monetization/Deploy (Nov 8-15, ~50h).

### 4.4 Risks and Mitigation
- **Risk**: Mezon SDK changes → Mitigate: Use browse_page tool for updates.  
- **Risk**: Balance issues (win rate >60%) → Mitigate: Vitest sim 1,000 battles, adjust counters/skills.

## Appendices

### A. Glossary
- Gateway: NestJS WebSocket handler.  
- RNG: Seeded random generator.  
- Prisma: Postgres ORM for entities/migrations.  
- Vitest: Fast testing framework.

### B. Implementation Plan
**Project Structure**:
```
.
├── src/              # Main application source code
│   ├── application/  # Application-specific logic (commands, queries, etc.)
│   │   └── commands/ # Command handlers and definitions
│   ├── database/     # Database-related modules and services (Prisma)
│   ├── domain/       # Domain entities and types
│   └── infra/        # Infrastructure concerns (bot, builders, decorators, Mezon integration, storages)
│       ├── bot/      # Bot-specific command handling and modules
│       ├── builders/ # Message and component builders
│       ├── decorators/ # Custom decorators
│       ├── mezon/    # Mezon client integration
│       └── storages/ # Data storage mechanisms
├── db/               # Database schema, migrations, and related utilities
│   ├── .scaffdog/    # Scaffolding for data migrations
│   ├── prisma/       # Prisma schema, data migrations, and database migrations
│   │   ├── data-migrations/ # Data migration scripts
│   │   └── migrations/ # Database schema migration files
│   └── src/          # Generated Prisma client and related code
│       └── __generated__/ # Generated code
│           └── fabbrica/ # Fabbrica related generated code
└── test/             # Integration and unit tests
    └── integration/  # Integration tests
```

**Phases and Micro-Tasks** (Granular, max 6h/task; total ~177h):
- **Phase 1: Base Structure (Oct 13-17, ~27h)**: Setup Postgres/Vitest, per-user state reset, interactive utils/gateway. Checkpoint: *menu flow + reset test.
- **Phase 2: Core Features (Oct 18-31, ~60h)**: *start/onboarding, dragon catch/feed/breed/inventory, clan create/join/donate. Parallel: Dragon vs Clan devs.
- **Phase 3: PVP/Events (Nov 1-7, ~40h)**: *attack/matchmaking/sim, leaderboards, events cron (e.g., Olympus). Balance Vitest.
- **Phase 4: Monetization/Deploy (Nov 8-15, ~50h)**: Premium gods/Stripe, full integration/QA, PM2/Docker deploy, Redis cache optional.

Guidelines: Git branches per phase; Vitest >70% coverage; Weekly commits + logs.

### C. References & Citations
- Mezon SDK: https://mezon.ai/docs/mezon-sdk-docs/#mezonclient (Core Concepts).  
- Interactive: https://mezon.ai/docs/mezon-interactive-message/#updating-a-message.  
- GitHub MezonJS: https://github.com/mezonai/mezon-js (Structures: Message.ts).  
- IEEE 830-1998: http://www.math.uaa.alaska.edu/~afkjm/cs401/IEEE830.pdf.  
- NestJS Gateways: https://docs.nestjs.com/websockets/gateways.

---
