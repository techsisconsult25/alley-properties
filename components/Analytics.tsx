import Script from "next/script";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function Analytics() {
  const primary = GA || ADS;
  if (!primary) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primary}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());
${GA ? `gtag('config','${GA}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}
      </Script>
    </>
  );
}
