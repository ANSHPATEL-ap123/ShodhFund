export function Logo({ inverted = false, size = 28 }: { inverted?: boolean; size?: number }) {
  const fill = inverted ? "#fff" : "#0a0a0a";
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M10 48 L22 48 L22 36 L10 48 Z" fill={fill} />
        <path d="M24 48 L32 32 L32 48 Z" fill="#C8F135" />
        <path d="M12 18 C12 10 20 8 32 8 L48 8 L40 16 L28 16 C22 16 20 18 20 22 C20 26 24 28 32 28 L44 28 C56 28 56 40 56 44 C56 54 46 56 32 56 L18 56 L26 48 L36 48 C44 48 46 46 46 42 C46 38 42 36 34 36 L22 36 C12 36 12 26 12 22 Z" fill={fill} />
        <rect x="18" y="14" width="14" height="3" rx="1" fill={inverted ? "#0a0a0a" : "#fff"} />
        <rect x="18" y="19" width="10" height="3" rx="1" fill={inverted ? "#0a0a0a" : "#fff"} />
      </svg>
      <span className={`text-[17px] font-semibold tracking-tight ${inverted ? "text-white" : "text-black"}`}>
        Shodh Fund<span className="inline-block w-1.5 h-1.5 bg-[#C8F135] rounded-[1px] ml-0.5 align-baseline" />
      </span>
    </div>
  );
}
