import type { ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface ShellProps {
  children: ReactNode;
  nav: NavItem[];
  active: string;
  onNav: (id: string) => void;
}

export function Shell({ children, nav, active, onNav }: ShellProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6" style={{ fontFamily: "Fraunces, serif" }}>
            <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>🤜 BroHub</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Your ultimate bro companion</div>
          </div>
          <nav className="flex-1 px-4 flex flex-col gap-1">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left w-full"
                style={{
                  background: active === item.id ? "var(--accent)" : "transparent",
                  color: active === item.id ? "#fff" : "var(--ink)",
                  borderRadius: "0.75rem",
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "var(--accent)" }}>
            🤜 BroHub
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <nav
          className="flex items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
              style={{ color: active === item.id ? "var(--accent)" : "var(--muted)" }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
