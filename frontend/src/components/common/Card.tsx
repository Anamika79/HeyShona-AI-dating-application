import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
}) => {
  return (
    <div className={`app-card ${className}`}>
      {(title || subtitle) && (
        <div className="app-card__header">
          {title && <h3 className="app-card__title">{title}</h3>}
          {subtitle && <p className="app-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="app-card__body">{children}</div>
      {footer && <div className="app-card__footer">{footer}</div>}
    </div>
  );
};
