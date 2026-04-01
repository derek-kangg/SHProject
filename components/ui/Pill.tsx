"use client";
interface PillProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
export default function Pill({ active, onClick, children, className }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] border transition-colors ${
        active
          ? "bg-[#111110] text-white border-[#111110]"
          : "bg-white text-[#726D68] border-black/[0.08] hover:border-black/[0.15] hover:text-[#111110]"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
