import React from 'react';
import { fcfa } from './lib/calc';

/** Libellé bilingue FR / 中文 */
export function Bi({ fr, zh }: { fr: string; zh?: string }) {
  return (
    <>
      {fr}
      {zh ? <span className="zh"> / {zh}</span> : null}
    </>
  );
}

export function Card({
  title,
  zh,
  note,
  children,
}: {
  title?: string;
  zh?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      {title && (
        <div className="card-h">
          {title}
          {zh && <span className="zh">{zh}</span>}
        </div>
      )}
      {note && <div className="card-note">{note}</div>}
      {children}
    </div>
  );
}

/** Champ numérique (montant) avec libellé bilingue. */
export function NumberField({
  fr,
  zh,
  value,
  onChange,
  suffix = 'FCFA',
  step,
}: {
  fr: string;
  zh?: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="field">
      <label>
        <Bi fr={fr} zh={zh} />
      </label>
      <div className="suffix-wrap">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          onFocus={(e) => e.target.select()}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
    </div>
  );
}

export function SelectField({
  fr,
  zh,
  value,
  options,
  onChange,
}: {
  fr: string;
  zh?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="field">
      <label>
        <Bi fr={fr} zh={zh} />
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Ligne de résultat ; sign = 'neg' | 'pos' | undefined pour colorer. */
export function Row({
  fr,
  zh,
  value,
  sign,
  total,
  raw,
}: {
  fr: string;
  zh?: string;
  value: number | string;
  sign?: 'neg' | 'pos';
  total?: boolean;
  raw?: boolean;
}) {
  const cls = ['res-row', sign ?? '', total ? 'total' : ''].filter(Boolean).join(' ');
  const display = typeof value === 'number' ? (raw ? value.toLocaleString('fr-FR') : fcfa(value)) : value;
  return (
    <div className={cls}>
      <span className="lbl">
        <Bi fr={fr} zh={zh} />
      </span>
      <span className="val">{display}</span>
    </div>
  );
}

export function Control({ fr, zh, ok, okText, koText }: { fr: string; zh?: string; ok: boolean; okText?: string; koText?: string }) {
  return (
    <div className="ctrl">
      <span className="badge" style={{ visibility: 'hidden', width: 0, padding: 0 }} />
      <span className="lbl" style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>
        <Bi fr={fr} zh={zh} />
      </span>
      <span className={`badge ${ok ? 'ok' : 'no'}`}>{ok ? okText ?? 'OK' : koText ?? 'À vérifier'}</span>
    </div>
  );
}

export function Segmented({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="seg">
      <button className={value ? 'active' : ''} onClick={() => onChange(true)} type="button">
        Oui
      </button>
      <button className={!value ? 'active' : ''} onClick={() => onChange(false)} type="button">
        Non
      </button>
    </div>
  );
}
