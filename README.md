# Mezon Bot: Ember Clash

[![NestJS](https://img.shields.io/badge/NestJS-^10.0-red)](https://nestjs.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-^5.0-blue)](https://www.typescriptlang.org/) [![Postgres](https://img.shields.io/badge/Postgres-^15-green)](https://www.postgresql.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

EmberClash là một bot game RPG casual dành cho nền tảng Mezon, lấy cảm hứng từ FakeRPG (PVP và sưu tầm), TurnipRPG (farming cộng đồng), Dragon City (lai tạo rồng), và Clash of Clans (chiến tranh clan và trophies). Người chơi đóng vai huấn luyện viên rồng, bắt rồng hoang, lai tạo hybrid, nâng cấp qua tài nguyên, và đấu PVP trong clan được bảo hộ bởi các vị thần Hy Lạp. Bot nhấn mạnh tương tác cộng đồng, yếu tố ngẫu nhiên gây nghiện, và cân bằng công bằng (không pay-to-win nặng). Tất cả tương tác dùng interactive messages (embeds + buttons) với update single-message flow, không timers hay auto-gen để tập trung manual engagement.

## Tính Năng Chính (Business Overview)
Bot xây dựng hệ sinh thái nghiện nhưng cân bằng, với tactics > raw power: Element counters (Fire > Earth > Water > Air > Fire, Neutral trung lập), skills proc 30% (có thể counter vip bằng common), và events cuốn hút underdog (dân đen counter vip để leo rank). Core loop: **Bắt rồng hoang → Nuôi/nâng cấp → Lai tạo → Đấu PVP lấy loot/trophies → Donate clan buff gods**. 

- **Rồng (Dragons)**: 50+ loại (elements + rarities: Common 70% spawn, Legendary 2%). Stats scale level * rarity mult (common x1, legendary x2.5). Skills niche (e.g., common Goblin "Fumble" disarm vip). Bắt: Spawn random 5-10/giờ ở #wild channel, tốn 10 gems (cap 5/ngày), RNG seeded fair. Nuôi: *feed absorb elixir (500/lvl, instant). Lai tạo: *breed 2 Lv1+ (200 gold, 20% fail Goblin, +bonus element match).
  
- **Clan & Gods**: 1 clan/user. *createclan <name>: Chọn common god qua buttons (Zeus +ATK, Hades +DEF, Athena +breed). Donate elixir pool upgrade level (+10%/lvl buff). Premium gods ($1.99 Stripe: Poseidon +loot, Apollo +regen, Ares +risk/reward). Swap free qua events.

- **PVP & Trophies**: *attack (100 gold search). Matchmaking progressive: Bắt đầu ±50 trophies, expand ±100/200/... nếu queue >10s (max ±500). Team 5 dragons (Lv1+). Sim 5 rounds: Damage = ATK * godBuff * elementBonus - DEF, skills proc. Trophies: Base ±20-30, adjust diff (win higher: +more, lose lower: -less, giống Clash). History/leaderboards embed.

- **Events (Cron weekly/seasonal)**: Cuốn retain qua FOMO + tactics. Ví dụ: Olympus Festival (double rares, element twist); Underdog Uprising (force vs higher, ban vip); Clan Pantheon War (clan donate + PVP proxy); Mythic Eclipse (neutral only, hidden counters); Hero's Forge (daily quests chain). Rewards: Gems, free god trial, exclusive dragons (có weakness).

- **Economy & Balance**: Resources từ loot/donate (gold battle, elixir upgrades, gems rare 1%). RNG seeded (clanId + userId + timestamp). Cân bằng: Tactics 60% win (counters/skills), power 40%; underdog shine (common counter vip); events accessible, premium chỉ +5% edge.

Chi tiết data gods/dragons/events ở [data.md](docs/data.md) + [srs.md](docs/srs.md).

## Tech Stack & Architecture
- **Backend**: NestJS (modular: modules per feature như DragonModule), TypeORM (Postgres entities/relations/migrations), Mezon SDK (sockets/events).
- **Reusables**: Per-user state stack (in-memory Map, reset on new *command tránh leak channels); Interactive updates (IInteractiveMessageProps via message.update()); Seeded RNG (seedrandom); Cron (@nestjs/schedule) cho spawns/events.
- **Testing**: Vitest (>70% coverage).
- **Deployment**: PM2 + Docker (Postgres local); Optional Redis cache Phase 4.
- **Structure**:
  ```
  src/
  ├── app.module.ts     # Imports features
  ├── gateways/         # MezonGateway (onMessage/onButtonClick)
  ├── modules/          # OnboardingModule, DragonModule, etc.
  ├── entities/         # User, Dragon, Clan (TypeORM)
  ├── utils/            # embed.util.ts, state.manager.ts, rng.util.ts
  ├── data/             # gods.json, dragons.json
  └── migrations/       # TypeORM scripts
  ```

## Quick Start
### Prerequisites
- Node.js v20+.
- Postgres (Docker: `docker-compose up`).
- Mezon token (.env: MEZON_TOKEN, PG_URI, STRIPE_SECRET).

### Setup
```bash
git clone <repo>
cd emberclash-bot
pnpm install
cp .env.example .env  # Fill tokens
pnpm migration:run    # TypeORM migrations
pnpm dev              # NestJS dev mode + Vitest watch
```

### Run Tests
```bash
pnpm test             # Vitest all
pnpm test:watch       # Interactive watch
```

Test flow: *start → menu embed → Click Dragons → Update sub-embed → *menu elsewhere (reset state).

### Commands & Interactions
- Prefix "*": *start (onboard), *menu (main), *feed <id> <amt>, *breed <d1> <d2>, *createclan <name>, *joincclan <id>, *donate <amt>, *attack, *leaderboard <personal/clan>, *inventory, *buypremiumgod <god>.
- Buttons: PVP (sub: Search/Assign), Dragons (Inventory/Feed/Breed), Clan (Donate/Join), Go Back/Menu (stack nav).
- Events: Auto-notify channels (e.g., "Olympus Festival starts!").

## Contributing
1. Fork repo, branch `feature/xxx`.
2. Commit small (Vitest pass >70%).
3. PR: Describe changes + Vitest logs.
4. Add data: Append `data.md` (balance check: Sim 1k battles).

Issues: Balance tweaks, new events/dragons (e.g., add counter skill).

## Deployment
- Prod: PM2 `ecosystem.config.js` + VPS.
- Env: WILD_CHANNEL_ID (community #wild).
- Scale: Redis for state cache (Phase 4).

## License
MIT - See [LICENSE](LICENSE).

---

**SRS đầy đủ**: Xem [docs/srs.md](docs/srs.md) cho requirements traceable. Data modular: [data.md](data/gods.json). Cảm ơn contribute—hãy làm EmberClash nghiện hơn! 🚀