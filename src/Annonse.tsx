import React, { useEffect, useRef } from "react";

const Annonse = (props: any) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleResize = (event: MessageEvent) => {
      if (event.origin === "https://annon-se.stengttunnel.no") {
        const newHeight = event.data;
        if (iframeRef.current) {
          iframeRef.current.style.height = `${newHeight+20}px`;
        }
      }
    };

    window.addEventListener("message", handleResize);

    return () => {
      window.removeEventListener("message", handleResize);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://annon-se.stengttunnel.no/v1/html"
      style={{ width: "100%", height: "100%", border: "none" }}
      title="Annonse"
    />
  );
};

export default Annonse;
