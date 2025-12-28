'use client'

import Script from 'next/script'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'df-messenger': any
    }
  }
}

export function TawkToChat() {
  return (
    <>
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
        strategy="lazyOnload"
      />
      {/* @ts-ignore */}
      <df-messenger
        chat-title="Frutaza"
        agent-id="c70761f2-2e4b-4447-b38a-8f8905ff4fce"
        language-code="es"
        chat-icon="/images/variante-color.png"
      />
    </>
  )
}
