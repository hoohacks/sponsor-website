# After Hours Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the sponsor site as the approved After Hours design: dark, cinematic, scroll-driven, lightening to morning (Dawn) in the lower half, tied together by faint Blue Ridge ridgelines.

**Architecture:** Each page section is one React component that owns its markup and its scroll motion. A small shared module (`src/lib/scroll.ts`) provides pure progress math plus one `requestAnimationFrame` loop that components subscribe to; it writes only `transform`, `opacity`, `clip-path` and one CSS variable (`--color`) on small elements. Ridgeline geometry is pure math in `src/lib/ridges.ts`, rendered by a `Ridges` component. Content stays in `src/content.ts`.

**Tech Stack:** Vite 8, React 19, TypeScript, plain CSS (`src/styles/global.css`), Vitest + Testing Library (jsdom). No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-11-15-after-hours-redesign-design.md`. Reference prototype: `.superpowers/proto/after-hours-3.html` (+ `shared.js`), served by the dev server at `/.superpowers/proto/after-hours-3.html`. When a task says "match the prototype", open that page beside your build at 1440×900.

## Global Constraints

- No new runtime dependencies. Stack: Vite, React 19, TypeScript, plain CSS in `src/styles/global.css`.
- Scroll code writes only `transform`, `opacity`, `clip-path`, and the `--color` custom property. Never `top`/`left`/`width`/`height`/`filter` per frame.
- Palette: night `#0A1330`, deep `#101B40`, ice `#E8EDF7`, mist `#8E9AB9`, silver `#BCC8E6`, rule `rgba(232,237,247,.12)`. Morning text `#0A1330` / `#4A5677`.
- Dawn gradients: roles night→`#101C46`; tiers `#101C46`→`#172660`→`#26397A`; sponsors `#26397A`→`#4F629C`→`#9FAFD6`→`#C9D3EB`; contact `#C9D3EB`→`#E8EDF7`; footer `#E8EDF7`.
- Fonts: Funnel Display (300 for big figures, 500–600 headings) and Funnel Sans (body), Google Fonts. Manrope removed.
- No orange, no cards, no top navigation, no dot canvas anywhere in the code.
- Copy is plain and factual. Exact strings below are from the spec; don't reword them.
- `prefers-reduced-motion: reduce`: nothing pins or slides, photos in color, headline solid, scroll cue hidden, ridgelines still, packages stacked.
- Phones (`max-width: 760px`): packages stack, roles stack without drift, no sideways page scroll.
- Inquiry form behavior (validation, honeypot, states, "Ask about [tier]" pre-fill) unchanged.
- Commit messages: lowercase, one line, no body, no co-author or AI attribution trailers (repo owner's rule overrides tool defaults). Commit locally; do not push.

## Review Focus

1. **"Ask about Gold" from the sideways rail** should pre-fill the message and land the reader at the form, even though the rail is pinned. Test added in Task 8.
2. **Keyboard users tabbing through the rail**: focusing an off-screen tier's "Ask about" button must bring that tier into view (scroll the page to that tier's point in the pin). Test added in Task 8.
3. **Resizing the window mid-page** (or rotating a phone): pinned section heights, rail distance and ridgeline sizes must recompute; nothing should end up cut off. Verified in Task 11.
4. **Reduced motion** must show every section finished and readable, including the headline (solid, not outline) and photos (color). Tests added in Tasks 4 and 8, verified in Task 11.
5. **Narrow phones (360px)**: the huge stats line and the logo rows must not create a sideways page scroll. Verified in Task 11.

---

### Task 1: Content, copy and tier helper

**Files:**
- Modify: `src/content.ts`
- Modify: `src/lib/tiers.ts`
- Test: `src/lib/logic.test.ts`

**Interfaces:**
- Produces: `weekend: { photo: Photo; day: string; time: string; title: string; body: string }[]` (`when` stays until Task 6 removes it, because the old `Weekend.tsx` still reads it); `roles[].tag` unchanged name; `addedAtTier(groups: BenefitGroup[], tierIndex: number): IncludedBenefit[]` in `src/lib/tiers.ts` (all benefits at Bronze; at higher tiers only those with `change !== null`).

- [ ] **Step 1: Write failing tests** in `src/lib/logic.test.ts`:

```ts
describe("addedAtTier", () => {
  it("lists every benefit at Bronze", () => {
    expect(addedAtTier(benefits, 0)).toEqual(benefitsForTier(benefits, 0));
  });
  it("lists only what Gold adds over Silver", () => {
    expect(addedAtTier(benefits, 2).map((b) => b.label)).toEqual(["Social media shoutout", "Resume book"]);
  });
  it("includes upgrades, like the large logo at Platinum", () => {
    expect(addedAtTier(benefits, 3).find((b) => b.label === "Logo on the website")?.change).toBe("upgraded");
  });
});
describe("copy", () => {
  it("uses the plain tier summaries", () => {
    expect(tiers.map((t) => t.pitch)).toEqual([
      "Support the event, send mentors and judges, and put your logo on the website.",
      "Adds a table at the sponsorship fair, the sponsor lounge, and your logo on the T-shirt.",
      "Adds the resume book and a social media shoutout.",
      "Adds a workshop, a sponsored prize, and an email to all attendees after the event.",
      "Adds your own competition track, the keynote, and coffee chats with students.",
    ]);
  });
});
```

- [ ] **Step 2: Run** `npx vitest run src/lib/logic.test.ts`. Expected: FAIL (`addedAtTier` not exported, pitches differ).

- [ ] **Step 3: Update `src/content.ts`**
  - Tier `pitch` values: the five strings above.
  - `weekend` entries become `{ photo, day, time, title, body }`. Values (day / time / body):
    - hall: `Saturday` / `12:30 PM` / "Everyone meets in the lecture hall. Sponsors can introduce themselves and their challenges."
    - fair-crowd: `Saturday` / `2:00 PM` / "Students visit sponsor tables to ask about jobs, internships, and the tools they can use."
    - late-night: `Overnight` / `3:00 AM` / "Teams work through the night, and mentors help them when they get stuck."
    - judging: `Sunday` / `9:00 AM` / "Each team presents its project to the judges."
    - winners-stage: `Sunday` / `11:00 AM` / "Winners are announced on stage, including the sponsor prizes."
    - Add a comment above `weekend`: `// TODO(confirm): times are placeholders from the prototype; replace with the real 2026 schedule.`
  - `roles`: titles/bodies/tags become
    - Meet students / "Talk with students at the sponsorship fair, hand out swag, and follow up with the resume book." / "Silver and up"
    - Run a workshop / "Teach a technical workshop, or give the keynote at Diamond." / "Platinum and up"
    - Judge and award / "Send mentors and judges, sponsor a prize, or run a competition track at Diamond." / "Every tier"
  - Keep `when` on each `weekend` entry for now. Leave `heroPhotos` and the `Photo` union alone; Task 3 removes `heroPhotos`, and Task 11 prunes unused `Photo` names.

- [ ] **Step 4: Add `addedAtTier`** to `src/lib/tiers.ts` (filter of `benefitsForTier`).

- [ ] **Step 5: Run** `npx vitest run src/lib/logic.test.ts && npx tsc -b`. Expected: PASS, no type errors.

- [ ] **Step 6: Commit** `git commit -m "content: plain copy, weekend times, added-at-tier helper"`

---

### Task 2: Scroll and ridgeline math

**Files:**
- Create: `src/lib/scroll.ts`, `src/lib/ridges.ts`
- Create: `src/lib/scroll.test.ts`
- Modify: `src/test/setup.ts`

**Interfaces:**
- Produces (`src/lib/scroll.ts`):
  - `clamp(v: number): number` (0–1), `ease(t: number): number` (cubic out), `inOut(t: number): number` (cubic in-out), `lerp(a: number, b: number, t: number): number`
  - `pinProgress(r: { top: number; height: number }, vh: number): number` = clamp(−top / max(1, height − vh))
  - `enterProgress(r: { top: number }, vh: number, end = 0.5): number` = clamp((vh − top) / (vh · (1 − end)))
  - `throughProgress(r: { top: number; height: number }, vh: number): number` = clamp((vh − top) / (vh + height))
  - `useScrollFrame(cb: () => void): void`: subscribes `cb` to one shared rAF loop that runs on `scroll`, `resize` and `load`; does nothing (never calls `cb`) when `matchMedia("(prefers-reduced-motion: reduce)")` matches.
  - `useMediaQuery(query: string): boolean` (updates on change).
  - `scrollToPin(el: HTMLElement, p: number): void`: scrolls the window to `p` of the way through a pinned section.
  - `REDUCED = "(prefers-reduced-motion: reduce)"`, `PHONE = "(max-width: 760px)"`.
- Produces (`src/lib/ridges.ts`):
  - `ridgeLines(o: { width: number; height: number; layers: number; seed: number; step?: number }): number[][]`: one array of y values per layer (x = index · step, step default 12, width covers `width · 1.3`).
  - `toPath(ys: number[], step = 12): string`: `"M0 y0L12 y1…"`.

- [ ] **Step 1: Add a `matchMedia` stub** to `src/test/setup.ts` (jsdom lacks it): returns `{ matches: false, addEventListener() {}, removeEventListener() {} }` unless a test overrides `window.matchMedia`.

- [ ] **Step 2: Write failing tests** in `src/lib/scroll.test.ts`:

```ts
it("pin progress runs 0 to 1 across the extra height", () => {
  expect(pinProgress({ top: 0, height: 3000 }, 1000)).toBe(0);
  expect(pinProgress({ top: -1000, height: 3000 }, 1000)).toBe(0.5);
  expect(pinProgress({ top: -2500, height: 3000 }, 1000)).toBe(1);
});
it("enter progress finishes when the top is halfway up", () => {
  expect(enterProgress({ top: 1000 }, 1000)).toBe(0);
  expect(enterProgress({ top: 500 }, 1000)).toBe(1);
});
it("ridges nest: every layer stays below the one behind it", () => {
  const lines = ridgeLines({ width: 1200, height: 400, layers: 6, seed: 11 });
  expect(lines).toHaveLength(6);
  for (let i = 1; i < lines.length; i++)
    lines[i].forEach((y, k) => expect(y).toBeGreaterThanOrEqual(lines[i - 1][k] + 400 * 0.022 - 1e-9));
});
it("ridges are deterministic for a seed", () => {
  expect(ridgeLines({ width: 800, height: 300, layers: 4, seed: 3 })).toEqual(ridgeLines({ width: 800, height: 300, layers: 4, seed: 3 }));
});
it("useScrollFrame never calls back under reduced motion", () => { /* override matchMedia to match REDUCED, render a component using the hook, dispatch scroll, assert cb not called */ });
```

- [ ] **Step 3: Run** `npx vitest run src/lib/scroll.test.ts`. Expected: FAIL (modules missing).

- [ ] **Step 4: Implement `src/lib/scroll.ts`** per the interfaces. The loop: one module-level `Set` of callbacks, one `raf` id, listeners added on first subscribe and removed when the set empties.

- [ ] **Step 5: Implement `src/lib/ridges.ts`.** Port `ridgeSvg` from `.superpowers/proto/after-hours-3.html` (seeded generator `seed = seed * 16807 % 2147483647`; per layer: base `h·(0.3 + 0.62·i/(n−1))`, tall `h·0.15·(1 − 0.09·i)`, main term `tall·(0.5+0.5·sin)^1.6` plus `h·0.035` and `h·0.01` sines; clamp `y ≥ prev[k] + h·0.022`).

- [ ] **Step 6: Run** `npx vitest run`. Expected: PASS (all files).

- [ ] **Step 7: Commit** `git commit -m "add scroll and ridgeline helpers"`

---

### Task 3: Clear the old site and lay the foundation

**Files:**
- Delete: `src/components/Nav.tsx`, `src/components/Crowd.tsx`, `src/lib/crowd.ts`, `src/components/CountUp.tsx`, `src/lib/reveal.ts`, `src/components/StatsSentence.tsx`
- Modify: `src/lib/logic.test.ts` (remove the `crowd map` describe and its import), `index.html`, `src/App.tsx`, `src/styles/global.css`
- Create: `src/components/DuoPhoto.tsx`, `src/components/Ridges.tsx`, `src/App.test.tsx`

**Interfaces:**
- Produces: `DuoPhoto({ name: Photo; alt: string; sizes: string; className?: string; loading?: "lazy" | "eager" })`, which renders `<div class="duo"><img …/><img class="duo__bw" alt="" aria-hidden …/></div>`. The grayscale layer's opacity is `calc(1 - var(--color, 1))`, so a parent sets `--color` (0 = black and white, 1 = color). Default with no variable set is full color.
- Produces: `Ridges({ seed: number; layers: number; drift: "x" | "y"; className?: string })`. It sizes itself to its box (ResizeObserver; redraws on resize), finds its closest `section`, and in `useScrollFrame` translates paths: `"x"` uses `pinProgress` with `translateX(−p · vw · (0.22 + 0.02·k))`; `"y"` uses `throughProgress` with `translate(−p · vw · 0.06, (0.5 − p) · 24 · k px)` (k = (i+1)/layers). It fades in by `clamp(enterProgress · 1.5)`. Stroke color comes from CSS `--lc`, and per-layer stroke opacity is `0.07 + 0.17·i/(n−1)`, times `--lo`.
- Produces: `App` renders, in order, `Hero`, `StatsLine`, `Weekend`, `Roles`, `Tiers`, `Logos`, `Contact`, `Footer` inside `<main>`. Replace `Hero`, `Weekend`, `Roles` and `Logos` with placeholders (just `<section id=…>`; the old ones depend on deleted code) and create `StatsLine` as a placeholder; keep the existing `Tiers`, `Contact` and `Footer` working until their tasks. Remove `heroPhotos` from `content.ts`. Section ids: `hero`, `stats`, `weekend`, `roles`, `tiers`, `sponsors`, `contact`.

- [ ] **Step 1: Write failing test** `src/App.test.tsx`:

```tsx
it("has no top navigation and keeps the sections in order", () => {
  const { container } = render(<App />);
  expect(screen.queryByRole("navigation", { name: "Sections" })).toBeNull();
  expect([...container.querySelectorAll("main > section")].map((s) => s.id)).toEqual(["hero", "stats", "weekend", "roles", "tiers", "sponsors", "contact"]);
});
```

- [ ] **Step 2: Run** `npx vitest run src/App.test.tsx`. Expected: FAIL.

- [ ] **Step 3: Delete the old files, rebuild `App.tsx`** (keep the `interest` state and the skip link), **swap fonts in `index.html`** (Funnel Display 300–800 + Funnel Sans 400–600; `theme-color` `#0A1330`).

- [ ] **Step 4: Replace `global.css`** with: reset, tokens (Global Constraints palette as `--night` etc.), body (`Funnel Sans` 18px/1.6, ice on night, `overflow-x: clip`), `.wrap` (max 1320px, padding `clamp(20px, 4vw, 64px)`), `h2` (Funnel Display 500, `clamp(40px, 5.6vw, 88px)`, line-height 0.98, letter-spacing −0.04em), pill `.btn` (ice fill) and `.btn--ghost` (1px ice outline), `.visually-hidden`, `:focus-visible` (2px silver outline, 3px offset), `.duo` and `.duo__bw` rules, `.ridges` rules. Section styles come in later tasks, each under its own comment header. Nothing from the old stylesheet survives.

- [ ] **Step 5: Implement `DuoPhoto` and `Ridges`.**

- [ ] **Step 6: Run** `npx vitest run && npx tsc -b`. Expected: PASS.

- [ ] **Step 7: Commit** `git commit -m "clear old site, add foundation, duo photo and ridges"`

---

### Task 4: Hero

**Files:** Modify `src/components/Hero.tsx`, `src/styles/global.css`. Test: `src/components/Hero.test.tsx`.

**Interfaces:** Consumes `DuoPhoto`, `useScrollFrame`, `pinProgress`, `inOut`, `ease`, `lerp`, `clamp`, `event.dateLine`.

- [ ] **Step 1: Failing tests:**

```tsx
it("states the headline once for assistive tech", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1, name: "Meet the people building what's next." })).toBeInTheDocument();
});
it("says what HooHacks is and links to packages and the form", () => {
  render(<Hero />);
  expect(screen.getByText("HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Become a sponsor" })).toHaveAttribute("href", "#contact");
  expect(screen.getByRole("link", { name: "See packages" })).toHaveAttribute("href", "#tiers");
});
```

- [ ] **Step 2: Run** `npx vitest run src/components/Hero.test.tsx`. Expected: FAIL.

- [ ] **Step 3: Build the hero to match the prototype.**
  - Markup: `section#hero` (230vh) > sticky pin.
  - Inside the pin: the small white logo (`/img/logo-long-white.svg`, 15px, opacity 0.8, top 30px, left = wrap padding); `DuoPhoto name="opening-crowd"`; the dark gradient; the copy with `March 2027, University of Virginia` (from `event.dateLine` if it reads that way, else literal); `h1.hl` with an outline span and an `aria-hidden` solid span; the row with the supporting line and both buttons; the scroll cue (`.cue` 1px × 56px with `<i>` animated by CSS `@keyframes`).
  - Per frame (p = pinProgress):
    - photo `scale(lerp(1.14, 1, ease(p)))`;
    - photo `--color` = clamp((p − 0.1)/0.6);
    - solid clip `inset(0 ${100 − inOut(clamp(p/0.7))·100}% 0 0)`;
    - row opacity and `translateY` from `ease(clamp((p − 0.68)/0.22))`;
    - cue opacity `1 − clamp(p/0.06)`.
  - Reduced-motion CSS: no sticky, solid span fully shown, `.duo__bw` hidden, cue hidden, row visible.

- [ ] **Step 4: Run** tests. Expected: PASS. **Check in the browser** (`npm run dev`, 1440×900) beside the prototype hero at scroll 0 and at the end of the pin.

- [ ] **Step 5: Commit** `git commit -m "build after hours hero"`

---

### Task 5: Stats line and the weekend heading

**Files:** Create `src/components/StatsLine.tsx`; modify `global.css`. Test: `src/components/StatsLine.test.tsx`.

**Interfaces:** Consumes `stats` from content, `Ridges`, scroll helpers.

- [ ] **Step 1: Failing tests:**

```tsx
it("lists every figure as plain text", () => {
  render(<StatsLine />);
  for (const t of ["760+ students", "46 schools", "18 states", "220+ projects", "29% women and non-binary", "15 sponsors", "7 partners"])
    expect(screen.getByText(t, { selector: ".visually-hidden li" })).toBeInTheDocument();
});
it("introduces the weekend", () => {
  render(<StatsLine />);
  expect(screen.getByRole("heading", { level: 2, name: "Twenty-four hours in Charlottesville." })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - Structure: `section#stats` (260vh), sticky pin 100vh, content at the top with `padding-top: 24vh`.
  - The visual line is `aria-hidden`. A visually hidden `<ul>` carries the seven figures. The visual items render `<b>760+</b><span>students</span>` etc. in Funnel Display 300 at `clamp(96px, 16vw, 260px)`.
  - Under the line: `<h2>` "Twenty-four hours<br/>in Charlottesville." (accessible name without the break), absolutely positioned at `bottom: 10vh`.
  - `<Ridges seed={11} layers={6} drift="x">` in the lower 52vh behind both.
  - Per frame: line `translateX(−p · max(0, scrollWidth − innerWidth))`. Heading opacity and `translateY((1−n)·40px)` with `n = ease(clamp((p − 0.62)/0.3))`.
  - Reduced motion and phones under 760px: the line wraps (`flex-wrap`, no transform, font scaled down) and the heading shows normally below it.

- [ ] **Step 4: Run** tests. Expected: PASS. **Browser check:** scrolling out of the hero shows 760+ while the hero photo is still on screen. At the end of the pin, the heading sits under the numbers and the first weekend scene follows with no empty navy screen.

- [ ] **Step 5: Commit** `git commit -m "build stats line with weekend heading"`

---

### Task 6: Weekend scenes

**Files:** Modify `src/components/Weekend.tsx`, `global.css`. Test: `src/components/Weekend.test.tsx`.

- [ ] **Step 1: Failing test:**

```tsx
it("shows each moment with its day and time", () => {
  render(<Weekend />);
  expect(screen.getAllByRole("article")).toHaveLength(5);
  expect(screen.getByRole("heading", { name: "Demos" }).closest("article")).toHaveTextContent("Sunday9:00 AM");
});
```

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - Remove `when` from `weekend` in `content.ts`.
  - Structure: `section#weekend` with an `aria-label` of "The weekend". It holds five `article.scene` elements, each sticky top 0 at 100vh, with:
    - a `DuoPhoto`;
    - a dim layer;
    - copy: `<p class="scene__time"><small>{day}</small>{time}</p>` large on the left, and `<h3>` plus the body on the right.
  - Per frame for scene i:
    - `--color = ease(clamp((enter − 0.4)/0.6))`, where `enter = clamp((vh − top)/vh)`;
    - `cover` = the same measure for scene i+1;
    - photo `scale(1 − cover·0.08)` and dim opacity `cover·0.7`.
  - Reduced motion: scenes are static, full-color blocks, one after another.

- [ ] **Step 4: Run** tests. Expected: PASS. **Browser check** against the prototype.

- [ ] **Step 5: Commit** `git commit -m "build weekend scenes"`

---

### Task 7: Ways to get involved

**Files:** Modify `src/components/Roles.tsx`, `global.css`. Test: `src/components/Roles.test.tsx`.

- [ ] **Step 1: Failing test:**

```tsx
it("names the three ways and who can use them", () => {
  render(<Roles />);
  expect(screen.getByRole("heading", { level: 2, name: "Ways to get involved." })).toBeInTheDocument();
  expect(screen.getByText("Every package includes sending mentors and judges. Higher tiers add more ways to take part.")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Run a workshop" })).toBeInTheDocument();
  expect(screen.getByText("Platinum and up")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - Background: Dawn gradient night→`#101C46`, with `<Ridges seed={23} layers={7} drift="y">` in the lower 75%.
  - Layout: a three-column grid. Each column has a `DuoPhoto` at 3:4, then an h3, the body and the tag. The middle column sits 12vh lower.
  - Per frame for column i:
    - photo `translateY((0.5 − throughProgress) · [60, −40, 90][i] px)`;
    - `--color = ease(clamp(enter·1.2 − 0.2))`.
  - Headings rise in with `ease(enterProgress(…, 0.35))` (opacity and 40px `translateY`).
  - Phones and reduced motion: stack, no drift.

- [ ] **Step 4: Run** tests. Expected: PASS. **Browser check.**

- [ ] **Step 5: Commit** `git commit -m "build ways to get involved"`

---

### Task 8: Sponsorship packages

**Files:** Modify `src/components/Tiers.tsx`. Create `src/components/Compare.tsx`, `src/components/AddOns.tsx`. Modify `global.css`. Test: `src/components/Tiers.test.tsx`, `src/App.test.tsx`.

**Interfaces:**
- Consumes `addedAtTier`, `tiers`, `benefits`, `addOns`, `formatPrice`, `useMediaQuery`, `scrollToPin`, `Ridges`.
- `Tiers({ onAsk: (tierName: string) => void })`, unchanged signature.
- `Compare()` and `AddOns()` carry over the current comparison table and à la carte list markup, restyled for the dark background.

- [ ] **Step 1: Failing tests** (`Tiers.test.tsx`):

```tsx
it("shows only what each tier adds, plus the tier below", () => {
  render(<Tiers onAsk={() => {}} />);
  const gold = screen.getByRole("article", { name: "Gold" });
  expect(within(gold).getByText("$5,000")).toBeInTheDocument();
  expect(within(gold).getByText("Resume book")).toBeInTheDocument();
  expect(within(gold).queryByText("Sponsor lounge")).toBeNull();
  expect(within(gold).getByText("Plus everything in Silver.")).toBeInTheDocument();
});
it("stacks the tiers under reduced motion", () => { /* matchMedia matches REDUCED → container has class "tiers--stacked" and no element with class "rail" transform style */ });
it("brings a tier into view when its button gets keyboard focus", () => { /* spy on window.scrollTo; focus Diamond's "Ask about Diamond" link; expect scrollTo called */ });
```

`App.test.tsx`:

```tsx
it("pre-fills the message after Ask about Gold", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("link", { name: "Ask about Gold" }));
  expect(screen.getByLabelText(/Questions or comments/)).toHaveValue("We're interested in the Gold tier.");
});
```

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - **Structure:** `section#tiers` with h2 "Sponsorship packages.". Each tier is an `<article aria-label={name}>` holding:
    - the name with its metal dot;
    - the price in Funnel Display 300;
    - the pitch;
    - a `<ul>` of `addedAtTier`, where the right column shows the detail, or "Upgraded" when the change is an upgrade without a detail;
    - "Plus everything in {previous}." (absent at Bronze);
    - `<a class="btn btn--ghost" href="#contact" onClick={() => onAsk(name)}>Ask about {name}</a>`.
  - **Rail mode** (default):
    - The section height is set in JS to `rail.scrollWidth − 0.55·vw + vh`, and recomputed on resize.
    - The pin starts with padding-top 11vh.
    - Per frame: `translateX(−p·(scrollWidth − 0.55·vw))`.
    - The active tier is `round(p·4)`. It gets full opacity; the others get 0.35.
    - The tier names are buttons that call `scrollToPin(section, i/4)` and carry `aria-current` on the active one.
    - Focusing inside an off-screen tier calls `scrollToPin(section, i/4)`.
    - `<Ridges seed={37} layers={5} drift="x">` sits in the bottom 30vh, with `--lc: #c9d5f2` and `--lo: 0.55`.
    - The background is the Dawn tiers gradient.
  - **Stacked mode** (`useMediaQuery(PHONE)` or `useMediaQuery(REDUCED)`): same articles in a vertical list; the names become jump links; no pin.
  - **Below the rail:** `<Compare/>` (a `details` element whose summary reads "Compare every tier") and `<AddOns/>` (heading "À la carte").

- [ ] **Step 4: Run** `npx vitest run`. Expected: PASS. **Browser check:** the rail scrolls, the tabs jump, and Tab moves focus through the tiers while bringing each one into view.

- [ ] **Step 5: Commit** `git commit -m "build sponsorship packages rail"`

---

### Task 9: Past sponsors

**Files:** Modify `src/components/Logos.tsx`, `global.css`. Test: `src/components/Logos.test.tsx`.

- [ ] **Step 1: Failing test:**

```tsx
it("lists every past sponsor once for assistive tech", () => {
  render(<Logos />);
  expect(screen.getAllByRole("img").filter((i) => i.getAttribute("alt"))).toHaveLength(sponsors.length);
});
```

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - Structure: `section#sponsors` with h2 "Past sponsors and partners." and two rows (first half and second half of `sponsors`). Each row is duplicated so it fills the width; the duplicate copy is `aria-hidden` with empty `alt`.
  - Logos are white (`filter: brightness(0) invert(1)`, opacity 0.7), sized with `logoSize(ratio, { area: 2400, maxH: 48, maxW: 170 })`.
  - Per frame: row 1 `translateX(−t·40vw)`, row 2 `translateX(−60vw + t·40vw)`, with t = throughProgress.
  - Background: the Dawn sponsors gradient. `<Ridges seed={41} layers={5} drift="y">` sits in the lower 60% with `--lc: #0A1330`.
  - The section clips horizontally (`overflow: hidden`).

- [ ] **Step 4: Run** tests. Expected: PASS. **Browser check.**

- [ ] **Step 5: Commit** `git commit -m "build past sponsors rows"`

---

### Task 10: Contact and footer in morning light

**Files:** Modify `src/components/Contact.tsx`, `src/components/InquiryForm.tsx`, `src/components/InquiryForm.test.tsx`, `src/components/Footer.tsx`, `global.css`.

- [ ] **Step 1: Update tests first:**
  - In `InquiryForm.test.tsx`, change `/Questions, comments, or concerns/` to `/Questions or comments/`.
  - Add to `App.test.tsx`: `expect(screen.getByRole("heading", { name: "Get in touch." })).toBeInTheDocument()` and `expect(screen.getByText("Tell us about your company and what you're interested in. The sponsorship team will reply by email.")).toBeInTheDocument()`.

- [ ] **Step 2: Run.** Expected: FAIL.

- [ ] **Step 3: Build it.**
  - Change the textarea label to "Questions or comments" with the existing `(optional)` span.
  - Contact: a two-column grid. On the left, the heading, the sentence, and the email and packet links (keep the current wording: "Prefer email? …", "Want the details offline? Download the sponsorship packet (PDF)"). On the right, `InquiryForm`.
  - Morning styles: background `#C9D3EB`→`#E8EDF7`; text `#0A1330`/`#4A5677`; white fields with border `rgba(10,19,48,.14)`, which turns navy on focus; navy primary button; error and alert colors readable on light.
  - Footer: same content as today, on `#E8EDF7` with navy text, the colored `logo-long.svg`, and a border-top of `rgba(10,19,48,.12)`.

- [ ] **Step 4: Run** `npx vitest run`. Expected: PASS. **Browser check:** sending a form with empty fields shows the errors legibly on the light background.

- [ ] **Step 5: Commit** `git commit -m "build contact and footer in morning light"`

---

### Task 11: Phones, reduced motion, performance, and final check

**Files:** `global.css` (fixes only), `README.md` (one line: the design spec link and that `content.ts` holds the weekend times).

- [ ] **Step 1: Phone check** at 390×844 and 360×740.
  - `document.documentElement.scrollWidth === innerWidth` everywhere.
  - Packages stack, roles stack, and the stats line wraps.
  - No text overflows.
  - Fix any of these in CSS.

- [ ] **Step 2: Reduced-motion check** (Chrome devtools rendering → emulate `prefers-reduced-motion: reduce`).
  - Nothing pins.
  - The headline is solid and the photos are in color.
  - The scroll cue is hidden and the ridges are still.
  - Every section is readable.

- [ ] **Step 3: Resize check.** Drag the window from 1440 to 900 wide while in the middle of the packages rail and while in the stats pin. Nothing should be cut off, and the rail should still reach Diamond.

- [ ] **Step 4: Performance check.** Record 10 seconds of steady scrolling, top to bottom, in the Chrome performance panel at 1440×900. No frame should be over 50ms while scrolling, and there should be no layout from scroll handlers (only Paint/Composite). Fix any violation before continuing.

- [ ] **Step 5: Final gates.** Run `npm test && npm run build`. Expected: both pass. `grep -ri "e57200\|manrope\|crowd\|nav__" src index.html` returns nothing.

- [ ] **Step 6: Commit** `git commit -m "polish phones, reduced motion and performance"`
