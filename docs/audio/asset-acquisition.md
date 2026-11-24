# Audio acquisition and review

Open /audio-lab/ in the development site. Download the candidate files using the source links shown there. Extract archives locally, then load individual tracks in the audition page. No remote audio is loaded by the app. The lab is unlinked and noindex, not access controlled.

Kenney Interface Sounds is listed as CC0 at https://kenney.nl/assets/interface-sounds. The MintoDog source pages could not be retrieved during this change; confirm author, title and license on the original download before redistribution. No new binary assets are included.

## Approval checklist
- Keep original download and source license evidence.
- Compare browsing and gameplay tracks at low volume on a phone speaker.
- Check loop seams and repeated snap feedback.
- Check success melody and music ducking.
- Use FFmpeg to transcode approved tracks to MP3 (music) or WAV/MP3 (short effects); audition again and check peak levels and loop seams.
- Record filename, source URL, author, license, modifications and SHA-256 in the asset manifest.
- Commit reviewed assets and enable the corresponding slots in audio.catalog.ts in a subsequent PR.

Target total audio budget: 4 MB. Do not ship entire effect packs or unverified tracks.
