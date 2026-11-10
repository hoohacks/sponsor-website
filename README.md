# HooHacks sponsor site

The sponsor-facing site at [sponsor.hoohacks.io](https://sponsor.hoohacks.io): the case for sponsoring HooHacks, the tiers and add-ons, and an inquiry form that goes straight to the sponsorship team.

Built with Vite, React and TypeScript. Deployed on Netlify (`netlify.toml`).

## Run it

```bash
npm install
cp .env.example .env   # fill in HackX's development Firebase web config
npm run dev
```

`npm test` runs the unit and form tests. `npm run build` type-checks and builds to `dist/`.

## Where things live

- `src/content.ts`: everything that changes each year (date, stats, tiers, benefits, add-ons, photos, past sponsors). Most yearly updates only touch this file.
- `src/components/`: one component per page section.
- `src/lib/inquiry.ts`: form validation and the Firestore write. Its limits match the `sponsorInquiries` rule in HackX.
- `public/`: photos (WebP at 800 and 1600 wide), trimmed sponsor logos, and the packet PDF.
- `docs/`: the design doc and the approved prototype.

## How inquiries flow

The form writes one document to `sponsorInquiries` in the current season's HackX Firebase project. A HackX Cloud Function posts it to Discord, and admins see every inquiry at `/admin/sponsor-inquiries` in HackX. The HackX side lives in the `hoohacks-app` repo.

## Each new season

1. Update `src/content.ts` (date line, stats, tiers, sponsors) and swap in new photos or the new packet PDF if they changed.
2. Point the `VITE_FIREBASE_*` variables in Netlify at the new HackX production project, then redeploy.
3. Make sure the new HackX project has the `sponsorInquiries` rule, the Discord function and its webhook secret (see HackX's `docs/MIGRATION.md`).

Adding a sponsor logo: trim the whitespace around it, save it as a PNG in `public/logos/`, and add it to `sponsors` in `content.ts` with its width ÷ height as `ratio`. Logos are sized for equal visual area, so the ratio matters.
