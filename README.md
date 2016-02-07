# babel-plugin-transform-ng1-jsx

A proof of concept of type-checking templates for Angular 1.

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
    return '<div class="ooo">{{$ctrl.record.id}}<child-view some-parameter="aaa" on-save="$ctrl.save(data)"></child-view><span ng-if="$ctrl.flag">foo</span></div>';
});
```

# Example

You can find an example to play with in the `example` folder. Run `npm run build` to compile it.