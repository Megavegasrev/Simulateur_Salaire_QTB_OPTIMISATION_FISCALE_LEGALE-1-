import { useState } from 'react';
import type { Params } from '../lib/params';
import { computeSalaire, type SalaireInputs } from '../lib/calc';
import { Card, NumberField, Row, Control } from '../components';

const initial: SalaireInputs = {
  salaireBase: 80000,
  sursalaire: 20000,
  heuresSupp: 0,
  primeAnciennete: 0,
  primeRendement: 10000,
  primeAssiduite: 5000,
  primeRisque: 0,
  primeResponsabilite: 0,
  transport: 25000,
  panier: 0,
  salissure: 0,
  deplacement: 0,
  logement: 10000,
};

export default function Simulateur({ params }: { params: Params }) {
  const [i, setI] = useState<SalaireInputs>(initial);
  const set = (k: keyof SalaireInputs) => (v: number) => setI((s) => ({ ...s, [k]: v }));
  const r = computeSalaire(i, params);

  return (
    <div className="screen">
      <div className="screen-title">Simulateur de salaire / 工资模拟器</div>

      <Card title="Rémunération imposable" zh="应税报酬" note="L'IRPP est calculé directement sur la base après abattement. Aucune part fiscale n'est utilisée.">
        <NumberField fr="Salaire de base" zh="基本工资" value={i.salaireBase} onChange={set('salaireBase')} />
        <NumberField fr="Sursalaire" zh="工资补贴" value={i.sursalaire} onChange={set('sursalaire')} />
        <NumberField fr="Heures supplémentaires" zh="加班费" value={i.heuresSupp} onChange={set('heuresSupp')} />
        <NumberField fr="Prime d'ancienneté" zh="工龄津贴" value={i.primeAnciennete} onChange={set('primeAnciennete')} />
        <NumberField fr="Prime de rendement" zh="绩效津贴" value={i.primeRendement} onChange={set('primeRendement')} />
        <NumberField fr="Prime d'assiduité" zh="出勤津贴" value={i.primeAssiduite} onChange={set('primeAssiduite')} />
        <NumberField fr="Prime de risque" zh="风险津贴" value={i.primeRisque} onChange={set('primeRisque')} />
        <NumberField fr="Prime de responsabilité" zh="职责津贴" value={i.primeResponsabilite} onChange={set('primeResponsabilite')} />
      </Card>

      <Card title="Indemnités & primes exonérées" zh="免税津贴" note="Le logement est exonéré jusqu'au plafond ; l'excédent devient imposable.">
        <NumberField fr="Prime de transport" zh="交通补贴" value={i.transport} onChange={set('transport')} />
        <NumberField fr="Prime de panier" zh="餐补" value={i.panier} onChange={set('panier')} />
        <NumberField fr="Prime de salissure" zh="清洗补贴" value={i.salissure} onChange={set('salissure')} />
        <NumberField fr="Indemnité de déplacement" zh="出差补贴" value={i.deplacement} onChange={set('deplacement')} />
        <NumberField fr="Indemnité de logement" zh="住房补贴" value={i.logement} onChange={set('logement')} />
      </Card>

      <Card title="Résultat salarié" zh="员工端结果">
        <Row fr="Brut imposable (+ logement > plafond)" value={r.brutImposable} />
        <Row fr="(-) CNSS salarié" value={r.cnssSal} sign="neg" />
        <Row fr="(-) CNAMGS salarié" value={r.cnamgsSal} sign="neg" />
        <Row fr="Net social" value={r.netSocial} />
        <Row fr="(-) TCS" value={r.tcs} sign="neg" />
        <Row fr="Base IRPP après abattement" value={r.baseIrpp} />
        <Row fr="(-) IRPP" value={r.irpp} sign="neg" />
        <Row fr="(+) Indemnités exonérées" value={r.indemnitesExonerees} sign="pos" />
        <Row fr="Net à payer" zh="实发工资" value={r.netAPayer} total />
      </Card>

      <Card title="Résultat employeur" zh="雇主成本">
        <Row fr="Charges patronales CNSS + CNAMGS" value={r.chargesPatronales} />
        <Row fr="Provision congés payés" value={r.provisionConges} />
        <Row fr="Coût mensuel total" value={r.coutMensuelEmployeur} />
        <Row fr="Coût annuel total" zh="年度总成本" value={r.coutAnnuelEmployeur} total />
      </Card>

      <Card title="Contrôles" zh="合法性检查">
        <Control fr="Salaire base ≥ SMIG" zh="≥ 最低工资" ok={r.ctrlSmig} />
        <Control fr="Rémunération totale ≥ RMM" zh="总月薪 ≥ 最低月收入" ok={r.ctrlRmm} />
        <Control fr="Logement ≤ plafond exonération" zh="住房补贴 ≤ 免税上限" ok={r.ctrlLogement} okText="OK" koText="Dépassement" />
      </Card>
    </div>
  );
}
