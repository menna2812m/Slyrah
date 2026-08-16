"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-sm border bg-chalk px-3.5 py-3 text-[1rem] text-ink placeholder:text-clay/70 transition-colors focus:outline-none focus-visible:border-iris focus-visible:ring-2 focus-visible:ring-iris/25";

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.875rem] text-graphite">
        <span>{label}</span>
        {optional ? <span className="text-[0.75rem] text-clay">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[0.8125rem] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-clay">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export function TextField({ label, hint, error, optional, wrapperClassName, className, ...props }: TextFieldProps) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL, error ? "border-danger" : "border-mist", className)}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(CONTROL, "appearance-none pe-10", error ? "border-danger" : "border-mist", className)}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="pointer-events-none absolute end-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-clay"
        >
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  wrapperClassName,
  className,
  ...props
}: TextAreaFieldProps) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL, "min-h-28 resize-y", error ? "border-danger" : "border-mist", className)}
      />
    </FieldShell>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string }) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        {...props}
        id={id}
        type="checkbox"
        className="mt-0.5 h-4.5 w-4.5 shrink-0 rounded-xs border border-clay/60 accent-iris"
      />
      <label htmlFor={id} className="text-[0.875rem] leading-snug text-graphite">
        {label}
        {description ? <span className="mt-0.5 block text-[0.8125rem] text-clay">{description}</span> : null}
      </label>
    </div>
  );
}
