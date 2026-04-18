/* Shared decorative marks used across the site. */

export function HomePlate({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M2 1 H10 V5.5 L6 10.2 L2 5.5 Z" />
    </svg>
  );
}

export function Ball({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <circle cx="8" cy="8" r="6.4" />
      <path d="M3.5 4.8 C 6 7, 6 9, 3.5 11.2" />
      <path d="M12.5 4.8 C 10 7, 10 9, 12.5 11.2" />
    </svg>
  );
}

export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M5 0.5 L9.5 5 L5 9.5 L0.5 5 Z" />
    </svg>
  );
}
