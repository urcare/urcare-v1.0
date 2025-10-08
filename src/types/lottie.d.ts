// Type declarations for lottie-player web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': {
        ref?: React.Ref<any>;
        src?: string;
        background?: string;
        speed?: number;
        style?: React.CSSProperties;
        loop?: boolean;
        autoplay?: boolean;
        [key: string]: any;
      };
    }
  }
}

export {};

