"use client";

import React from "react";
import { PlantGrowthStage } from "@/lib/focus/forest-data";

interface PlantRendererProps {
  speciesId: string;
  stage: PlantGrowthStage;
  isActive?: boolean;
  scale?: number;
}

export function PlantRenderer({
  speciesId,
  stage,
  isActive = false,
  scale = 1,
}: PlantRendererProps) {
  // 1. Stage: Seed
  if (stage === "seed") {
    return (
      <g transform={`scale(${scale})`}>
        {/* Soil mound */}
        <ellipse cx="0" cy="0" rx="14" ry="7" fill="#5A3A1A" opacity="0.9" />
        <ellipse cx="0" cy="-2" rx="10" ry="5" fill="#784B24" />
        {/* Seed pod */}
        <ellipse cx="0" cy="-3" rx="4" ry="2.5" fill="#15803D" />
        {/* Tiny dew highlight */}
        <circle cx="1" cy="-4" r="1.5" fill="#86EFAC" />
        {isActive && (
          <ellipse
            cx="0"
            cy="0"
            rx="18"
            ry="9"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="animate-spin origin-center"
          />
        )}
      </g>
    );
  }

  // 2. Stage: Sprout
  if (stage === "sprout") {
    return (
      <g transform={`scale(${scale})`}>
        {/* Soil mound */}
        <ellipse cx="0" cy="0" rx="12" ry="6" fill="#5A3A1A" />
        <ellipse cx="0" cy="-1.5" rx="8" ry="4" fill="#784B24" />
        {/* Tender stem */}
        <path d="M 0 -2 Q 0 -12 -1 -16" stroke="#16A34A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Left leaf */}
        <path d="M -1 -12 Q -8 -16 -6 -8 Q -3 -8 -1 -12" fill="#22C55E" />
        {/* Right leaf */}
        <path d="M -1 -15 Q 7 -19 6 -11 Q 3 -11 -1 -15" fill="#4ADE80" />
        {/* Dew drop */}
        <circle cx="4" cy="-15" r="1.5" fill="#BAE6FD" />
      </g>
    );
  }

  // 3. Stage: Sapling
  if (stage === "sapling") {
    return (
      <g transform={`scale(${scale})`}>
        {/* Ground shadow */}
        <ellipse cx="0" cy="0" rx="14" ry="7" fill="#3E2723" opacity="0.4" />
        {/* Slender trunk */}
        <path d="M -2 0 L -1 -18 L 1 -18 L 2 0 Z" fill="#8D6E63" />
        {/* Foliage based on species family */}
        {speciesId === "moon_tree" ? (
          <g>
            <circle cx="0" cy="-22" r="10" fill="#2563EB" />
            <circle cx="-5" cy="-20" r="7" fill="#1D4ED8" />
            <circle cx="5" cy="-20" r="7" fill="#3B82F6" />
            <circle cx="1" cy="-24" r="2.5" fill="#FBBF24" />
          </g>
        ) : speciesId === "sakura" ? (
          <g>
            <circle cx="0" cy="-22" r="10" fill="#F472B6" />
            <circle cx="-5" cy="-20" r="7" fill="#FBCFE8" />
            <circle cx="5" cy="-20" r="7" fill="#EC4899" />
          </g>
        ) : (
          <g>
            <circle cx="0" cy="-22" r="10" fill="#10B981" />
            <circle cx="-6" cy="-20" r="7" fill="#059669" />
            <circle cx="6" cy="-20" r="7" fill="#34D399" />
          </g>
        )}
      </g>
    );
  }

  // 4. Stage: Mature Tree (Full Detailed Botanical Vector Artwork)
  return (
    <g transform={`scale(${scale})`}>
      {/* Soft ground shadow */}
      <ellipse cx="0" cy="2" rx="20" ry="10" fill="#0F2D1F" opacity="0.5" />

      {/* Species-specific Rendering */}
      {speciesId === "moon_tree" && (
        <g>
          {/* Trunk */}
          <path d="M -4 2 Q -2 -14 -1 -22 L 2 -22 Q 3 -14 5 2 Z" fill="#5D4037" />
          <path d="M -1 -22 Q -8 -30 -14 -32 L -12 -34 Q -6 -32 0 -24" fill="#4E342E" />
          <path d="M 1 -22 Q 8 -29 13 -30 L 12 -33 Q 6 -31 0 -24" fill="#4E342E" />

          {/* Indigo & Royal Blue Canopy Puffs */}
          <g filter="url(#drop-shadow)">
            {/* Bottom darker layer */}
            <circle cx="-12" cy="-32" r="12" fill="#1E3A8A" />
            <circle cx="12" cy="-32" r="12" fill="#1E3A8A" />
            <circle cx="0" cy="-30" r="14" fill="#1D4ED8" />

            {/* Mid vibrant layer */}
            <circle cx="-10" cy="-38" r="11" fill="#2563EB" />
            <circle cx="10" cy="-38" r="11" fill="#3B82F6" />
            <circle cx="0" cy="-42" r="13" fill="#60A5FA" />

            {/* Top highlight puffs */}
            <circle cx="-4" cy="-44" r="8" fill="#93C5FD" opacity="0.8" />
            <circle cx="6" cy="-44" r="7" fill="#BFDBFE" opacity="0.7" />
          </g>

          {/* Luminous Golden Crescent Moon */}
          <g transform="translate(0, -36)">
            {/* Soft celestial glow */}
            <circle cx="0" cy="0" r="9" fill="#FDE047" opacity="0.3" className="animate-pulse" />
            {/* Golden crescent body */}
            <path
              d="M 5 -7 A 8 8 0 1 1 -5 5 A 6.5 6.5 0 1 0 5 -7 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="0.75"
            />
            {/* Tiny stars */}
            <circle cx="-8" cy="-5" r="1" fill="#FEF08A" />
            <circle cx="8" cy="-3" r="0.8" fill="#FEF08A" />
            <circle cx="5" cy="7" r="1" fill="#FEF08A" />
          </g>
        </g>
      )}

      {speciesId === "sakura" && (
        <g>
          {/* Slender curved Japanese cherry trunk */}
          <path d="M -3 2 Q 0 -14 -2 -24 L 2 -24 Q 4 -12 4 2 Z" fill="#4E342E" />
          <path d="M -1 -20 Q -9 -28 -16 -30" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 1 -20 Q 9 -28 15 -29" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Tiered Pastel Pink Blossom Clouds */}
          <circle cx="-13" cy="-30" r="11" fill="#DB2777" />
          <circle cx="13" cy="-29" r="11" fill="#EC4899" />
          <circle cx="0" cy="-28" r="13" fill="#F472B6" />

          <circle cx="-10" cy="-38" r="11" fill="#F472B6" />
          <circle cx="10" cy="-38" r="10" fill="#F9A8D4" />
          <circle cx="0" cy="-42" r="12" fill="#FBCFE8" />

          {/* Highlight petals */}
          <circle cx="-3" cy="-44" r="6" fill="#FDF2F8" />
          <circle cx="5" cy="-43" r="5" fill="#FFFFFF" opacity="0.9" />

          {/* Blossom dots */}
          <circle cx="-8" cy="-34" r="1.5" fill="#BE185D" />
          <circle cx="7" cy="-33" r="1.5" fill="#BE185D" />
          <circle cx="1" cy="-37" r="1.5" fill="#BE185D" />

          {/* Drifting petal particles */}
          <ellipse cx="14" cy="-18" rx="2" ry="1" fill="#F472B6" transform="rotate(25 14 -18)" />
          <ellipse cx="-16" cy="-16" rx="2" ry="1" fill="#FBCFE8" transform="rotate(-30 -16 -16)" />
        </g>
      )}

      {speciesId === "sweet_chestnut" && (
        <g>
          {/* Whimsical Cream Blossom Tree (inspired directly by top center tree in user screenshot) */}
          <path d="M -3 2 L -1 -22 L 2 -22 L 4 2 Z" fill="#6D4C41" />

          {/* Multi-layered cake/cloud blossom canopy */}
          <circle cx="-11" cy="-30" r="11" fill="#F59E0B" />
          <circle cx="11" cy="-30" r="11" fill="#F59E0B" />
          <circle cx="0" cy="-28" r="13" fill="#FBBF24" />

          {/* Cream swirl middle tier */}
          <circle cx="-8" cy="-38" r="10" fill="#FEF08A" />
          <circle cx="8" cy="-38" r="10" fill="#FEF08A" />
          <circle cx="0" cy="-42" r="12" fill="#FFFBEB" />

          {/* Cherry topping on crown */}
          <circle cx="0" cy="-48" r="3.5" fill="#E11D48" />
          <path d="M 0 -51 Q 4 -55 7 -54" stroke="#059669" strokeWidth="1" fill="none" />

          {/* Blossom sprinkle spots */}
          <circle cx="-7" cy="-32" r="1.5" fill="#D97706" />
          <circle cx="6" cy="-32" r="1.5" fill="#D97706" />
          <circle cx="0" cy="-36" r="1.5" fill="#E11D48" />
        </g>
      )}

      {speciesId === "emerald_pine" && (
        <g>
          {/* Brown sturdy trunk */}
          <path d="M -2 2 L -1 -12 L 2 -12 L 3 2 Z" fill="#5D4037" />

          {/* Tier 1 (Bottom broad triangle) */}
          <polygon points="0,-30 -18,-14 18,-14" fill="#064E3B" />
          <polygon points="0,-30 -14,-14 14,-14" fill="#047857" />

          {/* Tier 2 (Middle triangle) */}
          <polygon points="0,-40 -14,-26 14,-26" fill="#047857" />
          <polygon points="0,-40 -11,-26 11,-26" fill="#059669" />

          {/* Tier 3 (Top crest triangle) */}
          <polygon points="0,-50 -10,-37 10,-37" fill="#059669" />
          <polygon points="0,-50 -7,-37 7,-37" fill="#10B981" />

          {/* Snow / light crest tip */}
          <polygon points="0,-51 -3,-46 3,-46" fill="#A7F3D0" />
        </g>
      )}

      {speciesId === "golden_ginkgo" && (
        <g>
          {/* Trunk */}
          <path d="M -3 2 Q 1 -14 -1 -24 L 2 -24 Q 4 -12 4 2 Z" fill="#78350F" />

          {/* Radiant Amber & Gold Canopy */}
          <circle cx="-12" cy="-30" r="11" fill="#B45309" />
          <circle cx="12" cy="-30" r="11" fill="#B45309" />
          <circle cx="0" cy="-28" r="13" fill="#D97706" />

          <circle cx="-9" cy="-38" r="10" fill="#F59E0B" />
          <circle cx="9" cy="-38" r="10" fill="#F59E0B" />
          <circle cx="0" cy="-42" r="12" fill="#FBBF24" />

          <circle cx="-3" cy="-45" r="7" fill="#FDE68A" />
          <circle cx="4" cy="-44" r="6" fill="#FEF3C7" />
        </g>
      )}

      {speciesId === "zen_bonsai" && (
        <g>
          {/* Ceramic shallow planter dish */}
          <polygon points="-12,0 -9,4 9,4 12,0" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

          {/* Twisted Bonsai Trunk */}
          <path
            d="M 0 0 Q -4 -10 2 -16 Q 8 -22 0 -26"
            stroke="#78350F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Jade Foliage Pads */}
          <ellipse cx="-6" cy="-17" rx="8" ry="4" fill="#065F46" />
          <ellipse cx="-6" cy="-18" rx="6" ry="3" fill="#059669" />

          <ellipse cx="6" cy="-23" rx="9" ry="4.5" fill="#047857" />
          <ellipse cx="6" cy="-24" rx="7" ry="3" fill="#10B981" />

          <ellipse cx="0" cy="-28" rx="10" ry="5" fill="#059669" />
          <ellipse cx="0" cy="-30" rx="7" ry="3.5" fill="#34D399" />
        </g>
      )}

      {speciesId === "crystal_fern" && (
        <g>
          {/* Glowing Bioluminescent Fronds */}
          <path d="M 0 2 Q -12 -14 -16 -28" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 0 2 Q 12 -14 16 -28" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 0 2 Q -6 -20 -4 -38" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 0 2 Q 6 -20 4 -38" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Glowing Cyan Pearls */}
          <circle cx="-16" cy="-28" r="3" fill="#38BDF8" />
          <circle cx="16" cy="-28" r="3" fill="#38BDF8" />
          <circle cx="-4" cy="-38" r="3.5" fill="#67E8F9" className="animate-pulse" />
          <circle cx="4" cy="-38" r="3.5" fill="#A5F3FC" className="animate-pulse" />
        </g>
      )}

      {speciesId === "sunburst_berry" && (
        <g>
          {/* Bush base */}
          <ellipse cx="0" cy="-12" rx="15" ry="11" fill="#065F46" />
          <ellipse cx="-6" cy="-18" rx="11" ry="9" fill="#059669" />
          <ellipse cx="6" cy="-18" rx="11" ry="9" fill="#10B981" />
          <ellipse cx="0" cy="-22" rx="10" ry="8" fill="#34D399" />

          {/* Ruby red berries */}
          <circle cx="-8" cy="-14" r="2.5" fill="#EF4444" />
          <circle cx="8" cy="-14" r="2.5" fill="#EF4444" />
          <circle cx="-3" cy="-20" r="2.5" fill="#DC2626" />
          <circle cx="5" cy="-20" r="2.5" fill="#DC2626" />
          <circle cx="0" cy="-15" r="3" fill="#F87171" />
        </g>
      )}

      {/* Active Growth Neon Pulse Ring */}
      {isActive && (
        <g>
          <ellipse
            cx="0"
            cy="0"
            rx="24"
            ry="12"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="animate-pulse"
          />
          <circle cx="0" cy="-56" r="3" fill="#34D399" className="animate-ping" />
        </g>
      )}
    </g>
  );
}

/**
 * Lightweight Companion Plant Renderer (Wildflowers, Shrubs, Mushrooms)
 */
export function CompanionRenderer({
  type,
  scale = 0.8,
}: {
  type: "flower" | "shrub" | "mushroom" | "baby_tree";
  scale?: number;
}) {
  if (type === "flower") {
    return (
      <g transform={`scale(${scale})`}>
        {/* Wildflower clover patch */}
        <circle cx="-4" cy="-3" r="2.5" fill="#F472B6" />
        <circle cx="4" cy="-4" r="2.5" fill="#FBBF24" />
        <circle cx="0" cy="-7" r="3" fill="#60A5FA" />
        <circle cx="0" cy="-7" r="1" fill="#FEF08A" />
        <path d="M 0 0 L 0 -5" stroke="#15803D" strokeWidth="1" />
        <ellipse cx="0" cy="1" rx="5" ry="2.5" fill="#166534" opacity="0.6" />
      </g>
    );
  }

  if (type === "mushroom") {
    return (
      <g transform={`scale(${scale})`}>
        {/* Stalk */}
        <path d="M -2 0 L -1 -6 L 1 -6 L 2 0 Z" fill="#F1F5F9" />
        {/* Red spotted cap */}
        <path d="M -6 -6 Q 0 -13 6 -6 Z" fill="#EF4444" />
        <circle cx="-2" cy="-8" r="0.8" fill="#FFFFFF" />
        <circle cx="2" cy="-8" r="0.8" fill="#FFFFFF" />
        {/* Small companion mushroom */}
        <path d="M 3 0 L 4 -4 L 5 -4 L 6 0 Z" fill="#F1F5F9" />
        <path d="M 2 -4 Q 5 -9 7 -4 Z" fill="#F59E0B" />
      </g>
    );
  }

  if (type === "shrub") {
    return (
      <g transform={`scale(${scale})`}>
        <ellipse cx="0" cy="-4" rx="8" ry="6" fill="#047857" />
        <ellipse cx="0" cy="-6" rx="6" ry="5" fill="#10B981" />
        <circle cx="-2" cy="-5" r="1.5" fill="#EF4444" />
        <circle cx="3" cy="-6" r="1.5" fill="#F59E0B" />
      </g>
    );
  }

  // Baby tree
  return (
    <g transform={`scale(${scale * 0.7})`}>
      <polygon points="0,-22 -9,-8 9,-8" fill="#065F46" />
      <polygon points="0,-16 -7,-4 7,-4" fill="#10B981" />
      <path d="M -1 0 L 1 0" stroke="#78350F" strokeWidth="2" />
    </g>
  );
}
