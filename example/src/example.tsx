/// <reference path="../../ng1-jsx.ts" />

var mod = angular.module('example', []);

class ParentView extends Component {
  record: { id: string };
  flag: boolean;
  save(data: string) {}
}

mod.component('parentView', {
  controller: ParentView,
  template: parentViewTemplate => parentViewTemplate,
  bindings: {
    record: '<',
    flag: '<'
  }
});

mod.factory('parentViewTemplate', function() {
  let $ctrl: ParentView;
  return (
    <div class="ooo">
      {$ctrl.record.id}
      <ChildView
        someParameter="aaa"
        onSave={({ data }) => $ctrl.save(data)}
      />
      <span ng-if={$ctrl.flag}>foo</span>
    </div>
  );
});

class ChildView extends Component {
  someParameter: string;
  onSave: (param: { data: string }) => void;
  doSave() {
    var a = { a: 1 };
    this.onSave({ data: 'abc' });
  }
}

mod.component('childView', {
  controller: ChildView,
  template: childViewTemplate => childViewTemplate,
  bindings: {
    someParameter: '<',
    onSave: '&'
  }
});

mod.factory('childViewTemplate', function() {
  let $ctrl: ChildView;
  return <div>{$ctrl.someParameter}</div>;
});
