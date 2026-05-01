import React, { useEffect, useRef, useState } from "react";

const ANNONSE_ORIGIN = "https://annon-se.stengttunnel.no";
// Initial reserved height so we don't get a layout shift while the iframe
// loads and posts its real height. Most banner ads are ~250-280px tall.
const INITIAL_HEIGHT = 280;

const Annonse = (props: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>(INITIAL_HEIGHT);

  useEffect(() => {
    const handleResize = (event: MessageEvent) => {
      if (event.origin !== ANNONSE_ORIGIN) {
        return;
      }
      const newHeight = Number(event.data);
      if (Number.isFinite(newHeight) && newHeight > 0) {
        setHeight(newHeight + 20);
      }
    };

    window.addEventListener("message", handleResize);

    return () => {
      window.removeEventListener("message", handleResize);
    };
  }, []);

  return (
    <div style={{ minHeight: `${INITIAL_HEIGHT}px`, width: "100%" }}>
      <iframe
        ref={iframeRef}
        src={`${ANNONSE_ORIGIN}/v1/html`}
        style={{
          width: "100%",
          height: `${height}px`,
          border: "none",
          display: "block",
        }}
        loading="lazy"
        title="Annonse"
      />
    </div>
  );
};

export default Annonse;
