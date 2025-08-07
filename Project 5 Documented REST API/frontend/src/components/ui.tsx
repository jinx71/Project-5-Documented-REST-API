import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const fieldBase =
  'w-full rounded border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-muted/60';

export const Field = ({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-muted">
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    {children}
    {error && <p className="text-xs text-danger">{error}</p>}
  </div>
);

export const TextInput = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${fieldBase} ${className}`} />
);

export const Select = ({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`${fieldBase} ${className}`}>
    {children}
  </select>
);

export const Textarea = ({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`${fieldBase} resize-none ${className}`} />
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
};

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-line bg-white text-ink hover:bg-paper',
  danger: 'border border-danger/30 bg-white text-danger hover:bg-danger/5',
  ghost: 'text-muted hover:text-ink',
};

export const Button = ({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
);

export const Spinner = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={`animate-spin text-current ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path
      className="opacity-90"
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const EmptyState = ({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-panel px-6 py-16 text-center">
    <div className="flex items-end gap-[3px]" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="w-px bg-line" style={{ height: i % 4 === 0 ? 18 : 9 }} />
      ))}
    </div>
    <p className="font-display text-base font-semibold text-ink">{title}</p>
    {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
    {action}
  </div>
);
