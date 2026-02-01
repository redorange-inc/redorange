'use client';

import { DynamicIcon } from 'lucide-react/dynamic';
import type { LucideProps } from 'lucide-react';
import { toKebabCase } from './constants';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconProps extends Omit<LucideProps, 'size'> {
  name: string;
  size?: IconSize;
}

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon = ({ name, size = 'md', className, ...props }: IconProps) => {
  const kebabName = name.includes('-') ? name : toKebabCase(name);

  return (
    <DynamicIcon
      // @ts-expect-error - DynamicIcon accepts any valid icon name
      name={kebabName}
      size={sizeMap[size]}
      className={className}
      fallback={() => <DynamicIcon name="snowflake" size={sizeMap[size]} className={className} {...props} />}
      {...props}
    />
  );
};
