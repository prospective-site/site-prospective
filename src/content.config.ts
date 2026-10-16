import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Chaque fichier .md du dossier « contenu/pages » devient une page du site.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './contenu/pages' }),
  schema: z.object({
    titre: z.string(),
    description: z.string().optional(),
    // Position dans le menu (1, 2, 3…). Absent = page hors menu.
    ordre: z.number().optional(),
  }),
});

export const collections = { pages };
