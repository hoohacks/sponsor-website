# After Hours: sponsor site redesign

Status: approved 2026-11-15 and built. The design below is what was approved; "Changes after the build" at the end records what the client changed once they saw the real site, and wins where the two disagree.
Reference prototype: `.superpowers/proto/after-hours-3.html` (throwaway, kept out of git; run the dev server and open `/.superpowers/proto/after-hours-3.html`). Its bottom-right headline switcher is prototype-only; headline 1 is the chosen one.

## Intent

The sponsor site at sponsor.hoohacks.io exists to get companies to sponsor HooHacks 2027. Its readers are recruiters, university-relations staff and engineering leads deciding whether a weekend at UVA is worth their budget.

The current site reads as childish: orange, white and navy together look like a birthday page, and it is built from rows of rounded cards. The scroll effects added recently also stutter, mostly because of the full-screen dot canvas behind the page.

The redesign should feel like a professional organization made it: modern, minimal, polished and cinematic. It should be distinctive without gimmicks, and the writing should sound plain and normal, not like a startup pitch. Motion follows the scrollbar and rewinds when you scroll back up.

How we got here: of three prototyped directions (Ledger, After Hours, Grounds), the client picked **After Hours**. Later rounds removed the top navigation, tightened the stats, picked **Dawn** for the lower half (over Stage light and Ambient photo) because a plain navy background after the photo sections felt like the effort stopped, added faint **Blue Ridge ridgelines** to tie the dark sections together (over contour rings), rewrote the copy plainly, and kept the original headline.

## Goals

- A cinematic page that follows the event through the night: it opens dark (deep navy, ice-white type, photos coming into color) and lightens toward morning in the lower half, ending with the form in daylight.
- One quiet visual thread through the page: faint ridgelines of the Blue Ridge, seen from Charlottesville.
- Scroll-driven motion in every section, smooth on an ordinary laptop.
- Keep everything sponsors need to decide: stats, what happens over the weekend, ways to take part, every tier and what it includes, add-ons, past sponsors, and the inquiry form.
- Works well on phones, not just shrunk.

## Non-goals

- No change to the content model beyond what the design needs. `src/content.ts` stays the single file that changes each season.
- No change to how inquiries are stored or delivered (Firestore `sponsorInquiries`, HackX Discord function).
- No light mode or theme toggle.

## Anti-goals (a failure even if it works)

- Anything corny or gimmicky: no git graphs, badges, countdown clocks, airport boards, mascot-heavy art.
- Startup-pitch copy: slogans, hype, clever lines in place of plain facts.
- Orange as a brand color, or the navy-orange-white combination.
- Rows of identical rounded cards.
- A stretch of empty navy screen between sections.
- Scrolling that stutters. If an effect can't stay smooth, it goes.
- Motion that blocks reading. Every section must be readable without the animation.

## Constraints

- Stack stays as it is: Vite, React 19, TypeScript, plain CSS in `src/styles/global.css`, deployed on Netlify. No new runtime dependencies.
- The inquiry form keeps its behavior: validation and limits in `src/lib/inquiry.ts` (they mirror the Firestore rule), honeypot, sending, sent and error states, and pre-fill from "Ask about [tier]".
- Existing tests (`npm test`) keep passing; form tests are updated only where markup or labels change.
- Accessibility: keyboard reachable, visible focus, real text for every number shown as motion, alt text on photos, `prefers-reduced-motion` respected.
- Photos are the existing WebP set in `public/img`; logos are the existing PNGs in `public/logos`.

## Approaches considered

1. **Ledger.** Editorial and light: an annual-report look with a living comparison table. Not chosen.
2. **After Hours.** Dark and cinematic, with photos coming into color. **Chosen.**
3. **Grounds.** Quietly UVA: serif type, arched photo frames. Not chosen.

For the lower half: **Dawn** (chosen), Stage light (projector beams), Ambient photo (blurred event photos). For the connecting lines: **Ridgelines** (chosen), contour rings.

How to drive the motion (builder's call within these limits): a single small scroll loop that reads positions once per frame and writes only `transform`, `opacity` and `clip-path`, as the prototype's `shared.js` does. CSS scroll-driven animations (`animation-timeline`) may replace it where supported, as long as browsers without them still get a finished, readable page.

## The design

### Look

- **Palette.** Night `#0A1330` (page), deep `#101B40` (fields, raised areas), ice `#E8EDF7` (main text on dark), mist `#8E9AB9` (secondary text), silver `#BCC8E6` (accents, captions, ridgelines), rule `rgba(232,237,247,.12)` (hairlines). Tier metal colors (from `content.ts`) appear only as small dots next to tier names.
- **Dawn.** From the ways-to-get-involved section down, the background lightens section by section, each a vertical gradient that starts where the last one ended: night to `#101C46` (ways to get involved), to `#172660` and `#26397A` (packages, shifting slowly while pinned), through `#4F629C` and `#9FAFD6` to `#C9D3EB` (past sponsors), then `#E8EDF7` morning for the contact section and footer. In the morning sections, text turns navy (`#0A1330` main, `#4A5677` secondary), fields are white with a faint navy border, and the primary button is navy.
- **Ridgelines.** Thin 1px lines tracing layered ridges, generated (not an image), nesting so they never cross: back ridges taller and fainter, front ridges lower and brighter (stroke opacity roughly 0.07 to 0.24). They appear in the lower part of the stats screen (behind the numbers and the weekend heading), behind the ways-to-get-involved photos, along the bottom of the packages (fainter, so they never compete with package text), and across the lower part of past sponsors, where they turn navy on the light dawn background like hills at sunrise. They drift slowly with the scroll, nearer ridges a little more than farther ones, and fade in as their section arrives.
- **Type.** Funnel Display for headings and large figures (light 300 for big numbers, 500 to 600 for headings); Funnel Sans for body. Both from Google Fonts, replacing Manrope.
- **Photos.** Each photo is two stacked layers, color under a grayscale copy; fading the grayscale copy brings it into color. This uses opacity only, so it stays smooth.
- **Logo.** No top navigation bar. The white logo sits small (about 15px tall, slightly dimmed) in the hero's top-left corner and scrolls away with the hero. The footer carries the full logo and links.
- Buttons are pill-shaped: ice fill as the primary, a thin ice outline as the secondary (navy versions in the morning sections).

### Page, top to bottom

1. **Hero (pinned, about 2.3 screens).** Full-screen opening-ceremony photo that slowly settles in scale and comes into color. Above the headline, "March 2027, University of Virginia". The headline "Meet the people building what's next." starts as an outline and fills in left to right with the scroll. Then the supporting line ("HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes.") and two buttons (Become a sponsor, See packages) rise in. A **scroll cue** sits at the bottom center: a 1px, 56px-tall hairline with a soft light running down it on a loop, which fades out as soon as scrolling starts.
2. **Stats (pinned).** One line of huge figures and words (760+ students, 46 schools, 18 states, 220+ projects, 29% women and non-binary, 15 sponsors, 7 partners) slides sideways across the upper part of the screen. It starts on screen, so 760+ is already visible while the hero is still leaving. No caption or progress line. As the line finishes, the weekend's heading, "Twenty-four hours in Charlottesville.", rises in below it, so the photo scenes follow directly and there is no empty navy screen in between. Ridgelines sit faintly behind both. Every figure is also present as plain text for screen readers.
3. **The weekend.** Five full-screen scenes (opening ceremony, sponsorship fair, heads down, demos, awards), starting right after the stats. Each sticks, comes into color, and is covered by the next one sliding up while it shrinks and dims slightly. Each scene shows the day, the time set large, the title and one plain sentence.
4. **Ways to get involved.** Heading "Ways to get involved." and the line "Every package includes sending mentors and judges. Higher tiers add more ways to take part." Three tall photos (meet students, run a workshop, judge and award) drifting at different speeds and coming into color, each with a title, one sentence and which tiers include it. Ridgelines behind them.
5. **Sponsorship packages (pinned, sideways).** Heading "Sponsorship packages." The page pins and the five tiers pass by sideways, each in its own column with name, price, a plain one-line summary, only what it adds or upgrades over the tier below, "Plus everything in [previous tier]", and an "Ask about [tier]" button that jumps to the form and pre-fills the message (current behavior). The tier names above act as tabs that scroll to that tier. Below the rail:
   - **Compare every tier.** A collapsible full comparison table (current content), restyled.
   - **À la carte.** The add-ons price list (current content), restyled.
6. **Past sponsors.** Two rows of white logos drifting in opposite directions as you scroll, on the blue middle of the dawn gradient where white still reads clearly, with navy ridgelines below.
7. **Contact.** Heading "Get in touch.", the line "Tell us about your company and what you're interested in. The sponsorship team will reply by email.", email and packet PDF links, and the real inquiry form in morning light.
8. **Footer.** Current footer content (logo, links, socials, team and Devpost links) restyled to match, on the same morning background.

### Copy

Plain and factual throughout: say what happens and what's included. The prototype's wording is the reference. The tier summaries in `content.ts` change to:

- Bronze: "Support the event, send mentors and judges, and put your logo on the website."
- Silver: "Adds a table at the sponsorship fair, the sponsor lounge, and your logo on the T-shirt."
- Gold: "Adds the resume book and a social media shoutout."
- Platinum: "Adds a workshop, a sponsored prize, and an email to all attendees after the event."
- Diamond: "Adds your own competition track, the keynote, and coffee chats with students."

The weekend scene sentences, role titles and role sentences in `content.ts` change to the prototype's versions (for example "Each team presents its project to the judges."; the "Teach something" role becomes "Run a workshop").

### Phones (under about 760px wide)

- Hero, stats line and weekend scenes work as on a laptop. The weekend heading may sit under the stats line rather than rising in, if space is tight.
- Packages do not pin sideways. The tiers stack vertically, each showing what it adds, and the tier names become a simple row of jump links.
- The three ways to get involved stack, without the drift.
- Ridgelines stay, scaled to the width.
- Headings and figures scale down so no line overflows. No sideways page scroll.

### Reduced motion

Nothing pins or slides. Photos show in color, the headline is solid, the scroll cue is hidden, the stats line becomes a wrapped list of figures, and ridgelines stay still. Packages show as the stacked phone layout. Every section is in its finished state.

### What goes away

- The dot canvas (`Crowd.tsx`, `src/lib/crowd.ts`) and the current scroll-reveal system.
- Orange, Manrope, the card-based sections, and the fixed top navigation. (The earlier uncommitted card and scroll changes were already discarded; work starts from `main`.)

## Left to the builder

- Component structure, names, and how the scroll loop is shared between components.
- Exact pin lengths and easing, tuned so each section feels unhurried but never stuck.
- Where the prototype's numbers (sizes, offsets, ridge shapes) need adjusting for real content and widths.
- Whether to keep `useScrollScenes` or replace it, as long as the performance rule holds.

## Calls I made (check these)

- Keep "Compare every tier" and "À la carte". The prototype dropped them, but sponsors use them.
- Phones get stacked tiers instead of the sideways rail.
- Funnel Display and Funnel Sans replace Manrope.
- Work happens on `feat/after-hours-redesign`, a fresh branch off `main` (already created).
- With the nav gone, the only ways to jump to packages or the form are the hero buttons, the "Ask about" buttons and the footer links.
- The form's message label becomes "Questions or comments (optional)", matching the current form's meaning.

## Done when

- Every section above is built and matches the prototype's feel at laptop width, and works at phone width and with reduced motion.
- No stretch of empty screen between the stats and the weekend scenes.
- Scrolling stays smooth on a typical laptop (no long frames while scrolling, checked in the browser's performance panel).
- The inquiry form sends, validates, and pre-fills from "Ask about [tier]" as it does today; `npm test` and `npm run build` pass.
- No orange, no cards, no dot canvas, no top nav left in the code.

## Changes after the build

Decided by the client after reviewing the built site, 2026-11-15 to 2026-11-16. Where these disagree with the sections above, these win.

- **Headline.** "The illimitable freedom of the human mind.", from Jefferson's 1820 letter about founding UVA, with a small italic attribution under it: "Thomas Jefferson". Replaces "Meet the people building what's next."
- **Type.** Every statement heading (hero, section titles, weekend scene titles, role names, "À la carte", "Message sent.") is set in Instrument Serif. Funnel Display is kept only for numbers (stats line, prices, weekend times). Funnel Sans stays for body text, labels, buttons and the form.
- **Hero.** The headline fades from faint to solid with the scroll (no outline). The date line is small and dim after a short hairline, and its text comes from `event.dateLine` in `content.ts`. The two calls to action are underlined text links, not buttons.
- **Hero opening.** When the page opens, the hall photo opens from a thin horizontal slit to full screen while settling from a deep zoom. Then the logo and date fade in and each headline word slides up from behind its own mask. The sequence waits for the photo to load (or 2.5 seconds at most).
- **Buttons and fields.** Every other button and form field has square corners (2px), not pills.
- **Ways to get involved.** On wide screens it's a pinned triptych: the three photos fill the screen edge to edge in black and white, then pull apart into framed columns, come into color, and the words rise in under each. Each photo shrinks around its own frame and ends fully framed, never as a cropped slice. Phones and short screens (under 600px tall) get stacked columns that rise into place as their photos wipe open. With reduced motion the columns simply stack, already in place.
- **Entrances everywhere.** Every block of content fades and slides in with the scroll and rewinds when you scroll back up. On phones, side slides become rises so nothing is cut off at the screen edge.
- **Weekend.** Times are the real 2026 schedule: opening ceremony 10:30 AM, sponsorship fair 3:00 PM, heads down 12:00 AM, judging 1:30 PM, closing ceremony 5:00 PM. "Demos" became "Judging" and "Awards" became "Closing ceremony".
- **No footer.** The page ends at the contact section, which keeps the email and packet links. The team page, Devpost and social links went with it.
- **Short screens.** Packages and the hero size their type by window height as well as width, so everything fits from 720px tall up. Under 600px tall (a phone on its side) the packages and the ways-to-get-involved columns stack.
- **Link previews.** `public/og.jpg` is a capture of the hero, and the share description leads with the quote.
