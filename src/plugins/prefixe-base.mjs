// Ajoute BASE devant les liens qui commencent par « / » dans le Markdown
// (ex. /pdf/brochure.pdf → /site-prospective/pdf/brochure.pdf).
// Sans effet quand BASE vaut « / ».
export default function prefixeBase(base) {
  const prefixe = base.replace(/\/$/, '');

  return {
    name: 'prefixe-base',
    element: {
      filter: ['a', 'img'],
      visit(node, ctx) {
        if (!prefixe) return;
        for (const attr of ['href', 'src']) {
          const valeur = node.properties?.[attr];
          if (
            typeof valeur === 'string' &&
            valeur.startsWith('/') &&
            !valeur.startsWith('//') &&
            !valeur.startsWith(prefixe + '/')
          ) {
            ctx.setProperty(node, attr, prefixe + valeur);
          }
        }
      },
    },
  };
}
