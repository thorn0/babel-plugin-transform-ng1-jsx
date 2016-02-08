# babel-plugin-transform-ng1-jsx

A proof of concept of type-checking templates for Angular 1.

# What it looks like

```ts
angular.module('example').factory('parentViewTemplate', function() {
  let $ctrl: ParentView;
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

# Example

You can find an example to play with in the `example` folder. Run `npm run build` in that folder to compile it.

# Issues / TBD

* Type-check component attributes. TypeScript almost (but not quite) allows this. See the comments in [`ng1-jsx.d.ts`](ng1-jsx.d.ts).
* Non-JS syntax elements in Angular expressions: filters and one-time bindings.

  It might look like this: `attr={ '|myFilter', $ctrl.foo }`, `ng-if={ '::', $ctrl.flag }`. This seems to be a good solution for one-time bindings, however the filters can change the type of the resulting value. This seems to make the type-checking impossible.
* `ng-repeat`

  For the type-checking to be possible, `ng-repeat` needs to be written as a few separate attributes and assembled back to one attribute by the plugin.
* Templates with multiple root elements. JSX doesn't support this.
* Generate code for adding the templates to `$templateCache` like [grunt-angular-templates](https://github.com/ericclemmons/grunt-angular-templates) does.
