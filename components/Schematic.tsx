function series(seed: number) {
  let value = seed % 2147483646 || 1;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function Schematic({ seed }: { seed: number }) {
  const rand = series(seed + 17);
  const chip = { x: 74, y: 104, w: 54, h: 44 };
  const traces: string[] = [];
  for (let pin = 0; pin < 5; pin += 1) {
    const y = chip.y + 8 + pin * 7;
    const left = 16 + Math.round(rand() * 28);
    const leftY = 24 + Math.round(rand() * 200);
    traces.push(`M${chip.x} ${y} H${left + 18} V${leftY} H${left}`);
    const rightY = chip.y + 8 + pin * 7;
    const end = 156 + Math.round(rand() * 28);
    const endY = 30 + Math.round(rand() * 190);
    traces.push(`M${chip.x + chip.w} ${rightY} H${end - 16} V${endY} H${end}`);
  }
  const vias = Array.from({ length: 7 }, () => ({
    cx: 20 + Math.round(rand() * 160),
    cy: 22 + Math.round(rand() * 210),
  }));
  const pads = Array.from({ length: 4 }, () => ({
    x: 18 + Math.round(rand() * 140),
    y: 18 + Math.round(rand() * 200),
  }));

  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`s-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b45ff" />
          <stop offset="100%" stopColor="#4b17c9" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="184" height="234" rx="18" fill="#efe8ff" stroke="#6a2ff033" />
      {traces.map((d, index) => (
        <path key={`${index}-${d}`} d={d} fill="none" stroke={`url(#s-${seed})`} strokeWidth="1.4" />
      ))}
      {pads.map((pad) => (
        <rect key={`${pad.x}-${pad.y}`} x={pad.x} y={pad.y} width="16" height="10" rx="2" fill="none" stroke="#6a2ff0" />
      ))}
      {vias.map((via) => (
        <circle key={`${via.cx}-${via.cy}`} cx={via.cx} cy={via.cy} r="3.2" fill="none" stroke="#7b3bff" strokeWidth="1.2" />
      ))}
      <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx="6" fill="#6a2ff0" stroke="#4b17c9" />
      <path d={`M${chip.x + 10} ${chip.y + 14} h14 M${chip.x + 10} ${chip.y + 22} h22 M${chip.x + 10} ${chip.y + 30} h10`} stroke="#f3eeff" strokeWidth="1.3" />
    </svg>
  );
}
