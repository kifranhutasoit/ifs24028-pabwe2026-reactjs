import { useEffect } from 'react';

export default function useDocumentTitle(title, description) {
  useEffect(() => {
    const baseTitle = 'Lost & Founds App - Pelaporan Barang Hilang & Temuan';
    const finalTitle = title || baseTitle;
    document.title = finalTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
      let twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) {
        twDesc.setAttribute('content', description);
      }
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', finalTitle);
    }
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', finalTitle);
    }

    // Keep canonical and og:url synchronized with the active route and origin
    try {
      const currentUrl = window.location.href.split('?')[0].split('#')[0];
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', currentUrl);
      }
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', currentUrl);
      }
    } catch {
      // In SSR or non-browser test environment
    }
  }, [title, description]);
}
