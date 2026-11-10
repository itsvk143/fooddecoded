"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
  title?: string;
  showVerifiedBadge?: boolean;
  badgeText?: string;
  badgeClassName?: string;
  onImageError?: () => void;
}

export function ProductImage({
  src,
  alt,
  className = "max-h-full max-w-full object-contain mx-auto",
  fallbackSrc = "/images/placeholder-product.svg",
  loading = "lazy",
  title,
  showVerifiedBadge = false,
  badgeText = "Verified",
  badgeClassName = "absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 dark:bg-stone-900/95 text-emerald-700 dark:text-emerald-300 shadow-xs backdrop-blur-xs border border-stone-200/50 dark:border-stone-700/50",
  onImageError,
}: ProductImageProps) {
  const isDefaultPlaceholder = !src || src === fallbackSrc || src.includes("placeholder");
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(isDefaultPlaceholder);

  useEffect(() => {
    const isPl = !src || src === fallbackSrc || src.includes("placeholder");
    setCurrentSrc(src || fallbackSrc);
    setHasError(isPl);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onImageError?.();
    }
  };

  return (
    <>
      <img
        src={currentSrc}
        alt={alt}
        title={title}
        className={className}
        loading={loading}
        onError={handleError}
      />

      {showVerifiedBadge && !hasError && !currentSrc.includes("placeholder") && (
        <span className={badgeClassName}>
          <CheckCircle2 className={badgeClassName.includes("text-xs") ? "w-4 h-4 text-emerald-500" : "w-3 h-3 text-emerald-500"} /> {badgeText}
        </span>
      )}
    </>
  );
}

export default ProductImage;
