"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { MetricExplorer } from "./MetricExplorer";
import type { MetricDefinition, RankedRow } from "@/lib/types";

interface RankingBundle {
  metric: MetricDefinition;
  rows: RankedRow[];
}

interface Props {
  rankings: RankingBundle[];
  defaultMetricId: string;
}

export function HomeExplorer({ rankings, defaultMetricId }: Props) {
  const byId = useMemo(() => {
    const m = new Map<string, RankingBundle>();
    rankings.forEach((r) => m.set(r.metric.id, r));
    return m;
  }, [rankings]);

  const [activeId, setActiveId] = useState<string>(() =>
    byId.has(defaultMetricId)
      ? defaultMetricId
      : rankings[0]?.metric.id ?? defaultMetricId
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = new URLSearchParams(window.location.search).get("metric");
    if (fromUrl && byId.has(fromUrl)) setActiveId(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = useCallback((id: string) => {
    setActiveId(id);
    setOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("metric", id);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, MetricDefinition[]> = {};
    rankings.forEach((r) => {
      (g[r.metric.category] ||= []).push(r.metric);
    });
    return g;
  }, [rankings]);

  const active = byId.get(activeId) ?? rankings[0];
  if (!active) return null;
  const categories = Object.keys(grouped).sort();

  return (
    <div className="flex h-full flex-col">
      {/* Top bar with dropdown — full width, compact */}
      <div className="relative z-40 flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white/70 px-5 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/70">
        <div
          ref={dropdownRef}
          className="relative w-full max-w-md sm:w-auto sm:min-w-[360px]"
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-900 shadow-sm hover:bg-neutral-50 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <span className="truncate">{active.metric.title}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {open && (
            <div
              role="listbox"
              className="absolute left-0 right-0 z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-md border border-neutral-300 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              {categories.map((cat) => (
                <div key={cat}>
                  <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {cat}
                  </div>
                  {grouped[cat].map((m) => {
                    const isActive = m.id === activeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => select(m.id)}
                        className={`block w-full px-3 py-1.5 text-left text-sm ${
                          isActive
                            ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {m.title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
            {active.metric.direction === "higher-worse"
              ? "↑ higher = worse"
              : "↓ lower = worse"}
          </span>
          <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
            Updated {active.metric.source.lastUpdated}
          </span>
          <a
            href={active.metric.source.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-neutral-600 hover:underline dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
          >
            Source ↗
          </a>
        </div>
      </div>

      <div className="relative flex-1">
        <MetricExplorer metric={active.metric} rows={active.rows} />
      </div>
    </div>
  );
}
