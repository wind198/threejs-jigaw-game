# Audio foundation

Howler owns playback; the root provider maps routes and puzzle callbacks to audio. Existing sound preference is master mute; music and effects have independent persistent controls. No audio is required for gameplay. Playback is gated by a gesture and visibility. No external requests for audio.

## Asset handoff
Production catalog (`AUDIO_CATALOG`) enables toddler-friendly browse/play loops (heartade), wooden snap impacts (Kenney), and the exciting clear jingle (MintoDog). `/play/*` uses playing music; other routes use browsing. Puzzle lock → snap; completion → success with music duck. Lab at `/audio-lab/` remains for audition.

## Validation
Run npm test and npm run build. Manual checks: first gesture, mute persistence, parent sliders, repeated snaps, final snap, replay, navigation, hidden tab, failed audio load, mobile Safari/Chrome. No human listening approval claimed.
