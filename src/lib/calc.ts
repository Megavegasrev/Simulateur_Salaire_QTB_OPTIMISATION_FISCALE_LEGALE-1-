// Moteur de calcul de paie QTB (Gabon).
// Reproduit fidèlement les formules des onglets Excel :
// Simulateur, Comparateur, Calcul_Inverse, Cumul_Conges.

import type { IrppBracket, Params } from './params';

/** Reproduit Excel LOOKUP(valeur, seuils, colonne) sur un barème trié par seuil croissant.
 *  Renvoie l'entrée dont le seuil est le plus grand <= valeur. */
function lookupBracket(value: number, bareme: IrppBracket[]): IrppBracket {
  let found = bareme[0];
  for (const b of bareme) {
    if (b.seuil <= value) found = b;
    else break;
  }
  return found;
}

// ─────────────────────────────────────────────────────────────
// SIMULATEUR (calcul direct) + base du COMPARATEUR
// ─────────────────────────────────────────────────────────────

export interface SalaireInputs {
  salaireBase: number;
  sursalaire: number;
  heuresSupp: number;
  primeAnciennete: number;
  primeRendement: number;
  primeAssiduite: number;
  primeRisque: number;
  primeResponsabilite: number;
  // Indemnités & primes exonérées
  transport: number;
  panier: number;
  salissure: number;
  deplacement: number;
  logement: number;
}

export interface SalaireResult {
  brutImposable: number;
  cnssSal: number; // négatif
  cnamgsSal: number; // négatif
  netSocial: number;
  tcs: number; // négatif
  baseIrpp: number;
  irpp: number; // négatif
  indemnitesExonerees: number;
  netAPayer: number;
  // Employeur
  chargesPatronales: number;
  provisionConges: number;
  coutMensuelEmployeur: number;
  coutAnnuelEmployeur: number;
  // Contrôles
  ctrlSmig: boolean;
  ctrlRmm: boolean;
  ctrlLogement: boolean;
}

export function emptySalaireInputs(): SalaireInputs {
  return {
    salaireBase: 0,
    sursalaire: 0,
    heuresSupp: 0,
    primeAnciennete: 0,
    primeRendement: 0,
    primeAssiduite: 0,
    primeRisque: 0,
    primeResponsabilite: 0,
    transport: 0,
    panier: 0,
    salissure: 0,
    deplacement: 0,
    logement: 0,
  };
}

export function computeSalaire(i: SalaireInputs, p: Params): SalaireResult {
  const sommeImposable =
    i.salaireBase +
    i.sursalaire +
    i.heuresSupp +
    i.primeAnciennete +
    i.primeRendement +
    i.primeAssiduite +
    i.primeRisque +
    i.primeResponsabilite;

  // C24 : brut imposable + excédent logement au-delà du plafond exonéré
  const brutImposable = sommeImposable + Math.max(0, i.logement - p.plafondLogement);

  const cnssSal = -Math.min(brutImposable, p.plafondCnss) * p.tauxCnssSal;
  const cnamgsSal = -Math.min(brutImposable, p.plafondCnamgs) * p.tauxCnamgsSal;
  const netSocial = brutImposable + cnssSal + cnamgsSal;
  const tcs = -Math.max(0, netSocial - p.seuilTcs) * p.tauxTcs;
  const baseIrpp = Math.max(0, (netSocial + tcs) * (1 - p.abattementIrpp));
  const b = lookupBracket(baseIrpp, p.bareme);
  const irpp = -Math.max(0, baseIrpp * b.taux - b.deduction);

  // C31 : indemnités exonérées (logement plafonné)
  const indemnitesExonerees =
    i.transport + i.panier + i.salissure + i.deplacement + Math.min(i.logement, p.plafondLogement);

  const netAPayer = netSocial + tcs + irpp + indemnitesExonerees;

  const chargesPatronales =
    Math.min(brutImposable, p.plafondCnss) * p.tauxCnssEmp +
    Math.min(brutImposable, p.plafondCnamgs) * p.tauxCnamgsEmp;
  const provisionConges = (brutImposable * p.congesMajeur) / p.joursReference;
  const coutMensuelEmployeur =
    brutImposable + indemnitesExonerees + chargesPatronales + provisionConges;
  const coutAnnuelEmployeur = coutMensuelEmployeur * 12;

  return {
    brutImposable,
    cnssSal,
    cnamgsSal,
    netSocial,
    tcs,
    baseIrpp,
    irpp,
    indemnitesExonerees,
    netAPayer,
    chargesPatronales,
    provisionConges,
    coutMensuelEmployeur,
    coutAnnuelEmployeur,
    ctrlSmig: i.salaireBase >= p.smig,
    ctrlRmm: brutImposable + indemnitesExonerees >= p.rmm,
    ctrlLogement: i.logement <= p.plafondLogement,
  };
}

// ─────────────────────────────────────────────────────────────
// CALCUL INVERSÉ : budget employeur → net salarié maximal
// ─────────────────────────────────────────────────────────────

export interface InverseRubrique {
  utiliser: boolean;
  maxJustifie: number;
}

export interface InverseInputs {
  coutTotal: number; // budget employeur accepté
  brutMin: number; // brut imposable minimum à respecter
  precision: number; // arrondi au millier inférieur
  transport: InverseRubrique;
  panier: InverseRubrique;
  salissure: InverseRubrique;
  deplacement: InverseRubrique;
  logement: InverseRubrique;
}

export interface InverseResult {
  indemnitesAdmissibles: number; // E16
  coutBrutMin: number; // C19
  totalIndemnitesPotentielles: number; // C20
  indemnitesRetenues: number; // C21
  budgetRestant: number; // C22
  brutImposable: number; // C25
  indemnites: number; // C26 = E16
  cnssSal: number;
  cnamgsSal: number;
  netSocial: number;
  tcs: number;
  baseIrpp: number;
  irpp: number;
  netAPayer: number; // C33
  chargesPatronales: number;
  provisionConges: number;
  coutEmployeurRecalcule: number; // C36
  ecartBudget: number; // C37
  tauxConversion: number; // C38
  controle: 'INSUFFISANT' | 'ECART' | 'COHERENT';
}

export function defaultInverseInputs(p: Params): InverseInputs {
  return {
    coutTotal: 500000,
    brutMin: p.brutMinReco,
    precision: 1000,
    transport: { utiliser: true, maxJustifie: p.optTransport },
    panier: { utiliser: true, maxJustifie: p.optPanier },
    salissure: { utiliser: true, maxJustifie: p.optSalissure },
    deplacement: { utiliser: false, maxJustifie: p.optDeplacement },
    logement: { utiliser: true, maxJustifie: p.optLogement },
  };
}

export function computeInverse(i: InverseInputs, p: Params): InverseResult {
  const rubriques = [i.transport, i.panier, i.salissure, i.deplacement, i.logement];

  // C19 : coût employeur du brut minimum
  const coutBrutMin =
    i.brutMin +
    Math.min(i.brutMin, p.plafondCnss) * p.tauxCnssEmp +
    Math.min(i.brutMin, p.plafondCnamgs) * p.tauxCnamgsEmp +
    (i.brutMin * p.congesMajeur) / p.joursReference;

  // D16 : total des maximums "Oui"
  const totalIndemnitesPotentielles = rubriques.reduce(
    (s, r) => s + (r.utiliser ? r.maxJustifie : 0),
    0,
  );

  // C21 : indemnités retenues (plafonnées par le budget disponible)
  const indemnitesRetenues = Math.min(
    totalIndemnitesPotentielles,
    Math.max(0, i.coutTotal - coutBrutMin),
  );

  // E11..E15 : cascade d'allocation des indemnités dans la limite C21
  let cumul = 0;
  let indemnitesAdmissibles = 0;
  for (const r of rubriques) {
    const dispo = Math.max(0, indemnitesRetenues - cumul);
    const montant = Math.min(r.utiliser ? r.maxJustifie : 0, dispo);
    indemnitesAdmissibles += montant;
    cumul += montant;
  }

  // C22 : budget restant pour le brut imposable
  const budgetRestant = Math.max(0, i.coutTotal - indemnitesRetenues);

  // C25 : brut imposable estimé (formule fermée par paliers CNSS/CNAMGS)
  const cMaj = p.congesMajeur / p.joursReference;
  const fPlein = 1 + p.tauxCnssEmp + p.tauxCnamgsEmp + cMaj;
  let brutRaw: number;
  if (budgetRestant <= p.plafondCnss * fPlein) {
    brutRaw = budgetRestant / fPlein;
  } else if (
    budgetRestant <=
    p.plafondCnamgs * (1 + p.tauxCnamgsEmp + cMaj) + p.plafondCnss * p.tauxCnssEmp
  ) {
    brutRaw =
      (budgetRestant - p.plafondCnss * p.tauxCnssEmp) / (1 + p.tauxCnamgsEmp + cMaj);
  } else {
    brutRaw =
      (budgetRestant - p.plafondCnss * p.tauxCnssEmp - p.plafondCnamgs * p.tauxCnamgsEmp) /
      (1 + cMaj);
  }

  let brutImposable: number;
  if (i.precision <= 0) {
    brutImposable = 0;
  } else {
    const arrondi = Math.floor(brutRaw / i.precision) * i.precision;
    brutImposable = i.coutTotal < coutBrutMin ? arrondi : Math.max(i.brutMin, arrondi);
  }

  // Aval : on rejoue le calcul direct sur le brut estimé + indemnités admissibles
  const indemnites = indemnitesAdmissibles;
  const cnssSal = -Math.min(brutImposable, p.plafondCnss) * p.tauxCnssSal;
  const cnamgsSal = -Math.min(brutImposable, p.plafondCnamgs) * p.tauxCnamgsSal;
  const netSocial = brutImposable + cnssSal + cnamgsSal;
  const tcs = -Math.max(0, netSocial - p.seuilTcs) * p.tauxTcs;
  const baseIrpp = Math.max(0, (netSocial + tcs) * (1 - p.abattementIrpp));
  const b = lookupBracket(baseIrpp, p.bareme);
  const irpp = -Math.max(0, baseIrpp * b.taux - b.deduction);
  const netAPayer = netSocial + tcs + irpp + indemnites;

  const chargesPatronales =
    Math.min(brutImposable, p.plafondCnss) * p.tauxCnssEmp +
    Math.min(brutImposable, p.plafondCnamgs) * p.tauxCnamgsEmp;
  const provisionConges = (brutImposable * p.congesMajeur) / p.joursReference;
  const coutEmployeurRecalcule = brutImposable + indemnites + chargesPatronales + provisionConges;
  const ecartBudget = i.coutTotal - coutEmployeurRecalcule;
  const tauxConversion = i.coutTotal !== 0 ? netAPayer / i.coutTotal : 0;

  let controle: InverseResult['controle'];
  if (i.coutTotal < coutBrutMin) controle = 'INSUFFISANT';
  else if (Math.abs(ecartBudget) > i.precision) controle = 'ECART';
  else controle = 'COHERENT';

  return {
    indemnitesAdmissibles,
    coutBrutMin,
    totalIndemnitesPotentielles,
    indemnitesRetenues,
    budgetRestant,
    brutImposable,
    indemnites,
    cnssSal,
    cnamgsSal,
    netSocial,
    tcs,
    baseIrpp,
    irpp,
    netAPayer,
    chargesPatronales,
    provisionConges,
    coutEmployeurRecalcule,
    ecartBudget,
    tauxConversion,
    controle,
  };
}

// ─────────────────────────────────────────────────────────────
// CUMUL CONGÉS PAYÉS
// ─────────────────────────────────────────────────────────────

export interface CongesInputs {
  salaireMensuel: number;
  dureeTravaillee: number; // mois
  profil: 'Majeur' | 'Mineur';
  joursPris: number;
  joursReferenceMois: number;
}

export interface CongesResult {
  joursAcquisParMois: number;
  joursAcquisCumules: number;
  joursRestant: number;
  salaireJournalier: number;
  valeurAcquis: number;
  valeurRestant: number;
  provisionMensuelle: number;
  table: { mois: number; joursCumules: number; valeurCumulee: number }[];
}

export function defaultCongesInputs(): CongesInputs {
  return {
    salaireMensuel: 150000,
    dureeTravaillee: 6,
    profil: 'Majeur',
    joursPris: 0,
    joursReferenceMois: 30,
  };
}

export function computeConges(i: CongesInputs, p: Params): CongesResult {
  const joursAcquisParMois = i.profil === 'Mineur' ? p.congesMineur : p.congesMajeur;
  const joursAcquisCumules = i.dureeTravaillee * joursAcquisParMois;
  const joursRestant = Math.max(0, joursAcquisCumules - i.joursPris);
  const salaireJournalier = i.joursReferenceMois !== 0 ? i.salaireMensuel / i.joursReferenceMois : 0;
  const valeurAcquis = joursAcquisCumules * salaireJournalier;
  const valeurRestant = joursRestant * salaireJournalier;
  const provisionMensuelle =
    i.joursReferenceMois !== 0 ? (i.salaireMensuel * joursAcquisParMois) / i.joursReferenceMois : 0;

  const nbMois = Math.max(1, Math.min(60, Math.ceil(i.dureeTravaillee)));
  const table = [];
  for (let m = 1; m <= nbMois; m++) {
    const joursCumules = m * joursAcquisParMois;
    table.push({ mois: m, joursCumules, valeurCumulee: joursCumules * salaireJournalier });
  }

  return {
    joursAcquisParMois,
    joursAcquisCumules,
    joursRestant,
    salaireJournalier,
    valeurAcquis,
    valeurRestant,
    provisionMensuelle,
    table,
  };
}

// ─────────────────────────────────────────────────────────────
// Formatage
// ─────────────────────────────────────────────────────────────

export function fcfa(n: number): string {
  const rounded = Math.round(n);
  return rounded.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA';
}

export function num(n: number, digits = 2): string {
  return n.toLocaleString('fr-FR', { maximumFractionDigits: digits });
}
