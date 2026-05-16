import React, { useEffect, useRef, useState } from "react";

const ANNONSE_ORIGIN = "https://annon-se.stengttunnel.no";
// Initial reserved height so we don't get a layout shift while the iframe
// loads and posts its real height.
const INITIAL_HEIGHT = 280;
const COLLAPSE_TIMEOUT_MS = 1500;

const Annonse = (props: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(INITIAL_HEIGHT);
  const [received, setReceived] = useState(false);

  useEffect(() => {
    const handleResize = (event: MessageEvent) => {
      if (event.origin !== ANNONSE_ORIGIN) {
        return;
      }
      const newHeight = Number(event.data);
      if (Number.isFinite(newHeight) && newHeight > 0) {
        setHeight(newHeight + 20);
        setReceived(true);
      }
    };

    window.addEventListener("message", handleResize);

    // Collapse if the iframe never posts a height (blocked, empty, etc).
    const timer = window.setTimeout(() => {
      if (!received) {
        setHeight(0);
      }
    }, COLLAPSE_TIMEOUT_MS);

    return () => {
      window.removeEventListener("message", handleResize);
      window.clearTimeout(timer);
    };
    // We intentionally do not depend on `received`; the timer is a one-shot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: height === 0 ? 0 : `${INITIAL_HEIGHT}px`,
        width: "100%",
        transition: "min-height 0.2s ease-out",
      }}
    >
      <iframe
        ref={iframeRef}
        src={`${ANNONSE_ORIGIN}/v1/html`}
        style={{
          width: "100%",
          height: `${height}px`,
          border: "none",
          display: "block",
          transition: "height 0.2s ease-out",
        }}
        loading="lazy"
        title="Annonse"
      />
    </div>
  );
};

export default Annonse;
