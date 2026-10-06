import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    icon,
    error,
    className = "",
    hint,
    ...props
  },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-[#3A4A3F]">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87A878]">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-2xl
            bg-white border-2 text-[#3A4A3F] text-sm
            placeholder:text-[#3A4A3F]/40
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-400 focus:border-red-400"
                : "border-[#87A878]/20 focus:border-[#87A878] focus:shadow-[0_0_0_3px_rgba(135,168,120,0.15)]"
            }
            outline-none
          `}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="text-xs text-[#3A4A3F]/50">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
