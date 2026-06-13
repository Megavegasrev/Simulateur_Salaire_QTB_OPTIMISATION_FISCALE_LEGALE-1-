# Simulateur Salaire QTB — Application mobile (PWA)

Application mobile (PWA — Progressive Web App) reproduisant fidèlement le
simulateur de paie QTB *(optimisation fiscale légale, Gabon)*, à l'origine sous
forme de classeur Excel. Interface **bilingue français / 中文**, optimisée pour
téléphone, **installable sur l'écran d'accueil** (iPhone & Android) et
utilisable **hors connexion**.

## Modules

| Onglet | Description |
| --- | --- |
| 🧮 **Simulateur** | Calcul direct : rémunération saisie → net à payer + coût employeur. |
| 🎯 **Calcul inversé** | Budget employeur → net salarié maximal, avec optimisation légale des indemnités. |
| ⚖️ **Comparateur** | Comparaison de 3 structures salariales (meilleur net / coût le plus bas). |
| 🌴 **Cumul congés** | Valorisation et cumul des congés payés (majeur / mineur). |
| ⚙️ **Paramètres** | Taux légaux & fiscaux modifiables (CNSS, CNAMGS, barème IRPP, TCS, congés). |

Les paramètres sont enregistrés localement sur l'appareil et utilisés par tous
les modules. Tous les calculs reproduisent à l'identique les formules du fichier
Excel d'origine (vérifiés : net, coût employeur, charges, provisions…).

## Logique fiscale reproduite

- **CNSS / CNAMGS** salarié & employeur, avec plafonds de cotisation.
- **TCS** (taxe complémentaire sur salaires) sur la fraction au-delà du seuil.
- **IRPP** : abattement standard + barème numérique par tranches (LOOKUP).
- **Logement** : exonéré jusqu'au plafond, l'excédent réintégré au brut imposable.
- **Provision congés payés** : droit mensuel / jours de référence.
- **Contrôles de conformité** : SMIG, RMM, plafond logement.

> ⚠️ Les indemnités exonérées doivent être **réelles, justifiées et conformes**.
> Une prime fictive peut être requalifiée en salaire imposable et cotisable.
> Les barèmes (IRPP/TCS) sont à valider chaque année avec la DGI / comptabilité.

## Développement

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production -> dossier dist/
npm run preview  # prévisualiser le build de production
```

Stack : **React + TypeScript + Vite**, PWA via `vite-plugin-pwa`. Aucune
dépendance backend — tout est calculé côté client.

## Déploiement

Le projet est prêt pour **Vercel** (configuration dans `vercel.json`). Tout
hébergement de fichiers statiques convient : il suffit de servir le dossier
`dist/` généré par `npm run build`.

## Installer sur le téléphone

1. Ouvrir l'URL de l'application dans le navigateur du téléphone.
2. **iPhone (Safari)** : Partager → « Sur l'écran d'accueil ».
3. **Android (Chrome)** : menu ⋮ → « Ajouter à l'écran d'accueil » / « Installer l'application ».

L'application apparaît alors comme une vraie app, en plein écran et hors ligne.
