"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Box, CalendarDays, Check, CircleAlert, Heart, LoaderCircle, MapPin, PackageCheck, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import kitsData from "@/data/kits.json";

type Kit = typeof kitsData[number];
type Quote = { rental: number; discount: number; protection: number; delivery: number; dueToday: number; refundableHold: number; total: number; returnDay: number };

const categories = ["All", "Make", "Sound", "Capture"];
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function calculateQuote(kit: Kit, days: number, protection: boolean, delivery: string): Quote {
  const rental = kit.dailyRate * days;
  const discount = days >= 7 ? Math.round(rental * 0.15) : 0;
  const protectionFee = protection ? Math.round((rental - discount) * 0.12) : 0;
  const deliveryFee = delivery === "shipped" ? 24 : 0;
  return {
    rental,
    discount,
    protection: protectionFee,
    delivery: deliveryFee,
    dueToday: rental - discount + protectionFee + deliveryFee,
    refundableHold: protection ? Math.round(kit.replacementValue * 0.1) : Math.round(kit.replacementValue * 0.25),
    total: rental - discount + protectionFee + deliveryFee,
    returnDay: days + 1,
  };
}

export default function Home() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [view, setView] = useState<"browse" | "saved">("browse");
  const [selected, setSelected] = useState<Kit | null>(null);
  const [days, setDays] = useState(5);
  const [protection, setProtection] = useState(true);
  const [delivery, setDelivery] = useState("pickup");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kits = useMemo(() => kitsData.filter(kit => {
    const matchesCategory = category === "All" || kit.category === category;
    const matchesQuery = `${kit.name} ${kit.summary} ${kit.contents.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    const matchesView = view === "browse" || saved.includes(kit.id);
    return matchesCategory && matchesQuery && matchesView;
  }), [category, query, saved, view]);

  const openKit = (kit: Kit) => { setSelected(kit); setDays(Math.min(5, kit.availableDays)); setProtection(true); setDelivery("pickup"); setQuote(null); setError(""); };
  const toggleSaved = (id: string) => setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const updateDays = (value: number) => { setDays(value); setQuote(null); setError(""); };

  async function checkAvailability() {
    if (!selected) return;
    setError(""); setQuote(null);
    if (!Number.isInteger(days) || days < 2 || days > 21) { setError("Choose a rental between 2 and 21 days."); return; }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 450));
    if (days > selected.availableDays) {
      setError(`Only ${selected.availableDays} consecutive days remain for this demo kit. Shorten the rental to continue.`);
    } else {
      setQuote(calculateQuote(selected, days, protection, delivery));
    }
    setLoading(false);
  }

  return <div className="app">
    <a className="skip" href="#catalog">Skip to kits</a>
    <header className="topbar">
      <a className="brand" href="#top"><span className="mark"><Box size={21} /></span>HobbyBox</a>
      <nav aria-label="Primary"><button className={view === "browse" ? "active" : ""} onClick={() => setView("browse")}>Browse kits</button><button className={view === "saved" ? "active" : ""} onClick={() => setView("saved")}>Saved <span>{saved.length}</span></button></nav>
      <div className="demo"><i /> FICTIONAL INVENTORY · DEMO CHECKOUT</div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> BEGINNER-FIRST RENTALS</div><h1>Try the hobby.<br /><em>Skip the gear spiral.</em></h1><p>Complete kits, one finishable project and a return label. Discover what sticks before your closet fills with expensive intentions.</p><a href="#catalog">Find your first kit <ArrowRight size={16} /></a></div>
        <div className="case-art" aria-hidden="true"><div className="case-handle" /><div className="case-label"><span>CASE 021</span><strong>EVERYTHING<br />YOU NEED</strong><small>CHECK · MAKE · RETURN</small></div><div className="case-stickers"><b>TRY</b><b>05 DAYS</b></div></div>
      </section>

      <section className="promise" aria-label="Rental promises"><div><PackageCheck size={20} /><span><strong>Complete, not cobbled</strong>Consumables and setup guide included</span></div><div><CalendarDays size={20} /><span><strong>2–21 day trials</strong>15% off a full week</span></div><div><ShieldCheck size={20} /><span><strong>Know the downside</strong>Hold and protection shown upfront</span></div></section>

      <section className="catalog" id="catalog">
        <div className="section-head"><div><span>01 · PICK A PROJECT</span><h2>{view === "saved" ? "Your saved experiments" : "What do you want to try?"}</h2></div><p>Fictional kits and availability. Quotes are illustrative and no reservation or payment is created.</p></div>
        <div className="filters">
          <div className="category-tabs" role="group" aria-label="Kit category">{categories.map(item => <button key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="search"><Search size={16} /><span className="sr-only">Search kits</span><input aria-label="Search kits" value={query} placeholder="Search gear or project" onChange={event => setQuery(event.target.value)} /></label>
        </div>
        <div className="kit-grid">
          {kits.map((kit, index) => <article className={`kit-card accent-${kit.accent}`} key={kit.id}>
            <div className="kit-visual"><span>{String(index + 1).padStart(2, "0")}</span><div className="glyph">{kit.category === "Make" ? "✦" : kit.category === "Sound" ? "◒" : "◎"}</div><button aria-label={`${saved.includes(kit.id) ? "Remove" : "Save"} ${kit.name}`} aria-pressed={saved.includes(kit.id)} onClick={() => toggleSaved(kit.id)}><Heart size={17} fill={saved.includes(kit.id) ? "currentColor" : "none"} /></button></div>
            <div className="kit-body"><div className="kit-meta"><span>{kit.category}</span><span>{kit.difficulty}</span></div><h3>{kit.name}</h3><p>{kit.summary}</p><div className="outcome"><Check size={14} /><span>Leave with: <strong>{kit.outcome}</strong></span></div><div className="kit-foot"><div><small>FROM</small><strong>{money(kit.dailyRate)}<i>/day</i></strong></div><button onClick={() => openKit(kit)}>Build a rental <ArrowRight size={15} /></button></div></div>
          </article>)}
        </div>
        {!kits.length && <div className="empty"><Box size={31} /><h3>{view === "saved" ? "No saved kits yet" : "No kits found"}</h3><p>{view === "saved" ? "Save an experiment from the browse view." : "Try a broader project or gear search."}</p><button onClick={() => { setView("browse"); setQuery(""); setCategory("All"); }}>Browse all kits</button></div>}
      </section>
    </main>

    {selected && <div className="overlay" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) setSelected(null); }}><section className="drawer" role="dialog" aria-modal="true" aria-labelledby="rental-title">
      <button className="close" aria-label="Close rental builder" onClick={() => setSelected(null)}><X size={20} /></button>
      <div className="drawer-head"><div className="eyebrow">CASE {selected.id.toUpperCase()}</div><h2 id="rental-title">{selected.name}</h2><p>{selected.contents.join(" · ")}</p></div>
      <div className="availability"><i /><span><strong>Demo availability: {selected.availableDays} days</strong>No inventory is held until a real checkout exists.</span></div>
      <div className="rental-form">
        <label>Rental length <span>{days} days</span><input aria-label="Rental length" type="range" min="2" max="21" value={days} onChange={event => updateDays(Number(event.target.value))} /></label>
        <fieldset><legend>Get the box</legend><label className={delivery === "pickup" ? "choice active" : "choice"}><input type="radio" name="delivery" value="pickup" checked={delivery === "pickup"} onChange={() => { setDelivery("pickup"); setQuote(null); }} /><MapPin size={17} /><span><strong>Studio pickup</strong>Free · fictional Brooklyn desk</span></label><label className={delivery === "shipped" ? "choice active" : "choice"}><input type="radio" name="delivery" value="shipped" checked={delivery === "shipped"} onChange={() => { setDelivery("shipped"); setQuote(null); }} /><Box size={17} /><span><strong>Ship both ways</strong>$24 demo flat rate</span></label></fieldset>
        <label className="protect"><input type="checkbox" checked={protection} onChange={event => { setProtection(event.target.checked); setQuote(null); }} /><ShieldCheck size={18} /><span><strong>Add beginner protection</strong>12% of rental · lowers refundable hold from 25% to 10% of replacement value.</span></label>
      </div>
      <button className="run" onClick={() => void checkAvailability()} disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Checking demo inventory…</> : <>Check availability & price <ArrowRight size={17} /></>}</button>
      <div className="result" aria-live="polite">
        {error && <div className="error" role="alert"><CircleAlert size={17} /><span>{error}</span></div>}
        {quote && <><div className="quote-top"><span>AVAILABLE · DEMO ONLY</span><strong>{money(quote.dueToday)} <i>due today</i></strong></div><dl><div><dt>{days} day rental</dt><dd>{money(quote.rental)}</dd></div>{quote.discount > 0 && <div className="saving"><dt>7+ day discount</dt><dd>−{money(quote.discount)}</dd></div>}<div><dt>Protection</dt><dd>{quote.protection ? money(quote.protection) : "Declined"}</dd></div><div><dt>Delivery</dt><dd>{quote.delivery ? money(quote.delivery) : "Pickup"}</dd></div><div><dt>Refundable hold</dt><dd>{money(quote.refundableHold)}</dd></div></dl><p>Return by day {quote.returnDay}. The hold is not charged in this demo. Final condition, late and missing-item rules require a real inventory system.</p></>}
        {!error && !quote && <p className="hint">Choose how long you want the experiment, then check the fictional inventory and transparent price.</p>}
      </div>
    </section></div>}
    <footer><strong>HobbyBox</strong><p>Fictional prototype · No inventory, payment, reservation or insurance is live.</p><a href="https://github.com/DrGonzo79/hobbybox-20260909">Source & product notes <ArrowRight size={14} /></a></footer>
  </div>;
}
