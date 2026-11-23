import { z } from 'zod';

export const difficultySchema = z.enum(['easy', 'medium', 'hard']);
export type Difficulty = z.infer<typeof difficultySchema>;

export const themeMetadataSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase kebab-case'),
  title: z.string().trim().min(3),
  category: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase kebab-case'),
  difficulty: difficultySchema,
}).strict();

export type ThemeMetadata = z.infer<typeof themeMetadataSchema>;
export interface Theme extends ThemeMetadata {
  content: string;
  source: string;
}
