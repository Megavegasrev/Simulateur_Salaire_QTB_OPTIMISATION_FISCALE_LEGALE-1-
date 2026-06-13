import type { Params } from '../lib/params';
import { DEFAULT_PARAMS } from '../lib/params';
import { Card, NumberField } from '../components';

/** Champ pour un taux exprimé en % (stocké en fraction). */
function PctField({ fr, zh, value, onChange }: { fr: string; zh?: string; value: number; onChange: (v: number) => void }) {
  return (
    <NumberField
      fr={fr}
      zh={zh}
      suffix="%"
      step={0.1}
      value={Math.round(value * 1000) / 10}
      onChange={(v) => onChange(v / 100)}
    />
  );
}

export default function Parametres({
  params,
  setParams,
  onReset,
}: {
  params: Params;
  setParams: (p: Params) => void;
  onReset: () => void;
}) {
  const p = params;
  const upd = (patch: Partial<Params>) => setParams({ ...p, ...patch });

  return (
    <div className="screen">
      <div className="screen-title">Paramètres légaux & fiscaux / 法定参数</div>
      <div className="banner warn">
        Modifier uniquement si les taux légaux changent. Les valeurs sont sauvegardées sur cet appareil et utilisées par tous les modules. À valider chaque année avec la DGI / comptabilité.
      </div>

      <Card title="Seuils de salaire" zh="工资门槛">
        <NumberField fr="SMIG / salaire minimum" zh="最低工资" value={p.smig} onChange={(v) => upd({ smig: v })} />
        <NumberField fr="RMM / revenu minimum mensuel" zh="最低月收入" value={p.rmm} onChange={(v) => upd({ rmm: v })} />
      </Card>

      <Card title="Cotisations sociales" zh="社会保险">
        <PctField fr="Taux CNSS salarié" value={p.tauxCnssSal} onChange={(v) => upd({ tauxCnssSal: v })} />
        <PctField fr="Taux CNAMGS salarié" value={p.tauxCnamgsSal} onChange={(v) => upd({ tauxCnamgsSal: v })} />
        <PctField fr="Taux CNSS employeur" value={p.tauxCnssEmp} onChange={(v) => upd({ tauxCnssEmp: v })} />
        <PctField fr="Taux CNAMGS employeur" value={p.tauxCnamgsEmp} onChange={(v) => upd({ tauxCnamgsEmp: v })} />
        <NumberField fr="Plafond CNSS mensuel" value={p.plafondCnss} onChange={(v) => upd({ plafondCnss: v })} />
        <NumberField fr="Plafond CNAMGS mensuel" value={p.plafondCnamgs} onChange={(v) => upd({ plafondCnamgs: v })} />
      </Card>

      <Card title="Fiscalité (IRPP / TCS)" zh="税收">
        <PctField fr="Abattement IRPP" value={p.abattementIrpp} onChange={(v) => upd({ abattementIrpp: v })} />
        <NumberField fr="Seuil TCS mensuel" value={p.seuilTcs} onChange={(v) => upd({ seuilTcs: v })} />
        <PctField fr="Taux TCS" value={p.tauxTcs} onChange={(v) => upd({ tauxTcs: v })} />
        <NumberField fr="Plafond exonération logement" value={p.plafondLogement} onChange={(v) => upd({ plafondLogement: v })} />
      </Card>

      <Card title="Barème IRPP numérique" zh="所得税税率表" note="Seuil inférieur, taux marginal et déduction (LOOKUP).">
        <table className="leave">
          <thead>
            <tr>
              <th>Seuil</th>
              <th>Taux %</th>
              <th>Déduction</th>
            </tr>
          </thead>
          <tbody>
            {p.bareme.map((b, idx) => (
              <tr key={idx}>
                <td><InlineNum value={b.seuil} onChange={(v) => updateBareme(p, setParams, idx, { seuil: v })} /></td>
                <td><InlineNum value={Math.round(b.taux * 1000) / 10} onChange={(v) => updateBareme(p, setParams, idx, { taux: v / 100 })} /></td>
                <td><InlineNum value={b.deduction} onChange={(v) => updateBareme(p, setParams, idx, { deduction: v })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Congés payés" zh="带薪假">
        <NumberField fr="Congés acquis/mois — majeur" value={p.congesMajeur} onChange={(v) => upd({ congesMajeur: v })} suffix="j" step={0.5} />
        <NumberField fr="Congés acquis/mois — mineur" value={p.congesMineur} onChange={(v) => upd({ congesMineur: v })} suffix="j" step={0.5} />
        <NumberField fr="Jours de référence congés" value={p.joursReference} onChange={(v) => upd({ joursReference: v })} suffix="j" step={1} />
      </Card>

      <Card title="Optimisation du calcul inversé" zh="反向计算优化" note="Montants réellement justifiables utilisés par défaut dans le calcul inversé.">
        <NumberField fr="Brut imposable minimum recommandé" value={p.brutMinReco} onChange={(v) => upd({ brutMinReco: v })} />
        <NumberField fr="Transport justifiable" value={p.optTransport} onChange={(v) => upd({ optTransport: v })} />
        <NumberField fr="Panier justifiable" value={p.optPanier} onChange={(v) => upd({ optPanier: v })} />
        <NumberField fr="Salissure justifiable" value={p.optSalissure} onChange={(v) => upd({ optSalissure: v })} />
        <NumberField fr="Déplacement justifiable" value={p.optDeplacement} onChange={(v) => upd({ optDeplacement: v })} />
        <NumberField fr="Logement justifiable" value={p.optLogement} onChange={(v) => upd({ optLogement: v })} />
      </Card>

      <button className="btn full danger" onClick={onReset}>
        Réinitialiser les paramètres par défaut
      </button>
      <div className="footer-note">
        Valeurs par défaut basées sur les barèmes Gabon 2026 (CNSS/CNAMGS : CLEISS ; IRPP/TCS : DGI ; congés : Code du travail). Référence SMIG par défaut : {DEFAULT_PARAMS.smig.toLocaleString('fr-FR')} FCFA.
      </div>
    </div>
  );
}

function updateBareme(p: Params, setParams: (p: Params) => void, idx: number, patch: Partial<Params['bareme'][number]>) {
  const bareme = p.bareme.map((b, k) => (k === idx ? { ...b, ...patch } : b));
  setParams({ ...p, bareme });
}

function InlineNum({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
      onFocus={(e) => e.target.select()}
      style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '6px 7px', fontSize: 13, textAlign: 'right' }}
    />
  );
}
