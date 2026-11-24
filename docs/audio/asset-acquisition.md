# Audio acquisition and review

Open `/audio-lab/`. Recommended defaults preload on mount:

- **Browsing:** heartade *Children's Game Music 3 – Home* (soft piano/flute/strings for toddlers).
- **Gameplay:** heartade *Children's Game Music 4 – Activity* (gentle curiosity / puzzle percussion for kids).
- **Snap:** Kenney Impact Sounds `impactWood_light` / `impactWood_medium` — wooden board material + piece seat.
- **Success:** MintoDog *Cozy Puzzle Clear (Jingle)* (exciting win); Kenney NES / Win / Pizzicato as alternates.

Provenance and SHA-256 hashes live in `bundled-candidates.json` and `src/audio/audio-candidates.ts`. Wood OGG originals are kept beside converted MP3s. Kids home/activity WAVs were transcoded to 128k MP3 for web size.

## Production policy

- **Snap:** enabled — randomized across wood-light/medium candidates in `AUDIO_CATALOG.snap`.
- **Music / success:** still `null` in the production catalog until listening approval. Lab audition does not auto-promote them.

Check mobile speaker quality, loop seams, toddler-friendly loudness, repeated wood snaps, and celebration ducking before enabling music/success. Local file audition remains available. The lab is unlinked and noindex, not access controlled.
