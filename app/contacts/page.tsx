import { redirect } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import Avatar from "@/components/ui/Avatar";
import { ChevronRight, Plus } from "lucide-react";
import { getUser } from "@/lib/actions/auth";
import { getContacts } from "@/lib/actions/contacts";
import { formatCurrency } from "@/lib/utils";

// Dummy groups for UI completeness since we didn't add full groups DB API yet
const GROUPS = [
  { id: "g-1", name: "Room 204", members: ["Rahul Sharma", "Dharini Patel", "Hetavi Shah"], balance: 450, emoji: "🏠" },
  { id: "g-2", name: "Goa Trip 2025", members: ["Rahul Sharma", "Mahek Joshi", "Aryan Mehta"], balance: -200, emoji: "🏖️" },
];

export default async function ContactsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const contacts = await getContacts();

  const owedToMe = contacts.filter((c: any) => Number(c.net_balance) > 0);
  const owedByMe = contacts.filter((c: any) => Number(c.net_balance) < 0);
  
  const totalOwedToMe = owedToMe.reduce((sum: number, c: any) => sum + Number(c.net_balance), 0);
  const totalOwedByMe = Math.abs(owedByMe.reduce((sum: number, c: any) => sum + Number(c.net_balance), 0));

  return (
    <div className="page-container" id="contacts-page">
      <PageHeader
        title="Contacts & Splits"
        rightAction={
          <button className="header-icon-btn" aria-label="Add contact" id="contacts-add-btn">
            <Plus size={18} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
        }
      />

      <div style={{ padding: "0 20px 24px" }}>
        {/* ── Summary ────────────────────────────────── */}
        <div
          className="animate-fade-up"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}
        >
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>
              You're owed
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--green)", fontFamily: "'JetBrains Mono', monospace" }}>
              {formatCurrency(totalOwedToMe)}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              from {owedToMe.length} people
            </p>
          </div>
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>
              You owe
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--orange)", fontFamily: "'JetBrains Mono', monospace" }}>
              {formatCurrency(totalOwedByMe)}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              to {owedByMe.length} people
            </p>
          </div>
        </div>

        {/* ── Contacts List ─────────────────────────── */}
        <div className="animate-fade-up delay-100" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>People</h2>
          <div className="card" style={{ padding: "4px 16px" }}>
            {contacts.map((contact: any, idx: number) => {
              const netBalance = Number(contact.net_balance);
              const isPositive = netBalance > 0;
              const isNeutral = netBalance === 0;

              return (
                <div
                  key={contact.id}
                  id={`contact-${contact.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 0",
                    borderBottom: idx < contacts.length - 1 ? "1px solid var(--border-light)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <Avatar name={contact.name} color={contact.avatar_color} size={44} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      {contact.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {contact.phone || "No phone"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isNeutral ? "var(--text-primary)" : isPositive ? "var(--green)" : "var(--orange)",
                        marginBottom: 2,
                      }}
                    >
                      {!isNeutral && (isPositive ? "+" : "-")}{formatCurrency(Math.abs(netBalance))}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                      {isNeutral ? "Settled up" : isPositive ? "owes you" : "you owe"}
                    </p>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              );
            })}

            {contacts.length === 0 && (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>No contacts added yet</p>
                <button className="btn-secondary" style={{ padding: "8px 16px", height: "auto" }}>
                  Add Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Groups ───────────────────────────────── */}
        <div className="animate-fade-up delay-200">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Groups</h2>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                background: "var(--bg-dark)",
                color: "white",
                borderRadius: "var(--radius-full)",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
              }}
              id="contacts-new-group-btn"
            >
              <Plus size={12} />
              New Group
            </button>
          </div>

          {GROUPS.map((group) => (
            <div
              key={group.id}
              className="card card-hover"
              id={`group-${group.id}`}
              style={{ padding: "16px", marginBottom: 12, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div
                  className="icon-circle"
                  style={{
                    width: 44,
                    height: 44,
                    background: "var(--bg-input)",
                    fontSize: 22,
                  }}
                >
                  {group.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                    {group.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {group.members.length} members
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: group.balance > 0 ? "var(--green)" : "var(--orange)",
                    }}
                  >
                    {group.balance > 0 ? "+" : ""}{formatCurrency(Math.abs(group.balance))}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                    {group.balance > 0 ? "you receive" : "you owe"}
                  </p>
                </div>
              </div>

              {/* Member avatars */}
              <div style={{ display: "flex", gap: -4 }}>
                {group.members.map((name, idx) => (
                  <div key={idx} style={{ marginLeft: idx > 0 ? -8 : 0, zIndex: group.members.length - idx }}>
                    <Avatar
                      name={name}
                      color={["#4F6EF7", "#22C55E", "#F97316", "#A855F7"][idx % 4]}
                      size={28}
                      fontSize={10}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      <FAB href="/add" />
    </div>
  );
}
