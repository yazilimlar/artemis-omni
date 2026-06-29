type ArtemisEmblemProps = {
  className?: string;
  label?: string;
};

export function ArtemisEmblem({ className, label = "Artemis" }: ArtemisEmblemProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      <circle cx="60" cy="60" r="51" fill="#0A1326" />
      <circle cx="60" cy="60" r="51" stroke="#DDB04E" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="43" fill="#D8D8D8" fillOpacity="0.9" />
      <path
        d="M30 34c-8 22 1 48 22 59 16 8 34 5 47-7-12 4-27 2-40-6-18-11-28-29-29-46Z"
        fill="#00CFFF"
        fillOpacity="0.82"
      />
      <path
        d="M38 28c-7 17-2 36 12 49 13 12 31 15 47 8-14 11-35 13-51 3-22-13-30-41-18-64l10 4Z"
        fill="#47BDEB"
        fillOpacity="0.68"
      />
      <path d="M60 22 88 88 74 88 60 52 46 88 32 88 60 22Z" fill="#F2D06B" />
      <path d="M60 22 88 88 76 81 60 42 44 81 32 88 60 22Z" fill="#DDB04E" />
      <path d="M60 22 48 88H32L60 22Z" fill="#F2D06B" fillOpacity="0.82" />
      <circle cx="60" cy="60" r="53.5" stroke="#F2D06B" strokeOpacity="0.45" />
      <circle cx="60" cy="60" r="57.5" stroke="#00CFFF" strokeOpacity="0.18" />
    </svg>
  );
}
