import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import SupportChatPage from "./pages/SupportChatPage.jsx";
import { useCart } from "./state/CartContext.jsx";

function AppShell({ children }) {
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const location = useLocation();
  const isSupport = location.pathname.startsWith("/support");

  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden font-display ${
        isSupport ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      <header className="sticky top-0 z-50 w-full border-b border-forest-accent/30 bg-background-dark/80 backdrop-blur-md px-6 py-4 md:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">eco</span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-100">
                RayevaStore
              </h2>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`
                }
              >
                Impact
              </NavLink>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-slate-300 hover:text-primary"
                  }`
                }
              >
                About
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden items-center rounded-full border border-forest-accent/50 bg-forest-accent/40 px-4 py-1.5 lg:flex">
              <span className="material-symbols-outlined text-xl text-primary">
                search
              </span>
              <input
                type="text"
                placeholder="Search eco items..."
                className="w-48 border-none bg-transparent text-sm placeholder:text-slate-500 focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/support"
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-background-dark transition-all hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-lg">smart_toy</span>
                <span className="hidden sm:inline">AI Support</span>
              </Link>
              <Link
                to="/cart"
                className="relative p-2 text-slate-100 transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-2xl">
                  shopping_cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background-dark">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="h-9 w-9 overflow-hidden rounded-full border-2 border-forest-accent"
                aria-label="Account"
              >
                <span className="flex h-full w-full items-center justify-center bg-forest-accent text-sm font-bold text-primary">
                  R
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={isSupport ? "flex flex-1 min-h-0 overflow-hidden" : "flex-1"}>
        {children}
      </main>

      {!isSupport && (
        <footer className="border-t border-forest-accent/20 bg-background-dark px-6 py-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2 text-primary opacity-80">
              <span className="material-symbols-outlined text-2xl">eco</span>
              <h2 className="text-lg font-bold text-slate-100">RayevaStore</h2>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <Link to="/" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/" className="transition-colors hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/" className="transition-colors hover:text-primary">
                Shipping Info
              </Link>
            </div>
            <p className="text-sm text-slate-600">
              © 2024 RayevaStore. All rights reserved.
            </p>
          </div>
        </footer>
      )}
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
