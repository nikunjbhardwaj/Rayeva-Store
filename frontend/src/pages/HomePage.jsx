import { useState, useRef } from "react";
import { useCart } from "../state/CartContext.jsx";

const PRODUCTS = [
  {
    id: "bamboo-toothbrush",
    name: "Bamboo Toothbrush",
    price: 60,
    description: "Biodegradable handle, soft bristles. Ditch single-use plastic.",
    badges: ["Plastic-free", "Vegan"],
    label: "Best Seller",
    image: "/products/img/bamboo-toothbrush.png.png"
  },
  {
    id: "steel-bottle",
    name: "Reusable Steel Bottle",
    price: 900,
    description: "Insulated, leak-proof, replaces hundreds of plastic bottles.",
    badges: ["Eco-friendly"],
    label: null,
    image: "/products/img/steel-bottle.png.png"
  },
  {
    id: "compostable-cutlery",
    name: "Compostable Cutlery Set",
    price: 120,
    description: "Plant-based materials, designed to break down quickly.",
    badges: ["Carbon-neutral"],
    label: null,
    image: "/products/img/compostable-cutlery.png.png"
  },
  {
    id: "recycled-notebook",
    name: "Recycled Paper Notebook",
    price: 150,
    description: "100% post-consumer recycled paper, perfect for daily notes.",
    badges: ["Biodegradable"],
    label: "New Arrival",
    image: "/products/img/recycled-notebook.png.png"
  }
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null); // { name, image }
  const timerRef = useRef(null);

  function handleAddToCart(product) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      badges: product.badges
    });
    setToast({ name: product.name, image: product.image });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 hero-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Live demo · Sustainable Commerce · AI-native
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-100 mb-6 leading-[1.1] tracking-tight">
            Curated eco essentials, with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              impact reporting
            </span>{" "}
            built-in.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Ethically sourced, carbon neutral, and verified by AI. Join the movement
            towards a regenerative future for our planet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#products"
              className="w-full sm:w-auto px-10 py-4 bg-primary text-background-dark font-bold rounded-xl text-lg hover:shadow-[0_0_25px_rgba(37,244,106,0.4)] transition-all"
            >
              Shop Collection
            </a>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="relative overflow-hidden max-w-7xl mx-auto px-6 py-20">

        {/* ── Decorative background tree ── */}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 620"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 1,
          }}
        >
          <g
            stroke="#6fffa0"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {/* ── Trunk ── */}
            <path d="M 250 620 Q 250 520 250 390" strokeWidth="1.8" opacity="0.09" />

            {/* ── Level 1 — main boughs ── */}
            <path d="M 250 390 Q 195 330 115 248" strokeWidth="1.4" opacity="0.08" />
            <path d="M 250 390 Q 305 330 385 248" strokeWidth="1.4" opacity="0.08" />
            {/* Centre upward shoot */}
            <path d="M 250 390 Q 250 330 250 258" strokeWidth="1.1" opacity="0.06" />

            {/* ── Level 2 — secondary branches ── */}
            {/* Left bough children */}
            <path d="M 115 248 Q 72  202 40  138" strokeWidth="1.1" opacity="0.07" />
            <path d="M 115 248 Q 148 196 172 138" strokeWidth="1.1" opacity="0.07" />
            {/* Right bough children */}
            <path d="M 385 248 Q 352 196 328 138" strokeWidth="1.1" opacity="0.07" />
            <path d="M 385 248 Q 418 202 460 138" strokeWidth="1.1" opacity="0.07" />
            {/* Centre shoot children */}
            <path d="M 250 258 Q 228 210 210 158" strokeWidth="0.9" opacity="0.055" />
            <path d="M 250 258 Q 272 210 290 158" strokeWidth="0.9" opacity="0.055" />

            {/* ── Level 3 — fine sprigs ── */}
            <path d="M 40  138 Q 24  98  12  58" strokeWidth="0.85" opacity="0.065" />
            <path d="M 40  138 Q 55  96  68  58" strokeWidth="0.85" opacity="0.065" />

            <path d="M 172 138 Q 154 96  140 56" strokeWidth="0.85" opacity="0.065" />
            <path d="M 172 138 Q 186 94  198 52" strokeWidth="0.85" opacity="0.065" />

            <path d="M 328 138 Q 314 94  302 52" strokeWidth="0.85" opacity="0.065" />
            <path d="M 328 138 Q 342 96  356 56" strokeWidth="0.85" opacity="0.065" />

            <path d="M 460 138 Q 445 96  432 58" strokeWidth="0.85" opacity="0.065" />
            <path d="M 460 138 Q 476 98  488 58" strokeWidth="0.85" opacity="0.065" />

            <path d="M 210 158 Q 200 118 193 78" strokeWidth="0.75" opacity="0.05" />
            <path d="M 290 158 Q 300 118 307 78" strokeWidth="0.75" opacity="0.05" />

            {/* ── Leaf tips — tiny glowing dots ── */}
            <circle cx="12" cy="58" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="68" cy="58" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="140" cy="56" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="198" cy="52" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="302" cy="52" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="356" cy="56" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="432" cy="58" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="488" cy="58" r="2.2" fill="#6fffa0" stroke="none" opacity="0.18" />
            <circle cx="193" cy="78" r="1.8" fill="#6fffa0" stroke="none" opacity="0.14" />
            <circle cx="307" cy="78" r="1.8" fill="#6fffa0" stroke="none" opacity="0.14" />
            <circle cx="250" cy="258" r="1.6" fill="#6fffa0" stroke="none" opacity="0.10" />
          </g>
        </svg>

        <div className="relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Sustainable Essentials
              </h2>
              <p className="text-slate-400">
                Our highest rated items, hand-picked for their low carbon footprint.
              </p>
            </div>
            <a
              href="#"
              className="text-primary font-bold flex items-center gap-1 hover:underline"
            >
              View all{" "}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((p) => (
              <article
                key={p.id}
                className="glass-card rounded-2xl p-4 flex flex-col group transition-transform hover:-translate-y-2"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-forest-accent to-background-dark">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {p.label && (
                    <div className="absolute top-3 left-3 bg-primary/90 text-background-dark text-[10px] font-black px-2 py-1 rounded uppercase">
                      {p.label}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-slate-100 font-bold text-lg">{p.name}</h3>
                    <span className="text-primary font-bold">₹{p.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-1">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    {p.badges.map((badge) => (
                      <span
                        key={badge}
                        className="bg-forest-accent text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          eco
                        </span>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full bg-forest-accent/50 hover:bg-primary hover:text-background-dark text-slate-100 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">
                    add_shopping_cart
                  </span>
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-forest-accent/10 border-y border-forest-accent/20 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-100 mb-6 leading-tight">
                We track every gram of impact so you don&apos;t have to.
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Our proprietary AI engine analyzes supply chains in real-time to
                provide transparent reporting for every purchase made at RayevaStore.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="text-slate-100 font-bold">
                      Third-party Verified
                    </h4>
                    <p className="text-slate-500 text-sm">
                      Audited by global environmental standards annually.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <div>
                    <h4 className="text-slate-100 font-bold">
                      Real-time Tracking
                    </h4>
                    <p className="text-slate-500 text-sm">
                      See your personal contribution grow in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="glass-card rounded-2xl p-8 border-l-4 border-l-primary flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Plastic Saved
                  </p>
                  <p className="text-4xl font-black text-slate-100">12,500 kg</p>
                </div>
                <p className="text-primary text-sm font-bold mt-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +12% from last month
                </p>
              </div>
              <div className="glass-card rounded-2xl p-8 border-l-4 border-l-emerald-400 flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Trees Planted
                  </p>
                  <p className="text-4xl font-black text-slate-100">8,420</p>
                </div>
                <p className="text-emerald-400 text-sm font-bold mt-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +5% from last month
                </p>
              </div>
              <div className="glass-card rounded-2xl p-8 border-l-4 border-l-teal-400 flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Carbon Offset
                  </p>
                  <p className="text-4xl font-black text-slate-100">250 tons</p>
                </div>
                <p className="text-teal-400 text-sm font-bold mt-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +8% from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom-right "Added to cart" toast ── */}
      <div
        style={{
          position: "fixed",
          bottom: "28px",
          right: "24px",
          zIndex: 9999,
          transform: toast ? "translateY(0)" : "translateY(120%)",
          opacity: toast ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
          pointerEvents: toast ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(10, 18, 12, 0.92)",
            border: "1px solid rgba(111, 255, 160, 0.35)",
            borderRadius: "16px",
            padding: "14px 20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(111,255,160,0.08)",
            backdropFilter: "blur(16px)",
            minWidth: "260px",
            maxWidth: "330px",
          }}
        >
          {/* Product thumbnail */}
          {toast?.image && (
            <img
              src={toast.image}
              alt={toast?.name}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "10px",
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid rgba(111,255,160,0.2)",
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", color: "#6fffa0", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>
              Added to Cart
            </p>
            <p style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 600, margin: 0 }}>
              {toast?.name}
            </p>
          </div>

          {/* Checkmark badge */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(111,255,160,0.15)",
              border: "1px solid rgba(111,255,160,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#6fffa0" }}>
              check
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
