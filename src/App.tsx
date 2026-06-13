import { useEffect, useState, type ReactNode } from 'react';
import { loadParams, saveParams, resetParams, DEFAULT_PARAMS, type Params } from './lib/params';
import { LogoMark } from './Logo';
import {
  IconSimulateur,
  IconInverse,
  IconComparateur,
  IconConges,
  IconParametres,
} from './icons';
import Simulateur from './screens/Simulateur';
import CalculInverse from './screens/CalculInverse';
import Comparateur from './screens/Comparateur';
import CumulConges from './screens/CumulConges';
import Parametres from './screens/Parametres';

type TabId = 'sim' | 'inv' | 'cmp' | 'cong' | 'param';

const TABS: { id: TabId; icon: ReactNode; label: string }[] = [
  { id: 'sim', icon: <IconSimulateur />, label: 'Simulateur' },
  { id: 'inv', icon: <IconInverse />, label: 'Inversé' },
  { id: 'cmp', icon: <IconComparateur />, label: 'Comparer' },
  { id: 'cong', icon: <IconConges />, label: 'Congés' },
  { id: 'param', icon: <IconParametres />, label: 'Paramètres' },
];

const HEADERS: Record<TabId, string> = {
  sim: 'Simulateur · calcul direct',
  inv: 'Calcul inversé · budget → net',
  cmp: 'Comparateur · 3 structures',
  cong: 'Cumul des congés payés',
  param: 'Paramètres légaux & fiscaux',
};

export default function App() {
  const [tab, setTab] = useState<TabId>('sim');
  const [params, setParamsState] = useState<Params>(() => loadParams());

  useEffect(() => {
    saveParams(params);
  }, [params]);

  const onReset = () => {
    resetParams();
    setParamsState({ ...DEFAULT_PARAMS });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <LogoMark size={44} />
        </div>
        <div className="htxt">
          <h1>
            Qing Tian <span className="light">Bois</span>
          </h1>
          <div className="sub">{HEADERS[tab]}</div>
        </div>
      </header>

      {tab === 'sim' && <Simulateur params={params} />}
      {tab === 'inv' && <CalculInverse params={params} />}
      {tab === 'cmp' && <Comparateur params={params} />}
      {tab === 'cong' && <CumulConges params={params} />}
      {tab === 'param' && <Parametres params={params} setParams={setParamsState} onReset={onReset} />}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
