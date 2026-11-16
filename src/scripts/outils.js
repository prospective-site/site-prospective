// Outils interactifs des pages : tri des tâches, chaîne de valeur, diagnostic éclair.
// Le contenu vient des blocs « ::: » du Markdown (voir README). Sans JavaScript,
// il reste affiché tel quel, en listes et en cartes. Rien n'est envoyé ni enregistré.

const element = (balise, classe, texte) => {
  const el = document.createElement(balise);
  if (classe) el.className = classe;
  if (texte !== undefined) el.textContent = texte;
  return el;
};

// ── Tri : filtrer les tâches par dimension ───────────────
// Chaque tâche commence par sa dimension en gras : « - **Piloter** Compiler… »
document.querySelectorAll('.tri').forEach((tri) => {
  const dimension = (li) => li.firstElementChild?.textContent.trim();
  const taches = [...tri.querySelectorAll('li')].filter(
    (li) => li.firstElementChild?.tagName === 'STRONG',
  );
  const dimensions = [...new Set(taches.map(dimension))];
  if (!dimensions.length) return;

  const filtre = element('div', 'filtre');
  filtre.setAttribute('role', 'group');
  filtre.setAttribute('aria-label', 'Filtrer par dimension');

  const boutons = ['Toutes les dimensions', ...dimensions].map((nom, i) => {
    const bouton = element('button', '', nom);
    bouton.type = 'button';
    bouton.setAttribute('aria-pressed', String(i === 0));
    bouton.addEventListener('click', () => {
      boutons.forEach((b) => b.setAttribute('aria-pressed', String(b === bouton)));
      taches.forEach((li) => li.classList.toggle('estompe', i > 0 && dimension(li) !== nom));
    });
    return bouton;
  });

  filtre.append(...boutons);
  tri.before(filtre);
});

// ── Chaîne de valeur : un onglet par maillon ─────────────
// Le niveau de la jauge est lu dans le texte « … : 4 sur 5 ».
document.querySelectorAll('.chaine').forEach((chaine, n) => {
  const maillons = [...chaine.querySelectorAll(':scope > .maillon')];
  if (!maillons.length) return;

  const onglets = element('div', 'onglets');
  onglets.setAttribute('role', 'tablist');
  onglets.setAttribute('aria-label', 'Maillons de la chaîne de valeur');

  const boutons = maillons.map((maillon, i) => {
    const id = `chaine-${n}-${i}`;
    const niveau = Number(
      maillon.querySelector('.potentiel')?.textContent.match(/(\d)\s*sur\s*5/)?.[1] ?? 0,
    );

    maillon.id = id;
    maillon.setAttribute('role', 'tabpanel');
    maillon.setAttribute('aria-labelledby', `${id}-onglet`);
    maillon.tabIndex = 0;

    const bouton = element('button');
    bouton.type = 'button';
    bouton.id = `${id}-onglet`;
    bouton.setAttribute('role', 'tab');
    bouton.setAttribute('aria-controls', id);
    bouton.append(
      element('span', 'numero', String(i + 1).padStart(2, '0')),
      element('span', 'nom', maillon.querySelector('h3')?.textContent.trim() ?? ''),
    );
    if (niveau) {
      const jauge = element('span', 'jauge');
      jauge.setAttribute('aria-hidden', 'true');
      for (let k = 0; k < 5; k++) jauge.append(element('i', k < niveau ? 'plein' : ''));
      bouton.append(jauge);
    }
    return bouton;
  });

  const choisir = (i, focus = false) => {
    boutons.forEach((b, k) => {
      b.setAttribute('aria-selected', String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      maillons[k].hidden = k !== i;
    });
    if (focus) boutons[i].focus();
  };

  // Sur téléphone, les onglets sont au-dessus du maillon : on y descend après le choix.
  const empile = window.matchMedia('(max-width: 47.99rem)');

  boutons.forEach((bouton, i) => {
    bouton.addEventListener('click', () => {
      choisir(i);
      if (empile.matches) maillons[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    bouton.addEventListener('keydown', (e) => {
      const fin = boutons.length - 1;
      const cible = {
        ArrowDown: i === fin ? 0 : i + 1,
        ArrowRight: i === fin ? 0 : i + 1,
        ArrowUp: i === 0 ? fin : i - 1,
        ArrowLeft: i === 0 ? fin : i - 1,
        Home: 0,
        End: fin,
      }[e.key];
      if (cible === undefined) return;
      e.preventDefault();
      choisir(cible, true);
    });
  });

  onglets.append(...boutons);
  chaine.prepend(onglets);
  chaine.classList.add('interactive');
  choisir(0);
});

// ── Parcours : étapes cliquables, détail dans un encadré ──
// Des blocs « :::etape » (titre ###, bloc « résumé », texte, puis #### Outils et
// une liste). Une piste de cercles numérotés est ajoutée au-dessus ; un clic sur
// un cercle affiche l'étape dans l'encadré. Sans JavaScript, les étapes se suivent.
document.querySelectorAll('.parcours').forEach((parcours, n) => {
  const etapes = [...parcours.querySelectorAll(':scope > .etape')];
  if (!etapes.length) return;

  const piste = element('div', 'piste');
  piste.setAttribute('role', 'tablist');
  piste.setAttribute('aria-label', 'Étapes de la démarche');

  const boutons = etapes.map((etape, i) => {
    const id = `parcours-${n}-${i}`;
    const titre = etape.querySelector('h3');
    const nom = titre?.textContent.trim() ?? '';
    const resume = etape.querySelector('.resume')?.textContent.trim();
    titre?.prepend(element('span', 'numero', `${String(i + 1).padStart(2, '0')} · `));

    etape.id = id;
    etape.setAttribute('role', 'tabpanel');
    etape.setAttribute('aria-labelledby', `${id}-onglet`);
    etape.tabIndex = 0;

    const bouton = element('button', 'etape-bouton');
    bouton.type = 'button';
    bouton.id = `${id}-onglet`;
    bouton.setAttribute('role', 'tab');
    bouton.setAttribute('aria-controls', id);
    const cercle = element('span', 'cercle', String(i + 1));
    cercle.setAttribute('aria-hidden', 'true');
    bouton.append(cercle, element('span', 'nom', nom));
    if (resume) bouton.append(element('span', 'resume-court', resume));
    return bouton;
  });

  const choisir = (i, focus = false) => {
    boutons.forEach((b, k) => {
      b.setAttribute('aria-selected', String(k === i));
      b.classList.toggle('franchie', k < i);
      b.tabIndex = k === i ? 0 : -1;
      etapes[k].hidden = k !== i;
    });
    // Le trait de la piste se remplit jusqu'à l'étape choisie.
    piste.style.setProperty('--avancement', String(etapes.length > 1 ? i / (etapes.length - 1) : 0));
    if (focus) boutons[i].focus();
  };

  boutons.forEach((bouton, i) => {
    bouton.addEventListener('click', () => choisir(i));
    bouton.addEventListener('keydown', (e) => {
      const fin = boutons.length - 1;
      const cible = {
        ArrowRight: i === fin ? 0 : i + 1,
        ArrowDown: i === fin ? 0 : i + 1,
        ArrowLeft: i === 0 ? fin : i - 1,
        ArrowUp: i === 0 ? fin : i - 1,
        Home: 0,
        End: fin,
      }[e.key];
      if (cible === undefined) return;
      e.preventDefault();
      choisir(cible, true);
    });
  });

  piste.append(...boutons);
  parcours.prepend(piste);
  parcours.classList.add('interactif');
  choisir(0);
});

// ── Diagnostic éclair : questions à choix, puis un profil ─
// Une liste numérotée de questions, chacune suivie de ses choix (du plus faible
// au plus fort), puis un bloc « résultat » par profil, du plus faible au plus fort.
document.querySelectorAll('.diagnostic').forEach((diagnostic, n) => {
  const liste = diagnostic.querySelector(':scope > ol');
  const resultats = [...diagnostic.querySelectorAll(':scope > .resultat')];
  if (!liste || !resultats.length) return;

  const formulaire = element('form', 'questionnaire');
  [...liste.children].forEach((question, q) => {
    const choix = [...(question.querySelector('ul')?.children ?? [])];
    const enonce = question.cloneNode(true);
    enonce.querySelector('ul')?.remove();

    const groupe = element('fieldset');
    groupe.append(element('legend', '', `${q + 1}. ${enonce.textContent.trim()}`));
    const echelle = element('div', 'echelle');
    choix.forEach((c, valeur) => {
      const etiquette = element('label');
      const bouton = element('input');
      bouton.type = 'radio';
      bouton.name = `diagnostic-${n}-${q}`;
      bouton.value = String(valeur);
      etiquette.append(bouton, element('span', '', c.textContent.trim()));
      echelle.append(etiquette);
    });
    groupe.append(echelle);
    formulaire.append(groupe);
  });

  const envoyer = element('button', 'bouton', 'Voir mon profil');
  envoyer.type = 'submit';
  const message = element('p', 'message');
  message.setAttribute('aria-live', 'polite');
  formulaire.append(envoyer, message);

  liste.replaceWith(formulaire);
  resultats.forEach((r) => {
    r.hidden = true;
    r.tabIndex = -1;
  });

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    const groupes = [...formulaire.querySelectorAll('fieldset')];
    const reponses = groupes.map((g) => g.querySelector('input:checked'));
    resultats.forEach((r) => (r.hidden = true));

    if (reponses.some((r) => !r)) {
      message.textContent = `Répondez aux ${groupes.length} questions pour obtenir votre profil.`;
      return;
    }

    const maximum = groupes.reduce((s, g) => s + g.querySelectorAll('input').length - 1, 0);
    const total = reponses.reduce((s, r) => s + Number(r.value), 0);
    const pourcentage = Math.round((total / maximum) * 100);
    const profil = Math.min(
      resultats.length - 1,
      Math.floor((pourcentage / 100) * resultats.length),
    );

    message.textContent = `Votre score : ${pourcentage} %. Votre profil s'affiche ci-dessous.`;
    resultats[profil].hidden = false;
    resultats[profil].focus();
  });
});

// ── Quadrants : atteignables au clavier ou d'un toucher sur tablette ──
// Le texte de l'engagement s'affiche au survol et au focus (voir site.css).
document.querySelectorAll('.quadrant').forEach((quadrant) => {
  quadrant.tabIndex = 0;
});

// ── Catalogue : expertise → titres → description, en trois colonnes ──
// Des sections « :::colonne » (pictogramme, titre ###, fiches « :::::fiche{#id} »
// avec titre ####, durées, public, description). Colonne 1 : les expertises ;
// colonne 2 : les titres de l'expertise choisie ; colonne 3 : la fiche choisie.
// Sur téléphone, les trois blocs s'empilent. Une ancre (#id) ouvre une fiche.
// Sans JavaScript, les fiches complètes restent dans leurs sections.
document.querySelectorAll('.catalogue').forEach((catalogue, n) => {
  const colonnes = [...catalogue.querySelectorAll(':scope > .colonne')];
  const fiches = [...catalogue.querySelectorAll('.fiche')];
  if (!colonnes.length || !fiches.length) return;

  const zone = element('div', 'catalogue-zone');
  catalogue.before(zone);

  const choix = element('div', 'choix-expertises');
  choix.setAttribute('role', 'group');
  choix.setAttribute('aria-label', 'Expertises');

  const detail = element('div', 'catalogue-detail');
  detail.setAttribute('aria-live', 'polite');
  const invite = element('p', 'invite', 'Choisissez une formation ou une conférence pour en voir la description.');
  detail.append(invite);

  const empile = window.matchMedia('(max-width: 63.99rem)');
  const doux = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onglets = []; // [bouton, colonne]
  const paires = []; // [bouton, fiche, colonne]

  const montrerExpertise = (colonne) => {
    onglets.forEach(([b, c]) => {
      b.setAttribute('aria-pressed', String(c === colonne));
      c.hidden = c !== colonne;
    });
  };

  const choisir = (fiche, defiler) => {
    invite.hidden = Boolean(fiche);
    paires.forEach(([b, f]) => {
      b.setAttribute('aria-pressed', String(f === fiche));
      f.hidden = f !== fiche;
    });
    // Sur téléphone, la description est sous la liste : on y descend.
    if (!fiche || !defiler || !empile.matches) return;
    const r = detail.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      detail.scrollIntoView({ behavior: doux() ? 'smooth' : 'auto', block: 'nearest' });
    }
  };

  colonnes.forEach((colonne, i) => {
    colonne.id = colonne.id || `catalogue-${n}-expertise-${i}`;

    // Colonne 1 : un bouton par expertise (icône et nom)
    const onglet = element('button');
    onglet.type = 'button';
    onglet.setAttribute('aria-pressed', 'false');
    onglet.setAttribute('aria-controls', colonne.id);
    const icone = colonne.querySelector('.pictogramme')?.cloneNode(true);
    if (icone) onglet.append(icone);
    onglet.append(element('span', 'nom', colonne.querySelector('h3')?.textContent.trim() ?? ''));
    onglet.addEventListener('click', () => {
      montrerExpertise(colonne);
      choisir(null, false);
    });
    choix.append(onglet);
    onglets.push([onglet, colonne]);

    // Colonne 2 : les titres de l'expertise
    const liste = element('ul', 'titres-catalogue');
    colonne.querySelectorAll(':scope > .fiche').forEach((fiche) => {
      const bouton = element('button', '', fiche.querySelector('h4')?.textContent.trim() ?? '');
      bouton.type = 'button';
      bouton.setAttribute('aria-pressed', 'false');
      bouton.setAttribute('aria-controls', fiche.id);
      bouton.addEventListener('click', () => {
        choisir(fiche, true);
        history.replaceState(null, '', `#${fiche.id}`);
      });
      const li = element('li');
      li.append(bouton);
      liste.append(li);
      paires.push([bouton, fiche, colonne]);
      fiche.hidden = true;
      detail.append(fiche); // Colonne 3 : la fiche choisie
    });
    colonne.append(liste);
  });

  zone.append(choix, catalogue, detail);
  catalogue.classList.add('interactif');

  // Arrivée par un lien vers une fiche ; sinon, première expertise et première fiche.
  const depuisAncre = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const paire = paires.find(([, f]) => f.id === id);
    if (!paire) return false;
    montrerExpertise(paire[2]);
    choisir(paire[1], false);
    (empile.matches ? detail : zone).scrollIntoView({ block: empile.matches ? 'center' : 'start' });
    return true;
  };
  if (!depuisAncre()) {
    montrerExpertise(colonnes[0]);
    choisir(paires[0][1], false);
  }
  window.addEventListener('hashchange', depuisAncre);
});
