import { useEffect, useState } from 'react';
import { loadParams, saveParams, resetParams, DEFAULT_PARAMS, type Params } from './lib/params';
import Simulateur from './screens/Simulateur';
import CalculInverse from './screens/CalculInverse';
import Comparateur from './screens/Comparateur';
import CumulConges from './screens/CumulConges';
import Parametres from './screens/Parametres';

type TabId = 'sim' | 'inv' | 'cmp' | 'cong' | 'param';

const TABS: { id: TabId; ico: string; label: string }[] = [
  { id: 'sim', ico: '🧮', label: 'Simulateur' },
  { id: 'inv', ico: '🎯', label: 'Inversé' },
  { id: 'cmp', ico: '⚖️', label: 'Comparer' },
  { id: 'cong', ico: '🌴', label: 'Congés' },
  { id: 'param', ico: '⚙️', label: 'Paramètres' },
];

const HEADERS: Record<TabId, { title: string; sub: string }> = {
  sim: { title: 'Simulateur Salaire QTB', sub: '工资模拟器 · calcul direct' },
  inv: { title: 'Calcul inversé', sub: '反向计算 · budget → net maximal' },
  cmp: { title: 'Comparateur', sub: '薪资结构对比 · 3 structures' },
  cong: { title: 'Cumul des congés', sub: '带薪假累计 · valorisation' },
  param: { title: 'Paramètres', sub: '法定参数 · taux légaux & fiscaux' },
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

  const h = HEADERS[tab];

  return (
    <div className="app">
      <header className="app-header">
        <h1>{h.title}</h1>
        <div className="sub">{h.sub}</div>
      </header>

      {tab === 'sim' && <Simulateur params={params} />}
      {tab === 'inv' && <CalculInverse params={params} />}
      {tab === 'cmp' && <Comparateur params={params} />}
      {tab === 'cong' && <CumulConges params={params} />}
      {tab === 'param' && <Parametres params={params} setParams={setParamsState} onReset={onReset} />}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            <span className="ico">{t.ico}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
