import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={selectId} className="text-sm font-medium text-[--ink-soft]">{label}</label>}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-3 py-2.5 text-sm bg-white border rounded text-[--ink]",
            "focus:outline-none focus:ring-2 focus:ring-[--wine] focus:border-transparent transition-colors appearance-none cursor-pointer",
            error ? "border-red-400 bg-red-50" : "border-[--border] hover:border-[--ink-faint]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
