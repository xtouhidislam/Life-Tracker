"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  TreePine,
  Sun,
  Moon,
  Cloud,
  Layers,
  Calendar,
  Clock,
  Zap,
  Info,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  PlantSpecies,
  PLANT_SPECIES,
  ForestTreeRecord,
  GRID_SIZE,
  getActiveSessionPlants,
} from "@/lib/focus/forest-data";
import { PlantRenderer, CompanionRenderer } from "@/components/focus/PlantRenderer";

interface IsometricForestIslandProps {
  // Live session props
  isLiveSession?: boolean;
  activeSpeciesId?: string;
  elapsedSeconds?: number;
  targetSeconds?: number;
  onSelectSpecies?: (speciesId: string) => void;

  // Lifetime island props
  trees?: ForestTreeRecord[];
  totalFocusMinutes?: number;
}

export function IsometricForestIsland({
  isLiveSession = false,
  activeSpeciesId = "moon_tree",
  elapsedSeconds = 0,
  targetSeconds = 1500,
  onSelectSpecies,
  trees = [],
  totalFocusMinutes = 0,
}: IsometricForestIslandProps) {
  const [viewMode, setViewMode] = useState<"live" | "lifetime">(
    isLiveSession ? "live" : "lifetime"
  );
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month" | "all">("day");
  const [atmosphere, setAtmosphere] = useState<"day" | "sunset" | "night">("night");
  const [selectedTree, setSelectedTree] = useState<ForestTreeRecord | null>(null);

  // Isometric Projection Geometry
  const tileWidth = 68;
  const tileHeight = 34;
  const originX = 260;
  const originY = 85;
  const cliffDepth = 34;

  // Convert (col, row) to isometric 2D coordinates
  const getIsoCoords = (col: number, row: number) => {
    const x = originX + (col - row) * (tileWidth / 2);
    const y = originY + (col + row) * (tileHeight / 2);
    return { x, y };
  };

  // Atmosphere backgrounds
  const atmosphereStyles = {
    day: {
      bg: "bg-gradient-to-b from-sky-400 via-emerald-800 to-emerald-950",
      ambient: "from-sky-300/20 via-emerald-500/10 to-transparent",
      cloudColor: "rgba(255, 255, 255, 0.4)",
    },
    sunset: {
      bg: "bg-gradient-to-b from-amber-600 via-rose-900 to-slate-950",
      ambient: "from-amber-400/20 via-rose-500/10 to-transparent",
      cloudColor: "rgba(254, 215, 170, 0.35)",
    },
    night: {
      bg: "bg-gradient-to-b from-[#0B251B] via-[#071E16] to-[#04120D]",
      ambient: "from-emerald-500/15 via-teal-500/10 to-transparent",
      cloudColor: "rgba(167, 243, 208, 0.15)",
    },
  }[atmosphere];

  // Live session plants (main tree + companion flora that sprout as session lengthens)
  const { mainTree, companions } = useMemo(() => {
    return getActiveSessionPlants(activeSpeciesId, elapsedSeconds, targetSeconds);
  }, [activeSpeciesId, elapsedSeconds, targetSeconds]);

  // Filtered lifetime trees
  const filteredTrees = useMemo(() => {
    if (viewMode === "live") return [];
    const now = Date.now();
    return trees.filter((tree) => {
      const treeTime = new Date(tree.planted_at).getTime();
      const diffHours = (now - treeTime) / (1000 * 60 * 60);
      if (timeFilter === "day") return diffHours <= 24;
      if (timeFilter === "week") return diffHours <= 168;
      if (timeFilter === "month") return diffHours <= 720;
      return true;
    });
  }, [trees, timeFilter, viewMode]);

  // Combine items to render on the grid
  const gridCells = useMemo(() => {
    const cells: {
      col: number;
      row: number;
      tree?: ForestTreeRecord;
      companion?: (typeof companions)[0];
      isMainLive?: boolean;
    }[] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (viewMode === "live") {
          const isMain = c === mainTree.tile_x && r === mainTree.tile_y;
          const comp = companions.find((p) => p.x === c && p.y === r);
          cells.push({
            col: c,
            row: r,
            tree: isMain ? mainTree : undefined,
            companion: comp,
            isMainLive: isMain,
          });
        } else {
          const tree = filteredTrees.find((t) => t.tile_x === c && t.tile_y === r);
          cells.push({
            col: c,
            row: r,
            tree,
          });
        }
      }
    }

    // Sort using Painter's Algorithm: back tiles (low col+row) rendered first, front tiles overlap
    return cells.sort((a, b) => a.col + a.row - (b.col + b.row));
  }, [viewMode, mainTree, companions, filteredTrees]);

  // Active species definition
  const currentSpecies = useMemo(() => {
    return PLANT_SPECIES.find((s) => s.id === activeSpeciesId) || PLANT_SPECIES[0];
  }, [activeSpeciesId]);

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Island Header Bar (Matching user reference Forest top bar) */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#154D38] text-white shadow-2xs">
            <TreePine className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
              <span>Focus Forest Island</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-[#154D38] font-bold">
                {viewMode === "live" ? "Live Growth" : "Planted Garden"}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              {viewMode === "live"
                ? "The longer you stay in deep work, the more plants and flowers flourish."
                : "Your personal archipelago of completed focus sprints and cultivated trees."}
            </p>
          </div>
        </div>

        {/* View Toggle & Atmosphere Controls */}
        <div className="flex items-center gap-2">
          {/* Live vs Lifetime Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-200/70 border border-zinc-200">
            <button
              onClick={() => setViewMode("live")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "live"
                  ? "bg-[#154D38] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Live Session
            </button>
            <button
              onClick={() => setViewMode("lifetime")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "lifetime"
                  ? "bg-[#154D38] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Full Island
            </button>
          </div>

          {/* Atmosphere Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600">
            <button
              onClick={() => setAtmosphere("day")}
              className={`p-1 rounded-lg transition-colors ${
                atmosphere === "day" ? "bg-amber-100 text-amber-800" : "hover:text-zinc-900"
              }`}
              title="Daylight"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setAtmosphere("sunset")}
              className={`p-1 rounded-lg transition-colors ${
                atmosphere === "sunset" ? "bg-rose-100 text-rose-800" : "hover:text-zinc-900"
              }`}
              title="Sunset"
            >
              <Cloud className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setAtmosphere("night")}
              className={`p-1 rounded-lg transition-colors ${
                atmosphere === "night" ? "bg-indigo-100 text-indigo-800" : "hover:text-zinc-900"
              }`}
              title="Starry Night"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Isometric 3D Visualizer Canvas */}
      <div className={`relative overflow-hidden ${atmosphereStyles.bg} transition-colors duration-700 min-h-[360px] sm:min-h-[420px] flex items-center justify-center p-4`}>
        {/* Ambient atmospheric glow */}
        <div className={`absolute inset-0 bg-gradient-to-t ${atmosphereStyles.ambient} pointer-events-none`} />

        {/* Floating Clouds */}
        <div className="absolute top-6 left-8 opacity-40 animate-pulse pointer-events-none">
          <svg width="70" height="24" viewBox="0 0 70 24">
            <path
              d="M 10 18 Q 5 18 5 13 Q 5 8 13 8 Q 18 2 28 4 Q 38 0 46 6 Q 54 4 58 10 Q 66 10 66 18 Z"
              fill={atmosphereStyles.cloudColor}
            />
          </svg>
        </div>

        <div className="absolute top-12 right-12 opacity-30 pointer-events-none">
          <svg width="60" height="20" viewBox="0 0 60 20">
            <path
              d="M 8 16 Q 3 16 3 11 Q 3 6 11 6 Q 16 1 24 3 Q 32 0 38 5 Q 46 4 50 9 Q 56 9 56 16 Z"
              fill={atmosphereStyles.cloudColor}
            />
          </svg>
        </div>

        {/* SVG Isometric Canvas */}
        <svg
          viewBox="0 0 520 330"
          className="w-full max-w-[560px] h-auto drop-shadow-2xl select-none"
        >
          <defs>
            <linearGradient id="grass-turf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>

            <linearGradient id="cliff-left-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="35%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="cliff-right-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="40%" stopColor="#5E2607" />
              <stop offset="100%" stopColor="#291102" />
            </linearGradient>

            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Island Ground Drop Shadow */}
          <ellipse cx="260" cy="275" rx="190" ry="45" fill="#000000" opacity="0.45" filter="blur(16px)" />

          {/* 3D Earthen Sub-Stratum Cliffs (Cliff Depth Extrusions) */}
          {/* Left Cliff Face (from Left Corner [col:0, row:4] to Bottom Center [col:4, row:4]) */}
          {(() => {
            const leftCorner = getIsoCoords(0, GRID_SIZE - 1);
            const bottomCorner = getIsoCoords(GRID_SIZE - 1, GRID_SIZE - 1);
            const p1x = leftCorner.x - tileWidth / 2;
            const p1y = leftCorner.y + tileHeight / 2;
            const p2x = bottomCorner.x;
            const p2y = bottomCorner.y + tileHeight;

            return (
              <g>
                {/* Left Cliff Polygon */}
                <polygon
                  points={`${p1x},${p1y} ${p2x},${p2y} ${p2x},${p2y + cliffDepth} ${p1x},${p1y + cliffDepth}`}
                  fill="url(#cliff-left-grad)"
                />
                {/* Geological soil strata bands */}
                <path
                  d={`M ${p1x} ${p1y + 12} Q ${(p1x + p2x) / 2} ${(p1y + p2y) / 2 + 10} ${p2x} ${p2y + 12}`}
                  stroke="#A16207"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d={`M ${p1x} ${p1y + 22} Q ${(p1x + p2x) / 2} ${(p1y + p2y) / 2 + 20} ${p2x} ${p2y + 22}`}
                  stroke="#5A2E0C"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                />
              </g>
            );
          })()}

          {/* Right Cliff Face (from Bottom Center [col:4, row:4] to Right Corner [col:4, row:0]) */}
          {(() => {
            const bottomCorner = getIsoCoords(GRID_SIZE - 1, GRID_SIZE - 1);
            const rightCorner = getIsoCoords(GRID_SIZE - 1, 0);
            const p1x = bottomCorner.x;
            const p1y = bottomCorner.y + tileHeight;
            const p2x = rightCorner.x + tileWidth / 2;
            const p2y = rightCorner.y + tileHeight / 2;

            return (
              <g>
                {/* Right Cliff Polygon */}
                <polygon
                  points={`${p1x},${p1y} ${p2x},${p2y} ${p2x},${p2y + cliffDepth} ${p1x},${p1y + cliffDepth}`}
                  fill="url(#cliff-right-grad)"
                />
                {/* Strata lines */}
                <path
                  d={`M ${p1x} ${p1y + 12} Q ${(p1x + p2x) / 2} ${(p1y + p2y) / 2 + 11} ${p2x} ${p2y + 12}`}
                  stroke="#78350F"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d={`M ${p1x} ${p1y + 22} Q ${(p1x + p2x) / 2} ${(p1y + p2y) / 2 + 21} ${p2x} ${p2y + 22}`}
                  stroke="#381504"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                />
              </g>
            );
          })()}

          {/* Grass Turf Tiles & Plants (Sorted Back-to-Front) */}
          {gridCells.map((cell) => {
            const { x: isoX, y: isoY } = getIsoCoords(cell.col, cell.row);

            // Diamond tile SVG path
            const diamondPath = `
              M ${isoX} ${isoY}
              L ${isoX + tileWidth / 2} ${isoY + tileHeight / 2}
              L ${isoX} ${isoY + tileHeight}
              L ${isoX - tileWidth / 2} ${isoY + tileHeight / 2}
              Z
            `;

            const isCenterTile = cell.col === 2 && cell.row === 2;
            const isClickable = Boolean(cell.tree);

            return (
              <g
                key={`${cell.col}-${cell.row}`}
                className={isClickable ? "cursor-pointer group" : ""}
                onClick={() => {
                  if (cell.tree) setSelectedTree(cell.tree);
                }}
              >
                {/* Diamond Grass Turf Tile */}
                <path
                  d={diamondPath}
                  fill="url(#grass-turf-grad)"
                  stroke="#15803D"
                  strokeWidth="0.75"
                  className="transition-colors group-hover:fill-emerald-300"
                />

                {/* Subtle grass blade accents */}
                {(cell.col + cell.row) % 3 === 0 && (
                  <circle cx={isoX - 6} cy={isoY + 14} r="1" fill="#86EFAC" opacity="0.7" />
                )}
                {(cell.col * 2 + cell.row) % 5 === 0 && (
                  <circle cx={isoX + 8} cy={isoY + 18} r="1" fill="#86EFAC" opacity="0.6" />
                )}

                {/* Stepping stone on center live path */}
                {isCenterTile && (
                  <ellipse cx={isoX} cy={isoY + tileHeight / 2 + 2} rx="6" ry="3" fill="#94A3B8" opacity="0.4" />
                )}

                {/* Main Tree (if tile is occupied) */}
                {cell.tree && (
                  <g transform={`translate(${isoX}, ${isoY + tileHeight / 2})`}>
                    <PlantRenderer
                      speciesId={cell.tree.species_id}
                      stage={cell.tree.stage}
                      isActive={cell.isMainLive}
                      scale={1.05}
                    />
                  </g>
                )}

                {/* Companion Plant (if present) */}
                {cell.companion && !cell.tree && (
                  <g transform={`translate(${isoX}, ${isoY + tileHeight / 2})`}>
                    <CompanionRenderer type={cell.companion.type} scale={0.9} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Tree Detail Modal / Tooltip */}
        {selectedTree && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200 shadow-xl text-zinc-900 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">
                  {PLANT_SPECIES.find((s) => s.id === selectedTree.species_id)?.iconEmoji || "🌲"}
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900">
                    {PLANT_SPECIES.find((s) => s.id === selectedTree.species_id)?.name || "Focus Tree"}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Planted on Tile ({selectedTree.tile_x}, {selectedTree.tile_y})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTree(null)}
                className="text-zinc-400 hover:text-zinc-700 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Objective:</span>
                <span className="font-bold text-zinc-900 line-clamp-1 max-w-[170px]">
                  {selectedTree.task_title || "Deep Work"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Sprint Duration:</span>
                <span className="font-bold text-emerald-700">
                  {selectedTree.duration_minutes} Minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Planted:</span>
                <span className="text-zinc-600 font-mono">
                  {new Date(selectedTree.planted_at).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forest Bottom Bar (Stats & Timeline Selectors) */}
      <div className="p-4 sm:p-5 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Lifetime Island Stats Strip (matching Forest app screenshot: 🌲 22  🍂 0) */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌲</span>
            <span className="font-mono font-black text-zinc-900">
              {filteredTrees.length} Trees Planted
            </span>
          </div>

          <span className="text-zinc-300">•</span>

          <div className="flex items-center gap-2">
            <span className="text-sm">🍂</span>
            <span className="font-mono font-bold text-zinc-500">0 Withered</span>
          </div>

          <span className="text-zinc-300">•</span>

          <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
            <Clock className="h-3.5 w-3.5 text-[#154D38]" />
            <span>
              Total:{" "}
              <strong className="text-zinc-900 font-bold">
                {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
              </strong>
            </span>
          </div>
        </div>

        {/* Right: Time Filter Buttons (Day, Week, Month, All) */}
        {viewMode === "lifetime" && (
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs">
            {(["day", "week", "month", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                  timeFilter === filter
                    ? "bg-[#154D38] text-white shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Plant Species Selector (Only in Live Session Mode or for choosing what to plant next) */}
      {onSelectSpecies && (
        <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Choose Plant Species to Cultivate
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">
              Selected: {currentSpecies.name} ({currentSpecies.rarity})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PLANT_SPECIES.map((species) => {
              const isSelected = species.id === activeSpeciesId;
              return (
                <button
                  key={species.id}
                  onClick={() => onSelectSpecies(species.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-white border-[#154D38] ring-2 ring-[#154D38]/20 shadow-sm"
                      : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80"
                  }`}
                >
                  <span className="text-xl">{species.iconEmoji}</span>
                  <span className="text-[11px] font-bold text-zinc-900 line-clamp-1">
                    {species.name.split(" ")[0]}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded-full"
                    style={{
                      backgroundColor: `${species.primaryColor}15`,
                      color: species.primaryColor,
                    }}
                  >
                    {species.rarity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
