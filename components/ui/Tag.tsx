"use client";

type TagVariant = "fix" | "add" | "good" | "solid";

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<TagVariant, string> = {
  fix:   "border border-[#F23005] text-[#F23005]",
  add:   "border border-[#3E8E4F] text-[#3E8E4F]",
  good:  "border border-[#3E8E4F] text-[#3E8E4F]",
  solid: "bg-[#17120C] text-[#EFE7D6] border border-[#17120C]",
};

export function Tag({ variant = "solid", children, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[0.65rem] font-medium rounded-sm ${styles[variant]} ${className}`}
      style={{ fontFamily: "var(--font-jetbrains), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}
    >
      {children}
    </span>
  );
}
