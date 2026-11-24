# Audio foundation

Howler owns playback; the root provider maps routes and puzzle callbacks to audio. Existing sound preference is master mute; music and effects have independent persistent controls. No audio is required for gameplay. Playback is gated by a gesture and visibility. No external requests for audio.

## Asset handoff
Production **snap** uses Kenney CC0 wooden impact samples (light/medium) via `AUDIO_CATALOG.snap`. Browsing, playing and success slots stay null pending listening approval of the lab’s toddler-friendly (heartade) loops and exciting clear jingle (MintoDog). Do not create placeholder music URLs. Lab at `/audio-lab/` preloads recommended defaults for audition.

## Validation
Run npm test and npm run build. Manual checks: first gesture, mute persistence, parent sliders, repeated snaps, final snap, replay, navigation, hidden tab, failed audio load, mobile Safari/Chrome. No human listening approval claimed.
