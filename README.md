# babel-plugin-transform-ng1-jsx

A proof of concept of type-checking Angular 1 templates with TypeScript.

The idea is to use [JSX](https://facebook.github.io/jsx/) for the templates, to type-check them with TypeScript, and to convert them into the usual HTML string representation with a Babel plugin.

The solution consists of two parts:

1. Type definitions for JSX ([`ng1-jsx.ts`](ng1-jsx.ts))
2. The Babel plugin

Written in JSX, templates become just part of the TypeScript code. Include the type definitions with a `/// <reference path="..." />` comment, and use the [`--jsx preserve`](https://github.com/Microsoft/TypeScript/wiki/JSX) mode (`"jsx": "preserve"` in `tsconfig.json`) for the TypeScript compiler to understand and emit JSX. Finally, use the Babel plugin to compile JSX into HTML strings.

# Important differences between HTML and JSX

* Contrary to what is required by Angular, don't write the names of elements (components) and attributes (properties) in kebab case: `<my-component my-attr/>`. Write them the same way they appear in the rest of the code: `<MyComponent myAttr/>`. The plugin will take care about the case conversion.
* Use single curly braces for expressions, not double: `<div>{{ $ctrl.foo }}</div>` becomes `<div>{ $ctrl.foo }</div>`.
* Curly braces are used anywhere you write expressions: `ng-if={ $ctrl.editMode }`.
* Don't use `@`-bindings and interpolation in attribute values. It's not supported. Instead of this `attr="aaa{{$ctrl.foo}}"`, use a `<`-binding and `attr={ 'aaa' + $ctrl.foo }`.
* If an `&`-binding has parameters, write it like this: `attr={ ({ param1, param2 }) => $ctrl.action(param1, param2 }`. The plugin will output only the returned expression: `attr="$ctrl.action(param1, param2)"`.
* Self-closing elements are allowed.

In the first place, this technique is supposed to be used with Angular 1.5 and its [component style directives](https://docs.angularjs.org/guide/component). If you use the component approach, most of the time the only variable used in the template is a reference to the controller (`$ctrl` by default). Just declare this variable above the JSX block. Don't assign anything to it as it's needed only for the type-checking.

# What it looks like

```ts
angular.module('example').factory('parentViewTemplate', function() {
  let $ctrl: ParentView; // this variable is needed only to check the types
  return (
    <div class='ooo'>
      { $ctrl.record.id }
      <ChildView someParameter="aaa" onSave={ ({data}) => $ctrl.save(data) } />
      <span ng-if={ $ctrl.flag }>foo</span>
    </div>
  );
});
```

is compiled to

```js
angular.module('example').factory('parentViewTemplate', function () {
    var $ctrl;
    return '<div class="ooo">{{$ctrl.record.id}}<child-view some-parameter="\'aaa\'" on-save="$ctrl.save(data)"></child-view><span ng-if="$ctrl.flag">foo</span></div>';
});
```

# Complete Example

You can find an example to play with in the `example` folder. Run `npm run build` in that folder to compile it.

# Issues / TBD

* Non-JS syntax elements in Angular expressions: filters and one-time bindings.

  The comma operator can help with this: `attr={ '|myFilter', $ctrl.foo }`, `ng-if={ '::', $ctrl.flag }`. This seems to be a good solution for one-time bindings, however the filters can change the type of the resulting value, so it's not type-checkable.

* `ng-repeat`

  For the type-checking to be possible, `ng-repeat` will have to be written as a few separate attributes and assembled back to one attribute by the plugin.

* Templates with multiple root elements. JSX doesn't support this. We'll have to use some artificial root element with a certain name that will be removed by the plugin.

* Generating code for adding the templates to `$templateCache` like [grunt-angular-templates](https://github.com/ericclemmons/grunt-angular-templates) does.

# Links

* [JSX in TypeScript](https://github.com/Microsoft/TypeScript/wiki/JSX)
* [Angular Expressions](https://docs.angularjs.org/guide/expression)
* [TypeScript, issue #5151: checking frontend template files](https://github.com/Microsoft/TypeScript/issues/5151)
* [TypeScript, issue #7004: JSX: a way to make all the properties of value-based elements optional](https://github.com/Microsoft/TypeScript/issues/7004)
* [Refactoring Angular Apps to Component Style](http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html)
