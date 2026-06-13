// Paramètres légaux et fiscaux (Gabon / QTB)
// Reproduit l'onglet "Parametres" du fichier Excel.
// Source: CLEISS, DGI Gabon, Code du travail gabonais (voir notes).

export interface IrppBracket {
  seuil: number; // seuil inférieur
  taux: number; // taux marginal
  deduction: number; // déduction
}

export interface Params {
  smig: number; // SMIG / salaire minimum
  rmm: number; // revenu minimum mensuel (contrôle interne)
  tauxCnssSal: number;
  tauxCnamgsSal: number;
  tauxCnssEmp: number;
  tauxCnamgsEmp: number;
  plafondCnss: number;
  plafondCnamgs: number;
  abattementIrpp: number;
  seuilTcs: number;
  tauxTcs: number;
  plafondLogement: number;
  congesMajeur: number; // jours/mois
  congesMineur: number; // jours/mois
  joursReference: number;
  // Barème IRPP numérique éditable
  bareme: IrppBracket[];
  // Paramètres d'optimisation du calcul inversé
  brutMinReco: number; // brut imposable minimum recommandé
  optTransport: number;
  optPanier: number;
  optSalissure: number;
  optDeplacement: number;
  optLogement: number;
}

export const DEFAULT_PARAMS: Params = {
  smig: 80000,
  rmm: 150000,
  tauxCnssSal: 0.05,
  tauxCnamgsSal: 0.02,
  tauxCnssEmp: 0.18,
  tauxCnamgsEmp: 0.041,
  plafondCnss: 1500000,
  plafondCnamgs: 2500000,
  abattementIrpp: 0.2,
  seuilTcs: 150000,
  tauxTcs: 0.05,
  plafondLogement: 250000,
  congesMajeur: 2,
  congesMineur: 2.5,
  joursReference: 30,
  bareme: [
    { seuil: 0, taux: 0, deduction: 0 },
    { seuil: 125000, taux: 0.05, deduction: 6250 },
    { seuil: 160000, taux: 0.1, deduction: 14250 },
    { seuil: 225000, taux: 0.15, deduction: 25500 },
    { seuil: 300000, taux: 0.2, deduction: 40500 },
    { seuil: 500000, taux: 0.25, deduction: 65500 },
    { seuil: 1000000, taux: 0.3, deduction: 115500 },
    { seuil: 2000000, taux: 0.35, deduction: 215500 },
  ],
  brutMinReco: 150000,
  optTransport: 25000,
  optPanier: 50000,
  optSalissure: 50000,
  optDeplacement: 0,
  optLogement: 50000,
};

const STORAGE_KEY = 'qtb_params_v1';

export function loadParams(): Params {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PARAMS };
    const parsed = JSON.parse(raw);
    // Fusion défensive : tout champ manquant retombe sur le défaut.
    return { ...DEFAULT_PARAMS, ...parsed, bareme: parsed.bareme ?? DEFAULT_PARAMS.bareme };
  } catch {
    return { ...DEFAULT_PARAMS };
  }
}

export function saveParams(p: Params) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetParams() {
  localStorage.removeItem(STORAGE_KEY);
}
