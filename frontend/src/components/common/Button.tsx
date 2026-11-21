import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`app-btn app-btn--${variant} ${loading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};
