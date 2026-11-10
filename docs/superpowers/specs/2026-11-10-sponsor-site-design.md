# HooHacks sponsor site: design

Date: 2026-11-10
Status: draft for review

## Why

Today, companies interested in sponsoring HooHacks get a PDF packet and a Google
Form. The form's responses pass through the website team before reaching the
sponsorship team. We want:

1. A sponsor-facing marketing site that looks like a top tech company paid an
   agency for it. It should be polished, clean and confident, not templated,
   and not built around a gimmick.
2. A short inquiry form on that site whose responses reach the sponsorship team
   directly, with no middleman.

The form only needs to produce the **first contact**. After someone replies,
the conversation moves to email, so inquiries don't need to outlive the event
year.

## Goals

- A single-page sponsor site in this repo (`sponsor-website`), built from
  scratch, based on prototype "D: UVA, the place" with hero option 2 (see
  "Reference prototype" below).
- Content from the 2027 sponsorship packet: 2026 stats, five tiers with the full
  benefits table, add-ons, past sponsors, and contact details.
- An inquiry form with four fields: name, email, company, and an optional
  "questions, comments, or concerns" box.
- Each inquiry is saved to the current season's HackX Firestore project, a
  Discord channel gets pinged, and HackX gets an admin page that lists every
  inquiry.
- Updating the site for a new year is a content edit, not a code change.

## Non-goals

- Sponsor accounts, logins, or a sponsor portal.
- Payments, invoices, or contracts.
- Keeping inquiries across years. HackX moves to a fresh Firebase project every
  season, and that's fine for this data.
- A CMS. Yearly content lives in one typed file in the repo.
- Email notifications (Discord only for now).

## Anti-goals (fails even if it "works")

- It looks AI-generated or templated: generic SaaS cards, gradient washes,
  all-caps eyebrows on every section, or one gimmick that dictates the whole
  page (the lanyard, laptop and clock prototypes were rejected for this).
- Photos get cropped or cut off awkwardly at common screen sizes. The hero must
  fit one screen with nothing cut off.
- An inquiry is silently lost: the site shows "sent" but nothing reached HackX
  or Discord.
- The Discord webhook URL or any other secret ships in client code.
- Facts that aren't in the packet get presented as real (made-up quotes,
  invented numbers, a schedule we don't have).

## Reference prototype

The approved look is the scratchpad prototype `d-place.html` with hero 2 (its
supporting `data.js`, logos and images sit next to it). It is the visual source
of truth for layout, type, spacing and color. It is a throwaway prototype; the
real build re-implements it cleanly.

Before building, copy the prototype and its assets into
`docs/prototype/` in this repo, so the builder has it.

### Page structure (top to bottom)

1. **Nav:** white and sticky, with a slight blur. Navy HooHacks wordmark on the
   left; links to "The weekend", "How sponsors join" and "Tiers"; a navy
   "Become a sponsor" button on the right. On phones the links are hidden.
2. **Hero (option 2):** a centered orange line, "March 2027 at the University
   of Virginia"; a very large two-line headline, "Every March, UVA builds for
   24 hours straight.", which spans most of the width (the user specifically
   wanted the side white space used); a short paragraph; two buttons
   ("Become a sponsor" in orange, "See tiers" outlined). Below that is a row
   of five rounded photos of stepped heights (short, medium, tall, medium,
   short). **The entire hero, photos included, must fit inside one viewport
   from about 1280×720 up to 1920×1080.** On phones, three photos show and
   the hero can scroll.
3. **Stats sentence:** one large centered sentence with the 2026 numbers in
   orange and three small pill-shaped photos set into the line. A short
   footnote gives 29% women+ against the MLH average of 24%.
4. **The weekend:** a "24 hours, start to finish." heading with prev/next
   arrows and a horizontally scrolling, snap-aligned row of five moments
   (kickoff, sponsorship fair, overnight, demos, awards). Each has a photo, a
   loose time label and two lines of copy. No specific clock times.
5. **How sponsors join:** three cards (meet students, teach something, judge
   and award), each with a photo, short copy and a tier tag ("Silver and up").
6. **Tiers:** a pill tab bar (Bronze through Diamond) driving one panel. The
   left side shows the tier name, a large price, one sentence and an "Ask about
   [tier]" button. The right side shows "N benefits included" in two columns,
   with benefits that are new or upgraded at that tier marked. Under the panel
   is a "Compare every tier" disclosure with the full benefits table, then
   five add-on cards.
7. **Past sponsors:** a centered greyscale logo cloud that turns to color on
   hover. Logos are sized for **equal visual area**, not equal height (trimmed
   PNGs, sized by aspect ratio), so wide and square logos look balanced.
8. **Contact:** a large rounded navy block split into a photo with "Come build
   with us." on one side and the form on the other.
9. **Footer:** one line.

### Visual system (as prototyped)

- **Type:** Manrope (400–800). Headlines are 800 weight with tight negative
  tracking, and "24 hours" never breaks across lines.
- **Color:** navy `#0E1452` (brand), UVA orange `#E57200` (accent and primary
  buttons, with navy text for contrast), soft surface `#F3F5FA`, lines
  `#E3E6EF`, muted text `#6E7598`. Tier dots use the packet's tier colors.
- **Shape:** large radii (22–30px) on photos and panels, pill buttons.
- **Motion:** restrained. A short fade-and-rise on the hero copy, gentle image
  scale on hover, and a smooth tab change. All of it is off under
  `prefers-reduced-motion`.
- **Accessibility:** visible focus rings, keyboard-operable tabs (arrow keys),
  alt text on every photo, AA contrast.

## Content

The prototype's `docs/prototype/data.js` is the authoritative content source.
It was extracted from the 2027 packet, including the full tier benefits
matrix, so the builder doesn't need the PDF. The compressed packet PDF ships in
the site's `public/` folder.

All yearly content lives in one typed module (for example `src/content.ts`):
event year and date line, stats, tiers (name, price, color, one-line pitch),
the benefits matrix (from the packet's table), add-ons, the weekend moments,
past-sponsor logos with their aspect ratios, contact email, and packet PDF URL.

Source of truth for the numbers is the 2027 packet. The 2026 stats are 760+
participants, 46 schools, 18 states, 29% women+, 220+ projects demoed, and 22+
sponsors and partners. The tiers are Bronze $1,000, Silver $3,000,
Gold $5,000, Platinum $10,000 and Diamond $15,000, with the benefits matrix
exactly as in the packet's tier table.

Past sponsors shown are Capital One, Deloitte, Google Cloud, IBM, Intel,
Jane Street, Perplexity, CoStar, Leidos, Fannie Mae, Appian, Wolfram,
Roboflow, NordVPN, Commonwealth Cyber Initiative and MLH (pulled from the
2024–2026 Devpost pages).

Photos currently come from the packet (about 1600px). Higher-resolution event
photos should replace them when available.

The packet PDF (14 MB) is offered as a download. Host a compressed copy.

## Inquiry flow

```
sponsor site form
  └─ writes one doc → HackX Firestore (current season's project)
       collection: sponsorInquiries
         ├─ Cloud Function (onDocumentCreated) → Discord webhook post
         └─ HackX admin page "Sponsor inquiries" reads the collection
```

### The form

- **Fields:** name (required), work email (required, valid format), company
  (required), questions/comments/concerns (optional, multi-line).
- **Spam:** a hidden honeypot field (submissions that fill it are dropped
  client-side) plus strict Firestore rule validation. The Discord function also
  skips the ping when the same email already sent an inquiry in the last 10
  minutes, so a flood can't spam the channel (the docs are still saved). This
  risk is accepted for launch, since the endpoint is publicly writable by
  design. If spam becomes a real problem, add Firebase App Check.
- **States:** idle, sending (button disabled), sent ("Message sent. We'll reply
  to your email soon."), and error. On error, the message says it didn't send,
  offers a retry, and shows team@hoohacks.io as a fallback. Inputs are never
  cleared on error.
- **Configuration:** the site reads the Firebase web config from environment
  variables at build time. Pointing at a new season is a config change, not a
  code change. Local and preview builds point at HackX's `development`
  project; the production build points at `production`.
- **Launch order:** HackX's production rules only change on a HackX release,
  so the HackX PR (rules, function, admin page) has to ship before the sponsor
  site's form goes live in production.

### Firestore (in HackX, `hoohacks-app`)

- **Collection:** `sponsorInquiries`, with fields `name`, `email`, `company`,
  `message` (string, may be empty), `createdAt` (server time) and `source`
  (`"sponsor-site"`). Admins later add `contacted` (boolean), `contactedBy`
  (uid) and `contactedAt` (timestamp) on the same document. The public create
  rule allows only the six original keys, so the public can never set these.
- **Public create rule:** unauthenticated create allowed only with exactly
  those keys, string types, length caps (name ≤ 120, email ≤ 254, company ≤
  160, message ≤ 4000), `createdAt == request.time`, and `source ==
  'sponsor-site'`. No public read, update or delete.
- **Reads and status updates:** admins only, through HackX's existing audited
  admin write path (the catch-all rule requires an audit-log entry in the same
  batch).
- **Tests:** rules tests in HackX's existing rules test suite for the public
  create, rejected shapes, and no public read.
- **Schema:** a Zod schema in `lib/schema` and its entry in `docs/SCHEMA.md`,
  following HackX conventions.

### Discord notification

- A Cloud Function triggered on new `sponsorInquiries` documents posts to a
  Discord webhook. The webhook URL is a Firebase secret, never in client code
  or the repo.
- The message includes the company, name, email, the first ~500 characters of
  the message, and a link to the HackX inquiries page.
- If the Discord post fails, the inquiry is still saved, and the function logs
  the error. The HackX page is the source of truth.
- It gets a line in HackX's `docs/ARCHITECTURE.md` "Backend decision" list,
  since it's the kind of side effect that list says needs a function.

### HackX admin page

- Lives at `/admin/sponsor-inquiries`, alongside the existing admin pages, and
  is added to `lib/routes.ts` and the admin nav. Like the other admin pages, it
  works wherever HackX runs (web and native).
- Newest first. Each entry shows company, name, email (as a mailto link), the
  full message and the received time.
- **My call:** a simple "Contacted" toggle per inquiry, recording who marked it
  and when, so two people don't email the same company. It's written through
  the audited admin path.
- **Empty state:** "No sponsor inquiries yet. They'll show up here when
  someone fills out the form on the sponsor site."
- Admin-only: any admin can see it.

### Yearly rollover

Add to HackX's `docs/MIGRATION.md` checklist:
- Deploy the function and set the Discord webhook secret on the new project.
- Update the sponsor site's Firebase environment variables to the new project
  and redeploy.
- Optional: export the old year's inquiries before retiring the project.

## Tech choices (my calls)

- **Sponsor site:** Vite + React + TypeScript, matching the main
  `hoohacks-2026-website` stack. Firebase JS SDK (Firestore Lite) for the one
  write. Styling follows the prototype's tokens.
- **Hosting:** Netlify, at `sponsor.hoohacks.io`.
- **HackX changes** go in a separate PR in `hoohacks-app`.

## Left to the builder

- Component breakdown, CSS approach (CSS modules or Tailwind), and file layout.
- Exact responsive breakpoints, as long as the hero-fits-one-screen rule and
  phone layouts match the prototype's intent.
- Image formats and sizes (responsive `srcset`, modern formats).

## Decisions from review

- HackX's Firebase project is on (or will be moved to) the Blaze plan, so the
  Discord ping is a Cloud Function in `hoohacks-app` (a new `functions/`
  subproject).
- The site lives at `sponsor.hoohacks.io`, on Netlify.
- The HackX inquiries page is admin-only, and any admin can see it
  (`isAdmin()`). No new role.
