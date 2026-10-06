import { useMemo, useState } from "react";
import type { Dashboard } from "@/lib/inventory";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function timeLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function DashboardPanel({
  data,
  currentUserId,
}: {
  data: Dashboard;
  currentUserId: string;
}) {
  const [userId, setUserId] = useState("all");
  const [action, setAction] = useState("all");

  const activity = useMemo(() => {
    return data.activity.filter((row) => {
      if (userId !== "all" && row.actorId !== userId) return false;
      if (action !== "all" && row.action !== action) return false;
      return true;
    });
  }, [action, data.activity, userId]);

  const stats = [
    { label: "In stock", value: String(data.stats.inStock) },
    { label: "Sold", value: String(data.stats.sold) },
    { label: "Stock value", value: formatMoney(data.stats.stockValue) },
    {
      label: "Realized P/L",
      value: formatMoney(data.stats.realizedProfit),
      tone:
        data.stats.realizedProfit > 0
          ? "profit"
          : data.stats.realizedProfit < 0
            ? "loss"
            : "neutral",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface px-4 py-4 shadow-soft"
          >
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-2 font-display text-2xl font-medium tracking-tight tabular-nums",
                "tone" in stat && stat.tone === "profit" && "text-profit",
                "tone" in stat && stat.tone === "loss" && "text-loss",
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5">
        <h2 className="font-display text-lg font-medium tracking-tight">Team</h2>
        <p className="mt-1 text-sm text-muted">
          Signed-in people and what they have done in this shop.
        </p>
        {data.users.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No accounts yet besides seed stock.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {data.users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 py-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-medium">
                    <span className="truncate">{user.name}</span>
                    {user.id === currentUserId ? <Badge>you</Badge> : null}
                  </p>
                  <p className="truncate text-xs text-subtle">{user.email}</p>
                </div>
                <p className="text-right text-xs text-muted tabular-nums">
                  {user.addedCount} added
                  <br />
                  {user.soldCount} sold
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-medium tracking-tight">Activity</h2>
            <p className="mt-1 text-sm text-muted">Who added, sold, or removed an item.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Filter by person"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="all">Everyone</option>
              {data.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="all">All actions</option>
              <option value="added">Added</option>
              <option value="sold">Sold</option>
              <option value="removed">Removed</option>
            </select>
          </div>
        </div>
        {activity.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Nothing matches those filters.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {activity.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 rounded-lg border border-border bg-bg px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {row.actorName}{" "}
                    <span className="font-normal text-muted">
                      {row.action} {row.productName}
                    </span>
                  </p>
                  {row.detail ? (
                    <p className="text-sm text-subtle">{row.detail}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="capitalize">{row.action}</Badge>
                  <span className="text-xs text-subtle tabular-nums">
                    {timeLabel(row.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
