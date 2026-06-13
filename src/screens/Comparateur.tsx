import { useState } from 'react';
import type { Params } from '../lib/params';
import { computeSalaire, emptySalaireInputs, fcfa, type SalaireInputs } from '../lib/calc';
import { Card, Bi } from '../components';

interface Scenario {
  nom: string;
  inp: SalaireInputs;
}

const FIELDS: { key: keyof SalaireInputs; fr: string; zh: string }[] = [
  { key: 'salaireBase', fr: 'Salaire de base', zh: '基本工资' },
  { key: 'sursalaire', fr: 'Sursalaire', zh: '工资补贴' },
  { key: 'heuresSupp', fr: 'Heures supp.', zh: '加班费' },
  { key: 'primeAnciennete', fr: 'Ancienneté', zh: '工龄' },
  { key: 'primeRendement', fr: 'Rendement', zh: '绩效' },
  { key: 'primeAssiduite', fr: 'Assiduité', zh: '出勤' },
  { key: 'primeRisque', fr: 'Risque', zh: '风险' },
  { key: 'primeResponsabilite', fr: 'Responsabilité', zh: '职责' },
  { key: 'transport', fr: 'Transport (exo.)', zh: '交通' },
  { key: 'panier', fr: 'Panier (exo.)', zh: '餐补' },
  { key: 'salissure', fr: 'Salissure (exo.)', zh: '清洗' },
  { key: 'deplacement', fr: 'Déplacement (exo.)', zh: '出差' },
  { key: 'logement', fr: 'Logement (exo.)', zh: '住房' },
];

function mk(nom: string, partial: Partial<SalaireInputs>): Scenario {
  return { nom, inp: { ...emptySalaireInputs(), ...partial } };
}

const INITIAL: Scenario[] = [
  mk('Classique', { salaireBase: 110000, sursalaire: 40000 }),
  mk('Optimisé modéré', { salaireBase: 85000, sursalaire: 30000, transport: 25000, panier: 10000 }),
  mk('Optimisé maximal', { salaireBase: 80000, sursalaire: 30000, transport: 30000, panier: 15000, salissure: 10000 }),
];

export default function Comparateur({ params }: { params: Params }) {
  const [scen, setScen] = useState<Scenario[]>(INITIAL);

  const setName = (idx: number, nom: string) =>
    setScen((s) => s.map((sc, k) => (k === idx ? { ...sc, nom } : sc)));
  const setVal = (idx: number, key: keyof SalaireInputs, v: number) =>
    setScen((s) => s.map((sc, k) => (k === idx ? { ...sc, inp: { ...sc.inp, [key]: v } } : sc)));

  const res = scen.map((s) => computeSalaire(s.inp, params));

  const nets = res.map((r) => r.netAPayer);
  const couts = res.map((r) => r.coutMensuelEmployeur);
  const bestNetIdx = nets.indexOf(Math.max(...nets));
  const lowCostIdx = couts.indexOf(Math.min(...couts));

  return (
    <div className="screen">
      <div className="screen-title">Comparateur de structures / 薪资结构对比</div>
      <div className="card-note" style={{ marginBottom: 12 }}>
        Comparez 3 structures salariales. Saisissez les montants de chaque scénario.
      </div>

      {scen.map((s, idx) => (
        <Card key={idx}>
          <input
            value={s.nom}
            onChange={(e) => setName(idx, e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: 15, fontWeight: 700, marginBottom: 8, outline: 'none' }}
          />
          <details>
            <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
              Modifier les montants (Structure {String.fromCharCode(65 + idx)})
            </summary>
            <div style={{ marginTop: 8 }}>
              {FIELDS.map((f) => (
                <div className="field" key={f.key} style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12 }}>
                    <Bi fr={f.fr} zh={f.zh} />
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={s.inp[f.key]}
                    onChange={(e) => setVal(idx, f.key, e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              ))}
            </div>
          </details>
        </Card>
      ))}

      <Card title="Comparaison" zh="对比">
        <div className="cmp-scroll">
          <table className="cmp">
            <thead>
              <tr>
                <th>Élément</th>
                {scen.map((s, k) => (
                  <th key={k}>{s.nom || String.fromCharCode(65 + k)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Brut imposable</td>
                {res.map((r, k) => (
                  <td key={k}>{fcfa(r.brutImposable)}</td>
                ))}
              </tr>
              <tr>
                <td>Net social</td>
                {res.map((r, k) => (
                  <td key={k}>{fcfa(r.netSocial)}</td>
                ))}
              </tr>
              <tr>
                <td>Indemnités exo.</td>
                {res.map((r, k) => (
                  <td key={k}>{fcfa(r.indemnitesExonerees)}</td>
                ))}
              </tr>
              <tr className="hl">
                <td>Net à payer</td>
                {res.map((r, k) => (
                  <td key={k} className={k === bestNetIdx ? 'best' : ''}>{fcfa(r.netAPayer)}</td>
                ))}
              </tr>
              <tr>
                <td>Charges patron.</td>
                {res.map((r, k) => (
                  <td key={k}>{fcfa(r.chargesPatronales)}</td>
                ))}
              </tr>
              <tr className="hl">
                <td>Coût mensuel</td>
                {res.map((r, k) => (
                  <td key={k} className={k === lowCostIdx ? 'best' : ''}>{fcfa(r.coutMensuelEmployeur)}</td>
                ))}
              </tr>
              <tr>
                <td>Coût annuel</td>
                {res.map((r, k) => (
                  <td key={k}>{fcfa(r.coutAnnuelEmployeur)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Synthèse" zh="总结">
        <div className="stat-grid">
          <div className="stat">
            <div className="k">Meilleur net salarié</div>
            <div className="v" style={{ color: 'var(--good)' }}>{scen[bestNetIdx]?.nom}</div>
            <div className="card-note" style={{ marginTop: 4, marginBottom: 0 }}>{fcfa(nets[bestNetIdx])}</div>
          </div>
          <div className="stat">
            <div className="k">Coût employeur le plus bas</div>
            <div className="v" style={{ color: 'var(--accent)' }}>{scen[lowCostIdx]?.nom}</div>
            <div className="card-note" style={{ marginTop: 4, marginBottom: 0 }}>{fcfa(couts[lowCostIdx])}</div>
          </div>
        </div>
      </Card>

      <Card title="Contrôles de conformité" zh="合规检查">
        {scen.map((s, k) => (
          <div className="res-row" key={k}>
            <span className="lbl">{s.nom || String.fromCharCode(65 + k)}</span>
            <span className="val" style={{ display: 'flex', gap: 5 }}>
              <span className={`badge ${res[k].ctrlSmig ? 'ok' : 'no'}`}>SMIG</span>
              <span className={`badge ${res[k].ctrlRmm ? 'ok' : 'no'}`}>RMM</span>
              <span className={`badge ${res[k].ctrlLogement ? 'ok' : 'warn'}`}>Logt</span>
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
