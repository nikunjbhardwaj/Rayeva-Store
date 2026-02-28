import { useCart } from "../state/CartContext.jsx";

const PRODUCTS = [
  {
    id: "bamboo-toothbrush",
    name: "Bamboo Toothbrush",
    price: 60,
    description: "Biodegradable handle, soft bristles. Ditch single-use plastic.",
    badge: "Plastic-free oral care"
  },
  {
    id: "steel-bottle",
    name: "Reusable Steel Bottle",
    price: 900,
    description: "Insulated, leak-proof, replaces hundreds of plastic bottles.",
    badge: "Hydrate without plastic"
  },
  {
    id: "compostable-cutlery",
    name: "Compostable Cutlery Set",
    price: 120,
    description: "Made from plant-based materials, designed to break down quickly.",
    badge: "Food-grade & compostable"
  },
  {
    id: "recycled-notebook",
    name: "Recycled Paper Notebook",
    price: 150,
    description: "100% post-consumer recycled paper, perfect for daily notes.",
    badge: "Made from waste paper"
  }
];

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="pill-badge mb-2">
            Live demo · Sustainable Commerce · AI-native
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Curated eco essentials,{" "}
            <span className="text-emerald-300">with impact reporting built-in.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Add a few products to your cart, place a simulated order, and instantly see
            the plastic and carbon you&apos;ve saved. No payments, just the impact layer.
          </p>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <article key={p.id} className="glass-panel flex flex-col p-4">
            <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-sky-500/10" />
            <h2 className="text-sm font-semibold text-slate-50">{p.name}</h2>
            <p className="mt-1 text-xs text-slate-400">{p.description}</p>
            <p className="mt-2 text-sm font-medium text-emerald-300">₹{p.price}</p>
            <p className="mt-1 text-[11px] text-emerald-300/90">{p.badge}</p>
            <button
              onClick={() =>
                addToCart({
                  id: p.id,
                  name: p.name,
                  price: p.price
                })
              }
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400 transition"
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

