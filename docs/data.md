
# Data Document: Gods and Dragons (Modular Configs)

Để dễ mở rộng, tao làm 2 file JSON riêng (copy vào `data/gods.json` và `data/dragons.json` trong project). Mỗi entry có id, name, rarity (common/premium cho gods; common/rare/epic/legendary cho dragons), stats/buffs/skills (JSON cho easy tweak). Load vào code via import, dùng cho spawn/breed/buff calc. Tao giữ balance: Skills proc 30%, counters rõ (Fire > Earth, etc.), underdog niches.

## gods.json
```json
[
  {
    "id": 1,
    "name": "Zeus",
    "rarity": "common",
    "description": "Thunder King - Aggressive ATK focus",
    "buff": {
      "atk": 0.1,
      "perLevel": true
    },
    "skill": {
      "name": "Lightning Strike",
      "effect": "Stun 1 enemy dragon (20% proc/round)",
      "counter": "Grounded enemies (Earth element +10% proc)"
    }
  },
  {
    "id": 2,
    "name": "Hades",
    "rarity": "common",
    "description": "Underworld Lord - Defensive sustain",
    "buff": {
      "def": 0.1,
      "hp": 0.1,
      "perLevel": true
    },
    "skill": {
      "name": "Soul Harvest",
      "effect": "Refund 50% elixir on loss",
      "counter": "No direct counter, but weak vs Fire (burn ignores def)"
    }
  },
  {
    "id": 3,
    "name": "Athena",
    "rarity": "common",
    "description": "Wisdom Warrior - Tactic/breed boost",
    "buff": {
      "breedSuccess": 0.05,
      "lootElixir": 0.1,
      "perLevel": true
    },
    "skill": {
      "name": "Strategy Aura",
      "effect": "+15% team ATK if elements match",
      "counter": "Mixed teams (penalty if mismatch)"
    }
  },
  {
    "id": 4,
    "name": "Poseidon",
    "rarity": "premium",
    "description": "Sea Ruler - Loot farmer",
    "price": 1.99,
    "buff": {
      "lootGold": 0.15,
      "lootElixir": 0.15,
      "flat": 0.05
    },
    "skill": {
      "name": "Tidal Wave",
      "effect": "-20% enemy ATK first round",
      "counter": "Air dodge (evade wave)"
    }
  },
  {
    "id": 5,
    "name": "Apollo",
    "rarity": "premium",
    "description": "Sun Healer - Regen sustain",
    "price": 1.99,
    "buff": {
      "hpRegen": 0.2,
      "flat": 0.05
    },
    "skill": {
      "name": "Solar Flare",
      "effect": "-10% enemy hit rate (blind)",
      "counter": "Earth shield (block light)"
    }
  },
  {
    "id": 6,
    "name": "Ares",
    "rarity": "premium",
    "description": "War God - High risk/reward",
    "price": 1.99,
    "buff": {
      "atkSpeed": 0.12,
      "flat": 0.05
    },
    "skill": {
      "name": "Berserk Rage",
      "effect": "+30% ATK on win, -10% DEF",
      "counter": "Water calm (reduce rage)"
    }
  }
]
```

## dragons.json
```json
{
  "elements": {
    "fire": {"counter": "earth", "bonus": 0.2},
    "earth": {"counter": "air", "bonus": 0.2},
    "water": {"counter": "fire", "bonus": 0.2},
    "air": {"counter": "water", "bonus": 0.2},
    "neutral": {"counter": null, "bonus": 0}
  },
  "dragons": [
    {
      "id": 1,
      "name": "Fire Drake",
      "rarity": "common",
      "element": "fire",
      "baseStats": {"hp": 100, "atk": 25, "def": 15},
      "skills": [
        {"name": "Flame Burst", "effect": "DPS over 2 rounds (proc 30%)", "counter": "water (douse -50%)"}
      ]
    },
    {
      "id": 2,
      "name": "Inferno Wyrm",
      "rarity": "rare",
      "element": "fire",
      "baseStats": {"hp": 200, "atk": 45, "def": 25},
      "skills": [
        {"name": "Blaze Wall", "effect": "Block 1 attack", "counter": "earth (melt wall)"}
      ]
    },
    {
      "id": 3,
      "name": "Vulcan Spawn",
      "rarity": "epic",
      "element": "fire",
      "baseStats": {"hp": 350, "atk": 70, "def": 35},
      "skills": [
        {"name": "Eruption", "effect": "AoE team dmg", "counter": "water (extinguish)"}
      ]
    },
    {
      "id": 4,
      "name": "Phoenix Reborn",
      "rarity": "legendary",
      "element": "fire",
      "baseStats": {"hp": 500, "atk": 100, "def": 50},
      "skills": [
        {"name": "Rebirth", "effect": "Revive once +50% HP", "counter": "earth (quake stun revive)"}
      ]
    },
    {
      "id": 5,
      "name": "Stone Golem",
      "rarity": "common",
      "element": "earth",
      "baseStats": {"hp": 150, "atk": 20, "def": 30},
      "skills": [
        {"name": "Rock Throw", "effect": "Stun 1 round", "counter": "air (dodge throw)"}
      ]
    },
    {
      "id": 6,
      "name": "Terra Beetle",
      "rarity": "rare",
      "element": "earth",
      "baseStats": {"hp": 250, "atk": 40, "def": 40},
      "skills": [
        {"name": "Quake", "effect": "Slow team speed, pierce vip armor", "counter": "fire (melt ground)"}
      ]
    },
    {
      "id": 7,
      "name": "Gaia Guardian",
      "rarity": "epic",
      "element": "earth",
      "baseStats": {"hp": 400, "atk": 65, "def": 45},
      "skills": [
        {"name": "Vine Entangle", "effect": "Immobilize", "counter": "air (evade vines)"}
      ]
    },
    {
      "id": 8,
      "name": "Titan Root",
      "rarity": "legendary",
      "element": "earth",
      "baseStats": {"hp": 550, "atk": 95, "def": 55},
      "skills": [
        {"name": "Regrowth", "effect": "Heal earth allies", "counter": "water (flood roots)"}
      ]
    },
    {
      "id": 9,
      "name": "Aqua Serpent",
      "rarity": "common",
      "element": "water",
      "baseStats": {"hp": 120, "atk": 22, "def": 18},
      "skills": [
        {"name": "Torrent", "effect": "Douse fire skills (-dmg)", "counter": "earth (absorb water)"}
      ]
    },
    {
      "id": 10,
      "name": "Leviathan Spawn",
      "rarity": "rare",
      "element": "water",
      "baseStats": {"hp": 220, "atk": 42, "def": 28},
      "skills": [
        {"name": "Bubble Shield", "effect": "+20% def vs physical", "counter": "air (pop bubbles)"}
      ]
    },
    {
      "id": 11,
      "name": "Kraken Tentacle",
      "rarity": "epic",
      "element": "water",
      "baseStats": {"hp": 380, "atk": 75, "def": 40},
      "skills": [
        {"name": "Ink Cloud", "effect": "Blind", "counter": "fire (evaporate ink)"}
      ]
    },
    {
      "id": 12,
      "name": "Neptune Fury",
      "rarity": "legendary",
      "element": "water",
      "baseStats": {"hp": 520, "atk": 98, "def": 52},
      "skills": [
        {"name": "Tsunami", "effect": "Push back/reset position", "counter": "earth (anchor)"}
      ]
    },
    {
      "id": 13,
      "name": "Wind Sprite",
      "rarity": "common",
      "element": "air",
      "baseStats": {"hp": 90, "atk": 28, "def": 12},
      "skills": [
        {"name": "Gust", "effect": "Dodge +1", "counter": "water (drown wind)"}
      ]
    },
    {
      "id": 14,
      "name": "Storm Harpy",
      "rarity": "rare",
      "element": "air",
      "baseStats": {"hp": 180, "atk": 48, "def": 22},
      "skills": [
        {"name": "Tornado", "effect": "Spin dmg, evade earth", "counter": "fire (disperse wind)"}
      ]
    },
    {
      "id": 15,
      "name": "Zephyr Eagle",
      "rarity": "epic",
      "element": "air",
      "baseStats": {"hp": 320, "atk": 68, "def": 32},
      "skills": [
        {"name": "Lightning Chain", "effect": "Chain to weak enemies", "counter": "earth (ground lightning)"}
      ]
    },
    {
      "id": 16,
      "name": "Tempest Sovereign",
      "rarity": "legendary",
      "element": "air",
      "baseStats": {"hp": 480, "atk": 102, "def": 48},
      "skills": [
        {"name": "Cyclone", "effect": "Suck in + AoE", "counter": "water (calm storm)"}
      ]
    },
    {
      "id": 17,
      "name": "Goblin Dragon",
      "rarity": "common",
      "element": "neutral",
      "baseStats": {"hp": 80, "atk": 15, "def": 10},
      "skills": [
        {"name": "Fumble", "effect": "Random disarm vip (ignore def 1 round)", "counter": "None (underdog niche)"}
      ]
    }
    // Add more up to 50: e.g., id18: Shadow Wraith (neutral epic, Eclipse Veil hide stats)
  ],
  "rarityMultipliers": {
    "common": 1,
    "rare": 1.5,
    "epic": 2,
    "legendary": 2.5
  }
}
```
