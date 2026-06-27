"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Applications", href: "/admin/applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { label: "Orders", href: "/admin/orders", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
      { label: "Menu Items", href: "/admin/menu", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
      { label: "Products", href: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
      { label: "Job Openings", href: "/admin/jobs", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    ],
  },
];

const superAdminSection: NavSection = {
  title: "System",
  items: [
    { label: "Admin Users", href: "/admin/users", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" },
  ],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string; username: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) { router.push("/admin"); return; }
        setUser(d);
        setReady(true);
      })
      .catch(() => router.push("/admin"));
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/admin");
  };

  const isActive = useCallback((href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname.startsWith("/admin/applications")) return "Applications";
    if (pathname.startsWith("/admin/menu")) return "Menu Items";
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/jobs")) return "Job Openings";
    if (pathname.startsWith("/admin/users")) return "Admin Users";
    return "Admin";
  };

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, i) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      isLast: i === parts.length - 1,
    }));
  };

  if (!ready || !user) {
    return (
      <main style={{ minHeight: "100vh", background: "#fdf9f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #e0ddd8", borderTopColor: "#1b3c33", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.9rem" }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </main>
    );
  }

  const sidebarWidth = collapsed ? "72px" : "260px";

  const allSections = user.role === "super_admin"
    ? [...sections, superAdminSection]
    : sections;

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const isHovered = hoveredItem === item.href;

    return (
      <div key={item.href} style={{ position: "relative" }}>
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? "0" : "0.75rem",
            padding: collapsed ? "0.7rem 0" : "0.6rem 1rem",
            borderRadius: "10px",
            color: active ? "#fdf9f4" : "rgba(255,255,255,0.55)",
            background: active
              ? "linear-gradient(135deg, rgba(234,185,106,0.18), rgba(234,185,106,0.08))"
              : isHovered
                ? "rgba(255,255,255,0.06)"
                : "transparent",
            textDecoration: "none",
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.85rem",
            fontWeight: active ? 700 : 500,
            transition: "all 0.2s ease",
            justifyContent: collapsed ? "center" : "flex-start",
            position: "relative" as const,
            borderLeft: active ? "3px solid #eab96a" : "3px solid transparent",
            marginLeft: collapsed ? "0" : "-3px",
            paddingLeft: collapsed ? "0" : "calc(1rem - 3px)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={active ? "#eab96a" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d={item.icon} />
          </svg>
          {!collapsed && (
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
          )}
        </Link>

        {collapsed && isHovered && (
          <div
            style={{
              position: "absolute",
              left: "calc(100% + 12px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "#1b3c33",
              color: "#fdf9f4",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 100,
              pointerEvents: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {item.label}
            <div style={{
              position: "absolute",
              left: "-4px",
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              background: "#1b3c33",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .admin-sidebar { transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease; }
        .admin-main { transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); position: fixed !important; z-index: 50 !important; }
          .admin-sidebar.mobile-open { transform: translateX(0); animation: slideIn 0.25s ease; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f1ec" }}>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40,
              animation: "fadeIn 0.2s ease",
            }}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            background: "linear-gradient(180deg, #0f2b22 0%, #1b3c33 40%, #162f28 100%)",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            overflow: "visible",
          }}
        >
          {/* Logo */}
          <div style={{
            padding: collapsed ? "1.5rem 0.75rem" : "1.5rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            minHeight: "72px",
          }}>
            {!collapsed ? (
              <div style={{ overflow: "hidden" }}>
                <h2 style={{
                  fontFamily: "var(--font-bebas-neue), sans-serif",
                  fontSize: "1.3rem",
                  color: "#fdf9f4",
                  letterSpacing: "0.12em",
                  lineHeight: 1.1,
                }}>December Delights</h2>
                <span style={{
                  display: "inline-block",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "4px",
                  background: user.role === "super_admin"
                    ? "linear-gradient(135deg, #eab96a, #f0c97d)"
                    : "rgba(255,255,255,0.12)",
                  color: user.role === "super_admin" ? "#0f2b22" : "rgba(255,255,255,0.6)",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-outfit), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "0.35rem",
                }}>
                  {user.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
            ) : (
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "linear-gradient(135deg, #eab96a, #f0c97d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-bebas-neue), sans-serif",
                fontSize: "1rem", color: "#0f2b22", fontWeight: 700,
              }}>
                DD
              </div>
            )}
          </div>

          {/* Nav sections */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "visible", padding: collapsed ? "0.75rem 0.5rem" : "0.75rem 0", display: "flex", flexDirection: "column", gap: "0" }}>
            {allSections.map((section, si) => (
              <div key={section.title} style={{ marginBottom: si < allSections.length - 1 ? "1.25rem" : "0" }}>
                {!collapsed && (
                  <p style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    padding: "0.4rem 1rem",
                    marginBottom: "0.3rem",
                  }}>
                    {section.title}
                  </p>
                )}
                {collapsed && si > 0 && (
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0.5rem 0.5rem" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {section.items.map(renderNavItem)}
                </div>
              </div>
            ))}
          </div>

          {/* User + Logout */}
          <div style={{
            padding: collapsed ? "0.75rem 0.5rem" : "0 0.75rem 1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {!collapsed ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                marginBottom: "0.5rem",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: user.role === "super_admin"
                    ? "linear-gradient(135deg, #eab96a, #f0c97d)"
                    : "rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800,
                  fontSize: "0.8rem", color: user.role === "super_admin" ? "#0f2b22" : "#fdf9f4",
                  flexShrink: 0,
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700, fontSize: "0.8rem", color: "#fdf9f4",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{user.username}</p>
                  <p style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: "0.65rem", color: "rgba(255,255,255,0.4)",
                  }}>{user.role === "super_admin" ? "Super Admin" : "Admin"}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: user.role === "super_admin"
                    ? "linear-gradient(135deg, #eab96a, #f0c97d)"
                    : "rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800,
                  fontSize: "0.8rem", color: user.role === "super_admin" ? "#0f2b22" : "#fdf9f4",
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: collapsed ? "0.65rem 0" : "0.6rem 0.75rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(231,76,60,0.1)";
                e.currentTarget.style.borderColor = "rgba(231,76,60,0.2)";
                e.currentTarget.style.color = "#e74c3c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="admin-main" style={{ flex: 1, marginLeft: sidebarWidth }}>
          {/* Top bar */}
          <header style={{
            height: "56px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e8e5e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  display: "none",
                  padding: "0.4rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                className="mobile-hamburger"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1b3c33" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Collapse toggle (desktop) */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  padding: "0.4rem",
                  background: "none",
                  border: "1px solid #e0ddd8",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  width: "32px",
                  height: "32px",
                }}
                className="desktop-toggle"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0ede8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#586159" strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.25s ease", transform: collapsed ? "rotate(180deg)" : "none" }}>
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              </button>

              {/* Breadcrumbs */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {getBreadcrumbs().map((crumb, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {i > 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>}
                    <span style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: crumb.isLast ? 700 : 500,
                      color: crumb.isLast ? "#1b3c33" : "#999",
                    }}>{crumb.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "6px",
                background: user.role === "super_admin" ? "#eab96a18" : "#1b3c3310",
                color: user.role === "super_admin" ? "#b8860b" : "#1b3c33",
                fontSize: "0.65rem",
                fontWeight: 700,
                fontFamily: "var(--font-outfit), sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {user.role === "super_admin" ? "Super Admin" : "Admin"}
              </span>
              <Link
                href="/"
                target="_blank"
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #e0ddd8",
                  background: "transparent",
                  color: "#586159",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0ede8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Site
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main style={{ padding: "1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {children}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
          .desktop-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}
