import type { BenefitGroup, Cell } from "../content";

export interface IncludedBenefit {
  label: string;
  /** Extra detail for this tier, such as "Early access". */
  detail: string | null;
  /** Whether the benefit first appears, or improves, at this tier. */
  change: "new" | "upgraded" | null;
}

/** The benefits a tier includes, marking what's new or better than the tier below. */
export function benefitsForTier(groups: BenefitGroup[], tierIndex: number): IncludedBenefit[] {
  return groups
    .flatMap((g) => g.benefits)
    .filter((b) => b.cells[tierIndex] !== null)
    .map((b) => {
      const cell = b.cells[tierIndex] as Exclude<Cell, null>;
      const below: Cell = tierIndex > 0 ? b.cells[tierIndex - 1] : cell;
      const change = tierIndex === 0 ? null : below === null ? "new" : below !== cell ? "upgraded" : null;
      return { label: b.label, detail: typeof cell === "string" ? cell : null, change };
    });
}
