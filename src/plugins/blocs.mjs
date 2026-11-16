// Transforme les blocs « ::: » des fichiers Markdown en éléments mis en forme.
//
//   :::section{.rupture}   →  <section class="section rupture">
//   :::cartes, :::carte…   →  <div class="cartes">, <div class="carte">…
//   ::rendezvous[Texte]    →  bouton vers le lien de prise de rendez-vous
//   ::bouton[Texte]{href="/demarche/"}  →  bouton vers une page
//   :etiquette[Diagnostic] →  étiquette en tête de carte
//
// Les classes possibles sont décrites dans le README.
import { RENDEZVOUS } from '../reglages.mjs';

const classes = (nom, attributs) =>
  [nom, ...(attributs?.class ?? '').split(/\s+/)].filter(Boolean);

export default function blocs() {
  return {
    name: 'blocs',
    containerDirective(node, ctx) {
      ctx.setProperty(node, 'data', {
        hName: node.name === 'section' ? 'section' : 'div',
        hProperties: {
          className: classes(node.name, node.attributes),
          ...(node.attributes?.id ? { id: node.attributes.id } : {}),
        },
      });
    },
    leafDirective(node, ctx) {
      if (node.name !== 'rendezvous' && node.name !== 'bouton') return;
      const href = node.name === 'rendezvous' ? RENDEZVOUS : node.attributes?.href ?? '/';
      ctx.setProperty(node, 'data', {
        hName: 'a',
        hProperties: { href, className: classes('bouton', node.attributes) },
      });
    },
    // :etiquette[Introduction] → petite étiquette en tête de carte
    textDirective(node, ctx) {
      if (node.name !== 'etiquette') return;
      ctx.setProperty(node, 'data', {
        hName: 'span',
        hProperties: { className: classes('etiquette', node.attributes) },
      });
    },
  };
}

// Chargement différé des images placées dans les pages.
export function imagesLegeres() {
  return {
    name: 'images-legeres',
    element: {
      filter: ['img'],
      visit(node, ctx) {
        ctx.setProperty(node, 'loading', 'lazy');
        ctx.setProperty(node, 'decoding', 'async');
      },
    },
  };
}
