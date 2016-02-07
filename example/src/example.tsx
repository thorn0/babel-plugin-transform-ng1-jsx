/// <reference path="../../ng1-jsx.d.ts" />

var mod = angular.module('example', []);

mod.component('parentView', {
  controller: ParentView,
  template: parentViewTemplate => parentViewTemplate,
  bindings: {
    record: '<',
    flag: '<'
  }
});

class ParentView {
  record: { id: string };
  flag: boolean;
  save(data: string) { }
}

mod.factory('parentViewTemplate', function() {
  let $ctrl: ParentView;
  return (
    <div class='ooo'>
      { $ctrl.record.id }
      <ChildView someParameter="aaa" onSave={ ({data}) => $ctrl.save(data) } />
      <span ng-if={ $ctrl.flag }>foo</span>
    </div>
  );
});

mod.component('childView', {
  controller: ChildView,
  template: childViewTemplate => childViewTemplate,
  bindings: {
    someParameter: '<',
    onSave: '&'
  }
})

mod.factory('childViewTemplate', function() {
  let $ctrl: ChildView;
  return <div>{$ctrl.someParameter}</div>;
});

class ChildView {
  someParameter: string;
  onSave: (param: { data: string }) => void;
  // doSave() { this.onSave({data: 'abc'}); }
}
