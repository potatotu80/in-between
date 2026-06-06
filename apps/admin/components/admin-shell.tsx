"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { fetchOverview, fetchRounds, fetchUsers, login } from "../lib/api";
import { clearToken, readToken, writeToken } from "../lib/storage";
import type { AdminOverview, AdminRound, AdminUser } from "../lib/types";

const seededCredentials = {
  username: "admin1",
  password: "admin123",
};

export function AdminShell() {
  const [token, setToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [rounds, setRounds] = useState<AdminRound[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(seededCredentials.username);
  const [password, setPassword] = useState(seededCredentials.password);

  useEffect(() => {
    const savedToken = readToken();
    if (savedToken) {
      setToken(savedToken);
      setDisplayName("Admin One");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    async function hydrate() {
      try {
        setBusy(true);
        const [nextOverview, nextUsers, nextRounds] = await Promise.all([
          fetchOverview(token),
          fetchUsers(token),
          fetchRounds(token),
        ]);

        if (!active) {
          return;
        }

        setOverview(nextOverview);
        setUsers(nextUsers);
        setRounds(nextRounds);
        setError("");
      } catch (nextError) {
        if (!active) {
          return;
        }

        setError(normalizeError(nextError));
      } finally {
        if (active) {
          setBusy(false);
        }
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleLogin() {
    try {
      setBusy(true);
      setError("");
      const response = await login(username, password);
      writeToken(response.accessToken);
      setToken(response.accessToken);
      setDisplayName(response.user.displayName);
    } catch (nextError) {
      setError(normalizeError(nextError));
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    clearToken();
    setToken("");
    setDisplayName("");
    setOverview(null);
    setUsers([]);
    setRounds([]);
    setError("");
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="admin-panel p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-200/70">Admin Console</p>
            <h1 className="mt-4 font-display text-5xl text-white">In Between Control Room</h1>
            <p className="mt-4 max-w-lg text-base text-slate-200/80">
              View player wallet balances, monitor round activity, and inspect live MVP game metrics from the backend.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <InfoTile label="Port" value="3002" />
              <InfoTile label="Source" value="Admin API" />
              <InfoTile label="Role" value="admin1" />
            </div>
          </section>

          <section className="admin-panel p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-200/70">Secure Access</p>
            <h2 className="mt-3 font-display text-3xl text-white">Sign In</h2>
            <p className="mt-3 text-sm text-slate-200/70">
              Use the seeded admin account to inspect the existing backend data and game activity.
            </p>

            <div className="mt-8 space-y-4">
              <Field label="Username" value={username} onChange={setUsername} />
              <Field label="Password" value={password} onChange={setPassword} type="password" />
            </div>

            {error ? <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

            <button
              className="mt-8 w-full rounded-2xl bg-accent px-5 py-4 font-semibold text-slatebrand transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              onClick={handleLogin}
              type="button"
            >
              {busy ? "Signing In..." : "Open Dashboard"}
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="space-y-5">
        <header className="admin-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-teal-200/70">Admin Console</p>
              <h1 className="mt-2 font-display text-4xl text-white">In Between Dashboard</h1>
              <p className="mt-2 text-sm text-slate-200/70">{displayName}</p>
            </div>
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200/80 hover:bg-white/5"
              onClick={handleLogout}
              type="button"
            >
              Log Out
            </button>
          </div>
        </header>

        {error ? <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Players" value={overview?.totalUsers ?? 0} accent />
          <MetricCard label="Active Sessions" value={overview?.activeSessions ?? 0} />
          <MetricCard label="Total Rounds" value={overview?.totalRounds ?? 0} />
          <MetricCard label="Settled Rounds" value={overview?.settledRounds ?? 0} />
          <MetricCard label="Turnover" value={`${overview?.turnover ?? 0} CNY`} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="admin-panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">Player Wallets</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-teal-200/70">{users.length} users</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/[0.03] text-left text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Player</th>
                    <th className="px-4 py-3 font-medium">Username</th>
                    <th className="px-4 py-3 font-medium">Balance</th>
                    <th className="px-4 py-3 font-medium">Locale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white/[0.02]">
                      <td className="px-4 py-3 text-white">{user.displayName}</td>
                      <td className="px-4 py-3 text-slate-300">{user.username}</td>
                      <td className="px-4 py-3 text-teal-200">{user.wallet.balance} {user.wallet.currency}</td>
                      <td className="px-4 py-3 text-slate-300">{user.locale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">Recent Rounds</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-teal-200/70">{rounds.length} rows</span>
            </div>
            <div className="mt-4 space-y-3">
              {rounds.slice(0, 8).map((round) => (
                <div
                  key={round.id}
                  className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Round #{round.roundNumber} · {round.outcome.toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {formatRank(round.leftCard.rank)} / {round.drawnCard ? formatRank(round.drawnCard.rank) : "---"} / {formatRank(round.rightCard.rank)}
                      </p>
                    </div>
                    <div className={clsx(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                      round.outcome === "win" ? "bg-teal-400/20 text-teal-100" : round.outcome === "lose" ? "bg-red-400/15 text-red-100" : "bg-white/10 text-slate-200",
                    )}>
                      {round.betAmount}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-300/80">{round.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Revenue Snapshot</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-teal-200/70">Live MVP</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <MetricCard label="Gross Gaming Revenue" value={`${overview?.grossGamingRevenue ?? 0} CNY`} accent />
            <MetricCard label="Average Bet" value={overview && overview.settledRounds > 0 ? `${(overview.turnover / overview.settledRounds).toFixed(2)} CNY` : "0 CNY"} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-200/80">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition focus:border-teal-200/50"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className={clsx(
      "admin-panel p-5",
      accent ? "border-teal-300/20 bg-teal-400/10" : "",
    )}>
      <p className="text-xs uppercase tracking-[0.2em] text-teal-200/70">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-teal-200/70">{label}</p>
      <p className="mt-2 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

function formatRank(rank: number) {
  const faces: Record<number, string> = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K",
  };

  return faces[rank] ?? String(rank);
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}
