declare namespace JSX {

  interface IntrinsicElements {
    [elemName: string]: {
      class?: string;
      "ng-if"?: boolean;
      "ng-show"?: boolean;
      // and so on
    }
  }

  type Element = string;
    
  // Uncomment the next line to enable the type-checking of component attributes. It almost works. 
    
  // interface ElementAttributesProperty {}
    
  // 'Almost' because the compiler actually generates an error unless all the instance members of
  // the component class are represented as attributes. Yes, it even wants to see an attribute for 
  // each method, even if it's private. You can try to uncomment the doSave method in the example
  // to see this unfortunate behavior.

}
