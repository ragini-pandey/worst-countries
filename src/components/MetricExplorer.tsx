"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import type { MetricDefinition, RankedRow } from "@/lib/types";
import { formatValue } from "@/lib/format";

interface Props {
  metric: MetricDefinition;
  rows: RankedRow[];
}

const TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NUMERIC_TO_ISO3: Record<string, string> = {
  "004":"AFG","008":"ALB","012":"DZA","024":"AGO","032":"ARG","036":"AUS","040":"AUT","051":"ARM","050":"BGD","052":"BRB","056":"BEL","064":"BTN","068":"BOL","070":"BIH","072":"BWA","076":"BRA","084":"BLZ","096":"BRN","100":"BGR","104":"MMR","108":"BDI","112":"BLR","116":"KHM","120":"CMR","124":"CAN","140":"CAF","144":"LKA","148":"TCD","152":"CHL","156":"CHN","158":"TWN","170":"COL","174":"COM","178":"COG","180":"COD","188":"CRI","191":"HRV","192":"CUB","196":"CYP","203":"CZE","204":"BEN","208":"DNK","214":"DOM","218":"ECU","222":"SLV","226":"GNQ","231":"ETH","232":"ERI","233":"EST","242":"FJI","246":"FIN","250":"FRA","262":"DJI","266":"GAB","268":"GEO","270":"GMB","275":"PSE","276":"DEU","288":"GHA","300":"GRC","320":"GTM","324":"GIN","328":"GUY","332":"HTI","340":"HND","348":"HUN","352":"ISL","356":"IND","360":"IDN","364":"IRN","368":"IRQ","372":"IRL","376":"ISR","380":"ITA","384":"CIV","388":"JAM","392":"JPN","398":"KAZ","400":"JOR","404":"KEN","408":"PRK","410":"KOR","414":"KWT","417":"KGZ","418":"LAO","422":"LBN","426":"LSO","428":"LVA","430":"LBR","434":"LBY","440":"LTU","442":"LUX","450":"MDG","454":"MWI","458":"MYS","462":"MDV","466":"MLI","470":"MLT","478":"MRT","480":"MUS","484":"MEX","496":"MNG","498":"MDA","499":"MNE","504":"MAR","508":"MOZ","512":"OMN","516":"NAM","524":"NPL","528":"NLD","540":"NCL","548":"VUT","554":"NZL","558":"NIC","562":"NER","566":"NGA","578":"NOR","586":"PAK","591":"PAN","598":"PNG","600":"PRY","604":"PER","608":"PHL","616":"POL","620":"PRT","624":"GNB","626":"TLS","630":"PRI","634":"QAT","642":"ROU","643":"RUS","646":"RWA","682":"SAU","686":"SEN","688":"SRB","690":"SYC","694":"SLE","702":"SGP","703":"SVK","704":"VNM","705":"SVN","706":"SOM","710":"ZAF","716":"ZWE","724":"ESP","728":"SSD","729":"SDN","740":"SUR","748":"SWZ","752":"SWE","756":"CHE","760":"SYR","762":"TJK","764":"THA","768":"TGO","780":"TTO","784":"ARE","788":"TUN","792":"TUR","795":"TKM","800":"UGA","804":"UKR","807":"MKD","818":"EGY","826":"GBR","834":"TZA","840":"USA","854":"BFA","858":"URY","860":"UZB","862":"VEN","882":"WSM","887":"YEM","894":"ZMB"
};

interface HoverState {
  row: RankedRow | null;
  name: string;
  x: number;
  y: number;
}

interface Position {
  coordinates: [number, number];
  zoom: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export function MetricExplorer({ metric, rows }: Props) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<Position>({
    coordinates: [10, 10],
    zoom: 1,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { color, byIso, range } = useMemo(() => {
    const map = new Map(rows.map((r) => [r.iso3, r] as const));
    const values = rows.map((r) => r.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const dom: [number, number] =
      metric.direction === "higher-worse" ? [max, min] : [min, max];
    const c = scaleSequential<string>(interpolateRdYlGn).domain(dom);
    return { color: c, byIso: map, range: { min, max } };
  }, [metric, rows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.country.name.toLowerCase().includes(q) ||
        r.iso3.toLowerCase().includes(q)
    );
  }, [rows, query]);

  useEffect(() => {
    setHover(null);
    setPinned(null);
    setPosition({ coordinates: [10, 10], zoom: 1 });
  }, [metric.id]);

  // Track fullscreen state
  useEffect(() => {
    function onChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const activeIso = hover?.row?.iso3 ?? pinned;
  const activeRow = activeIso ? byIso.get(activeIso) : null;

  const worstVal = metric.direction === "higher-worse" ? range.max : range.min;
  const bestVal = metric.direction === "higher-worse" ? range.min : range.max;

  const zoomBy = useCallback((factor: number) => {
    setPosition((p) => ({
      ...p,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, p.zoom * factor)),
    }));
  }, []);

  const resetView = useCallback(() => {
    setPosition({ coordinates: [10, 10], zoom: 1 });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900/60 dark:to-neutral-950 ${
        isFullscreen ? "h-screen" : "h-full min-h-[520px]"
      }`}
    >
      <ComposableMap
        projectionConfig={{ scale: 175 }}
        width={1280}
        height={620}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={(p: Position) => setPosition(p)}
          filterZoomEvent={(evt: Event) => evt.type !== "wheel"}
        >
          <Geographies geography={TOPO_URL}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties: { name: string; "Alpha-3"?: string } }> }) =>
              geographies.map((geo) => {
                const iso3 =
                  geo.properties["Alpha-3"] || NUMERIC_TO_ISO3[geo.id];
                const row = iso3 ? byIso.get(iso3) : undefined;
                const fill = row ? color(row.value) : "var(--map-empty)";
                const isActive = iso3 ? iso3 === activeIso : false;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isActive ? "#111827" : "var(--map-stroke)"}
                    strokeWidth={isActive ? 1.2 : 0.4}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      const rect =
                        containerRef.current?.getBoundingClientRect();
                      setHover({
                        row: row ?? null,
                        name: geo.properties.name,
                        x: e.clientX - (rect?.left ?? 0),
                        y: e.clientY - (rect?.top ?? 0),
                      });
                    }}
                    onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                      const rect =
                        containerRef.current?.getBoundingClientRect();
                      setHover((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX - (rect?.left ?? 0),
                              y: e.clientY - (rect?.top ?? 0),
                            }
                          : prev
                      );
                    }}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      if (iso3) setPinned(iso3 === pinned ? null : iso3);
                    }}
                    style={{
                      default: { outline: "none", cursor: row ? "pointer" : "default" },
                      hover: { outline: "none", filter: "brightness(1.08)" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Cursor-following tooltip on hover */}
      {hover && (
        <div
          className="pointer-events-none absolute z-30 translate-x-3 translate-y-3 min-w-[200px] max-w-[260px] rounded-lg border border-neutral-300 bg-white/95 px-3 py-2 shadow-xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/95"
          style={{ left: hover.x, top: hover.y }}
        >
          {hover.row ? (
            <DetailCardContent metric={metric} row={hover.row} total={rows.length} />
          ) : (
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {hover.name}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">No data</div>
            </div>
          )}
        </div>
      )}

      {/* Top-left panel: pinned country, or podium by default */}
      <div className="absolute top-3 left-3 z-20 w-[280px] max-w-[calc(100%-1.5rem)] rounded-lg border border-neutral-300 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/95">
        {pinned && activeRow ? (
          <div className="relative">
            <DetailCardContent metric={metric} row={activeRow} total={rows.length} />
            <button
              onClick={() => setPinned(null)}
              className="absolute -top-1 -right-1 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ) : (
          <Podium rows={rows} color={color} />
        )}
      </div>

      {/* Legend (bottom-left) */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg border border-neutral-300 bg-white/90 px-2.5 py-1.5 text-[11px] shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/85">
        <div
          className="h-1.5 w-44 rounded"
          style={{
            background:
              "linear-gradient(to right, #d73027, #fdae61, #fee08b, #d9ef8b, #1a9850)",
          }}
        />
        <div className="mt-1 flex justify-between tabular-nums text-neutral-600 dark:text-neutral-400">
          <span>
            <span className="text-red-600 dark:text-red-400">Worse</span> · {formatValue(worstVal, "")}
          </span>
          <span>
            <span className="text-emerald-600 dark:text-emerald-400">Better</span> · {formatValue(bestVal, "")}
          </span>
        </div>
      </div>

      {/* Zoom + fullscreen controls (left, vertical) */}
      <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        <ControlButton
          label="Zoom in"
          onClick={() => zoomBy(1.5)}
          disabled={position.zoom >= MAX_ZOOM}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </ControlButton>
        <ControlButton
          label="Zoom out"
          onClick={() => zoomBy(1 / 1.5)}
          disabled={position.zoom <= MIN_ZOOM}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </ControlButton>
        <ControlButton label="Reset view" onClick={resetView}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
        </ControlButton>
        <ControlButton label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFullscreen}>
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
            </svg>
          )}
        </ControlButton>
      </div>

      {/* Country list — overlaid on the right, inside the map (worst on top) */}
      <aside className="absolute top-3 right-3 bottom-3 z-10 flex w-[300px] max-w-[40vw] flex-col overflow-hidden rounded-xl border border-neutral-300 bg-white/95 shadow-xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/90">
          <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
            <input
              type="search"
              aria-label="Search country"
              placeholder="Search country…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">
              {filteredRows.length}
            </span>
          </div>
          <ol
            className="flex-1 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-900"
            role="list"
          >
            {filteredRows.map((r) => {
              const isActive = activeIso === r.iso3;
              return (
                <li key={r.iso3}>
                  <button
                    type="button"
                    onClick={() =>
                      setPinned(pinned === r.iso3 ? null : r.iso3)
                    }
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800/80 dark:text-white"
                        : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="w-6 text-right tabular-nums text-xs text-neutral-400 dark:text-neutral-500"
                    >
                      {r.rank}
                    </span>
                    <span
                      aria-hidden
                      className="h-3 w-3 rounded-sm shrink-0 ring-1 ring-black/10 dark:ring-black/40"
                      style={{ backgroundColor: color(r.value) }}
                    />
                    <span className="truncate flex-1">
                      <span className="mr-1.5">{r.country.flag}</span>
                      {r.country.name}
                    </span>
                    <span className="tabular-nums text-xs text-neutral-500 dark:text-neutral-400">
                      {formatValue(r.value, "")}
                    </span>
                  </button>
                </li>
              );
            })}
            {filteredRows.length === 0 && (
              <li className="px-3 py-6 text-center text-xs text-neutral-500">
                No matches.
              </li>
            )}
          </ol>
        </aside>

      <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-[10px] text-neutral-500">
        Drag to pan · use the buttons to zoom · click a country to pin
      </p>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-neutral-800 shadow-md transition hover:border-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-white dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

function DetailCardContent({
  metric,
  row,
  total,
}: {
  metric: MetricDefinition;
  row: RankedRow;
  total: number;
}) {
  const pct = Math.round((row.rank / total) * 100);
  const tone =
    pct <= 10
      ? "text-red-600 dark:text-red-400"
      : pct <= 25
        ? "text-orange-600 dark:text-orange-400"
        : pct <= 50
          ? "text-yellow-600 dark:text-yellow-400"
          : pct <= 75
            ? "text-lime-600 dark:text-lime-400"
            : "text-emerald-600 dark:text-emerald-400";
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          {row.country.flag}
        </span>
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {row.country.name}
        </div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
          {formatValue(row.value, "")}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{metric.unit}</span>
      </div>
      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
        Rank <span className={`font-semibold ${tone}`}>#{row.rank}</span>{" "}
        <span className="text-neutral-400 dark:text-neutral-600">/ {total}</span>
        {row.year ? (
          <span className="text-neutral-400 dark:text-neutral-600"> · {row.year}</span>
        ) : null}
      </div>
      <div className="mt-1 text-xs text-neutral-500">
        {row.country.region}
        {row.country.subregion ? ` · ${row.country.subregion}` : ""}
      </div>
    </div>
  );
}

function Podium({
  rows,
  color,
}: {
  rows: RankedRow[];
  color: (v: number) => string;
}) {
  const top = rows.slice(0, 3);
  if (top.length === 0) return null;
  // Visual order: 2nd, 1st, 3rd (classic podium); heights differ.
  const order: Array<{ row: RankedRow | undefined; height: string; tone: string }> = [
    { row: top[1], height: "h-12", tone: "bg-neutral-300 dark:bg-neutral-600" },
    { row: top[0], height: "h-16", tone: "bg-red-500" },
    { row: top[2], height: "h-9", tone: "bg-amber-500" },
  ];
  return (
    <div>
      <div className="flex items-center justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
          Hall of shame
        </span>
      </div>
      <div className="mt-2 flex items-end justify-center gap-1.5">
        {order.map((slot, i) =>
          slot.row ? (
            <div key={slot.row.iso3} className="flex flex-1 flex-col items-center">
              <span className="text-lg leading-none" aria-hidden>
                {slot.row.country.flag}
              </span>
              <span className="mt-0.5 truncate max-w-full text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                {slot.row.country.name}
              </span>
              <span className="text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">
                {formatValue(slot.row.value, "")}
              </span>
              <div
                className={`mt-1 flex w-full items-center justify-center rounded-t ${slot.height}`}
                style={{ backgroundColor: color(slot.row.value) }}
              >
                <span className="text-sm font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  #{slot.row.rank}
                </span>
              </div>
            </div>
          ) : (
            <div key={i} className="flex-1" />
          )
        )}
      </div>
      <p className="mt-2 text-[10px] text-neutral-500">
        Hover a country for details · click to pin
      </p>
    </div>
  );
}
