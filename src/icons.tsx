// Icônes de la barre d'onglets — traits fins, style professionnel.
const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconSimulateur() {
  return (
    <svg className="ico" viewBox="0 0 24 24" {...S}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <rect x="8" y="6" width="8" height="3.5" rx="1" />
      <path d="M8.5 13h0M12 13h0M15.5 13h0M8.5 16.5h0M12 16.5h0M15.5 16.5h0" />
    </svg>
  );
}

export function IconInverse() {
  return (
    <svg className="ico" viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconComparateur() {
  return (
    <svg className="ico" viewBox="0 0 24 24" {...S}>
      <path d="M5 20V10M12 20V4M19 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function IconConges() {
  return (
    <svg className="ico" viewBox="0 0 24 24" {...S}>
      <circle cx="12" cy="9.5" r="3.5" />
      <path d="M12 13v8M12 6V3M16 9.5h3M5 9.5h3M14.6 6.9l2-2M7.4 12.1l-2 2M14.6 12.1l2 2M7.4 6.9l-2-2" />
    </svg>
  );
}

export function IconParametres() {
  return (
    <svg className="ico" viewBox="0 0 24 24" {...S}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2.3" />
      <circle cx="8" cy="17" r="2.3" />
    </svg>
  );
}
