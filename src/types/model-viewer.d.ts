declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        'xr-environment'?: boolean;
        alt?: string;
        [key: string]: unknown;
      },
      HTMLElement
    >;
  }
}
