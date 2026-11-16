# Site Prospective

Site statique construit avec [Astro](https://astro.build).

## Où modifier quoi

| Je veux…                         | Où                                   |
| -------------------------------- | ------------------------------------ |
| Modifier le texte d'une page     | `contenu/pages/*.md`                 |
| Ajouter une page                 | Nouveau fichier `.md` dans `contenu/pages/` |
| Ajouter un PDF à télécharger     | Le déposer dans `public/pdf/`        |
| Ajouter une image ou un logo     | Version allégée dans `public/images/` |
| Changer le lien de rendez-vous ou les courriels | `src/reglages.mjs`     |
| Changer les couleurs, tailles, espacements | `src/styles/tokens.css`    |
| Changer l'apparence des éléments | `src/styles/site.css`                |
| Changer l'en-tête, le menu, le pied de page | `src/layouts/Base.astro`  |
| Changer l'adresse du site        | `astro.config.mjs` (lignes `SITE` et `BASE`) |

Chaque page commence par un en-tête :

```md
---
titre: Nom affiché dans l'onglet (et dans le menu)
menu: Libellé plus court dans le menu (facultatif)
description: Résumé pour les moteurs de recherche
ordre: 3          # position dans le menu (retirer = hors menu)
groupe: Expertises  # facultatif : range la page dans un sous-menu (« Expertises », « Approche »)
---
```

## Mettre en forme une page : les blocs « ::: »

Le texte s'écrit en Markdown ordinaire. Pour la mise en page, on l'entoure
de blocs qui commencent par `:::nom` et se terminent par `:::`. Un bloc placé
dans un autre prend **un deux-points de plus** (`::::`, puis `:::::`).

```md
:::section
## Titre de la section
Texte…

::::cartes
:::carte
### Première carte
Texte de la carte.
:::
::::
:::
```

| Bloc | Effet |
| --- | --- |
| `:::section` | Une bande de page. Variantes : `{.ouverture}` (haut de page, titre `#` ; une partie du titre entre astérisques, `# Texte. *Partie en couleur.*`, s'affiche en bleu nuit sur le reste du titre en noir), `{.douce}` (fond vert d'eau), `{.rupture}` (fond bleu nuit, pour l'appel final) |
| `::::cartes` / `:::carte` | Une grille de cartes. `::::cartes{.deux}` : deux colonnes. Une image seule en première ligne de la carte (`![](/images/ambiance/fichier.webp)`) s'affiche en photo de tête |
| `::::texte-photo` | Un bloc `:::::texte`, puis une image seule : texte et photo côte à côte (photo sous le texte sur téléphone). `{.inverse}` : photo à gauche |
| `::::diaporama` / `:::diapo` | Carrousel (accueil) : une diapositive par écran, avec flèches et pastilles. Chaque `:::diapo` : une image seule, un surtitre, un titre `##`, un paragraphe, un `::bouton`. Rien ne défile seul |
| `::::chiffres` | Une liste à puces `- **20+** libellé` affichée en chiffres clés |
| `::::tri` | Outil interactif : des `:::carte` dont chaque tâche commence par sa dimension en gras (`- **Piloter** Compiler les rapports`). Un filtre par dimension apparaît au-dessus |
| `::::chaine` | Outil interactif : des `:::maillon` (titre `###`, bloc `:::::potentiel` contenant « … : 4 sur 5 », puis intertitres `####`). Un onglet par maillon, avec une jauge |
| `::::parcours` | Outil interactif : des `:::etape` (titre `###`, bloc `:::::resume` d'une ligne, un paragraphe, puis `#### Outils` et une liste). Une piste de cercles numérotés s'affiche au-dessus ; un clic sur un cercle montre l'étape dans l'encadré |
| `::::catalogue` | Outil interactif en trois colonnes : des `:::colonne` (pictogramme, titre `###`, puis des `:::::fiche{#id}` avec titre `####`, durées, public et description). Colonne 1 : les expertises ; colonne 2 : les titres de l'expertise choisie ; colonne 3 : la fiche choisie. Sur téléphone, les blocs s'empilent. Un lien `/formations-conferences/#id` ouvre la fiche |
| `::::diagnostic` | Outil interactif : une liste numérotée de questions, chacune suivie de ses choix du plus faible au plus fort, puis un `:::resultat` par profil, du plus faible au plus fort |

Les trois outils interactifs (exemple complet : `outils.md`) fonctionnent
dans le navigateur du visiteur : rien n'est envoyé ni enregistré. Sans JavaScript, leur
contenu s'affiche en simples listes. Le code est dans `src/scripts/outils.js`.
| `::::etapes` | Une liste numérotée `1.` `2.`… affichée en étapes 01, 02… |
| `::::logos` | Une rangée de logos : une image par ligne, `![Nom](/images/clients/fichier.webp)` |
| `::::colonnes` | Une liste à puces sur deux colonnes |
| `::::references` | Une liste de publications : `- [Titre](lien) *Média*` |
| `::::boutons` | Plusieurs boutons côte à côte |
| `::rendezvous[Texte du bouton]` | Bouton vers la prise de rendez-vous (lien dans `src/reglages.mjs`) |
| `::bouton[Texte]{href="/demarche/"}` | Bouton vers une page. Ajouter `.secondaire` pour un bouton contour |
| `::::mosaique` | Une liste de liens `- [**Titre** suite](lien)` affichée en tuiles de couleurs alternées, en quinconce sur grand écran |
| `::::pastilles` | Une courte liste à puces affichée en étiquettes arrondies (enjeux, thèmes) |
| `::::quadrants` / `:::quadrant` | Cercle en quatre quadrants (Démarche) : dans chaque `:::quadrant`, une illustration `<svg class="illustration">`, un titre `###` et un paragraphe. Le titre s'affiche sur l'illustration ; au survol, le texte le remplace. Sur téléphone : des cartes empilées |
| `::::secteurs` / `:::secteur` | Quatre tuiles sombres en damier : dans chaque `:::secteur`, une illustration `<svg class="illustration">` en filigrane, un titre `###` et une ligne de texte, en clair |
| `::::encadre` | Encadré sur fond vert clair, avec un filet bleu à gauche. Peut commencer par un `:::::surtitre` |
| `:::::public` | Dans une carte, sous le titre : le public visé (formations, conférences) |
| `:etiquette[Diagnostic]` | Petite étiquette en tête de carte (type de service, format) |

Les couleurs de chaque variante respectent la charte : au plus trois couleurs
de la palette par section.

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
