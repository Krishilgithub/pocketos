import { redirect } from "next/navigation";
import { ChevronRight, User, Bell, Shield, CreditCard, Trash2, Download, Moon, Globe, LogOut } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import Avatar from "@/components/ui/Avatar";
import { getUser, getProfile, signOut } from "@/lib/actions/auth";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const profile = await getProfile();
  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const currency = profile?.currency || "INR";

  const SETTINGS_SECTIONS = [
    {
      title: "Account",
      items: [
        { id: "settings-profile", icon: <User size={18} />, label: "Edit Profile", sub: displayName, color: "#4F6EF7" },
        { id: "settings-currency", icon: <CreditCard size={18} />, label: "Currency", sub: `₹ Indian Rupee (${currency})`, color: "#22C55E" },
        { id: "settings-language", icon: <Globe size={18} />, label: "Language", sub: "English", color: "#A855F7" },
      ],
    },
    {
      title: "Appearance",
      items: [
        { id: "settings-theme", icon: <Moon size={18} />, label: "Theme", sub: profile?.theme === "dark" ? "Dark" : "Light", color: "#111111" },
        { id: "settings-notifications", icon: <Bell size={18} />, label: "Notifications", sub: "Enabled", color: "#F97316" },
      ],
    },
    {
      title: "Security",
      items: [
        { id: "settings-pin", icon: <Shield size={18} />, label: "Change PIN", sub: profile?.pin_enabled ? "Enabled" : "Not Set", color: "#EF4444" },
        { id: "settings-biometric", icon: <Shield size={18} />, label: "Face ID / Fingerprint", sub: "Disabled", color: "#14B8A6" },
      ],
    },
    {
      title: "Data",
      items: [
        { id: "settings-export", icon: <Download size={18} />, label: "Export Data", sub: "CSV or PDF", color: "#6366F1" },
        { id: "settings-delete", icon: <Trash2 size={18} />, label: "Delete Account", sub: "Permanently remove data", color: "#EF4444", danger: true },
      ],
    },
  ];

  return (
    <div className="page-container" id="settings-page">
      <PageHeader title="Settings" />

      <div style={{ padding: "0 20px" }}>
        {/* ── Profile Card ────────────────────────────── */}
        <div
          className="card animate-fade-up"
          style={{ padding: "20px", marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}
        >
          <Avatar name={displayName} color="#4F6EF7" size={60} fontSize={22} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
              {displayName}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
              {user.email}
            </p>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--green-light)",
                color: "var(--green-dark)",
              }}
            >
              ✓ Verified
            </span>
          </div>
          <button
            id="settings-edit-profile-btn"
            style={{
              padding: "8px 16px",
              background: "var(--bg-input)",
              border: "none",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>

        {/* ── Settings Sections ────────────────────────── */}
        {SETTINGS_SECTIONS.map((section, sIdx) => (
          <div
            key={section.title}
            className="animate-fade-up"
            style={{
              marginBottom: 24,
              animationDelay: `${(sIdx + 1) * 80}ms`,
              opacity: 0,
              animation: `fadeInUp 0.4s ease forwards`,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
                paddingLeft: 4,
              }}
            >
              {section.title}
            </p>
            <div className="card" style={{ padding: "4px 0" }}>
              {section.items.map((item, iIdx) => (
                <div
                  key={item.id}
                  id={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderBottom:
                      iIdx < section.items.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="icon-circle"
                    style={{
                      width: 36,
                      height: 36,
                      background: item.color + "18",
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: (item as { danger?: boolean }).danger ? "var(--red)" : "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Sign Out ────────────────────────────────── */}
        <form action={signOut}>
          <button
            type="submit"
            id="settings-signout-btn"
            className="btn-secondary"
            style={{
              color: "var(--red)",
              marginBottom: 32,
              display: "flex",
              width: "100%",
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>

        {/* ── App Info ────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>PocketOS v1.0.0</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Made with ❤️ · Privacy Policy · Terms of Service
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
