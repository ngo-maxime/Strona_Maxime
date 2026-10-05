import Script from "next/script";

// Google Consent Mode v2 – stan domyślny „denied” ustawiany przed jakimkolwiek tagiem Google.
// Sam skrypt Google Analytics ładuje się dopiero po zgodzie (components/analytics/ConsentAnalytics).
export default function GoogleConsent() {
  return (
    <Script
      id="google-consent-init"
      strategy="beforeInteractive"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: statyczny skrypt inicjalizujący Consent Mode
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',personalization_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});gtag('set','ads_data_redaction',true);`,
      }}
    />
  );
}
