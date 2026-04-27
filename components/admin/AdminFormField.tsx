interface AdminFormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function AdminFormField({
  label,
  required,
  hint,
  children,
}: AdminFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 font-display text-xs tracking-widest uppercase text-text-muted font-semibold">
        {label}
        {required && <span className="text-gold-bright">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-text-muted italic">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function AdminInput({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`
                w-full bg-bg-raised border border-border-gold rounded-md
                text-text-primary font-body text-sm
                px-3 py-2 outline-none
                placeholder:text-text-muted
                focus:border-gold-mid focus:ring-2 focus:ring-gold-subtle
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function AdminTextarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`
                w-full bg-bg-raised border border-border-gold rounded-md
                text-text-primary font-body text-sm
                px-3 py-2 outline-none resize-y min-h-[100px]
                placeholder:text-text-muted
                focus:border-gold-mid focus:ring-2 focus:ring-gold-subtle
                transition-all duration-150
                ${className}
            `}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function AdminSelect({
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={`
                w-full bg-bg-raised border border-border-gold rounded-md
                text-text-primary font-body text-sm
                px-3 py-2 outline-none
                focus:border-gold-mid focus:ring-2 focus:ring-gold-subtle
                transition-all duration-150
                ${className}
            `}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AdminCheckbox({
  label,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        {...props}
        className={`
                    w-4 h-4 rounded-sm border border-border-gold
                    bg-bg-raised accent-gold-bright
                    ${className}
                `}
      />
      <span className="text-sm text-text-secondary">{label}</span>
    </label>
  );
}
