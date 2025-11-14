"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** ===== Types ===== */
export interface Airline {
  code: string;      // IATA
  name: string;
  country: string;
  icao: string;      // ICAO
  callsign?: string; // Callsign (opcional)
}

export interface AirlineSelection {
  code: string;
  codeType: "IATA" | "ICAO";
  name: string;
  callsign?: string;
  icao?: string;
  country?: string;
}

export interface AirlineCallsignComboboxProps {
  value?: string;
  onValueChange?: (value: string, selection?: AirlineSelection) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** ===== Utils ===== */
function normalize(text: string) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function useDebounce<T>(v: T, ms = 200) {
  const [s, setS] = useState(v);
  useEffect(() => {
    const id = setTimeout(() => setS(v), ms);
    return () => clearTimeout(id);
  }, [v, ms]);
  return s;
}

/** ===== Component ===== */
export function AirlineCallsignCombobox({
  value,
  onValueChange,
  placeholder = "Search airline by IATA, ICAO, or callsign...",
  disabled,
  className,
}: AirlineCallsignComboboxProps) {
  const MAX_VISIBLE_SUGGESTIONS = 4;
  const ESTIMATED_ITEM_HEIGHT = 56;
  const [open, setOpen] = useState(false);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Carga una vez el JSON: /public/airlines/airlines.json
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/airlines/airlines.json", { cache: "force-cache" });
        const data = (await res.json()) as Airline[];
        if (alive) setAirlines(data || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Sin barra interna; todo se escribe en el input principal
  const dq = useDebounce(query, 200);

  // Prioridad: IATA (0) → ICAO (1) → CALLSIGN (2) → NAME (3)
  const results = useMemo(() => {
    const q = normalize(dq);
    if (!q) return [];
    return airlines
      .map((a) => {
        const iata = normalize(a.code);
        const icao = normalize(a.icao);
        const cs = normalize(a.callsign || "");
        const nm = normalize(a.name);

        let prio = 4;
        let suffix = "";
        if (iata.startsWith(q)) {
          prio = 0; suffix = iata.slice(q.length);
        } else if (icao.startsWith(q)) {
          prio = 1; suffix = icao.slice(q.length);
        } else if (cs && cs.startsWith(q)) {
          prio = 2; suffix = cs.slice(q.length);
        } else if (nm.includes(q)) {
          prio = 3; suffix = ""; // coincidencia general
        }
        return { a, prio, suffix };
      })
      .filter(x => x.prio < 4)
      .sort((x, y) => (x.prio - y.prio) || (x.suffix.length - y.suffix.length) || x.a.name.localeCompare(y.a.name))
      .slice(0, 50)
      .map(x => x.a);
  }, [airlines, dq]);

  const selected = useMemo(() => {
    if (!value) return undefined;
    return airlines.find(a => a.code === value || a.icao === value);
  }, [airlines, value]);

  const selectedBadge = selected ? (selected.code || selected.icao) : undefined;

  const handleSelect = (a: Airline) => {
    const code = a.code || a.icao;
    const selection: AirlineSelection = {
      code,
      codeType: a.code ? "IATA" : "ICAO",
      name: a.name,
      callsign: a.callsign,
      icao: a.icao,
      country: a.country,
    };
    onValueChange?.(code, selection);
    // El input muestra callsign o nombre
    setQuery(a.callsign?.trim() ? a.callsign : a.name);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Solo abrir con texto (length >= 1) o cuando ya hay resultados
        if (!next || query.length >= 1) setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        {/* El input principal es el trigger */}
        <div className={cn("relative w-full", className)}>
          {/* Badge IZQ con IATA/ICAO cuando hay selección */}
          {selectedBadge && (
            <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {selectedBadge}
              </Badge>
            </div>
          )}

          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open && e.target.value.length >= 1) setOpen(true);
              if (!e.target.value) onValueChange?.("");
            }}
            onFocus={() => { if (query.length >= 1) setOpen(true); }}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setOpen(false); e.preventDefault(); }
            }}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={cn(selectedBadge ? "pl-14" : "", "truncate")}
            title={query}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        // Mantener foco en el input principal
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              Loading airlines…
            </div>
          ) : results.length === 0 ? (
            <CommandEmpty className="py-6 text-center text-sm">No airlines found.</CommandEmpty>
          ) : (
            <CommandGroup
              className="max-h-80 overflow-y-auto"
              style={{ maxHeight: Math.min(results.length || MAX_VISIBLE_SUGGESTIONS, MAX_VISIBLE_SUGGESTIONS) * ESTIMATED_ITEM_HEIGHT }}
            >
              {results.map((a) => (
                <CommandItem
                  key={`${a.code || "NOIATA"}|${a.icao || "NOICAO"}|${a.name}`}
                  value={a.code || a.icao}
                  onSelect={() => handleSelect(a)}
                  className="group flex cursor-pointer items-center gap-2 p-2"
                  title={`${a.name} — ${a.country}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{a.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="truncate">{a.country}</span>
                      <span className="mx-1">•</span>
                      {a.code && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 transition-colors group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground"
                        >
                          {a.code}
                        </Badge>
                      )}
                      {a.icao && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5 transition-colors group-data-[selected]:border-primary group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground"
                        >
                          {a.icao}
                        </Badge>
                      )}
                      {a.callsign && <span className="ml-1 truncate">({a.callsign})</span>}
                    </div>
                  </div>

                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0 transition-opacity",
                      value === (a.code || a.icao) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
