"use client";

import { useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input readOnly value={path} aria-label="Referral link" className="field min-h-12 flex-1 px-4 font-mono text-sm" />
      <button type="button" onClick={copy} className="btn-primary sm:shrink-0">
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
