import { useState } from 'react';
import type { Params } from '../lib/params';
import { computeConges, defaultCongesInputs, fcfa, num, type CongesInputs } from '../lib/calc';
import { Card, NumberField, SelectField, Row } from '../components';

export default function CumulConges({ params }: { params: Params }) {
  const [i, setI] = useState<CongesInputs>(defaultCongesInputs);
  const r = computeConges(i, params);
  const setNum = (k: keyof CongesInputs) => (v: number) => setI((s) => ({ ...s, [k]: v }));

  return (
    <div className="screen">
      <div className="screen-title">Cumul des congés payés / 带薪假累计</div>
      <div className="card-note" style={{ marginBottom: 12 }}>
        Saisir le salaire, la durée de travail et les congés déjà pris. Le solde et la valeur financière se calculent automatiquement.
      </div>

      <Card title="Entrées" zh="输入">
        <NumberField fr="Salaire mensuel de référence" zh="参考月薪" value={i.salaireMensuel} onChange={setNum('salaireMensuel')} />
        <NumberField fr="Durée travaillée (mois)" zh="工作月数" value={i.dureeTravaillee} onChange={setNum('dureeTravaillee')} suffix="mois" step={1} />
        <SelectField
          fr="Profil travailleur"
          zh="员工类型"
          value={i.profil}
          onChange={(v) => setI((s) => ({ ...s, profil: v as CongesInputs['profil'] }))}
          options={[
            { value: 'Majeur', label: 'Majeur / 成年 (2 j/mois)' },
            { value: 'Mineur', label: 'Mineur / 未成年 (2,5 j/mois)' },
          ]}
        />
        <NumberField fr="Jours de congés déjà pris" zh="已休天数" value={i.joursPris} onChange={setNum('joursPris')} suffix="jours" step={1} />
        <NumberField fr="Jours de référence du mois" zh="月参考天数" value={i.joursReferenceMois} onChange={setNum('joursReferenceMois')} suffix="jours" step={1} />
      </Card>

      <Card title="Résultats" zh="结果">
        <Row fr="Jours acquis par mois" value={`${num(r.joursAcquisParMois)} j`} />
        <Row fr="Jours acquis cumulés" value={`${num(r.joursAcquisCumules)} j`} />
        <Row fr="Jours restant (acquis − pris)" value={`${num(r.joursRestant)} j`} />
        <Row fr="Salaire journalier indicatif" value={r.salaireJournalier} />
        <Row fr="Valeur financière des congés acquis" value={r.valeurAcquis} />
        <Row fr="Valeur financière du solde restant" zh="剩余余额价值" value={r.valeurRestant} total />
        <Row fr="Provision mensuelle congés" value={r.provisionMensuelle} />
      </Card>

      <Card title="Table cumulative par mois" zh="逐月累计表">
        <table className="leave">
          <thead>
            <tr>
              <th>Mois</th>
              <th>Jours acquis</th>
              <th>Valeur cumulée</th>
            </tr>
          </thead>
          <tbody>
            {r.table.map((row) => (
              <tr key={row.mois}>
                <td>{row.mois}</td>
                <td>{num(row.joursCumules)} j</td>
                <td>{fcfa(row.valeurCumulee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
