import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PiArrowLeftDuotone,
  PiArrowRightDuotone,
  PiArrowsClockwiseDuotone,
  PiChatCircleDotsDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MessageCard from "../components/admin/MessageCard";
import { deleteMessage, fetchMessages, updateMessageStatus } from "../api/messages";
import { apiErrorMessage } from "../api/errorMessage";
import { cn } from "../utils/cn";
import { formatCount } from "../utils/datetime";
import type { ContactMessage, MessageStatus } from "../types/message";

/** Status "new" bubbles to the top; newest first inside each group. */
const STATUS_RANK: Record<MessageStatus, number> = { new: 0, read: 1, answered: 2 };

function sortMessages(list: ContactMessage[]): ContactMessage[] {
  return [...list].sort((a, b) => {
    const rank = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (rank !== 0) return rank;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

interface Notice {
  text: string;
  tone: "ok" | "error";
}

export default function AdminMessages() {
  const { t, lang, dir } = useLanguage();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(() => new Set());

  const noticeTimer = useRef<number | null>(null);

  const showNotice = useCallback((text: string, tone: Notice["tone"]) => {
    setNotice({ text, tone });
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchMessages();
      setMessages(list);
      setLoaded(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    };
  }, [load]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${t.admin.title} | Cabinet21`;
    return () => {
      document.title = previousTitle;
    };
  }, [t.admin.title]);

  const setPending = (id: string, pending: boolean) => {
    setPendingIds((previous) => {
      const next = new Set(previous);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    setPending(id, true);
    try {
      const updated = await updateMessageStatus(id, status);
      setMessages((previous) => previous.map((item) => (item.id === id ? updated : item)));
      showNotice(t.admin.statusUpdated, "ok");
    } catch (err) {
      showNotice(apiErrorMessage(err, t, t.admin.actionFailed), "error");
    } finally {
      setPending(id, false);
    }
  };

  const handleDelete = async (id: string) => {
    setPending(id, true);
    try {
      await deleteMessage(id);
      setMessages((previous) => previous.filter((item) => item.id !== id));
      showNotice(t.admin.messageDeleted, "ok");
    } catch (err) {
      showNotice(apiErrorMessage(err, t, t.admin.actionFailed), "error");
    } finally {
      setPending(id, false);
    }
  };

  const sorted = sortMessages(messages);
  const newCount = messages.filter((item) => item.status === "new").length;
  const errorMessage = error ? apiErrorMessage(error, t, t.errors.generic) : null;

  return (
    <div className="min-h-screen bg-noir text-beige-light">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-noir/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <a
            href="/"
            aria-label={t.admin.backToSite}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs text-beige/70 transition-colors hover:border-[#b8935a]/40 hover:text-beige-light"
          >
            {dir === "rtl" ? <PiArrowRightDuotone /> : <PiArrowLeftDuotone />}
            <span className="hidden sm:inline">{t.admin.backToSite}</span>
          </a>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#b8935a]/30 bg-[#b8935a]/10 text-sm font-bold text-[#e0bd85] sm:flex">
              21
            </div>
            <div className="min-w-0">
              <h1 className="serif-heading truncate text-lg font-semibold text-beige-light sm:text-xl">
                {t.admin.title}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-bold",
                    newCount > 0
                      ? "bg-gradient-to-r from-[#e0bd85] to-[#b8935a] text-noir"
                      : "border border-white/12 bg-white/5 text-beige/50"
                  )}
                >
                  {t.admin.newCount.replace("{count}", formatCount(newCount, lang))}
                </span>
                <span className="text-beige/45">
                  {t.admin.totalCount.replace("{count}", formatCount(messages.length, lang))}
                </span>
              </div>
            </div>
          </div>

          <div className="ms-auto flex items-center gap-2.5">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              aria-label={t.admin.refresh}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e0bd85] to-[#b8935a] px-4 py-2.5 text-xs font-bold text-noir transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-[#b8935a]/20 cursor-pointer disabled:cursor-wait disabled:opacity-70"
            >
              <PiArrowsClockwiseDuotone className={cn("text-base", loading && "animate-spin")} />
              <span className="hidden sm:inline">{t.admin.refresh}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200"
          >
            <span className="flex items-center gap-2">
              <PiWarningCircleDuotone className="shrink-0 text-lg" />
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="rounded-full border border-red-300/40 px-4 py-1.5 text-xs font-bold transition-colors hover:bg-red-400/20 cursor-pointer"
            >
              {t.admin.retry}
            </button>
          </div>
        )}

        {loading && !loaded ? (
          <div className="flex flex-col gap-4" aria-label={t.admin.loading} aria-busy="true">
            {[0, 1, 2].map((index) => (
              <div key={index} className="glass-panel animate-pulse rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-1/2 rounded bg-white/5" />
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-4/5 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass-panel rounded-2xl py-14 text-center sm:py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl text-beige/40">
              <PiChatCircleDotsDuotone />
            </div>
            <h2 className="text-lg font-semibold text-beige-light">{t.admin.emptyTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-beige/50">{t.admin.emptyText}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {sorted.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  busy={pendingIds.has(message.id)}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.text}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.25 }}
            className={cn(
              "fixed bottom-5 left-1/2 z-50 max-w-[90vw] rounded-full border px-5 py-2.5 text-center text-sm font-medium shadow-xl backdrop-blur-md",
              notice.tone === "ok"
                ? "border-emerald-400/40 bg-emerald-950/90 text-emerald-200"
                : "border-red-400/40 bg-red-950/90 text-red-200"
            )}
          >
            {notice.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
