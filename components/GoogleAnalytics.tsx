'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Script from 'next/script';

function AnalyticsContent({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = (pathname || '') + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        const handlePageView = () => {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                // We use 'config' here because it also updates the current page state for other events
                (window as any).gtag('config', GA_MEASUREMENT_ID, {
                    page_path: url,
                    page_location: window.location.href,
                    page_title: document.title,
                    // Ensure we actually send the page_view
                    send_page_view: true
                });
            }
        };

        // Small delay to ensure document.title and other meta tags are correctly updated by Next.js
        const timeoutId = setTimeout(handlePageView, 150);

        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams, GA_MEASUREMENT_ID]);

    return null;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
                }}
            />
            <Suspense fallback={null}>
                <AnalyticsContent GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
            </Suspense>
        </>
    );
}
