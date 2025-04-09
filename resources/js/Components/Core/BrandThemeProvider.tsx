import React, { PropsWithChildren, useEffect } from 'react';

/**
 * A theme provider component that applies global theme settings
 * This can be wrapped around your main app layout
 */
export default function BrandThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // Set the DaisyUI theme
    document.documentElement.setAttribute('data-theme', 'yensao');

    // Apply any additional global theme settings here
    // For example, you could add specific classes to the body element
    document.body.classList.add('text-charcoal');
  }, []);

  return <>{children}</>;
}
