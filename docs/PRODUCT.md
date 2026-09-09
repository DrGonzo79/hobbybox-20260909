# Product plan

## Positioning

HobbyBox is the “try before you gear up” desk for curious beginners. It rents a complete, numbered project case with one achievable outcome, transparent replacement exposure and a return path.

## ICP and JTBD

**Initial ICP:** urban adults 25–40 with disposable income, limited storage, and intent to try equipment-heavy creative hobbies within seven days.

**JTBD:** “When I feel motivated to try a hobby, help me complete one real project without researching or purchasing an entire setup, so I can decide whether to commit.”

## MVP

The commercial MVP is one local DJ kit, pickup only, fixed five-day turn, deposit, checklist, setup guide, return inspection and manual support. The software demo shows the next slice: kit discovery, saved choices, length, fulfillment mode, protection, availability conflict and itemized quote.

Excluded from MVP: national shipping, peer suppliers, live payments, identity checks, automated claims, classes, AI recommendations and subscriptions.

## Data model

- **KitTemplate:** outcome, category, difficulty, component requirements, consumables, pricing rules.
- **PhysicalKit:** serial/case number, template, condition, location, replacement value.
- **InventoryWindow:** physical kit, start/end, status (available/held/booked/turnaround/repair).
- **Rental:** customer, physical kit, dates, fulfillment, price snapshot, hold, status.
- **Inspection:** before/after photos, component checklist, condition, assessor.
- **Charge:** reservation, rental, refundable hold, adjustment, refund.

The prototype intentionally stores only `KitTemplate`-like fixtures and calculates a quote without persistence.

## Technical architecture

- Next.js 16 App Router + TypeScript static export for the public interaction.
- FastAPI + strict Pydantic contract for the canonical quote operation.
- JSON fixture shared by web and API to prevent catalog drift in the demo.
- Future production path: Postgres with exclusion constraints for overlapping booked windows; object storage for inspections; Stripe authorization for holds; background jobs for reminders and release.

## AI/model strategy

No model is needed for the wedge. Deterministic pricing and inventory constraints deserve deterministic code. Later, a small retrieval workflow could generate setup troubleshooting from approved manuals and inspection summaries. It must cite the exact manual section and escalate safety-sensitive uncertainty; it is not a replacement for equipment support.

## Economics (assumptions, not source facts)

Example DJ kit: $780 landed replacement value, $27/day, five-day rental = $135. With 2.5 paid turns/month, gross is $337.50. Assume $32 average consumables/handling, 6% payment/loss reserve and $20 local acquisition per turn: roughly $207 monthly contribution before storage and labor, or 3.8-month hardware payback. A 50% utilization ceiling leaves turnaround time.

Kill criteria after 20 turns: contribution margin below 45%, damage/missing-item expense above 8% of revenue, staff handling above 35 minutes/turn, or fewer than 30% of depositors converting to a paid rental.

## Go-to-market

Start with exact-intent channels: local DJ schools and record stores, “beginner controller” search pages, apartment-community newsletters, and creator demos showing the finished 15-minute mix. Offer partners a tracked reservation code; avoid broad lifestyle ads until payback survives referral fees.

## Validation plan

1. Landing page with $10 refundable reservation for a single weekend.
2. Ten intent interviews and five observed unboxings.
3. Twenty paid turns with manual inspections and per-turn ledger.
4. Compare outcome-led offer against generic “DJ controller rental.”
5. Expand only if the outcome-led version improves paid conversion or return quality.

## Moat

The defensible asset is operational data: component failure, beginner confusion, time-to-outcome, damage, turn cost and category-specific residual value. Brand or an attractive catalog alone is weak. Dense local inventory, repeatable inspection and supplier buyback agreements can become compounding advantages.

## Risks

- Asset loss, card disputes and unclear protection terms.
- Low utilization or seasonal novelty.
- Shipping damage and two-way logistics erasing margin.
- Safety/liability in categories such as tools, food or sport.
- Catalog expansion before one category has repeatable unit economics.
- Marketplace cold start if third-party supply is introduced prematurely.

## 30/60/90 days

- **30:** one DJ kit, reservation page, five observed turns, component checklist, manual ledger.
- **60:** 20 total turns, pricing test, damage/handling dashboard, decide keep/kill/iterate.
- **90:** add one adjacent audio kit only if payback and handling thresholds pass; implement real inventory windows, payments and reminders behind a limited beta.
