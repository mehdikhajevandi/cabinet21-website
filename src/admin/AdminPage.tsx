import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PiArrowClockwiseDuotone,
  PiChatCircleTextDuotone,
  PiCheckDuotone,
  PiCopyDuotone,
  PiEyeDuotone,
  PiEyeSlashDuotone,
  PiHouseDuotone,
  PiLockKeyDuotone,
  PiPhoneDuotone,
  PiShieldCheckDuotone,
  PiSignOutDuotone,
  PiSpinnerGapDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { ApiError, adminLogin, fetchMessages, tokenStore, API_BASE } from "../lib/api";
import type { Message } from "../lib/api";

type Status = "loading" | "ready" | "empty" | "error";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Back-link to the public site, keeping any sub-path (e.g. GitHub Pages). */
const SITE_URL =
  typeof window === "undefined" ? "/" : window.location.pathname + window.location.search || "/";

const relativeFormatter = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "همین حالا";
  if (minutes < 60) return relativeFormatter.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return relativeFormatter.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 30) return relativeFormatter.format(-days, "day");
  return dateFormatter.format(new Date(iso));
}

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState<"checking" | "out" | "in">("checking");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorText, setErrorText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [query, setQuery] = useState("");

  const timer = useRef<number | null>(null);

  /* Keep the admin page in Persian, regardless of the public site language. */
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", "fa");
    html.setAttribute("dir", "rtl");
    html.classList.add("font-fa");
    html.classList.remove("font-en");
    const prevTitle = document.title;
    document.title = "پنل مدیریت | Cabinet21";
    window.scrollTo({ top: 0 });
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const load = useCallback(
    async (activeToken: string, quiet = false) => {
      if (!quiet) setRefreshing(true);
      try {
        const data = await fetchMessages(activeToken);
        setMessages(data.messages);
        setStatus(data.messages.length ? "ready" : "empty");
        setErrorText("");
        setLastSync(new Date());
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          tokenStore.clear();
          setToken("");
          setAuthState("out");
          setAuthError("نشست شما تمام شد. دوباره رمز را وارد کنید.");
          return;
        }
        setStatus("error");
        setErrorText(
          err instanceof ApiError && err.code === "unreachable"
            ? "اتصال به سرور پیام‌ها برقرار نشد. سرور را اجرا کنید یا آدرس API را بررسی کنید."
            : "خواندن پیام‌ها ناموفق بود. دوباره تلاش کنید."
        );
      } finally {
        setRefreshing(false);
      }
    },
    []
  );

  /* Restore a previous session on first load. */
  useEffect(() => {
    const stored = tokenStore.get();
    if (!stored) {
      setAuthState("out");
      return;
    }
    setToken(stored);
    (async () => {
      try {
        const data = await fetchMessages(stored);
        setMessages(data.messages);
        setStatus(data.messages.length ? "ready" : "empty");
        setLastSync(new Date());
        setAuthState("in");
      } catch {
        tokenStore.clear();
        setToken("");
        setAuthState("out");
      }
    })();
  }, []);

  /* Refresh every 45 seconds while logged in. */
  useEffect(() => {
    if (authState !== "in" || !token) return;
    timer.current = window.setInterval(() => load(token, true), 45000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [authState, token, load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoggingIn(true);
    setAuthError("");
    try {
      const newToken = await adminLogin(password.trim());
      tokenStore.set(newToken);
      setToken(newToken);
      setPassword("");
      setAuthState("in");
      setStatus("loading");
      await load(newToken);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "wrong_password") setAuthError("رمز عبور اشتباه است.");
        else if (err.status === 429)
          setAuthError(`تعداد تلاش‌ها زیاد بود. چند دقیقه دیگر دوباره امتحان کنید.`);
        else if (err.code === "unreachable")
          setAuthError("سرور پیام‌ها در دسترس نیست. ابتدا سرور را اجرا کنید (npm run server).");
        else setAuthError("ورود ناموفق بود. دوباره تلاش کنید.");
      } else {
        setAuthError("ورود ناموفق بود. دوباره تلاش کنید.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    tokenStore.clear();
    setToken("");
    setMessages([]);
    setAuthState("out");
    setStatus("loading");
    setPassword("");
  };

  const copyPhone = async (msg: Message) => {
    try {
      await navigator.clipboard.writeText(msg.phone);
      setCopiedId(msg.id);
      window.setTimeout(() => setCopiedId(""), 1600);
    } catch {
      /* clipboard blocked — the tel: link still works */
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) => m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.message.toLowerCase().includes(q)
    );
  }, [messages, query]);

  /* ---------------------------------------------------------------- */
  /* Login screen                                                      */
  /* ---------------------------------------------------------------- */

  if (authState !== "in") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noir px-6 py-16" dir="rtl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#b8935a]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#6b4a30]/10 blur-[120px]" />
        </div>
        <div className="grain-overlay" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel relative w-full max-w-md rounded-3xl p-8 sm:p-10"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#b8935a]/30 bg-[#b8935a]/5 text-2xl text-[#e0bd85]">
              21
            </div>
            <h1 className="serif-heading mt-5 text-2xl font-semibold text-beige-light">پنل مدیریت Cabinet21</h1>
            <p className="mt-2 text-sm text-beige/60">برای دیدن پیام‌های «مشاوره رایگان» رمز عبور را وارد کنید</p>
          </div>

          {authState === "checking" ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-beige/50">
              <PiSpinnerGapDuotone className="animate-spin text-lg text-[#e0bd85]" />
              در حال بررسی نشست…
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <span className="mb-2 block text-xs tracking-wide text-beige/60">رمز عبور</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#e0bd85]/70">
                    <PiLockKeyDuotone className="text-xl" />
                  </span>
                  <input
                    autoFocus
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    aria-label="رمز عبور"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-12 text-left text-sm text-beige-light placeholder:text-beige/30 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07] focus:shadow-lg focus:shadow-[#b8935a]/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                    className="absolute inset-y-0 left-3 flex items-center text-beige/50 transition-colors hover:text-[#e0bd85] cursor-pointer"
                  >
                    {showPassword ? <PiEyeSlashDuotone className="text-xl" /> : <PiEyeDuotone className="text-xl" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-xs text-red-200"
                  >
                    <PiWarningCircleDuotone className="shrink-0 text-base" />
                    {authError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loggingIn || !password.trim()}
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-6 py-3.5 text-sm font-semibold text-[#0a0908] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#b8935a]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
              >
                {loggingIn ? (
                  <>
                    <PiSpinnerGapDuotone className="animate-spin text-lg" />
                    در حال ورود…
                  </>
                ) : (
                  <>
                    <PiShieldCheckDuotone className="text-lg" />
                    ورود به پنل
                  </>
                )}
              </button>
            </form>
          )}

          <a
            href={SITE_URL}
            className="mt-7 flex items-center justify-center gap-2 text-xs text-beige/50 transition-colors hover:text-[#e0bd85]"
          >
            <PiHouseDuotone className="text-base" />
            بازگشت به سایت
          </a>
        </motion.div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Messages screen                                                   */
  /* ---------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen bg-noir pb-20" dir="rtl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#b8935a]/8 to-transparent" />
      <div className="grain-overlay" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-noir/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#b8935a]/30 bg-[#b8935a]/5 text-base text-[#e0bd85]">
              21
            </div>
            <div>
              <h1 className="serif-heading text-lg font-semibold text-beige-light">پیام‌های مشاوره رایگان</h1>
              <p className="text-[11px] text-beige/50">
                {messages.length} پیام ذخیره شده
                {lastSync && ` · آخرین به‌روزرسانی ${new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(lastSync)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => token && load(token, true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-beige-light transition-colors hover:border-[#b8935a]/50 hover:bg-white/10 disabled:opacity-50 cursor-pointer"
            >
              <PiArrowClockwiseDuotone className={`text-base ${refreshing ? "animate-spin" : ""}`} />
              به‌روزرسانی
            </button>
            <a
              href={SITE_URL}
              className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-beige-light transition-colors hover:border-[#b8935a]/50 hover:bg-white/10 sm:flex"
            >
              <PiHouseDuotone className="text-base" />
              سایت
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-beige-light transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 cursor-pointer"
            >
              <PiSignOutDuotone className="text-base" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 sm:px-8">
        {messages.length > 3 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجو در نام، شماره تماس یا متن پیام…"
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-beige-light placeholder:text-beige/40 outline-none transition-all duration-300 focus:border-[#b8935a]/60 focus:bg-white/[0.07]"
          />
        )}

        {status === "error" && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-5 text-sm text-red-200">
            <PiWarningCircleDuotone className="mt-0.5 shrink-0 text-xl" />
            <div>
              <p className="font-medium">{errorText}</p>
              <p className="mt-1 text-xs text-red-200/70" dir="ltr">
                API: {API_BASE || window.location.origin}
              </p>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="mt-8 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-panel h-32 animate-pulse rounded-2xl opacity-60" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}

        {status === "empty" && (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl text-[#e0bd85]/70">
              <PiChatCircleTextDuotone />
            </div>
            <h2 className="serif-heading mt-6 text-2xl font-semibold text-beige-light">هنوز پیامی ندارید</h2>
            <p className="mt-2 max-w-md text-sm text-beige/60">
              به محض اینکه کسی فرم «درخواست مشاوره رایگان» را در سایت پر کند، پیامش همین‌جا نمایش داده می‌شود.
            </p>
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <p className="mt-14 text-center text-sm text-beige/60">نتیجه‌ای برای این جست‌وجو پیدا نشد.</p>
        )}

        <ul className="mt-8 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {filtered.map((msg, index) => (
              <motion.li
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
                className="glass-panel rounded-2xl p-5 transition-colors duration-300 hover:border-[#b8935a]/35 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b8935a]/25 bg-[#b8935a]/10 text-base font-semibold text-[#e0bd85]">
                      {msg.name.trim().charAt(0) || "؟"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-beige-light">{msg.name}</h3>
                      <p className="mt-0.5 text-[11px] text-beige/50" title={dateFormatter.format(new Date(msg.createdAt))}>
                        {relativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${msg.phone.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-medium text-beige-light transition-all hover:border-[#b8935a]/50 hover:bg-[#b8935a]/10 hover:text-[#e0bd85]"
                    >
                      <PiPhoneDuotone className="text-base" />
                      <span dir="ltr">{msg.phone}</span>
                    </a>
                    <button
                      onClick={() => copyPhone(msg)}
                      aria-label="کپی شماره تماس"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-beige/70 transition-all hover:border-[#b8935a]/50 hover:text-[#e0bd85] cursor-pointer"
                    >
                      {copiedId === msg.id ? <PiCheckDuotone className="text-base text-[#8fd694]" /> : <PiCopyDuotone className="text-base" />}
                    </button>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap rounded-xl border border-white/8 bg-black/20 px-4 py-3.5 text-sm leading-7 text-beige/85">
                  {msg.message}
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </main>
    </div>
  );
}
