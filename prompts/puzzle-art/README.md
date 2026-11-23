# Little Jigsaw — prompt library

This library is the source of truth for generating **self-contained text prompts** to copy manually into an image-generation tool. It does **not** call an image API.

- `SYSTEM.md`: universal square, age-safe, no-frame requirements
- `standards/`: non-negotiable art direction, composition, vintage-background contrast, puzzle suitability and exclusions
- `difficulty/`: optional scene complexity profiles, separate from the number of pieces
- `themes/<category>/<id>.md`: independent scene briefs with YAML frontmatter
- `templates/final-prompt.md`: deterministic assembly template

Use `npm run prompts` for a guided Clack session, or `npm run prompts -- generate --category animals` for a whole category. `npm run prompts -- validate` checks source definitions. Output is written under `output/prompts/` (gitignored).

All generated `.txt` prompts include the full instructions. There are no references to local Markdown files that an external image-generation provider would need to resolve. Copy the whole text file.

After manually generating and approving an illustration, save the final square image in `public/assets/puzzles/` and register it in `src/content/puzzles.ts`. Generated text files are **not** runtime assets.

Theme source format:

```md
---
id: forest-friends
title: Forest Friends
category: animals
difficulty: easy
---
# Scene
Describe an exact scene.

# Composition
Explain major elements.

# Color direction
Describe contrast.
```

Use category and IDs in lowercase kebab-case. IDs must be unique across categories. Keep the illustration style coherent across the whole library. The shared standards are mandatory and cannot be overridden by a theme brief.
