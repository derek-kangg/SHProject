export default function AiBadge({ label = "AI-styled from your closet" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0EDE8] border border-black/[0.08] rounded-full text-[11px] text-[#726D68]">
      ✦ {label}
    </span>
  );
}
