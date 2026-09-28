/**
 * LifeQuest Focus Forest Data & Growth Models
 *
 * Implements isometric plant species, growth stages (seed -> sprout -> sapling -> mature),
 * and dynamic multi-plant generation algorithms based on session duration.
 */

export type PlantGrowthStage = "seed" | "sprout" | "sapling" | "mature";

export interface PlantSpecies {
  id: string;
  name: string;
  category: "Celestial" | "Blossom" | "Conifer" | "Ancient" | "Bonsai" | "Botanical";
  description: string;
  iconEmoji: string;
  primaryColor: string;
  accentColor: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  minDurationMinutes: number;
}

export interface ForestTreeRecord {
  id: string;
  species_id: string;
  tile_x: number; // 0 to 4 (5x5 grid)
  tile_y: number; // 0 to 4 (5x5 grid)
  stage: PlantGrowthStage;
  duration_minutes: number;
  task_title: string;
  planted_at: string;
  is_companion?: boolean;
  companion_type?: "flower" | "shrub" | "mushroom" | "baby_tree";
}

export const PLANT_SPECIES: PlantSpecies[] = [
  {
    id: "moon_tree",
    name: "Celestial Moon Tree",
    category: "Celestial",
    description: "Enchanted midnight tree bearing a glowing golden crescent moon, blooming under deep focus.",
    iconEmoji: "🌙",
    primaryColor: "#2563EB",
    accentColor: "#FBBF24",
    rarity: "Legendary",
    minDurationMinutes: 25,
  },
  {
    id: "sakura",
    name: "Spring Cherry Blossom",
    category: "Blossom",
    description: "Graceful Japanese sakura with tiered pastel pink petals and delicate floating blossoms.",
    iconEmoji: "🌸",
    primaryColor: "#EC4899",
    accentColor: "#FCE7F3",
    rarity: "Rare",
    minDurationMinutes: 15,
  },
  {
    id: "sweet_chestnut",
    name: "Sweet Blossom Chestnut",
    category: "Blossom",
    description: "Cream blossom crown with sweet golden undertones and warm harvest bark.",
    iconEmoji: "🧁",
    primaryColor: "#F59E0B",
    accentColor: "#FEF08A",
    rarity: "Rare",
    minDurationMinutes: 25,
  },
  {
    id: "emerald_pine",
    name: "Highland Emerald Pine",
    category: "Conifer",
    description: "Stately geometric evergreen pine with crisp tiered needles, symbolizing unwavering grit.",
    iconEmoji: "🌲",
    primaryColor: "#059669",
    accentColor: "#34D399",
    rarity: "Common",
    minDurationMinutes: 5,
  },
  {
    id: "golden_ginkgo",
    name: "Golden Solstice Ginkgo",
    category: "Ancient",
    description: "Ancient sacred tree with fan-shaped leaves that radiate glowing amber gold in the light.",
    iconEmoji: "🍁",
    primaryColor: "#D97706",
    accentColor: "#FDE68A",
    rarity: "Epic",
    minDurationMinutes: 50,
  },
  {
    id: "zen_bonsai",
    name: "Master Zen Bonsai",
    category: "Bonsai",
    description: "Carefully sculpted miniature evergreen, embodying tranquility and mindful persistence.",
    iconEmoji: "🪴",
    primaryColor: "#047857",
    accentColor: "#6EE7B7",
    rarity: "Epic",
    minDurationMinutes: 30,
  },
  {
    id: "crystal_fern",
    name: "Star Aurora Fern",
    category: "Botanical",
    description: "Mystical glowing teal fern emitting gentle bioluminescent pulses of focus energy.",
    iconEmoji: "✨",
    primaryColor: "#0284C7",
    accentColor: "#38BDF8",
    rarity: "Legendary",
    minDurationMinutes: 50,
  },
  {
    id: "sunburst_berry",
    name: "Sunburst Berry Bush",
    category: "Botanical",
    description: "Clustering lush shrub populated with ruby red wild berries and fresh green foliage.",
    iconEmoji: "🫐",
    primaryColor: "#DC2626",
    accentColor: "#10B981",
    rarity: "Common",
    minDurationMinutes: 10,
  },
];

export const GRID_SIZE = 5; // 5x5 grid = 25 isometric tiles

/**
 * Calculates current plant stage based on session percentage (0 - 100).
 */
export function getPlantGrowthStage(progressPct: number): PlantGrowthStage {
  if (progressPct < 15) return "seed";
  if (progressPct < 45) return "sprout";
  if (progressPct < 80) return "sapling";
  return "mature";
}

/**
 * Coordinates on the 5x5 grid for procedural companion plant placements.
 * Center is tile (2, 2) which is the primary active focus tree.
 */
const COMPANION_SLOTS = [
  { x: 1, y: 2, type: "flower" as const, minSecs: 120 },   // 2m: clover/flowers
  { x: 3, y: 2, type: "flower" as const, minSecs: 300 },   // 5m: daisies
  { x: 2, y: 1, type: "mushroom" as const, minSecs: 600 }, // 10m: mushrooms
  { x: 2, y: 3, type: "shrub" as const, minSecs: 900 },    // 15m: berry shrub
  { x: 1, y: 1, type: "baby_tree" as const, minSecs: 1300 }, // 21m: small tree
  { x: 3, y: 3, type: "baby_tree" as const, minSecs: 1800 }, // 30m: companion tree
  { x: 0, y: 2, type: "shrub" as const, minSecs: 2400 },    // 40m: wild bush
  { x: 4, y: 2, type: "baby_tree" as const, minSecs: 3000 }, // 50m: pine
  { x: 2, y: 0, type: "flower" as const, minSecs: 3600 },   // 60m: floral patch
  { x: 2, y: 4, type: "shrub" as const, minSecs: 4200 },    // 70m: shrub
  { x: 0, y: 0, type: "baby_tree" as const, minSecs: 4800 }, // 80m: corner tree
  { x: 4, y: 4, type: "baby_tree" as const, minSecs: 5400 }, // 90m: corner tree
];

export interface CompanionPlant {
  x: number;
  y: number;
  type: "flower" | "shrub" | "mushroom" | "baby_tree";
  speciesId: string;
  stage: PlantGrowthStage;
}

/**
 * Generates dynamic companion plants that sprout as session progresses.
 * The longer the focus session, the more plants and trees appear!
 */
export function getActiveSessionPlants(
  activeSpeciesId: string,
  elapsedSeconds: number,
  targetSeconds: number
): { mainTree: ForestTreeRecord; companions: CompanionPlant[] } {
  const progressPct = Math.min(100, Math.round((elapsedSeconds / Math.max(1, targetSeconds)) * 100));
  const mainStage = getPlantGrowthStage(progressPct);

  const mainTree: ForestTreeRecord = {
    id: "live-active-tree",
    species_id: activeSpeciesId,
    tile_x: 2,
    tile_y: 2, // Centered on island
    stage: mainStage,
    duration_minutes: Math.round(elapsedSeconds / 60),
    task_title: "Active Focus Sprint",
    planted_at: new Date().toISOString(),
  };

  const companions: CompanionPlant[] = [];

  // Determine how many companions have sprouted based on elapsed time and target
  for (const slot of COMPANION_SLOTS) {
    if (elapsedSeconds >= slot.minSecs) {
      // Determine growth stage of companion plant
      const timeSinceSpawn = elapsedSeconds - slot.minSecs;
      let stage: PlantGrowthStage = "sprout";
      if (timeSinceSpawn > 600) stage = "sapling";
      if (timeSinceSpawn > 1200) stage = "mature";

      // Alternate species for visual richness
      const speciesList = ["sakura", "emerald_pine", "sweet_chestnut", "golden_ginkgo", "moon_tree"];
      const speciesId = speciesList[(slot.x + slot.y) % speciesList.length];

      companions.push({
        x: slot.x,
        y: slot.y,
        type: slot.type,
        speciesId,
        stage,
      });
    }
  }

  return { mainTree, companions };
}

/**
 * Default starter forest so the user immediately sees a populated island
 * reminiscent of the Forest app screenshot.
 */
export const DEFAULT_ISLAND_TREES: ForestTreeRecord[] = [
  {
    id: "init-tree-1",
    species_id: "moon_tree",
    tile_x: 1,
    tile_y: 1,
    stage: "mature",
    duration_minutes: 50,
    task_title: "FastAPI Backend Architecture",
    planted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "init-tree-2",
    species_id: "moon_tree",
    tile_x: 3,
    tile_y: 1,
    stage: "mature",
    duration_minutes: 50,
    task_title: "PostgreSQL Database Schema",
    planted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "init-tree-3",
    species_id: "sakura",
    tile_x: 2,
    tile_y: 0,
    stage: "mature",
    duration_minutes: 25,
    task_title: "Docker Container Setup",
    planted_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "init-tree-4",
    species_id: "sweet_chestnut",
    tile_x: 0,
    tile_y: 2,
    stage: "mature",
    duration_minutes: 35,
    task_title: "Next.js UI Refactoring",
    planted_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "init-tree-5",
    species_id: "moon_tree",
    tile_x: 2,
    tile_y: 2,
    stage: "mature",
    duration_minutes: 60,
    task_title: "Deep Work AI Sprint",
    planted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "init-tree-6",
    species_id: "emerald_pine",
    tile_x: 4,
    tile_y: 2,
    stage: "mature",
    duration_minutes: 25,
    task_title: "TypeScript Lint & Tests",
    planted_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "init-tree-7",
    species_id: "moon_tree",
    tile_x: 1,
    tile_y: 3,
    stage: "mature",
    duration_minutes: 50,
    task_title: "Vector Embeddings Pipeline",
    planted_at: new Date().toISOString(),
  },
  {
    id: "init-tree-8",
    species_id: "sakura",
    tile_x: 3,
    tile_y: 3,
    stage: "mature",
    duration_minutes: 25,
    task_title: "Frontend Micro-Animations",
    planted_at: new Date().toISOString(),
  },
  {
    id: "init-tree-9",
    species_id: "sweet_chestnut",
    tile_x: 2,
    tile_y: 4,
    stage: "mature",
    duration_minutes: 30,
    task_title: "System Design Literature",
    planted_at: new Date().toISOString(),
  },
  {
    id: "init-tree-10",
    species_id: "moon_tree",
    tile_x: 0,
    tile_y: 4,
    stage: "mature",
    duration_minutes: 45,
    task_title: "Trading Journal & Chart Review",
    planted_at: new Date().toISOString(),
  },
  {
    id: "init-tree-11",
    species_id: "golden_ginkgo",
    tile_x: 4,
    tile_y: 0,
    stage: "mature",
    duration_minutes: 90,
    task_title: "Flagship Capstone Project",
    planted_at: new Date().toISOString(),
  },
  {
    id: "init-tree-12",
    species_id: "zen_bonsai",
    tile_x: 4,
    tile_y: 4,
    stage: "mature",
    duration_minutes: 45,
    task_title: "Mindfulness & Code Review",
    planted_at: new Date().toISOString(),
  },
];
