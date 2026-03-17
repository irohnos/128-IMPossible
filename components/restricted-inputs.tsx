'use client';

import { namesOnly, numbersOnly, gradesOnly } from "@/lib/utils";
import React from "react";

interface RestrictedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  restrictionType: 'name' | 'number' | 'grade';
}

export default function RestrictedInput({ restrictionType, className, ...props }: RestrictedInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (restrictionType === 'name') namesOnly(e);
    if (restrictionType === 'number') numbersOnly(e);
    if (restrictionType === 'grade') gradesOnly(e);
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return <input onKeyDown={handleKeyDown} className={className} {...props} />;
}