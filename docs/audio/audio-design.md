# Audio foundation

Howler owns playback; the root provider maps routes and puzzle callbacks to audio. Existing sound preference is master mute; music and effects have independent persistent controls. No audio is required for gameplay. Playback is gated by a gesture and visibility. No external requests for audio.

## Asset handoff
Only the pre-existing snap WAV is enabled. Browsing, playing and success slots are intentionally null pending licensed asset selection and listening approval. Do not create placeholder URLs. Next PR: audition playground, then add approved local assets, crossfades, and mobile listening QA. Existing snap provenance not verified in this change.

## Validation
Run npm test and npm run build. Manual checks: first gesture, mute persistence, parent sliders, repeated snaps, final snap, replay, navigation, hidden tab, failed audio load, mobile Safari/Chrome. No human listening approval claimed.
