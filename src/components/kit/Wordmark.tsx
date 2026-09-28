import { Link } from "@tanstack/react-router";

/**
 * Love Vet AI wordmark.
 * The single red heart in the product name is the ONLY decorative heart
 * allowed anywhere in the interface.
 */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2" aria-label="Love Vet AI home">
      <span className="grid size-8 place-items-center rounded-lg surface-ice border border-silver-strong/60 text-[0.7rem] font-semibold tracking-tight text-deep">
        LV
      </span>
      {!compact && (
        <span className="font-display text-[0.98rem] font-semibold tracking-tight text-navy">
          Love Vet AI{" "}
          <span aria-hidden className="text-heart">
            ❤️
          </span>
        </span>
      )}
    </Link>
  );
}
