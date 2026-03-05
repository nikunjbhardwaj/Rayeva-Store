import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../state/CartContext.jsx";
import api from "../api/client.js";

// Map product IDs to impact badge for cart display
const IMPACT_BADGES = {
  "bamboo-toothbrush": {
    label: "Low Carbon",
    icon: "energy_savings_leaf",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  "steel-bottle": {
    label: "Low Carbon",
    icon: "energy_savings_leaf",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  "compostable-cutlery": {
    label: "Water Saved",
    icon: "water_drop",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  "recycled-notebook": {
    label: "Low Carbon",
    icon: "energy_savings_leaf",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  }
};

const DEFAULT_BADGE = {
  label: "Eco-friendly",
  icon: "eco",
  className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
};

function getImpactBadge(productId) {
  return IMPACT_BADGES[productId] || DEFAULT_BADGE;
}

export default function CartPage() {
  const { items, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.get("/orders");
        setRecentOrders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadOrders();
  }, []);

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    setIsPlacing(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        }))
      };
      const res = await api.post("/orders", payload);
      clearCart();
      navigate(`/order/${res.data.orderId}`, { state: res.data });
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Is the backend running?");
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 lg:px-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 mb-6">
          <span className="material-symbols-outlined text-primary text-xs">
            analytics
          </span>
          <span className="text-primary text-xs font-bold tracking-wide uppercase">
            Module 3 · Impact Reporting
          </span>
        </div>
        <h1 className="text-slate-100 text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          Your cart, ready for{" "}
          <span className="text-primary">impact analysis</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Review your sustainable choices and see the environmental footprint of
          your order before finalizing checkout.
        </p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-6 lg:col-span-7">Product Details</div>
            <div className="col-span-3 lg:col-span-2 text-center">Quantity</div>
            <div className="col-span-3 lg:col-span-3 text-right">
              Impact Score
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">
              Your cart is empty. Add sustainable products from the home page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {items.map((i) => {
                const badge = getImpactBadge(i.id);
                return (
                  <div
                    key={i.id}
                    className="p-6 grid grid-cols-12 gap-4 items-center group hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="col-span-6 lg:col-span-7 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-emerald-900/40 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                        {i.image ? (
                          <img
                            src={i.image}
                            alt={i.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary/60">
                            eco
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-slate-100 font-semibold text-lg">
                          {i.name}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {(i.badges && i.badges[0]) || "Standard"} · 1 unit
                        </p>
                        <p className="text-primary font-mono mt-1">
                          ₹{i.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 lg:col-span-2 flex justify-center">
                      <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                          onClick={() =>
                            updateQuantity(i.id, i.quantity - 1)
                          }
                          className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="text-slate-100 font-bold text-sm w-4 text-center">
                          {i.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(i.id, i.quantity + 1)
                          }
                          className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3 lg:col-span-3 flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {badge.icon}
                        </span>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      robot_2
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm font-semibold">
                      Simulated Order Analysis
                    </p>
                    <p className="text-slate-500 text-xs">
                      AI prediction: This order will show plastic & carbon
                      savings on confirmation.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                      Total Impact Price
                    </p>
                    <p className="text-primary text-4xl font-black">
                      ₹{total.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex-1 md:flex-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPlacing ? "Placing…" : "Checkout Now"}
                  </button>
                </div>
              </div>
              {error && (
                <p className="mt-4 text-red-400 text-sm">{error}</p>
              )}
            </div>
          </>
        )}
      </div>

      {recentOrders.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-slate-100 text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                history
              </span>
              Recent Orders
            </h2>
            <button
              onClick={() => navigate("/cart")}
              className="text-primary text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                      Order ID
                    </p>
                    <p className="text-slate-100 font-mono text-sm">
                      #IMP-{String(o.id).slice(-5).toUpperCase()}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">
                    {o.status === "placed" ? "Delivered" : o.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-slate-500 text-sm">
                    calendar_month
                  </span>
                  <p className="text-slate-400 text-xs">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })
                      : "—"}{" "}
                    · {o.itemCount || 1} Item{o.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/order/${o.id}`)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-100 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    View Order
                  </button>
                  <button
                    onClick={() => {
                      window.localStorage.setItem("latestOrderId", String(o.id));
                      window.localStorage.removeItem("latestChatId");
                      navigate("/support");
                    }}
                    className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 py-2 rounded-lg transition-colors"
                    aria-label="Ask support"
                  >
                    <span className="material-symbols-outlined text-sm">
                      support_agent
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
