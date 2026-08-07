import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          autoplay?: boolean;
          'camera-controls'?: boolean;
          'seamless-poster'?: boolean;
          'camera-target'?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'field-of-view'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'environment-image'?: string;
          exposure?: string | number;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          ar?: boolean;
          loading?: string;
        },
        HTMLElement
      >;
    }
  }
}
