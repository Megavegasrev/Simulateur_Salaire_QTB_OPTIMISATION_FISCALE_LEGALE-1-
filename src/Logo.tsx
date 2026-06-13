// Reproduction vectorielle du logo Qing Tian Bois (QTB) :
// arbre stylisé dans un cercle, vert forêt dégradé. Net à toutes les tailles.

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Qing Tian Bois">
      <defs>
        <linearGradient id="qtbRing" x1="50" y1="6" x2="50" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#74c241" />
          <stop offset="1" stopColor="#157a33" />
        </linearGradient>
        <linearGradient id="qtbTrunk" x1="50" y1="42" x2="50" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3da64e" />
          <stop offset="1" stopColor="#12692c" />
        </linearGradient>
      </defs>

      {/* Anneau (légère ouverture en bas, comme la marque) */}
      <path
        d="M50 7 A43 43 0 1 1 28 13.5"
        stroke="url(#qtbRing)"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tronc + branches */}
      <path
        d="M50 90
           C49 78 49 70 50 62
           C50.5 56 52 52 55 49
           M50 62 C44 58 40 56 33 56
           M51 56 C57 53 62 52 68 53
           M50.5 50 C47 47 44 46 40 46"
        stroke="url(#qtbTrunk)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Feuillage — deux tons de vert */}
      <g fill="#74c241">
        <ellipse cx="56" cy="34" rx="5" ry="3" transform="rotate(-38 56 34)" />
        <ellipse cx="63" cy="40" rx="5" ry="3" transform="rotate(18 63 40)" />
        <ellipse cx="40" cy="42" rx="5" ry="3" transform="rotate(28 40 42)" />
        <ellipse cx="33" cy="52" rx="5" ry="3" transform="rotate(22 33 52)" />
        <ellipse cx="69" cy="48" rx="5" ry="3" transform="rotate(-22 69 48)" />
        <ellipse cx="48" cy="30" rx="4.6" ry="2.8" transform="rotate(-10 48 30)" />
      </g>
      <g fill="#3da64e">
        <ellipse cx="52" cy="40" rx="5" ry="3" transform="rotate(-30 52 40)" />
        <ellipse cx="44" cy="36" rx="5" ry="3" transform="rotate(35 44 36)" />
        <ellipse cx="60" cy="46" rx="5" ry="3" transform="rotate(10 60 46)" />
        <ellipse cx="37" cy="47" rx="4.6" ry="2.8" transform="rotate(26 37 47)" />
        <ellipse cx="64" cy="35" rx="4.6" ry="2.8" transform="rotate(-28 64 35)" />
      </g>
    </svg>
  );
}
