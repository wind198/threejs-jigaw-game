# Artwork color fidelity
## Cause
Artwork previously used MeshStandardMaterial under a warm directional light, hemisphere lighting and ACES filmic tone mapping with exposure 1.28. These change hue, luminance and saturation relative to the HTML image preview.
## Policy
- Printed face: MeshBasicMaterial, neutral white tint, toneMapped false, fog false. The face does not receive lighting or shadows, including shadows from other pieces.
- Texture: browser-decoded image drawn into an explicitly sRGB canvas at native raster dimensions, tagged SRGBColorSpace for GPU sampling.
- Output: retain renderer SRGBColorSpace. Do not change global light or exposure settings, since these still govern the tray, board and wooden edges.
- Mesh: retain castShadow and receiveShadow so the lit side walls and surrounding surfaces keep depth cues. The basic face itself is unlit.
- Intentional completion highlight remains a separate temporary overlay. No changes to snapping, stacking, pickup or geometry.
## Validation
Unit test checks material configuration, shared texture and shadow flags on 4/9/25-piece meshes. Browser QA must compare source preview to fully visible puzzle-face interior pixels at equivalent scaling, outside bevels, seams and the completion highlight. Resampling, antialiasing, display color management and texture filtering can cause pixel-level differences; do not claim pixel-identical output without measurement. Test light/exposure changes, overlapping pieces, drag shadows on board/tray and completion reveal. No extra dependencies.
