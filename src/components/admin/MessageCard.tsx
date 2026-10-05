import { useState } from "react";
import { motion } from "framer-motion";
import {
  PiClockDuotone,
  PiEnvelopeSimpleDuotone,
  PiPhoneDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { useLanguage } from "../../i18n/LanguageContext";
import { cn } from "../../utils/cn";
import { formatDateTime } from "../../utils/datetime";
import type { ContactMessage, MessageStatus } from "../../types/message";

const ALL_STATUSES: MessageStatus[] = ["new", "read", "answered"];

const STATUS_BADGE: Record<MessageStatus, string> = {
  new: "bg-gradient-to-r from-[#e0bd85] to-[#b8935a] text-noir shadow-sm",
  read: "border border-white/15 bg-white/10 text-beige",
  answered: "border border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
};

const LONG_MESSAGE_THRESHOLD = 140;

interface MessageCardProps {
  message: ContactMessage;
  busy: boolean;
  onStatusChange: (id: string, status: MessageStatus) => void;
  onDelete: (id: string) => void;
}

export default function MessageCard({ message, busy, onStatusChange, onDelete }: MessageCardProps) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isNew = message.status === "new";
  const isLong = message.message.length > LONG_MESSAGE_THRESHOLD;
  const initial = message.name.trim().charAt(0).toUpperCase() || "?";
  const hasContact = Boolean(message.phone || message.email);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as MessageStatus;
    if (next !== message.status) onStatusChange(message.id, next);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-busy={busy}
      className={cn(
        "glass-panel relative rounded-2xl p-5 transition-all duration-300 sm:p-6",
        isNew && "border-[#b8935a]/45 shadow-lg shadow-[#b8935a]/10",
        busy && "pointer-events-none opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              isNew
                ? "bg-[#b8935a]/20 text-[#e0bd85] ring-1 ring-[#b8935a]/40"
                : "bg-white/10 text-beige/80"
            )}
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-beige-light">{message.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-beige/50">
              <PiClockDuotone className="shrink-0 text-sm" />
              <time dateTime={message.createdAt}>
                {formatDateTime(message.createdAt, lang)}
              </time>
            </p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide",
            STATUS_BADGE[message.status]
          )}
        >
          {t.admin.statuses[message.status]}
        </span>
      </div>

      <div className="mt-4 text-sm">
        {hasContact ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-beige/70">
            {message.phone && (
              <span className="inline-flex items-center gap-1.5" dir="ltr">
                <PiPhoneDuotone className="text-[#e0bd85]" />
                <span dir="ltr">{message.phone}</span>
              </span>
            )}
            {message.email && (
              <a
                href={`mailto:${message.email}`}
                dir="ltr"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[#e0bd85]"
              >
                <PiEnvelopeSimpleDuotone className="text-[#e0bd85]" />
                <span dir="ltr">{message.email}</span>
              </a>
            )}
          </div>
        ) : (
          <span className="text-xs text-beige/40">{t.admin.noContact}</span>
        )}
      </div>

      <div className="mt-4 border-t border-white/8 pt-4">
        <p
          className={cn(
            "whitespace-pre-wrap text-sm leading-7 text-beige/85",
            !expanded && isLong && "line-clamp-3"
          )}
        >
          {message.message}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-2 text-xs font-semibold text-[#e0bd85] transition-colors hover:text-[#b8935a] cursor-pointer"
          >
            {expanded ? t.admin.collapse : t.admin.viewFull}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        <label className="flex items-center gap-2">
          <span className="text-xs text-beige/50">{t.admin.statusLabel}</span>
          <select
            value={message.status}
            onChange={handleStatusChange}
            disabled={busy}
            aria-label={t.admin.statusLabel}
            className="cursor-pointer appearance-none rounded-lg border border-white/12 bg-white/5 py-2 pe-8 ps-3 text-xs font-medium text-beige-light outline-none transition-colors hover:border-[#b8935a]/40 [&>option]:bg-noir [&>option]:text-beige-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8935a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.6rem center",
            }}
          >
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t.admin.statuses[status]}
              </option>
            ))}
          </select>
        </label>

        {confirmingDelete ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-beige/60">{t.admin.deleteConfirm}</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirmingDelete(false);
                onDelete(message.id);
              }}
              className="rounded-full bg-red-400/90 px-3.5 py-1.5 font-bold text-noir transition-colors hover:bg-red-400 cursor-pointer"
            >
              {t.admin.yes}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-beige/70 transition-colors hover:text-beige-light cursor-pointer"
            >
              {t.admin.no}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmingDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:border-red-400/60 hover:bg-red-400/10 cursor-pointer disabled:cursor-not-allowed"
          >
            <PiTrashDuotone className="text-sm" />
            {t.admin.delete}
          </button>
        )}
      </div>
    </motion.article>
  );
}
