import React from 'react';
import { cn } from '@/src/lib/utils';

interface LicensePlateProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  value,
  onChange,
  className,
  placeholder = "AB-123-CD",
  readOnly = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
    onChange?.(val);
  };

  return (
    <div className={cn(
      "flex border-2 border-black rounded-lg overflow-hidden h-[60px] shadow-md bg-white w-full max-w-[300px]",
      className
    )}>
      <div className="bg-plate-blue text-white w-[50px] flex flex-col items-center justify-end pb-1 font-bold text-sm relative">
        <span className="absolute top-2 text-[8px] opacity-80 tracking-widest">EU</span>
        NL
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-grow bg-plate-yellow border-none outline-none text-center text-2xl font-semibold text-black tracking-widest uppercase font-mono placeholder:text-black/30"
        maxLength={9}
      />
    </div>
  );
};
