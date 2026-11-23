# Little Jigsaw — prompt library

This library produces **self-contained instructions for an image-capable GPT with access to GitHub**. The CLI composes the prompts; it does **not** generate images, push commits, or open pull requests.

The composed prompt now asks the receiving GPT to:
1. Generate **one** square, storybook-style PNG illustration.
2. Validate composition, child safety, and contrast with the game's cream/beige board.
3. Use a connected GitHub capability to submit **one PR per generated image** to [`wind198/threejs-jigaw-game`](https://github.com/wind198/threejs-jigaw-game), targeting `main`.
4. Add the actual PNG under `src/assets/puzzle-images/<category>/<theme-id>--<difficulty>.png`.
5. Return a verified PR URL, or explain if image-generation/GitHub tools are unavailable. **Never invent a PR.**

For example, generating `forest-friends` at `easy` difficulty requests this path:

```text
src/assets/puzzle-images/animals/forest-friends--easy.png
```

**Note:** The existing runtime puzzle catalog currently references `public/assets/puzzles/`. Committing an image under `src/assets/puzzle-images/` does **not automatically make it playable**. Publishing selected approved artwork and integrating it into `src/content/puzzles.ts` is a separate review task.

## Source layout

- `SYSTEM.md`: image-generation and GitHub PR submission contract
- `standards/`: mandatory illustration guidelines, contrast, composition, puzzle suitability, exclusions
- `difficulty/`: visual complexity profiles (independent of piece count)
- `themes/<category>/<id>.md`: independent scene briefs with YAML frontmatter
- `templates/final-prompt.md`: deterministic assembly template

Use `npm run prompts` for an interactive Clack session, `npm run prompts -- generate forest-friends` for one image prompt, or `npm run prompts -- generate --category animals` for a category. Run `npm run prompts -- validate` to validate the library. Generated prompts are written to gitignored `output/prompts/`.

Each `.txt` file is self-contained: manually copy it into an image-capable GPT that has the required GitHub connection. **Bulk CLI generation creates multiple independent prompt files; it does not automatically submit any PR.** Submit each prompt separately to generate a corresponding PR.

## Theme source format

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

Use category and IDs in lowercase kebab-case. IDs must be unique across categories. Shared mandatory standards take precedence over incompatible theme instructions.
