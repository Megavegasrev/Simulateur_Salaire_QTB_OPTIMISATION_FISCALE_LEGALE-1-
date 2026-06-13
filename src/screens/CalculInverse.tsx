import { useState } from 'react';
import type { Params } from '../lib/params';
import { computeInverse, defaultInverseInputs, fcfa, num, type InverseInputs, type InverseRubrique } from '../lib/calc';
import { Card, NumberField, Row, Segmented, Bi } from '../components';

const RUBRIQUES: { key: keyof Pick<InverseInputs, 'transport' | 'panier' | 'salissure' | 'deplacement' | 'logement'>; fr: string; zh: string }[] = [
  { key: 'transport', fr: 'Transport', zh: '交通' },
  { key: 'panier', fr: 'Panier', zh: '餐补' },
  { key: 'salissure', fr: 'Salissure', zh: '清洗' },
  { key: 'deplacement', fr: 'Déplacement', zh: '出差' },
  { key: 'logement', fr: 'Logement', zh: '住房' },
];

export default function CalculInverse({ params }: { params: Params }) {
  const [i, setI] = useState<InverseInputs>(() => defaultInverseInputs(params));
  const r = computeInverse(i, params);

  const setNum = (k: 'coutTotal' | 'brutMin' | 'precision') => (v: number) => setI((s) => ({ ...s, [k]: v }));
  const setRub = (k: (typeof RUBRIQUES)[number]['key'], patch: Partial<InverseRubrique>) =>
    setI((s) => ({ ...s, [k]: { ...s[k], ...patch } }));

  const banner =
    r.controle === 'INSUFFISANT'
      ? { cls: 'bad', txt: 'Budget insuffisant pour le brut minimum.' }
      : r.controle === 'ECART'
        ? { cls: 'warn', txt: 'Écart supérieur à la précision d\'arrondi.' }
        : { cls: 'good', txt: 'Optimisation cohérente — à valider.' };

  return (
    <div className="screen">
      <div className="screen-title">Calcul inversé — budget → net maximal / 反向计算</div>

      <div className="banner info">
        Optimisation légale : on alloue d'abord les indemnités réellement justifiables, puis le brut imposable avec le budget restant. ⚠️ Les indemnités doivent être réelles, justifiées et conformes — une prime fictive peut être requalifiée.
      </div>

      <Card title="Entrées" zh="输入">
        <NumberField fr="Coût mensuel total accepté (budget)" zh="雇主预算" value={i.coutTotal} onChange={setNum('coutTotal')} />
        <NumberField fr="Brut imposable minimum à respecter" zh="最低应税工资" value={i.brutMin} onChange={setNum('brutMin')} />
        <NumberField fr="Précision d'arrondi" zh="取整精度" value={i.precision} onChange={setNum('precision')} step={500} />
      </Card>

      <Card title="Indemnités à mobiliser" zh="可用津贴" note="Maximum réel / justifié issu des Paramètres. Désactivez celles qui ne sont pas justifiables pour ce poste.">
        {RUBRIQUES.map((rb) => {
          const val = i[rb.key];
          return (
            <div className="rubrique" key={rb.key}>
              <div className="info">
                <div className="name">
                  <Bi fr={rb.fr} zh={rb.zh} />
                </div>
                <div className="max">Max justifié : {fcfa(val.maxJustifie)}</div>
              </div>
              <input
                type="number"
                inputMode="decimal"
                value={val.maxJustifie}
                onChange={(e) => setRub(rb.key, { maxJustifie: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                onFocus={(e) => e.target.select()}
                style={{ width: 96, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', padding: '9px 10px', fontSize: 15 }}
              />
              <Segmented value={val.utiliser} onChange={(u) => setRub(rb.key, { utiliser: u })} />
            </div>
          );
        })}
      </Card>

      <div className={`banner ${banner.cls}`}>{banner.txt}</div>

      <Card title="Moteur d'optimisation" zh="优化引擎">
        <Row fr="Coût employeur du brut minimum" value={r.coutBrutMin} />
        <Row fr="Total indemnités potentiellement admissibles" value={r.totalIndemnitesPotentielles} />
        <Row fr="Indemnités retenues automatiquement" value={r.indemnitesRetenues} />
        <Row fr="Budget restant pour le brut imposable" value={r.budgetRestant} />
      </Card>

      <Card title="Résultats optimisés" zh="优化结果">
        <Row fr="Brut imposable estimé" value={r.brutImposable} />
        <Row fr="Indemnités / remboursements admissibles" value={r.indemnites} sign="pos" />
        <Row fr="(-) CNSS salarié" value={r.cnssSal} sign="neg" />
        <Row fr="(-) CNAMGS salarié" value={r.cnamgsSal} sign="neg" />
        <Row fr="Net social" value={r.netSocial} />
        <Row fr="(-) TCS" value={r.tcs} sign="neg" />
        <Row fr="(-) IRPP" value={r.irpp} sign="neg" />
        <Row fr="Net à payer estimé" zh="预计实发" value={r.netAPayer} total />
      </Card>

      <Card title="Contrôle budget employeur" zh="预算核对">
        <Row fr="Charges patronales CNSS + CNAMGS" value={r.chargesPatronales} />
        <Row fr="Provision congés payés" value={r.provisionConges} />
        <Row fr="Coût employeur recalculé" value={r.coutEmployeurRecalcule} />
        <Row fr="Écart avec budget cible" value={r.ecartBudget} sign={r.ecartBudget < 0 ? 'neg' : 'pos'} />
        <Row fr="Taux de conversion budget → net" value={`${num(r.tauxConversion * 100, 1)} %`} />
      </Card>
    </div>
  );
}
