// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import prefixeBase from './src/plugins/prefixe-base.mjs';
import blocs, { imagesLegeres } from './src/plugins/blocs.mjs';

// ─────────────────────────────────────────────────────────────
//  ADRESSE DU SITE — les deux seules lignes à changer le jour où
//  le site passera sur votre propre domaine.
//
//  Aujourd'hui (GitHub Pages) :
//    https://prospective-site.github.io/site-prospective/
//
//  Plus tard (votre domaine), remplacez par par exemple :
//    const SITE = 'https://www.votre-domaine.com';
//    const BASE = '/';
// ─────────────────────────────────────────────────────────────
const SITE = 'https://prospective-site.github.io';
const BASE = '/site-prospective';

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    // Permet d'écrire les liens dans les fichiers Markdown sans se
    // soucier de BASE : « /pdf/brochure.pdf » fonctionne partout.
    // Les blocs « ::: » (sections, cartes, boutons) : voir README.
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [blocs()],
      hastPlugins: [prefixeBase(BASE), imagesLegeres()],
    }),
  },
});
