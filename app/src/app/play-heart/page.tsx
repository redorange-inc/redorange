/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

type Dir = 'U' | 'D' | 'L' | 'R';

type ArrowCell = {
  id: string;
  x: number;
  y: number;
  dir: Dir;
  removed: boolean;
  ghost: boolean;
};

const DIRS: Dir[] = ['U', 'D', 'L', 'R'];

function dirToVector(d: Dir) {
  switch (d) {
    case 'U':
      return { dx: 0, dy: -1 };
    case 'D':
      return { dx: 0, dy: 1 };
    case 'L':
      return { dx: -1, dy: 0 };
    case 'R':
      return { dx: 1, dy: 0 };
  }
}

function dirToRotation(d: Dir) {
  switch (d) {
    case 'R':
      return 0;
    case 'D':
      return 90;
    case 'L':
      return 180;
    case 'U':
      return 270;
  }
}

// Heart implicit curve
function isInHeart(nx: number, ny: number) {
  const x = nx;
  const y = ny * 1.08;
  const a = x * x + y * y - 1;
  const v = a * a * a - x * x * y * y * y;
  return v <= 0;
}

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function Page() {
  // tablero
  const GRID = 25;
  const CELL = 26; // ↑ más grande: la flecha no se corta
  const GAP = 2;

  const boardRef = useRef<HTMLDivElement | null>(null);

  // corazón INVERTIDO (punta hacia abajo): invertimos Y (ny * -1)
  const heartCells = useMemo(() => {
    const cells: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const nx = (x - (GRID - 1) / 2) / ((GRID - 1) / 2);
        const ny = (y - (GRID - 1) / 2) / ((GRID - 1) / 2);
        if (isInHeart(nx, -ny)) cells.push({ x, y }); // 👈 inversión
      }
    }
    return cells;
  }, [GRID]);

  const heartSet = useMemo(() => new Set(heartCells.map((c) => `${c.x},${c.y}`)), [heartCells]);

  const [arrows, setArrows] = useState<ArrowCell[]>([]);
  const [removedCount, setRemovedCount] = useState(0);

  const alive = useMemo(() => arrows.filter((a) => !a.removed && !a.ghost), [arrows]);
  const ghosts = useMemo(() => arrows.filter((a) => a.ghost), [arrows]);

  const totalInPlay = alive.length;

  const posMap = useMemo(() => {
    const m = new Map<string, ArrowCell>();
    for (const a of alive) m.set(`${a.x},${a.y}`, a);
    return m;
  }, [alive]);

  function isInsideHeart(x: number, y: number) {
    return heartSet.has(`${x},${y}`);
  }

  function isFree(a: ArrowCell) {
    const { dx, dy } = dirToVector(a.dir);
    let cx = a.x;
    let cy = a.y;

    while (true) {
      cx += dx;
      cy += dy;

      if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) return true;
      if (!isInsideHeart(cx, cy)) return true;

      if (posMap.has(`${cx},${cy}`)) return false;
    }
  }

  function anyFreeExists(listAlive: ArrowCell[]) {
    const m = new Map<string, ArrowCell>();
    for (const a of listAlive) m.set(`${a.x},${a.y}`, a);

    const free = (a: ArrowCell) => {
      const { dx, dy } = dirToVector(a.dir);
      let cx = a.x;
      let cy = a.y;
      while (true) {
        cx += dx;
        cy += dy;
        if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) return true;
        if (!heartSet.has(`${cx},${cy}`)) return true;
        if (m.has(`${cx},${cy}`)) return false;
      }
    };

    for (const a of listAlive) if (free(a)) return true;
    return false;
  }

  function generateLevel() {
    // denso para que el corazón se vea sólido
    const target = clamp(Math.floor(heartCells.length * 0.86), 140, 320);

    const taken = new Set<string>();
    const next: ArrowCell[] = [];

    let tries = 0;
    while (next.length < target && tries < target * 30) {
      tries++;
      const c = heartCells[(Math.random() * heartCells.length) | 0];
      const key = `${c.x},${c.y}`;
      if (taken.has(key)) continue;

      taken.add(key);
      next.push({
        id: makeId(),
        x: c.x,
        y: c.y,
        dir: DIRS[(Math.random() * 4) | 0],
        removed: false,
        ghost: false,
      });
    }

    let safety = 0;
    while (!anyFreeExists(next) && safety < 6) {
      safety++;
      for (let i = 0; i < next.length; i += 9) {
        next[i] = { ...next[i], dir: DIRS[(Math.random() * 4) | 0] };
      }
    }

    setRemovedCount(0);
    setArrows(next);

    requestAnimationFrame(() => {
      animate('.heart-arrow', {
        opacity: [0, 1],
        scale: [0.95, 1],
        delay: (el, i) => i * 2,
        duration: 220,
        easing: 'easeOutQuad',
      });
    });
  }

  useEffect(() => {
    generateLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pulse a flechas libres
  useEffect(() => {
    const id = window.setInterval(() => {
      const freeEls = document.querySelectorAll<HTMLElement>('[data-free="true"]');
      if (!freeEls.length) return;

      freeEls.forEach((el) => {
        animate(el, {
          opacity: [
            { value: 1, duration: 0 },
            { value: 0.82, duration: 200 },
            { value: 1, duration: 200 },
          ],
          duration: 400,
          easing: 'linear',
        });
      });
    }, 1100);

    return () => window.clearInterval(id);
  }, [alive, posMap]);

  const step = CELL + GAP;
  const boardW = GRID * CELL + (GRID - 1) * GAP;
  const boardH = boardW;

  // ✅ animación cuando la flecha se va (snake + movimiento)
  function snakeExit(el: HTMLElement, dir: Dir) {
    const distance = 680; // un poco más para que salga claro de pantalla
    const { dx, dy } = dirToVector(dir);

    const shaft = el.querySelector<SVGPathElement>('path[data-shaft="1"]');
    const head = el.querySelector<SVGPathElement>('path[data-head="1"]');

    // dash para "consumir" el trazo
    let L = 60;
    if (shaft) {
      try {
        L = Math.max(30, Math.round(shaft.getTotalLength()));
      } catch {
        // ignore
      }
      shaft.style.strokeDasharray = `${L}`;
      shaft.style.strokeDashoffset = `0`;
    }

    if (head) {
      head.style.strokeDasharray = `40`;
      head.style.strokeDashoffset = `0`;
    }

    // wiggle perpendicular
    const wiggleAxis = dir === 'L' || dir === 'R' ? 'translateY' : 'translateX';
    const wiggle = [0, -2, 2, -1.5, 1.5, 0];

    const main = animate(el, {
      translateX: dx * distance,
      translateY: dy * distance,
      duration: 560,
      easing: 'easeInCubic',
    });

    const wig = animate(el, {
      [wiggleAxis]: wiggle as any,
      duration: 560,
      easing: 'linear',
    });

    const eat = shaft
      ? animate(shaft, {
          strokeDashoffset: [0, L],
          duration: 560,
          easing: 'easeInCubic',
        })
      : null;

    const fadeHead = head
      ? animate(head, {
          opacity: [1, 0],
          duration: 380,
          easing: 'easeInQuad',
        })
      : null;

    const fade = animate(el, {
      opacity: [1, 0],
      duration: 560,
      easing: 'linear',
    });

    return Promise.all([(main as any).finished, (wig as any).finished, eat ? (eat as any).finished : Promise.resolve(), fadeHead ? (fadeHead as any).finished : Promise.resolve(), (fade as any).finished]);
  }

  function shake(el: HTMLElement) {
    animate(el, {
      translateX: [-4, 4, -3, 3, 0],
      duration: 260,
      easing: 'easeOutQuad',
    });
  }

  async function onArrowClick(a: ArrowCell) {
    const el = document.getElementById(`arrow-${a.id}`);
    if (!el) return;

    const free = isFree(a);
    if (!free) {
      shake(el);
      return;
    }

    await snakeExit(el, a.dir);

    setArrows((prev) => prev.map((x) => (x.id === a.id ? { ...x, removed: true, ghost: true } : x)));
    setRemovedCount((c) => c + 1);
  }

  const completed = totalInPlay === 0 && arrows.length > 0;

  return (
    <main className="min-h-screen bg-transparent text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Play Heart — Arrows Escape</h1>
            <p className="text-sm text-muted-foreground">
              Toca una flecha <span className="font-medium text-foreground">solo si está libre</span>. Se va exactamente hacia donde apunta.
            </p>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generateLevel}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm shadow-sm backdrop-blur transition hover:bg-background/60"
            >
              <RotateCcw className="h-4 w-4" />
              Nuevo nivel
            </button>

            <div className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              Removidas: <span className="font-medium text-foreground">{removedCount}</span>
              {' · '}
              Restantes: <span className="font-medium text-foreground">{totalInPlay}</span>
            </div>

            {completed && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm shadow-sm backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Completado</span>
              </div>
            )}
          </div>

          <section className="relative">
            <div ref={boardRef} className="relative mx-auto" style={{ width: boardW, height: boardH }}>
              {/* Ghosts gris */}
              {ghosts.map((a) => (
                <div
                  key={`ghost-${a.id}`}
                  className="pointer-events-none absolute"
                  style={{
                    width: CELL,
                    height: CELL,
                    left: a.x * step,
                    top: a.y * step,
                    transform: `rotate(${dirToRotation(a.dir)}deg)`,
                    opacity: 0.55,
                  }}
                >
                  <MazeArrow colorClass="text-muted-foreground" />
                </div>
              ))}

              {/* Flechas rojas */}
              {alive.map((a) => {
                const free = isFree(a);
                return (
                  <button
                    key={a.id}
                    id={`arrow-${a.id}`}
                    onClick={() => onArrowClick(a)}
                    data-free={free ? 'true' : 'false'}
                    className={[
                      'heart-arrow absolute grid place-items-center',
                      'bg-transparent p-0',
                      'transition-[filter,opacity] duration-150',
                      free ? 'opacity-100 hover:opacity-90' : 'opacity-90 hover:opacity-95',
                    ].join(' ')}
                    style={{
                      width: CELL,
                      height: CELL,
                      left: a.x * step,
                      top: a.y * step,
                      transform: `rotate(${dirToRotation(a.dir)}deg)`,
                      // mini padding visual para que no corte el head por bordes
                      padding: 2,
                    }}
                    aria-label={`Arrow ${a.dir}`}
                    title={free ? 'Libre' : 'Bloqueada'}
                  >
                    <MazeArrow colorClass="text-primary" />
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="text-xs text-muted-foreground">Si te quedas sin movimientos, usa “Nuevo nivel”.</footer>
        </div>
      </div>
    </main>
  );
}

/**
 * Flecha estilo “maze”.
 * Ajusté viewBox y path para que NO se corte.
 */
function MazeArrow({ colorClass }: { colorClass: string }) {
  return (
    <svg viewBox="0 0 28 28" className={['h-full w-full', colorClass].join(' ')} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter">
      {/* shaft */}
      <path data-shaft="1" d="M4 14H18" />
      {/* head */}
      <path data-head="1" d="M16 8l8 6-8 6" />
    </svg>
  );
}
