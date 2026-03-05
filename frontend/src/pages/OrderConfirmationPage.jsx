import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      const resolvedId = order.orderId || order._id || id;
      if (resolvedId) {
        window.localStorage.setItem("latestOrderId", String(resolvedId));
      }
      return;
    }
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
        const resolvedId = res.data.orderId || res.data._id || id;
        if (resolvedId) {
          window.localStorage.setItem("latestOrderId", String(resolvedId));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch order details. Try placing a new order.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, order]);

  const impact = order?.impact_data;
  const totalItems = order?.products?.reduce(
    (s, p) => s + (p.quantity || 1),
    0
  ) || 0;
  const locallySourced = impact?.locally_sourced_count ?? 0;
  const localPct =
    totalItems > 0 ? Math.round((locallySourced / totalItems) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-1 nature-gradient items-center justify-center py-20 px-6">
        <p className="text-slate-400">Loading order details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 nature-gradient flex-col items-center justify-center gap-4 py-20 px-6">
        <p className="text-red-400">{error}</p>
        <Link to="/" className="text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const orderIdStr = String(order.orderId || order._id || id);
  const shortId = orderIdStr.slice(-7).toUpperCase();

  return (
    <main className="flex flex-1 nature-gradient justify-center py-10 px-6">
      <div className="flex max-w-[1024px] flex-1 flex-col space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-sm font-semibold uppercase tracking-widest">
              Order Confirmed
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-100 text-5xl font-extrabold leading-tight tracking-tight">
              Order placed, impact calculated{" "}
              <span className="text-primary">in real time</span>
            </h1>
            <p className="text-slate-400 text-lg font-normal max-w-2xl">
              Your conscious choice today contributes to a healthier planet.
              We&apos;ve analyzed your basket&apos;s environmental footprint.
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-accent-dark/40 border border-border-dark rounded-xl p-6 flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-col">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="text-slate-100 text-xl font-mono">#RVE-{shortId}</p>
          </div>
          <div className="h-10 w-px bg-border-dark hidden md:block" />
          <div className="flex flex-col">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <p className="text-slate-100 font-medium">Processing Impact</p>
            </div>
          </div>
          <div className="h-10 w-px bg-border-dark hidden md:block" />
          <div className="flex flex-col text-right">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              Total Amount
            </p>
            <p className="text-primary text-2xl font-bold">
              ₹{order.total_amount?.toLocaleString() ?? "—"}
            </p>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 rounded-xl p-8 border border-border-dark bg-accent-dark/20 hover:bg-accent-dark/40 transition-all group">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-3xl">recycling</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium leading-normal mb-1">
                Plastic Saved
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {impact?.plastic_saved_kg ?? 0} kg
                </p>
                <p className="text-primary text-sm font-bold">
                  {impact?.plastic_saved_kg ? "+12% vs last order" : "—"}
                </p>
              </div>
            </div>
            <div className="w-full h-1 bg-border-dark rounded-full overflow-hidden mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${
                    (impact?.plastic_saved_kg ?? 0) > 0
                      ? Math.max(10, Math.min(100, ((impact.plastic_saved_kg ?? 0) / 3.5) * 100))
                      : 0
                  }%`
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl p-8 border border-border-dark bg-accent-dark/20 hover:bg-accent-dark/40 transition-all group">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-3xl">co2</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium leading-normal mb-1">
                Carbon Avoided
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {impact?.carbon_saved_kg ?? 0} kg
                </p>
                <p className="text-primary text-sm font-bold">
                  {impact?.carbon_saved_kg ? "+5% target" : "—"}
                </p>
              </div>
            </div>
            <div className="w-full h-1 bg-border-dark rounded-full overflow-hidden mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width: `${
                    (impact?.carbon_saved_kg ?? 0) > 0
                      ? Math.max(10, Math.min(100, ((impact.carbon_saved_kg ?? 0) / 20) * 100))
                      : 0
                  }%`
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl p-8 border border-border-dark bg-accent-dark/20 hover:bg-accent-dark/40 transition-all group">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-3xl">distance</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium leading-normal mb-1">
                Locally Sourced
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-100 tracking-tight text-3xl font-bold leading-tight">
                  {locallySourced} Item{locallySourced !== 1 ? "s" : ""}
                </p>
                <p className="text-primary text-sm font-bold">
                  {totalItems > 0 ? `${localPct}% of order` : "—"}
                </p>
              </div>
            </div>
            <div className="w-full h-1 bg-border-dark rounded-full overflow-hidden mt-2">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${localPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>
            <h2 className="text-slate-100 text-2xl font-bold tracking-tight">
              AI-generated impact summary
            </h2>
          </div>
          <div className="bg-gradient-to-br from-accent-dark to-background-dark border border-border-dark rounded-xl p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-primary pointer-events-none transition-transform group-hover:scale-110 duration-700">
              <span className="material-symbols-outlined text-[200px]">eco</span>
            </div>
            <div className="relative z-10 flex flex-col gap-6">
              <p className="text-slate-300 text-lg leading-relaxed italic">
                &quot;
                {order.impact_statement ||
                  "Your sustainable choices make a difference. Impact data is calculated from verified product metadata and supply chain analysis."}
                &quot;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-border-dark">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">
                    verified_user
                  </span>
                </div>
                <p className="text-slate-500 text-sm">
                  Impact data verified by RayevaStore and generated via real-time
                  logistics mapping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 pb-16">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined">info</span>
            <p className="text-sm">
              Expect your delivery within 5–7 business days.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-8 py-3 rounded-full border border-border-dark text-slate-100 font-bold hover:bg-accent-dark transition-colors"
            >
              View Full Invoice
            </button>
            <Link
              to="/support"
              className="px-8 py-3 rounded-full bg-primary text-background-dark font-bold hover:brightness-110 flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              Chat with Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
