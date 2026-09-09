# CEO review

**Mode:** Scope reduction for commercial validation; hold-scope rigor for this prototype.  
**Decision:** Ship the multi-kit interaction as a communication artifact, but run the business test with one local DJ kit.

## Nuclear challenge

The attractive “Blockbuster for hobbies” framing hides the hardest fact: this is an asset and reverse-logistics company, not primarily a marketplace or software company. The user outcome is confidence after completing a first project. If people will not pay for one curated local box, catalog breadth and technology only amplify a weak premise.

**Current → plan → 12-month ideal:** no primary evidence → one outcome-led rental workflow and paid local pilot → one category with dense utilization, predictable inspections, sub-four-month asset payback and documented expansion gates.

## Strongest challenges and decisions

1. **Premise:** rental demand is inferred from analogies. Decision: require paid refundable deposits and observed turns.
2. **Wedge:** “all hobbies” creates inventory entropy. Decision: one DJ kit commercially; four fictional kits only demonstrate the interface.
3. **Economics:** gross rental price masks acquisition, idle time, damage and labor. Decision: ledger contribution and handling per physical turn, with kill thresholds.
4. **GTM:** broad inspiration traffic has weak intent. Decision: target beginner-gear and class intent plus local partners.
5. **Moat:** catalog and AI guidance are copyable. Decision: pursue operational density and category-specific condition/failure data.

## Review sections

### 1. Architecture
Static frontend and deterministic FastAPI domain source are appropriately separated. Production requires transactional inventory windows before payment. No live backend is implied.

### 2. Error and rescue map
- Unknown kit → `kit_not_found` (404), user returns to catalog.
- Invalid duration/type/delivery → Pydantic 422, form blocks correction.
- Unavailable window → `inventory_window_unavailable` (409), user sees remaining days.
- Future payment decline → release inventory hold and show named decline.
- Future reminder/hold-release job failure → retry with alert; never silently retain a card hold.

### 3. Security and threat model
The demo accepts no identity or payment data. Production needs hosted payment fields, signed inspection uploads, authorization per rental, rate limits and immutable state-transition audit events. Never store raw card data.

### 4. Data flow and interaction edges
Controls constrain ordinary input; the API rejects nil, wrong type, extra fields, out-of-range days and unknown IDs. Double-click requires idempotency in production. Navigate-away must expire a short inventory hold. Back-button restore must revalidate availability.

### 5. Code quality
Pricing is small and deterministic. The intentional client mirror is acceptable only for a static demo; production must consume the API-generated quote and never trust browser totals.

### 6. Tests
Python tests cover happy pricing, weekly discount, shipping, unprotected hold, invalid payloads, unknown kit and inventory conflict. Browser tests cover filter/save/quote, empty search, conflict, and mobile overflow. A production system additionally needs concurrency, payment compensation and rental state-machine tests.

### 7. Observability
The plan names conversion, utilization, unavailable searches, handling time, damage, late returns and hold-release latency. Initial operations can use a per-turn ledger; automated dashboards wait until real volume.

### 8. Database and state
No persistence in demo. Production must prevent overlapping inventory windows with a database constraint and snapshot price terms on Rental. Inspection records are append-only.

### 9. API contract
`POST /rentals/quote` is explicit, strict and versionable. It does not pretend to reserve inventory. A later booking endpoint must use an idempotency key and return hold expiry.

### 10. Performance and scale
Compute is trivial. At 10×, kit turnaround and support break first; at 100×, multi-location allocation, inspection queues and reverse logistics dominate. Do not optimize web compute before operations.

### 11. Design and UX
Hierarchy is project → kit → terms → transparent quote. Fictional state is persistent in the header, drawer and footer. Focus styles, labeled controls, loading, error, empty and mobile layouts are included. A real flow needs calendar dates, legal protection terms and payment consent.

## Accepted scope

Catalog filtering, saved kits, rental configuration, inventory-aware quote, strict API domain operation, shared fixtures, tests, static deployment and product evidence plan.

## Deferred

Live inventory, calendar dates, accounts, payments, claims, shipping labels, notifications, AI guidance and supplier marketplace—each requires evidence or a non-static backend.

## NOT in scope

Billable hosting, live reservations, real insurance/protection, financial guarantees, unverified source scores, and national multi-category launch.
