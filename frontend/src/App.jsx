import { Link, NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import SupportChatPage from "./pages/SupportChatPage.jsx";
import { useCart } from "./state/CartContext.jsx";

function AppShell({ children }) {
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/60">
              <span className="text-lg">🌱</span>
            </span>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-50">
                Sustainable Commerce
              </div>
              <div className="text-xs text-slate-400">
                Impact Reporting & AI Support
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "text-slate-300 hover:bg-slate-800/70"
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full inline-flex items-center gap-2 ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "text-slate-300 hover:bg-slate-800/70"
                }`
              }
            >
              Cart
              {cartCount > 0 && (
                <span className="pill-badge !px-2 !py-0.5 text-xs">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "text-slate-300 hover:bg-slate-800/70"
                }`
              }
            >
              Support Chat
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-3 text-center text-xs text-slate-500">
        Demo platform · Module 3: Impact Reporting · Module 4: AI Support Bot
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/:id" element={<OrderConfirmationPage />} />
        <Route path="/support" element={<SupportChatPage />} />
      </Routes>
    </AppShell>
  );
}

