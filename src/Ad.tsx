import React, { useEffect, useRef, useState } from "react";

// Reserved height while the ad is loading. Collapses to 0 if no ad slot
// becomes visible within COLLAPSE_TIMEOUT_MS, so we do not leave a large
// empty box when ads are blocked or do not fill.
const RESERVED_HEIGHT = 280;
const COLLAPSE_TIMEOUT_MS = 1500;

const Ad = (props: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8133897183984535",
      });
    } catch (e) {
      // AdSense may throw if blocked or not loaded; fail silently
    }

    const timer = window.setTimeout(() => {
      // If AdSense filled the slot, the <ins> has data-ad-status="filled"
      // and a non-zero height. Otherwise, collapse to avoid an empty box.
      const ins = containerRef.current?.querySelector("ins.adsbygoogle");
      const status = ins?.getAttribute("data-ad-status");
      const filled = status === "filled" || (ins?.clientHeight ?? 0) > 0;
      if (!filled) {
        setCollapsed(true);
      }
    }, COLLAPSE_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: collapsed ? 0 : `${RESERVED_HEIGHT}px`,
        width: "100%",
        overflow: "hidden",
        transition: "min-height 0.2s ease-out",
      }}
      aria-label="Annonseplass"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-8133897183984535"
        data-ad-slot="5404963764"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
      />
    </div>
  );
};

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default Ad;
