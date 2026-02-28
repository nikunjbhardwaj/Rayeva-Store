import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../state/CartContext.jsx";
import api from "../api/client.js";

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
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="pill-badge mb-2">Module 3 · Impact Reporting</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Your cart,{" "}
            <span className="text-emerald-300">ready for impact analysis.</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Adjust quantities and place a simulated order. We&apos;ll calculate plastic
            and carbon savings on the next screen.
          </p>
        </div>
      </header>

      <div className="glass-panel p-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">
            Your cart is empty. Add a few sustainable products from the products page.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-medium text-slate-50">{i.name}</div>
                  <div className="text-xs text-slate-400">₹{i.price}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 text-xs">
                    <button
                      onClick={() => updateQuantity(i.id, i.quantity - 1)}
                      className="px-2 py-1 text-slate-300 hover:bg-slate-800/70"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-slate-50">{i.quantity}</span>
                    <button
                      onClick={() => updateQuantity(i.id, i.quantity + 1)}
                      className="px-2 py-1 text-slate-300 hover:bg-slate-800/70"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-medium text-emerald-300">
                    ₹{i.price * i.quantity}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">Simulated order · No payment</div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Estimated total</div>
                <div className="text-lg font-semibold text-emerald-300">
                  ₹{total.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          disabled={items.length === 0 || isPlacing}
          onClick={handlePlaceOrder}
          className="ml-auto inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {isPlacing ? "Placing order…" : "Place Order"}
        </button>
      </div>

      {recentOrders.length > 0 && (
        <div className="glass-panel mt-6 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-50">
              Recent orders
            </h2>
            <p className="text-[11px] text-slate-500">
              Showing last {recentOrders.length} orders
            </p>
          </div>
          <div className="space-y-2 text-xs">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2"
              >
                <div>
                  <div className="font-mono text-[11px] text-slate-300">
                    #{String(o.id).slice(-6)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Total</div>
                    <div className="text-sm font-semibold text-emerald-300">
                      ₹{o.total_amount}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/order/${o.id}`)}
                    className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800/80"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      window.localStorage.setItem(
                        "latestOrderId",
                        String(o.id)
                      );
                      window.localStorage.removeItem("latestChatId");
                      navigate("/support");
                    }}
                    className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20"
                  >
                    Ask support
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

