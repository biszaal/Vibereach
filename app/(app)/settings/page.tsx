import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";

const channels = [
  { name: "Reddit", connected: true, username: "u/biszaal", icon: "▣" },
  { name: "X / Twitter", connected: false, icon: "◇", pro: false },
  { name: "LinkedIn", connected: false, icon: "◇", pro: false },
  { name: "Cold Email", connected: false, icon: "◉", pro: true },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar breadcrumb={["Account"]} title="Settings" />
      <main className="flex-1 p-6 space-y-8 max-w-2xl">

        {/* Plan */}
        <div>
          <SectionLabel className="mb-4">Plan & usage</SectionLabel>
          <div
            className="border rounded-sm p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className="text-base font-bold"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                >
                  Free Plan
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#8A8071" }}>
                  Resets in 12 days
                </p>
              </div>
              <button
                className="text-xs font-semibold px-4 py-2 rounded-sm shadow-hard-sm"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  background: "#F23005",
                  color: "#EFE7D6",
                }}
              >
                Upgrade to Starter — £15/mo
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Reddit posts", used: 3, max: 10, unit: "drafts/mo" },
                { label: "SEO audits", used: 1, max: 1, unit: "run" },
                { label: "Projects", used: 1, max: 1, unit: "active" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: "#5C5346" }}>{item.label}</span>
                    <span
                      className="text-[0.65rem]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                    >
                      {item.used} / {item.max} {item.unit}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(23,18,12,0.10)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.used / item.max) * 100}%`,
                        background: item.used >= item.max ? "#F23005" : "#17120C",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connected channels */}
        <div>
          <SectionLabel className="mb-4">Connected channels</SectionLabel>
          <div
            className="border rounded-sm overflow-hidden"
            style={{ borderColor: "rgba(23,18,12,0.14)" }}
          >
            {channels.map((ch, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b last:border-0"
                style={{
                  background: i % 2 === 0 ? "#F4EEE0" : "#EFE7D6",
                  borderColor: "rgba(23,18,12,0.10)",
                }}
              >
                <span
                  className="text-base w-5 shrink-0 text-center"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    color: ch.connected ? "#3E8E4F" : "#8A8071",
                  }}
                >
                  {ch.icon}
                </span>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                  >
                    {ch.name}
                  </p>
                  {ch.username && (
                    <p
                      className="text-[0.65rem] mt-0.5"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                    >
                      {ch.username}
                    </p>
                  )}
                </div>
                {"pro" in ch && ch.pro ? (
                  <Tag variant="solid">Pro</Tag>
                ) : ch.connected ? (
                  <span
                    className="text-[0.65rem] uppercase tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}
                  >
                    Connected
                  </span>
                ) : (
                  <button
                    className="text-xs font-medium px-3 py-1.5 border rounded-sm"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      borderColor: "rgba(23,18,12,0.20)",
                      color: "#5C5346",
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <SectionLabel className="mb-4">Danger zone</SectionLabel>
          <div
            className="border rounded-sm p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(242,48,5,0.20)" }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "#17120C" }}>
              Delete project
            </p>
            <p className="text-xs mb-4" style={{ color: "#5C5346" }}>
              Permanently delete this project and all associated data. This cannot be undone.
            </p>
            <button
              className="text-xs font-semibold px-3 py-1.5 border rounded-sm"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                borderColor: "#F23005",
                color: "#F23005",
              }}
            >
              Delete project
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
