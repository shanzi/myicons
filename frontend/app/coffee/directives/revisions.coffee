md5 = require '../deps/md5.js'

module.exports = ->
  restrict: 'E'
  scope:
    revision: '='
    restoreClick: '&'
  template: """
  <div class="revision-title">
    <span class="revision-action-icon" ng-class="revision.action">
      <i ng-class="rev.action_icon"></i>
    </span><img ng-src="{{ rev.avatar }}" class="revision-avatar">
    <span class="revision-user" ng-bind="revision.user.name"></span>
    <span class="revision-action" ng-bind="rev.action"></span>
    <a class="revision-target" ng-bind="revision.target_name" ng-href="{{ rev.target_url }}"></a>
    <span class="revert-ref" ng-if="revision.ref_name">
      <span ng-bind="rev.ref_action"></span>
      <a class="revision-ref" ng-bind="revision.ref_name" ng-href="{{ rev.ref_url }}"></a>
    </span>
    at
    <span class="revision-datetime" ng-bind="revision.created_at|date:'short'"></span>
  </div>
  <ul class="revision-detail">
    <li class="revision-detail-item" ng-if="rev.rename">
    Renamed from <span class="old" ng-bind="rev.rename.old"></span> to <span class="new" ng-bind="rev.rename.new"></span>
    </li>
    <li class="revision-detail-item" ng-repeat="item in rev.changes">
    Changed <span class="field" ng-bind="item.field"></span>
    from <span class="old" ng-bind="item.old"></span> to <span class="new" ng-bind="item.new"></span>
    </li>
    <li class="revision-detail-item" ng-repeat="item in rev.clears">
      Cleared the content of <span class="field" ng-bind="item.field"></span>
    </li>
    <li class="revision-detail-item" ng-repeat="item in rev.sets">
      Set <span class="field" ng-bind="item.field"></span> to <span class="new" ng-bind="item.new"></span>
    </li>
  </ul>
  <div class="restore-action" ng-if="rev.restorable" ng-click="restoreClick(revision)">
  <i class="icon-rev-restore"></i> Restore</div>
  """
  link: (scope, element, attrs) ->
    revision = scope.revision
    rev = {}

    rev.action_icon = 'icon-rev-' + revision.action
    rev.avatar = "https://secure.gravatar.com/avatar/#{ md5(revision.user.email) }?s=16&d=mm"
    model = revision.model
    model = 'icon' if model == 'collectionicon'

    switch revision.action
      when 'create'
        rev.action = 'added new ' + model
      when 'update'
        rev.action = 'modified ' + model
      when 'delete'
        rev.action = 'removed ' + model
        rev.restorable = !revision.is_restored
      when 'restore'
        rev.action = 'restored ' + model

    rename = null
    changes = []
    clears = []
    sets = []

    for k, val of revision.diff
      v = angular.copy val
      v.old = '' if not v.old
      v.new = '' if not v.new
      if k == 'name' and revision.action != 'create'
        rename = v
      else if v.old.trim() and v.new.trim()
        v.field = k
        changes.push v
      else if v.old.trim()
        v.field = k
        clears.push v
      else if v.new.trim()
        v.field = k
        sets.push v

    rev.rename = rename
    rev.changes = changes
    rev.clears = clears
    rev.sets = sets

    if revision.model == 'pack'
      rev.target_url = "#/packs/#{revision.target_id}"
    else if revision.model == 'collection'
      rev.target_url = "#/collections/#{revision.target_id}"

    if revision.ref_name
      rev.ref_url = "#/collections/#{revision.ref_id}"
      switch revision.action
        when 'create'
          rev.ref_action = 'to collection'
        when 'restore'
          rev.ref_action = 'to collection'
        when 'delete'
          rev.ref_action = 'from collection'
        else
          rev.ref_action = 'of collection'

    scope.rev = rev
