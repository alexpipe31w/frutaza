'use client';

import { useEffect } from 'react';

export function TawkToChat() {
  useEffect(() => {
    // Evitar duplicados si el script ya se cargó
    if (typeof window !== 'undefined' && !(window as any).Tawk_API) {
      // @ts-ignore
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/695079195823b7197c1542a2/1jdh5i36f';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }
  }, []);

  return null;
}
