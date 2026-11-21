import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'neutral';

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  pulse = false,
}) => {
  return (
    <span className={`status-badge status-badge--${variant}`}>
      {pulse && <span className="status-badge__dot" />}
      <span className="status-badge__label">{label}</span>
    </span>
  );
};
