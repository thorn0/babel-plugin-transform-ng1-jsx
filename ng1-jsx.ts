class Component {
  /** A bogus type-system-only property. */
  __bogusProps: Partial<this>;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: {
      class?: string;
      'ng-if'?: boolean;
      'ng-show'?: boolean;
      'ng-hide'?: boolean;
      'ng-class'?: { [key: string]: string };
      // and so on
    };
  }

  type Element = string;

  interface ElementAttributesProperty {
    __bogusProps: any;
  }
}
