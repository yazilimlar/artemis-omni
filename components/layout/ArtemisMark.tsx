type ArtemisMarkProps = {
  className?: string;
  label?: string;
};

/**
 * Full-color Artemis mark translated from the operational logo references.
 * The public site uses this SVG instead of publishing large logo-spec sheets.
 */
export function ArtemisMark({ className, label = "Artemis Omni" }: ArtemisMarkProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      <circle cx="60" cy="60" r="55" fill="#0A1326" />
      <circle cx="60" cy="60" r="55" stroke="#DDB04E" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="47" fill="#D8D8D8" fillOpacity="0.92" />
      <circle cx="60" cy="60" r="47" stroke="#F2D06B" strokeOpacity="0.28" strokeWidth="2" />
      <path
        d="M30 34c-8 23 1 49 23 60 17 8 36 4 49-9-13 5-30 3-43-5-18-11-29-29-29-46Z"
        fill="#00CFFF"
        fillOpacity="0.82"
      />
      <path
        d="M39 27c-8 18-3 38 12 51 13 12 31 15 48 7-15 12-36 14-53 4-22-13-31-42-18-66l11 4Z"
        fill="#47BDEB"
        fillOpacity="0.66"
      />
      <path d="M60 20 90 90H75L60 51 45 90H30L60 20Z" fill="#F2D06B" />
      <path d="M60 20 90 90 77 82 60 40 43 82 30 90 60 20Z" fill="#DDB04E" />
      <path d="M60 20 48 90H30L60 20Z" fill="#F2D06B" fillOpacity="0.82" />
      <path d="M43 88h34" stroke="#0A1326" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="60" r="58" stroke="#00CFFF" strokeOpacity="0.18" />
    </svg>
  );
}
