"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  createRound,
  createSession,
  fetchHistory,
  fetchLobby,
  fetchWallet,
  login,
  settleRound,
} from "../lib/api";
import { copy, type SupportedLocale } from "../lib/copy";
import { clearToken, readLocale, readToken, writeLocale, writeToken } from "../lib/storage";
import type {
  GameRound,
  GameSession,
  LobbyResponse,
  SettledRound,
  Wallet,
} from "../lib/types";
import { PhaserTable } from "./phaser-table";

type AuthState = {
  token: string;
  displayName: string;
};

const seededCredentials = {
  username: "player1",
  password: "password123",
};

export function PlayerShell() {
  const [locale, setLocale] = useState<SupportedLocale>("en");
  const [auth, setAuth] = useState<AuthState>({ token: "", displayName: "" });
  const [username, setUsername] = useState(seededCredentials.username);
  const [password, setPassword] = useState(seededCredentials.password);
  const [lobby, setLobby] = useState<LobbyResponse | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [history, setHistory] = useState<GameRound[]>([]);
  const [session, setSession] = useState<GameSession | null>(null);
  const [round, setRound] = useState<GameRound | null>(null);
  const [betAmount, setBetAmount] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const text = copy[locale];

  useEffect(() => {
    const savedLocale = readLocale() as SupportedLocale;
    const token = readToken();
    setLocale(savedLocale);
    if (token) {
      setAuth({ token, displayName: "Player One" });
    }
  }, []);

  useEffect(() => {
    if (!auth.token) {
      return;
    }

    let active = true;

    async function hydrate() {
      try {
        setBusy(true);
        const [nextLobby, nextWallet, nextHistory] = await Promise.all([
          fetchLobby(auth.token),
          fetchWallet(auth.token),
          fetchHistory(auth.token),
        ]);

        if (!active) {
          return;
        }

        setLobby(nextLobby);
        setWallet(nextWallet);
        setHistory(nextHistory);
        if (nextLobby.betLimits.defaults.length > 0) {
          setBetAmount(nextLobby.betLimits.defaults[1] ?? nextLobby.betLimits.defaults[0]);
        }
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
  }, [auth.token]);

  function switchLocale(nextLocale: SupportedLocale) {
    setLocale(nextLocale);
    writeLocale(nextLocale);
  }

  async function handleLogin(useSeed = false) {
    try {
      setBusy(true);
      setError("");
      const credentials = useSeed ? seededCredentials : { username, password };
      const response = await login(credentials.username, credentials.password);
      writeToken(response.accessToken);
      setAuth({
        token: response.accessToken,
        displayName: response.user.displayName,
      });
    } catch (nextError) {
      setError(normalizeError(nextError));
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    clearToken();
    setAuth({ token: "", displayName: "" });
    setLobby(null);
    setWallet(null);
    setHistory([]);
    setSession(null);
    setRound(null);
    setError("");
  }

  async function handleStartSession() {
    if (!auth.token) {
      return;
    }

    try {
      setBusy(true);
      const nextSession = await createSession(auth.token);
      setSession(nextSession);
      setRound(null);
    } catch (nextError) {
      setError(normalizeError(nextError));
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateRound() {
    if (!auth.token || !session) {
      setError(text.openSessionFirst);
      return;
    }

    try {
      setBusy(true);
      const nextRound = await createRound(session.id, auth.token);
      setRound(nextRound);
    } catch (nextError) {
      setError(normalizeError(nextError));
    } finally {
      setBusy(false);
    }
  }

  async function handleSettleRound() {
    if (!auth.token || !session || !round) {
      return;
    }

    try {
      setBusy(true);
      const settled = await settleRound(session.id, round.id, betAmount, auth.token);
      setRound(settled);
      setWallet({
        ...(wallet ?? lobby?.wallet ?? {
          id: "",
          userId: "",
          currency: "CNY",
          balance: 0,
          lockedBalance: 0,
        }),
        balance: settled.balance,
      });
      const nextHistory = await fetchHistory(auth.token);
      setHistory(nextHistory);
    } catch (nextError) {
      setError(normalizeError(nextError));
    } finally {
      setBusy(false);
    }
  }

  if (!auth.token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="panel overflow-hidden bg-table-felt p-8 sm:p-10">
            <div className="max-w-lg">
              <div className="mb-6 inline-flex rounded-full border border-ember-200/30 bg-black/20 p-1 text-sm">
                <button
                  className={locale === "en" ? activeToggleClass : inactiveToggleClass}
                  onClick={() => switchLocale("en")}
                  type="button"
                >
                  EN
                </button>
                <button
                  className={locale === "zh" ? activeToggleClass : inactiveToggleClass}
                  onClick={() => switchLocale("zh")}
                  type="button"
                >
                  中文
                </button>
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-ember-100/80">Phase 1 MVP</p>
              <h1 className="mt-4 font-display text-5xl text-white sm:text-6xl">{text.title}</h1>
              <p className="mt-4 max-w-md text-base text-parchment/80 sm:text-lg">{text.subtitle}</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <FeatureStat label="Frontend" value="Next.js" />
                <FeatureStat label="Game" value="Phaser" />
                <FeatureStat label="Embed" value="iframe" />
              </div>
            </div>
          </section>

          <section className="panel gold-ring p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ember-200/70">{text.loginTitle}</p>
            <h2 className="mt-3 font-display text-3xl text-white">{text.table}</h2>
            <p className="mt-3 text-sm text-parchment/75">{text.loginHint}</p>

            <div className="mt-8 space-y-4">
              <Field label={text.username} value={username} onChange={setUsername} />
              <Field label={text.password} value={password} onChange={setPassword} type="password" />
            </div>

            {error ? <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

            <div className="mt-8 flex flex-col gap-3">
              <button
                className="rounded-2xl bg-ember-400 px-5 py-4 font-semibold text-lacquer transition hover:bg-ember-300 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={busy}
                onClick={() => handleLogin(false)}
                type="button"
              >
                {busy ? text.signingIn : text.signIn}
              </button>
              <button
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-parchment transition hover:bg-white/10"
                disabled={busy}
                onClick={() => handleLogin(true)}
                type="button"
              >
                {text.quickAccess}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5">
          <header className="panel p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ember-200/70">{text.table}</p>
                <h1 className="mt-2 font-display text-4xl text-white">{text.title}</h1>
                <p className="mt-2 text-sm text-parchment/75">{auth.displayName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-ember-200/30 bg-black/20 p-1 text-sm">
                  <button
                    className={locale === "en" ? activeToggleClass : inactiveToggleClass}
                    onClick={() => switchLocale("en")}
                    type="button"
                  >
                    EN
                  </button>
                  <button
                    className={locale === "zh" ? activeToggleClass : inactiveToggleClass}
                    onClick={() => switchLocale("zh")}
                    type="button"
                  >
                    中文
                  </button>
                </div>
                <button
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-parchment/80 hover:bg-white/5"
                  onClick={handleLogout}
                  type="button"
                >
                  {text.logout}
                </button>
              </div>
            </div>
          </header>

          <section className="panel p-4 sm:p-5">
            <PhaserTable
              leftRank={round?.leftCard.rank}
              rightRank={round?.rightCard.rank}
              drawnRank={round?.drawnCard?.rank}
              outcomeLabel={round ? `${text.result}: ${translateOutcome(round.outcome, text)}` : text.idleTitle}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ActionCard
                label={text.startSession}
                value={session ? session.id.slice(0, 8) : "..." }
                buttonLabel={text.startSession}
                disabled={busy}
                onClick={handleStartSession}
              />
              <ActionCard
                label={text.roundStatus}
                value={round ? round.status : "idle"}
                buttonLabel={text.dealCards}
                disabled={busy}
                onClick={handleCreateRound}
              />
              <ActionCard
                label={text.result}
                value={round ? translateOutcome(round.outcome, text) : "---"}
                buttonLabel={text.settleBet}
                disabled={busy || !round || round.status !== "pending_bet"}
                onClick={handleSettleRound}
              />
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ember-200/70">{text.betAmount}</p>
                <h2 className="mt-2 font-display text-3xl text-white">{betAmount} {wallet?.currency ?? "CNY"}</h2>
              </div>
              <div className="rounded-full border border-jade/40 bg-jade/15 px-4 py-2 text-sm text-parchment/85">
                {text.balance}: {wallet?.balance ?? lobby?.wallet.balance ?? 0}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(lobby?.betLimits.defaults ?? [10, 20, 50, 100, 200]).map((value) => (
                <button
                  key={value}
                  className={clsx(
                    "rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition",
                    value === betAmount
                      ? "border-ember-200/70 bg-ember-300 text-lacquer"
                      : "border-white/10 bg-white/5 text-parchment hover:bg-white/10",
                  )}
                  onClick={() => setBetAmount(value)}
                  type="button"
                >
                  {value}
                </button>
              ))}
            </div>

            {!round ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-white/15 bg-black/10 px-5 py-6 text-sm text-parchment/70">
                <p className="font-medium text-parchment">{text.idleTitle}</p>
                <p className="mt-2">{text.idleBody}</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <StatCard label="Left" value={`${formatRank(round.leftCard.rank)} ${round.leftCard.suit}`} />
                <StatCard label="Right" value={`${formatRank(round.rightCard.rank)} ${round.rightCard.suit}`} />
                <StatCard label="Drawn" value={round.drawnCard ? `${formatRank(round.drawnCard.rank)} ${round.drawnCard.suit}` : "---"} />
                <StatCard label={text.result} value={translateOutcome(round.outcome, text)} accent />
              </div>
            )}
          </section>
        </section>

        <aside className="space-y-5">
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ember-200/70">{text.table}</p>
                <h2 className="mt-2 font-display text-2xl text-white">{lobby?.tableName ?? text.loading}</h2>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-ember-100">
                {lobby?.gameCode ?? "MVP"}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard label={text.balance} value={`${wallet?.balance ?? 0} ${wallet?.currency ?? "CNY"}`} accent />
              <StatCard
                label={text.limits}
                value={`${lobby?.betLimits.min ?? 10} - ${lobby?.betLimits.max ?? 500}`}
              />
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-white">{text.history}</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-ember-200/70">{history.length} rounds</span>
            </div>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-4 py-5 text-sm text-parchment/70">
                  {text.loading}
                </p>
              ) : (
                history.slice(0, 6).map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          #{entry.roundNumber} · {translateOutcome(entry.outcome, text)}
                        </p>
                        <p className="mt-1 text-xs text-parchment/65">
                          {formatRank(entry.leftCard.rank)} / {entry.drawnCard ? formatRank(entry.drawnCard.rank) : "---"} / {formatRank(entry.rightCard.rank)}
                        </p>
                      </div>
                      <div className={clsx(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                        entry.outcome === "win" ? "bg-jade/20 text-emerald-100" : entry.outcome === "lose" ? "bg-red-400/15 text-red-100" : "bg-white/10 text-parchment",
                      )}>
                        {entry.betAmount}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-parchment/70">{entry.reason}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
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
      <span className="mb-2 block text-sm text-parchment/80">{label}</span>
      <input
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none ring-0 transition placeholder:text-parchment/35 focus:border-ember-200/50"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-ember-100/65">{label}</p>
      <p className="mt-2 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

function ActionCard({
  label,
  value,
  buttonLabel,
  disabled,
  onClick,
}: {
  label: string;
  value: string;
  buttonLabel: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-ember-200/70">{label}</p>
      <p className="mt-2 truncate font-display text-xl text-white">{value}</p>
      <button
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-parchment transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={clsx(
      "rounded-[22px] border px-4 py-4",
      accent ? "border-ember-200/35 bg-ember-400/10" : "border-white/10 bg-black/15",
    )}>
      <p className="text-xs uppercase tracking-[0.2em] text-ember-200/70">{label}</p>
      <p className="mt-2 text-sm text-white sm:text-base">{value}</p>
    </div>
  );
}

function translateOutcome(
  outcome: string,
  text: { win: string; lose: string; void: string },
) {
  if (outcome === "win") {
    return text.win;
  }

  if (outcome === "lose") {
    return text.lose;
  }

  return text.void;
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

const activeToggleClass =
  "rounded-full bg-ember-300 px-3 py-1.5 font-semibold text-lacquer";
const inactiveToggleClass =
  "rounded-full px-3 py-1.5 text-parchment/70 transition hover:bg-white/5";
