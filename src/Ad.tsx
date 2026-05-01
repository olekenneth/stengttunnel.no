import React, { useEffect } from "react";

const Ad = (props: any) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8133897183984535",
      });
    } catch (e) {
      // AdSense may throw if blocked or not loaded; fail silently
    }
  }, []);

  return (
    <div
      style={{
        // Reserve space to avoid Cumulative Layout Shift while the ad loads.
        // Matches a common responsive ad size; overflow hidden keeps it stable
        // even when the ad ends up shorter.
        minHeight: "280px",
        width: "100%",
        overflow: "hidden",
      }}
      aria-label="Annonseplass"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "280px" }}
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
