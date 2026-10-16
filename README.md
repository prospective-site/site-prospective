# Site Prospective

Site statique construit avec [Astro](https://astro.build).

## Où modifier quoi

| Je veux…                         | Où                                   |
| -------------------------------- | ------------------------------------ |
| Modifier le texte d'une page     | `contenu/pages/*.md`                 |
| Ajouter une page                 | Nouveau fichier `.md` dans `contenu/pages/` |
| Ajouter un PDF à télécharger     | Le déposer dans `public/pdf/`        |
| Changer l'apparence (couleurs…)  | `src/layouts/Base.astro`             |
| Changer l'adresse du site        | `astro.config.mjs` (lignes `SITE` et `BASE`) |

Chaque page commence par un en-tête :

```md
---
titre: Nom affiché dans le menu et l'onglet
description: Résumé pour les moteurs de recherche
ordre: 3          # position dans le menu (retirer = hors menu)
---
```

Le nom du fichier donne l'adresse : `services.md` → `/services/`.
`accueil.md` est la page d'accueil.

Lien vers un PDF dans une page : `[Télécharger](/pdf/mon-fichier.pdf)`.

## Commandes

```bash
npm install      # une seule fois, après avoir récupéré le projet
npm run dev      # aperçu local sur http://localhost:4321
npm run build    # construit le site dans dist/
```

## Mise en ligne

Chaque envoi (`git push`) sur la branche `main` publie le site
automatiquement sur GitHub Pages (`.github/workflows/deploy.yml`).

## Passer sur votre propre domaine

1. Dans `astro.config.mjs`, mettre `SITE` = `'https://www.votre-domaine.com'` et `BASE` = `'/'`.
2. Créer le fichier `public/CNAME` contenant uniquement `www.votre-domaine.com`.
3. Chez votre fournisseur de domaine, configurer le DNS vers GitHub Pages
   (voir la documentation GitHub « Managing a custom domain »).
4. Sur GitHub : Settings → Pages → Custom domain, saisir le domaine et cocher « Enforce HTTPS ».
