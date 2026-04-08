

## Color System Overhaul: Clinical → Gamified

### Goal
Replace the blue-dominant clinical palette with an energetic purple/orange/green system that feels like a startup game.

### Color Mapping

**#6C5CE7 (purple)** in HSL ≈ `255 74% 64%` — new primary
**#F97316 (orange)** in HSL ≈ `25 95% 53%` — new accent  
**#22C55E (green)** in HSL ≈ `142 71% 45%` — progress/success

### Changes

#### 1. `src/index.css` — CSS Variables

**Light mode:**
- `--primary`: `210 78% 46%` → `255 74% 64%` (purple)
- `--ring`: same purple
- `--accent`: `210 60% 94%` → `25 90% 94%` (warm orange tint)
- `--accent-foreground`: `210 78% 36%` → `25 95% 40%` (orange)
- `--sim-info`: keep as `210 78% 46%` (blue stays for info/secondary)
- `--sim-success`: `152 68% 38%` → `142 71% 45%` (green)
- `--chart-1`: update to purple
- Sidebar primary: update to purple
- Add new custom property `--progress` for green: `142 71% 45%`

**Dark mode:** same shifts with slightly brighter/lighter values.

#### 2. `src/index.css` — Utility Classes

- `.sim-gradient`: `blue→teal` → `purple→blue` (`hsl(255 74% 64%)` → `hsl(220 70% 50%)`)
- `.sim-gradient-text`: same
- `.glow-primary`: update to purple hsl values
- `.gradient-explorer`: update to purple tones
- Add `.glow-hover` utility for button hover glow effect

#### 3. `tailwind.config.ts` — Add Colors

- Add `progress` color token mapped to `hsl(var(--progress))`
- Add `accent-orange` mapped to the orange accent for explicit use

#### 4. `src/components/ui/progress.tsx` — Green + Animation

- Change default indicator color from `bg-primary` to green (`bg-emerald-500` or the new progress token)
- Add CSS transition for width changes (already has `transition-all`, just ensure smooth)
- Add a subtle shine/pulse animation on the indicator

#### 5. `src/components/ui/button.tsx` — Hover Glow

- Add hover glow to the default variant: `hover:shadow-[0_0_20px_hsl(255_74%_64%/0.3)]`
- Slightly brighten on hover via `hover:bg-primary/95` or a brighter shade

### Files to Edit
1. `src/index.css` — CSS variables + utility classes
2. `tailwind.config.ts` — add progress/accent-orange tokens
3. `src/components/ui/progress.tsx` — green bar + shine animation
4. `src/components/ui/button.tsx` — hover glow on default variant

### What stays blue
- `--sim-info` (info badges, secondary elements)
- `.gradient-explorer` keeps a blue accent in its gradient
- Chart colors 2-5 unchanged

### What doesn't change
- No layout, routing, database, or component structure changes
- No text content changes
- XP gold system stays amber/gold

