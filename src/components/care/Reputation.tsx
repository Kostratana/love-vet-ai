import { Clock, Globe2, MapPin, ShieldCheck, Sparkles as _s, Star, Stethoscope } from "lucide-react";
import { GlowButton } from "@/components/kit/primitives";

void _s;

/**
 * Love Vet AI verified reviews and external public reputation are ALWAYS shown separately.
 * Ratings are computed from real review data only; the AI summary is labelled and kept apart
 * from original reviews. With no data, these render empty states.
 */
export type VerifiedReview = { id: string; overall: number; text: string; visitDate: string; recommend: boolean };
export type ExternalReputation = { source: string; rating: number; count: number; url?: string; retrievedAt: string };

export function averageRating(reviews: VerifiedReview[]) {
  if (!reviews.length) return null;
  return Math.round((reviews.reduce((a, r) => a + r.overall, 0) / reviews.length) * 10) / 10;
}

export function ReputationPanels({ reviews = [], external = [], aiSummary }: { reviews?: VerifiedReview[]; external?: ExternalReputation[]; aiSummary?: string }) {
  const avg = averageRating(reviews);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="glass rounded-2xl p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-navy"><ShieldCheck className="size-4 text-deep" strokeWidth={1.6} /> Love Vet AI</p>
        <p className="text-xs text-graphite">Verified appointment reviews</p>
        {avg === null ? (
          <p className="mt-5 text-sm text-graphite">No verified reviews yet. Reviews appear after completed Love Vet AI appointments.</p>
        ) : (
          <p className="mt-5 text-3xl font-extrabold text-navy">{avg}<span className="ml-2 text-sm font-medium text-graphite">from {reviews.length} verified reviews</span></p>
        )}
        <div className="mt-5 border-t border-silver/80 pt-4">
          <p className="text-xs font-semibold text-navy">AI summary of review themes</p>
          <p className="mt-1 text-sm text-graphite">{aiSummary ?? "A summary will appear once enough verified reviews exist. It never replaces the original reviews."}</p>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-navy"><Globe2 className="size-4 text-deep" strokeWidth={1.6} /> External public rating</p>
        <p className="text-xs text-graphite">Source clearly identified · never merged with Love Vet AI ratings</p>
        {external.length === 0 ? (
          <p className="mt-5 text-sm text-graphite">No external sources connected.</p>
        ) : (
          <ul className="mt-5 space-y-2 text-sm">
            {external.map((e) => (
              <li key={e.source}>{e.source}: {e.rating} ({e.count}) · retrieved {e.retrievedAt}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Future recommendation result card used inside the AI conversation. Renders only real data. */
export type Recommendation = {
  vetName: string;
  specialty: string;
  species: string[];
  clinic: string;
  distance: string;
  nextSlot: string;
  price: string;
  rating: number | null;
  reviewCount: number;
  reviewSummary?: string;
  whyMatch: string[];
};

export function RecommendationCard({ r, onReviews, onChoose }: { r: Recommendation; onReviews?: () => void; onChoose?: () => void }) {
  return (
    <article className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy">{r.vetName}</h3>
          <p className="text-sm text-graphite">{r.specialty} · {r.clinic}</p>
        </div>
        <p className="flex items-center gap-1 text-sm font-semibold text-navy">
          <Star className="size-4 text-deep" strokeWidth={1.6} />
          {r.rating === null ? "No reviews yet" : `${r.rating} · ${r.reviewCount} verified`}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-navy sm:grid-cols-4">
        <div><dt className="text-xs text-graphite"><Stethoscope className="mr-1 inline size-3" />Species</dt><dd>{r.species.join(", ")}</dd></div>
        <div><dt className="text-xs text-graphite"><MapPin className="mr-1 inline size-3" />Distance</dt><dd>{r.distance}</dd></div>
        <div><dt className="text-xs text-graphite"><Clock className="mr-1 inline size-3" />Available</dt><dd>{r.nextSlot}</dd></div>
        <div><dt className="text-xs text-graphite">Price</dt><dd>{r.price}</dd></div>
      </dl>
      <div className="mt-4 border-t border-silver/80 pt-3">
        <p className="text-xs font-semibold text-navy">Why this matches your request</p>
        <ul className="mt-1 list-disc pl-5 text-sm text-graphite">{r.whyMatch.map((w) => <li key={w}>{w}</li>)}</ul>
        {r.reviewSummary && <p className="mt-2 text-xs text-graphite"><span className="font-semibold">AI review summary:</span> {r.reviewSummary}</p>}
      </div>
      <div className="mt-4 flex gap-2">
        <GlowButton size="sm" variant="secondary" onClick={onReviews}>View Reviews</GlowButton>
        <GlowButton size="sm" onClick={onChoose}>Choose Appointment</GlowButton>
      </div>
    </article>
  );
}
