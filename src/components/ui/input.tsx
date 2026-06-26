import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-[--ink-soft]">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2.5 text-sm bg-white border rounded text-[--ink] placeholder:text-[--ink-faint]",
            "focus:outline-none focus:ring-2 focus:ring-[--wine] focus:border-transparent transition-colors",
            error ? "border-red-400 bg-red-50" : "border-[--border] hover:border-[--ink-faint]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[--ink-faint]">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
