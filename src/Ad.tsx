import React, { useEffect, FC } from "react";

const Ad: FC<any> = (props: any) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-8133897183984535",
      // enable_page_level_ads: true
    });
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8133897183984535"
      data-ad-slot="5404963764"
      data-ad-format="auto"
      data-full-width-responsive="true"
      // data-adtest="on"
    />
  );
};

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default Ad;
