"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { Gender } from "@/types";

const NAV_LINKS = [
  { href: "/",        label: "Today"         },
  { href: "/closet",  label: "My Closet"     },
  { href: "/builder", label: "Style Builder" },
  { href: "/saved",   label: "Saved Looks"   },
  { href: "/tryon",   label: "Try On"        },
  { href: "/shop",    label: "Shop"          },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState<Gender>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/[0.08] h-14 flex items-center justify-between px-8">
      <span className="text-[17px] font-medium tracking-[0.12em] select-none">FORME</span>

      <div className="flex items-center">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-3.5 py-2 text-[13px] rounded-lg transition-colors tracking-[0.02em] ${
                active
                  ? "text-[#111110] font-medium"
                  : "text-[#726D68] hover:text-[#111110] hover:bg-[#F0EDE8]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-[30px] h-[30px] rounded-full bg-[#F0EDE8] border border-black/[0.08] flex items-center justify-center text-[12px] font-medium text-[#726D68] hover:bg-[#F9F7F4] transition-colors"
        >
          AJ
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-white border border-black/[0.08] rounded-xl shadow-sm overflow-hidden">
            <div className="p-2.5">
              <p className="text-[11px] tracking-[0.08em] uppercase font-medium text-[#A8A39E] px-1.5 mb-2">Style for</p>
              <div className="flex gap-1.5">
                {(["men", "women", "all"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-1.5 text-[12px] rounded-lg border transition-colors capitalize ${
                      gender === g
                        ? "bg-[#111110] text-white border-[#111110]"
                        : "bg-white text-[#726D68] border-black/[0.08] hover:bg-[#F0EDE8]"
                    }`}
                  >
                    {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px bg-black/[0.08]" />
            {["Edit profile", "Preferences"].map((item) => (
              <button key={item} className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#726D68] hover:bg-[#F0EDE8] hover:text-[#111110] transition-colors">
                {item}
              </button>
            ))}
            <div className="h-px bg-black/[0.08]" />
            <button className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#726D68] hover:bg-[#F0EDE8] transition-colors">
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
