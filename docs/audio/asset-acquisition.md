# Audio acquisition and review

Open `/audio-lab/`. Recommended defaults preload on mount:

- **Browsing:** heartade *Children's Game Music 3 – Home* (soft piano/flute/strings for toddlers).
- **Gameplay:** heartade *Children's Game Music 4 – Activity* (gentle curiosity / puzzle percussion for kids).
- **Snap:** Kenney Impact Sounds `impactWood_light` / `impactWood_medium` — wooden board material + piece seat.
- **Success:** MintoDog *Cozy Puzzle Clear (Jingle)* (exciting win); Kenney NES / Win / Pizzicato as alternates.

Provenance and SHA-256 hashes live in `bundled-candidates.json` and `src/audio/audio-candidates.ts`. Wood OGG originals are kept beside converted MP3s. Kids home/activity WAVs were transcoded to 128k MP3 for web size.

## Production policy

Applied in `src/audio/audio.catalog.ts`:

- **Browsing music:** `browse.mp3` (home theme) on non-play routes
- **Gameplay music:** `play.mp3` (activity theme) on `/play/*`
- **Snap:** wood-light/medium pool
- **Success:** `clear-jingle.mp3` on puzzle complete

Lab at `/audio-lab/` remains for further audition. Local file audition available. The lab is unlinked and noindex, not access controlled.
