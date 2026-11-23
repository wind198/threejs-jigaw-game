# Storybook illustration system

This implementation replaces emoji glyphs in interactive game chrome with **Microsoft Fluent Emoji Flat** SVG assets, stored under `public/assets/illustrations/fluent/`.

- Functional actions (Home, Back, Hint, Audio, Restart, Settings): **Lucide React** components.
- Expressive illustrations (fox, rabbit, teddy bear, rocket, stars, sunflower): **Fluent Emoji Flat** locally bundled SVG.
- Reusable typed wrapper: `src/ui/components/IllustrationIcon.tsx`. It accepts `name`, `size`, `decorative`, `alt`, `className` and normal HTML image props.
- Decorative illustrations use empty alt text and `aria-hidden`. Informational images require meaningful alternative text.
- No Unicode emoji, remote icon fonts, or icon CDNs at runtime.
- Files are distributed under the upstream MIT license and credited in `public/assets/illustrations/fluent/`.

## Usage

```tsx
<IllustrationIcon name="fox" size={96} decorative />
<IllustrationIcon name="star" size={20} decorative />
<IllustrationIcon name="rocket" size={48} alt="Rocket illustration" />
```

Add an icon by copying the **Flat** SVG from Microsoft Fluent Emoji, updating its license provenance as needed, and adding a typed name to the wrapper. Do not add a second general-purpose React icon library for simple controls.

## Validation

`npm test` verifies that all declared local illustration assets and license documents exist and that the UI screens no longer contain emoji glyphs. `npm run build` verifies the production Next.js static export.

Original project: https://github.com/microsoft/fluentui-emoji
