"use client";

import React from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { InstallAppModal } from "./InstallAppModal";

interface InstallAppButtonProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function InstallAppButton({
  variant = "desktop",
  className,
}: InstallAppButtonProps) {
  const {
    isMounted,
    isInstalled,
    isIOS,
    canPromptNative,
    isModalOpen,
    openModal,
    closeModal,
    installApp,
  } = usePwaInstall();

  // Prevent hydration mismatch and hide permanently once installed
  if (!isMounted || isInstalled) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    installApp();
  };

  if (variant === "mobile") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 active:scale-90 transition-all shadow-2xs cursor-pointer shrink-0",
            className
          )}
          aria-label="Install FoodDecode App"
          title="Install FoodDecode App"
        >
          <Download className="w-5 h-5 text-emerald-500" />
        </button>

        <InstallAppModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onInstall={installApp}
          canPromptNative={canPromptNative}
          isIOS={isIOS}
        />
      </>
    );
  }

  // Desktop variant: Icon + "Install" text
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0",
          className
        )}
        title="Install FoodDecode Web App"
      >
        <Download className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Install</span>
      </button>

      <InstallAppModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onInstall={installApp}
        canPromptNative={canPromptNative}
        isIOS={isIOS}
      />
    </>
  );
}
