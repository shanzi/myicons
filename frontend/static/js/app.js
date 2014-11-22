require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var appCtrl, collectionAddCtrl, collectionCtrl, dashboardCtrl, menuCtrl, modelManager, packAddCtrl, packCtrl, packIconDirective, settingsCtrl, template;

window.Hammer = require('hammer');

require('angular.fileuploadshim');

require('angular');

require('angular.aria');

require('angular.route');

require('angular.animate');

require('angular.resource');

require('angular.material');

require('angular.loadingbar');

require('angular.fileupload');

appCtrl = require('./controllers/app');

menuCtrl = require('./controllers/menu');

packCtrl = require('./controllers/pack');

packAddCtrl = require('./controllers/pack_add');

collectionCtrl = require('./controllers/collection');

collectionAddCtrl = require('./controllers/collection_add');

settingsCtrl = require('./controllers/settings');

dashboardCtrl = require('./controllers/dashboard');

packIconDirective = require('./directives/pack_icons');

modelManager = require('./modelmanager');

template = function(name) {
  return "/static/templates/" + name + ".html";
};

angular.module('myiconsApp', ['ngMaterial', 'ngRoute', 'ngResource', 'angular-loading-bar', 'angularFileUpload']).controller('appCtrl', appCtrl).controller('menuCtrl', menuCtrl).controller('packCtrl', packCtrl).controller('packAddCtrl', packAddCtrl).controller('collectionCtrl', collectionCtrl).controller('collectionAddCtrl', collectionAddCtrl).controller('DashboardCtrl', dashboardCtrl).controller('SettingsCtrl', settingsCtrl).directive('packIcons', packIconDirective).factory('$modelManager', modelManager).config(function($routeProvider, $resourceProvider) {
  $routeProvider.when('/home/dashboard', {
    templateUrl: template('dashboard'),
    controller: 'DashboardCtrl'
  }).when('/home/settings', {
    templateUrl: template('settings'),
    controller: 'SettingsCtrl'
  }).when('/packs/add', {
    templateUrl: template('pack_add'),
    controller: 'packAddCtrl',
    controllerAs: 'pack'
  }).when('/packs/:id', {
    templateUrl: template('pack'),
    controller: 'packCtrl',
    controllerAs: 'pack'
  }).when('/collections/add', {
    templateUrl: template('collection_add'),
    controller: 'collectionAddCtrl',
    controllerAs: 'collection'
  }).when('/collections/:id', {
    templateUrl: template('collection'),
    controller: 'collectionCtrl',
    controllerAs: 'collection'
  }).otherwise({
    redirectTo: '/home/dashboard'
  });
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  csrf_token = document.querySelector('meta[name=csrf-token]').content;
  return $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token;
});



},{"./controllers/app":2,"./controllers/collection":3,"./controllers/collection_add":4,"./controllers/dashboard":5,"./controllers/menu":6,"./controllers/pack":7,"./controllers/pack_add":8,"./controllers/settings":9,"./directives/pack_icons":11,"./modelmanager":12,"angular":"angular","angular.animate":"angular.animate","angular.aria":"angular.aria","angular.fileupload":"angular.fileupload","angular.fileuploadshim":"angular.fileuploadshim","angular.loadingbar":"angular.loadingbar","angular.material":"angular.material","angular.resource":"angular.resource","angular.route":"angular.route","hammer":"hammer"}],2:[function(require,module,exports){
var AppController, md5;

md5 = require('../deps/md5.js');

AppController = (function() {
  AppController.prototype.theme = 'mydark';

  AppController.prototype.currentUser = null;

  AppController.prototype.gravatar = function(email, size) {
    if (size == null) {
      size = 100;
    }
    if (email) {
      return "https://secure.gravatar.com/avatar/" + (md5(email)) + "?s=" + size + "&d=mm";
    }
  };

  AppController.prototype.openMenu = function() {
    return this.$mdSidenav('left').open();
  };

  function AppController($mdSidenav, $modelManager) {
    this.$mdSidenav = $mdSidenav;
    this.$modelManager = $modelManager;
    this.currentUser = this.$modelManager.currentUser;
    this.$modelManager.ready((function(_this) {
      return function() {
        return console.log('models ready');
      };
    })(this));
  }

  return AppController;

})();

module.exports = AppController;



},{"../deps/md5.js":10}],3:[function(require,module,exports){
var CollectionController;

CollectionController = (function() {
  CollectionController.prototype.info = {};

  CollectionController.prototype.icons = [];

  CollectionController.prototype.iconNames = {};

  CollectionController.prototype.currentTab = 'icons';

  CollectionController.prototype.isTab = function(name) {
    return name === this.currentTab;
  };

  CollectionController.prototype.setTab = function(name) {
    return this.currentTab = name;
  };

  CollectionController.prototype.reset = function() {
    this.info = angular.copy(this._info);
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  CollectionController.prototype.save = function() {
    angular.extend(this._info, this.info);
    this._info.$update();
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  CollectionController.prototype.saveIconName = function(icon) {
    var save;
    save = (function(_this) {
      return function() {
        if (icon.name && _this.iconNameChanged(icon)) {
          _this.iconNames[icon.id] = icon.name;
          return icon.$update();
        }
      };
    })(this);
    return setTimeout(save, 100);
  };

  CollectionController.prototype.iconNameChanged = function(icon) {
    var oldName;
    oldName = this.iconNames[icon.id];
    return oldName !== icon.name;
  };

  CollectionController.prototype.iconNameReset = function(icon) {
    return icon.name = this.iconNames[icon.id];
  };

  CollectionController.prototype.deleteIcon = function(icon) {
    var idx;
    idx = this.icons.indexOf(icon);
    this.icons.splice(idx, 1);
    return icon.$delete();
  };

  CollectionController.prototype.unchanged = function() {
    return angular.equals(this.info, this._info);
  };

  CollectionController.prototype.liveURL = function() {
    return "" + window.location.origin + "/build/livetesting/" + this.info.token + ".css";
  };

  CollectionController.prototype.retoken = function() {
    return this.info.$retoken((function(_this) {
      return function(info) {
        _this._info.token = info.token;
        return _this.info.token = info.token;
      };
    })(this));
  };

  CollectionController.prototype["delete"] = function() {
    var ok;
    ok = confirm('Are you sure?');
    if (ok) {
      this.$modelManager.deleteCollection(this._info);
      return this.$location.path('#/home/dashboard');
    }
  };

  CollectionController.prototype.fieldName = function(prefix) {
    return prefix + this.randomFactor;
  };

  function CollectionController($routeParams, $rootScope, $location, $modelManager) {
    var id;
    this.$routeParams = $routeParams;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$modelManager = $modelManager;
    id = parseInt(this.$routeParams.id);
    this.$modelManager.getCollection(id, (function(_this) {
      return function(collection, icons) {
        _this._info = collection;
        _this.icons = icons;
        _this.iconNames = {};
        _this.icons.$promise.then(function() {
          var icon, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = icons.length; _i < _len; _i++) {
            icon = icons[_i];
            _results.push(_this.iconNames[icon.id] = icon.name);
          }
          return _results;
        });
        _this.reset();
        return _this.$rootScope.$broadcast('$reselectMenuItem');
      };
    })(this));
  }

  return CollectionController;

})();

module.exports = CollectionController;



},{}],4:[function(require,module,exports){
var CollectionAddController;

CollectionAddController = (function() {
  CollectionAddController.prototype.info = {};

  CollectionAddController.prototype.reset = function() {
    this.info = {};
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  CollectionAddController.prototype.save = function() {
    return this.$modelManager.addCollection(this.info, (function(_this) {
      return function(collection) {
        _this.reset();
        return _this.$location.path("/collections/" + collection.id);
      };
    })(this));
  };

  CollectionAddController.prototype.fieldName = function(prefix) {
    return prefix + this.randomFactor;
  };

  function CollectionAddController($location, $modelManager) {
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.reset();
  }

  return CollectionAddController;

})();

module.exports = CollectionAddController;



},{}],5:[function(require,module,exports){
module.exports = function($scope) {};



},{}],6:[function(require,module,exports){
var MenuController, MenuSection;

MenuSection = (function() {
  MenuSection.prototype.sectionIcon = '';

  MenuSection.prototype.isExpanded = false;

  MenuSection.prototype.addItemUrl = null;

  function MenuSection(name, sectionIcon, items) {
    this.name = name;
    this.sectionIcon = sectionIcon;
    this.items = items;
  }

  MenuSection.prototype.pathForItem = function(item) {
    return "/" + this.name + "/" + item.id;
  };

  MenuSection.prototype.toggleExpand = function() {
    return this.isExpanded = !this.isExpanded;
  };

  return MenuSection;

})();

MenuController = (function() {
  MenuController.prototype.sections = [];

  MenuController.prototype.currentSection = null;

  MenuController.prototype.currentItem = null;

  MenuController.prototype.isSelectedSection = function(section) {
    return section === this.currentSection && !section.isExpanded;
  };

  MenuController.prototype.isSelectedItem = function(section, item) {
    return item === this.currentItem && section.isExpanded;
  };

  MenuController.prototype.goto = function(section, item) {
    return this.$location.path(section.pathForItem(item));
  };

  MenuController.prototype.selectItem = function() {
    var item, path, section, _i, _j, _len, _len1, _ref, _ref1;
    path = this.$location.path();
    _ref = this.sections;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      _ref1 = section.items;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        if (section.pathForItem(item) === path) {
          this.currentSection = section;
          this.currentItem = item;
          this.currentSection.isExpanded = true;
          return;
        }
      }
    }
    this.currentSection = null;
    return this.currentItem = null;
  };

  function MenuController($rootScope, $location, $modelManager) {
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.home = new MenuSection('home', 'icon-home', [
      {
        id: 'dashboard',
        name: 'Dashboard'
      }, {
        id: 'settings',
        name: 'Settings'
      }
    ]);
    this.packs = new MenuSection('packs', 'icon-packs', this.$modelManager.packs);
    this.collections = new MenuSection('collections', 'icon-collections', this.$modelManager.collections);
    this.packs.addItemUrl = '#/packs/add';
    this.collections.addItemUrl = '#/collections/add';
    this.sections = [this.home, this.packs, this.collections];
    this.$rootScope.$on('$reselectMenuItem', (function(_this) {
      return function() {
        return _this.selectItem();
      };
    })(this));
    this.$rootScope.$on('$locationChangeSuccess', (function(_this) {
      return function() {
        return _this.selectItem();
      };
    })(this));
  }

  return MenuController;

})();

module.exports = MenuController;



},{}],7:[function(require,module,exports){
var PackController, PackIconInfoController;

PackIconInfoController = (function() {
  PackIconInfoController.prototype.sendto = function(collection) {
    var newIconData;
    newIconData = {
      name: this.icon.name,
      packicon: this.icon.id,
      collection: collection.id
    };
    return this.$modelManager.addCollectionIcon(newIconData, (function(_this) {
      return function() {
        return _this.$mdBottomSheet.hide();
      };
    })(this));
  };

  function PackIconInfoController($mdBottomSheet, $modelManager, icon) {
    this.$mdBottomSheet = $mdBottomSheet;
    this.$modelManager = $modelManager;
    this.icon = icon;
    this.collections = this.$modelManager.collections;
  }

  return PackIconInfoController;

})();

PackController = (function() {
  PackController.prototype.info = {};

  PackController.prototype.icons = [];

  PackController.prototype.currentTab = 'icons';

  PackController.prototype.isTab = function(name) {
    return name === this.currentTab;
  };

  PackController.prototype.setTab = function(name) {
    return this.currentTab = name;
  };

  PackController.prototype.reset = function() {
    this.info = angular.copy(this._info);
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  PackController.prototype.save = function() {
    angular.extend(this._info, this.info);
    this._info.$update();
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  PackController.prototype.unchanged = function() {
    return angular.equals(this.info, this._info);
  };

  PackController.prototype.showIconInfo = function(icon) {
    return this.$mdBottomSheet.show({
      controller: PackIconInfoController,
      controllerAs: 'info',
      templateUrl: '/static/templates/pack_icon_info.html',
      locals: {
        icon: icon
      }
    });
  };

  PackController.prototype.fieldName = function(prefix) {
    return prefix + this.randomFactor;
  };

  function PackController($routeParams, $rootScope, $modelManager, $mdBottomSheet) {
    var id;
    this.$routeParams = $routeParams;
    this.$rootScope = $rootScope;
    this.$modelManager = $modelManager;
    this.$mdBottomSheet = $mdBottomSheet;
    id = parseInt(this.$routeParams.id);
    this.$modelManager.getPack(id, (function(_this) {
      return function(pack, icons) {
        _this._info = pack;
        _this.icons = icons;
        _this.reset();
        return _this.$rootScope.$broadcast('$reselectMenuItem');
      };
    })(this));
  }

  return PackController;

})();

module.exports = PackController;



},{}],8:[function(require,module,exports){
var PackAddController;

PackAddController = (function() {
  PackAddController.prototype.info = {};

  PackAddController.prototype.fontStatus = '';

  PackAddController.prototype.cssStatus = '';

  PackAddController.prototype.icons = [];

  PackAddController.prototype.iconNames = [];

  PackAddController.prototype.reset = function() {
    this.info = {};
    this.icons = [];
    this.iconNames = [];
    this.fontStatus = '';
    this.cssStatus = '';
    return this.randomFactor = (new Date()).valueOf().toString(16);
  };

  PackAddController.prototype.fontFileSelected = function(files) {
    var fontfile;
    if (files.length && this.fontStatus !== 'processing') {
      fontfile = files[0];
      if (!fontfile.name.match(/\.(ttf|woff|eot|svg)$/)) {
        return this.fontStatus = 'error';
      } else {
        this.fontStatus = 'processing';
        return this.$upload.upload({
          url: '/convert/font/',
          file: fontfile
        }).success((function(_this) {
          return function(data) {
            _this.icons = data.content.glyphs;
            _this.fontStatus = 'success';
            return _this.info.name = data.content.fontname;
          };
        })(this)).error((function(_this) {
          return function() {
            return _this.fontStatus = 'error';
          };
        })(this));
      }
    }
  };

  PackAddController.prototype.cssFileSelected = function(files) {
    var cssfile;
    if (files.length && this.cssStatus !== 'processing') {
      cssfile = files[0];
      if (!cssfile.name.match(/\.css$/)) {
        return this.cssStatus = 'error';
      } else {
        this.cssStatus = 'processing';
        return this.$upload.upload({
          url: '/convert/css',
          file: cssfile
        }).success((function(_this) {
          return function(data) {
            _this.iconNames = data.content;
            return _this.cssStatus = 'success';
          };
        })(this)).error((function(_this) {
          return function() {
            return _this.cssStatus = 'error';
          };
        })(this));
      }
    }
  };

  PackAddController.prototype.fontInfo = function() {
    if (this.fontStatus === 'error') {
      return 'Invalid font file!';
    } else if (this.fontStatus === 'success') {
      return "" + this.icons.length + " icons detected";
    } else if (this.fontStatus === 'processing') {
      return 'Processing';
    } else {
      return 'Drag font(.ttf, .eot, .woff, .svg) file here to retrive all icons\' shape.';
    }
  };

  PackAddController.prototype.cssInfo = function() {
    if (this.cssStatus === 'error') {
      return 'Invalid css file!';
    } else if (this.cssStatus === 'success') {
      return "" + this.iconNames.length + " icon names detected";
    } else if (this.cssStatus === 'processing') {
      return 'Processing';
    } else {
      return 'Drag StyleSheet(.css) file here to retrive all icon names.';
    }
  };

  PackAddController.prototype.iconsInvalid = function() {
    var _ref;
    return !((this.cssStatus === (_ref = this.fontStatus) && _ref === 'success'));
  };

  PackAddController.prototype.pairIcons = function() {
    var glyph, glyphDict, icon, icons, namepair, _i, _j, _len, _len1, _ref, _ref1;
    glyphDict = {};
    _ref = this.icons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      glyph = _ref[_i];
      glyphDict[glyph.svg_unicode] = glyph;
    }
    icons = [];
    _ref1 = this.iconNames;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      namepair = _ref1[_j];
      glyph = glyphDict[namepair.unicode];
      if (glyph) {
        icon = angular.copy(glyph);
        icon.name = namepair.name;
        icons.push(icon);
      }
    }
    return icons;
  };

  PackAddController.prototype.save = function() {
    var icons, info;
    icons = this.pairIcons();
    if (!icons.length > 0) {
      return alert('Unmatched font and css, please upload the correct file!');
    } else {
      info = angular.copy(this.info);
      info.icons = icons;
      return this.$modelManager.addPack(info, (function(_this) {
        return function(pack) {
          _this.$location.path("/pack/" + pack.id);
          return _this.reset();
        };
      })(this));
    }
  };

  PackAddController.prototype.fieldName = function(prefix) {
    return prefix + this.randomFactor;
  };

  function PackAddController($location, $modelManager, $upload) {
    this.$location = $location;
    this.$modelManager = $modelManager;
    this.$upload = $upload;
    this.reset();
  }

  return PackAddController;

})();

module.exports = PackAddController;



},{}],9:[function(require,module,exports){
module.exports = function($scope) {};



},{}],10:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

module.exports = hex_md5;

},{}],11:[function(require,module,exports){
var PackIconDirective;

PackIconDirective = (function() {
  PackIconDirective.prototype._renderIcon = function(icon) {
    return "<div class=\"icon\" data-icon-id=\"" + icon.id + "\">\n  <svg viewBox=\"0 0 1024 1024\">\n    <path d=\"" + icon.svg_d + "\" transform=\"scale(1, -1) translate(" + (512 - (icon.width || 1024) / 2) + ", -896)\"></path>\n  </svg>\n</div>";
  };

  PackIconDirective.prototype.renderIcons = function() {
    var icon, icons;
    icons = this.scope.icons;
    if (icons) {
      this.element.html(((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = icons.length; _i < _len; _i++) {
          icon = icons[_i];
          _results.push(this._renderIcon(icon));
        }
        return _results;
      }).call(this)).join(''));
      return this.element.children().on('click', (function(_this) {
        return function(event) {
          var iconEle, iconId;
          iconEle = angular.element(event.currentTarget);
          iconId = parseInt(iconEle.attr('data-icon-id'));
          if (iconId) {
            return _this.iconClicked(iconId);
          }
        };
      })(this));
    } else {
      return this.element.html('');
    }
  };

  PackIconDirective.prototype.iconWithId = function(id) {
    var icon, _i, _len, _ref;
    _ref = this.scope.icons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      icon = _ref[_i];
      if (icon.id === id) {
        return icon;
      }
    }
  };

  PackIconDirective.prototype.iconClicked = function(id) {
    var icon;
    icon = this.iconWithId(id);
    return this.scope.iconClick({
      icon: icon
    });
  };

  function PackIconDirective(scope, element, attrs) {
    this.scope = scope;
    this.element = element;
    this.attrs = attrs;
    this.renderIcons();
    this.scope.$watchCollection('icons', (function(_this) {
      return function(value) {
        return _this.renderIcons();
      };
    })(this));
  }

  return PackIconDirective;

})();

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      icons: '=',
      iconClick: '&'
    },
    link: function(scope, element, attrs) {
      return scope.packIconCtrl = new PackIconDirective(scope, element, attrs);
    }
  };
};



},{}],12:[function(require,module,exports){
var ModelManger, models;

models = require('./models');

ModelManger = (function() {
  function ModelManger($resource, $q) {
    this.$resource = $resource;
    this.$q = $q;
    this.$models = models(this.$resource);
    this.currentUser = this.$models.User.current();
    this.packs = this.$models.Pack.query();
    this.collections = this.$models.Collection.query();
  }

  ModelManger.prototype.ready = function(callback) {
    return this.$q.all(this.currentUser.$promise, this.packs.$promise, this.collections.promise).then(callback);
  };

  ModelManger.prototype.getPack = function(id, callback) {
    return this.ready((function(_this) {
      return function() {
        var pack, _i, _len, _ref;
        _ref = _this.packs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pack = _ref[_i];
          if (pack.id === id) {
            callback(pack, _this.$models.PackIcon.query({
              pack: pack.id
            }));
            return;
          }
        }
      };
    })(this));
  };

  ModelManger.prototype.getCollection = function(id, callback) {
    return this.ready((function(_this) {
      return function() {
        var collection, _i, _len, _ref;
        _ref = _this.collections;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          collection = _ref[_i];
          if (collection.id === id) {
            callback(collection, _this.$models.CollectionIcon.query({
              collection: collection.id
            }));
            return;
          }
        }
      };
    })(this));
  };

  ModelManger.prototype.addPack = function(pack, callback) {
    var newPack;
    newPack = new this.$models.Pack(pack);
    return newPack.$save((function(_this) {
      return function() {
        _this.packs.push(newPack);
        if (callback) {
          return callback(newPack);
        }
      };
    })(this));
  };

  ModelManger.prototype.addCollection = function(collection, callback) {
    var newCollection;
    newCollection = new this.$models.Collection(collection);
    return newCollection.$save((function(_this) {
      return function() {
        _this.collections.push(newCollection);
        if (callback) {
          return callback(newCollection);
        }
      };
    })(this));
  };

  ModelManger.prototype.addCollectionIcon = function(icon, callback) {
    var newIcon;
    newIcon = new this.$models.CollectionIcon(icon);
    return newIcon.$save((function(_this) {
      return function() {
        if (callback) {
          return callback(newIcon);
        }
      };
    })(this));
  };

  ModelManger.prototype.deleteCollection = function(col) {
    var idx;
    idx = this.collections.indexOf(col);
    this.collections.splice(idx, 1);
    return col.$delete();
  };

  return ModelManger;

})();

module.exports = (function(_this) {
  return function($resource, $q) {
    return new ModelManger($resource, $q);
  };
})(this);



},{"./models":13}],13:[function(require,module,exports){
module.exports = function($resource) {
  return {
    'User': $resource('/accounts/users/:username/', {
      username: '@username'
    }, {
      current: {
        method: 'GET',
        url: '/accounts/users/current/'
      }
    }),
    'Pack': $resource('/packs/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    }),
    'PackIcon': $resource('/packicons/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    }),
    'Collection': $resource('/collections/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      },
      retoken: {
        url: '/collections/:id/retoken/',
        params: {
          id: '@id'
        },
        method: 'POST'
      }
    }),
    'CollectionIcon': $resource('/collectionicons/:id/', {
      id: '@id'
    }, {
      update: {
        method: 'PATCH'
      }
    })
  };
};



},{}],"angular.animate":[function(require,module,exports){
/*
 AngularJS v1.3.0
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(M,f,S){'use strict';f.module("ngAnimate",["ng"]).directive("ngAnimateChildren",function(){return function(T,B,k){k=k.ngAnimateChildren;f.isString(k)&&0===k.length?B.data("$$ngAnimateChildren",!0):T.$watch(k,function(f){B.data("$$ngAnimateChildren",!!f)})}}).factory("$$animateReflow",["$$rAF","$document",function(f,B){return function(k){return f(function(){k()})}}]).config(["$provide","$animateProvider",function(T,B){function k(f){for(var g=0;g<f.length;g++){var k=f[g];if(1==k.nodeType)return k}}
function N(f,g){return k(f)==k(g)}var s=f.noop,g=f.forEach,ba=B.$$selectors,$=f.isArray,ca=f.isString,da=f.isObject,t={running:!0};T.decorator("$animate",["$delegate","$$q","$injector","$sniffer","$rootElement","$$asyncCallback","$rootScope","$document","$templateRequest",function(O,M,I,U,x,C,P,S,V){function A(a,c){var b=a.data("$$ngAnimateState")||{};c&&(b.running=!0,b.structural=!0,a.data("$$ngAnimateState",b));return b.disabled||b.running&&b.structural}function z(a){var c,b=M.defer();b.promise.$$cancelFn=
function(){c&&c()};P.$$postDigest(function(){c=a(function(){b.resolve()})});return b.promise}function J(a){if(da(a))return a.tempClasses&&ca(a.tempClasses)&&(a.tempClasses=a.tempClasses.split(/\s+/)),a}function W(a,c,b){b=b||{};var e={};g(b,function(a,d){g(d.split(" "),function(d){e[d]=a})});var m=Object.create(null);g((a.attr("class")||"").split(/\s+/),function(a){m[a]=!0});var f=[],k=[];g(c.classes,function(a,d){var b=m[d],c=e[d]||{};!1===a?(b||"addClass"==c.event)&&k.push(d):!0===a&&(b&&"removeClass"!=
c.event||f.push(d))});return 0<f.length+k.length&&[f.join(" "),k.join(" ")]}function Q(a){if(a){var c=[],b={};a=a.substr(1).split(".");(U.transitions||U.animations)&&c.push(I.get(ba[""]));for(var e=0;e<a.length;e++){var f=a[e],k=ba[f];k&&!b[f]&&(c.push(I.get(k)),b[f]=!0)}return c}}function R(a,c,b,e){function m(a,d){var b=a[d],c=a["before"+d.charAt(0).toUpperCase()+d.substr(1)];if(b||c)return"leave"==d&&(c=b,b=null),l.push({event:d,fn:b}),H.push({event:d,fn:c}),!0}function k(c,h,G){var w=[];g(c,function(a){a.fn&&
w.push(a)});var f=0;g(w,function(c,n){var u=function(){a:{if(h){(h[n]||s)();if(++f<w.length)break a;h=null}G()}};switch(c.event){case "setClass":h.push(c.fn(a,F,d,u,e));break;case "animate":h.push(c.fn(a,b,e.from,e.to,u));break;case "addClass":h.push(c.fn(a,F||b,u,e));break;case "removeClass":h.push(c.fn(a,d||b,u,e));break;default:h.push(c.fn(a,u,e))}});h&&0===h.length&&G()}var p=a[0];if(p){e&&(e.to=e.to||{},e.from=e.from||{});var F,d;$(b)&&(F=b[0],d=b[1],F?d?b=F+" "+d:(b=F,c="addClass"):(b=d,c="removeClass"));
var h="setClass"==c,G=h||"addClass"==c||"removeClass"==c||"animate"==c,w=a.attr("class")+" "+b;if(X(w)){var u=s,n=[],H=[],q=s,r=[],l=[],w=(" "+w).replace(/\s+/g,".");g(Q(w),function(a){!m(a,c)&&h&&(m(a,"addClass"),m(a,"removeClass"))});return{node:p,event:c,className:b,isClassBased:G,isSetClassOperation:h,applyStyles:function(){e&&a.css(f.extend(e.from||{},e.to||{}))},before:function(a){u=a;k(H,n,function(){u=s;a()})},after:function(a){q=a;k(l,r,function(){q=s;a()})},cancel:function(){n&&(g(n,function(a){(a||
s)(!0)}),u(!0));r&&(g(r,function(a){(a||s)(!0)}),q(!0))}}}}}function y(a,c,b,e,m,k,p,F){function d(d){var h="$animate:"+d;H&&H[h]&&0<H[h].length&&C(function(){b.triggerHandler(h,{event:a,className:c})})}function h(){d("before")}function G(){d("after")}function w(){w.hasBeenRun||(w.hasBeenRun=!0,k())}function u(){if(!u.hasBeenRun){n&&n.applyStyles();u.hasBeenRun=!0;p&&p.tempClasses&&g(p.tempClasses,function(a){b.removeClass(a)});var h=b.data("$$ngAnimateState");h&&(n&&n.isClassBased?l(b,c):(C(function(){var d=
b.data("$$ngAnimateState")||{};v==d.index&&l(b,c,a)}),b.data("$$ngAnimateState",h)));d("close");F()}}var n=R(b,a,c,p);if(!n)return w(),h(),G(),u(),s;a=n.event;c=n.className;var H=f.element._data(n.node),H=H&&H.events;e||(e=m?m.parent():b.parent());if(Y(b,e))return w(),h(),G(),u(),s;e=b.data("$$ngAnimateState")||{};var q=e.active||{},r=e.totalActive||0,t=e.last;m=!1;if(0<r){r=[];if(n.isClassBased)"setClass"==t.event?(r.push(t),l(b,c)):q[c]&&(aa=q[c],aa.event==a?m=!0:(r.push(aa),l(b,c)));else if("leave"==
a&&q["ng-leave"])m=!0;else{for(var aa in q)r.push(q[aa]);e={};l(b,!0)}0<r.length&&g(r,function(a){a.cancel()})}!n.isClassBased||n.isSetClassOperation||"animate"==a||m||(m="addClass"==a==b.hasClass(c));if(m)return w(),h(),G(),d("close"),F(),s;q=e.active||{};r=e.totalActive||0;if("leave"==a)b.one("$destroy",function(a){a=f.element(this);var d=a.data("$$ngAnimateState");d&&(d=d.active["ng-leave"])&&(d.cancel(),l(a,"ng-leave"))});b.addClass("ng-animate");p&&p.tempClasses&&g(p.tempClasses,function(a){b.addClass(a)});
var v=Z++;r++;q[c]=n;b.data("$$ngAnimateState",{last:n,active:q,index:v,totalActive:r});h();n.before(function(d){var h=b.data("$$ngAnimateState");d=d||!h||!h.active[c]||n.isClassBased&&h.active[c].event!=a;w();!0===d?u():(G(),n.after(u))});return n.cancel}function K(a){if(a=k(a))a=f.isFunction(a.getElementsByClassName)?a.getElementsByClassName("ng-animate"):a.querySelectorAll(".ng-animate"),g(a,function(a){a=f.element(a);(a=a.data("$$ngAnimateState"))&&a.active&&g(a.active,function(a){a.cancel()})})}
function l(a,c){if(N(a,x))t.disabled||(t.running=!1,t.structural=!1);else if(c){var b=a.data("$$ngAnimateState")||{},e=!0===c;!e&&b.active&&b.active[c]&&(b.totalActive--,delete b.active[c]);if(e||!b.totalActive)a.removeClass("ng-animate"),a.removeData("$$ngAnimateState")}}function Y(a,c){if(t.disabled)return!0;if(N(a,x))return t.running;var b,e,k;do{if(0===c.length)break;var g=N(c,x),p=g?t:c.data("$$ngAnimateState")||{};if(p.disabled)return!0;g&&(k=!0);!1!==b&&(g=c.data("$$ngAnimateChildren"),f.isDefined(g)&&
(b=g));e=e||p.running||p.last&&!p.last.isClassBased}while(c=c.parent());return!k||!b&&e}x.data("$$ngAnimateState",t);var L=P.$watch(function(){return V.totalPendingRequests},function(a,c){0===a&&(L(),P.$$postDigest(function(){P.$$postDigest(function(){t.running=!1})}))}),Z=0,E=B.classNameFilter(),X=E?function(a){return E.test(a)}:function(){return!0};return{animate:function(a,c,b,e,g){e=e||"ng-inline-animate";g=J(g)||{};g.from=b?c:null;g.to=b?b:c;return z(function(b){return y("animate",e,f.element(k(a)),
null,null,s,g,b)})},enter:function(a,c,b,e){e=J(e);a=f.element(a);c=c&&f.element(c);b=b&&f.element(b);A(a,!0);O.enter(a,c,b);return z(function(g){return y("enter","ng-enter",f.element(k(a)),c,b,s,e,g)})},leave:function(a,c){c=J(c);a=f.element(a);K(a);A(a,!0);return z(function(b){return y("leave","ng-leave",f.element(k(a)),null,null,function(){O.leave(a)},c,b)})},move:function(a,c,b,e){e=J(e);a=f.element(a);c=c&&f.element(c);b=b&&f.element(b);K(a);A(a,!0);O.move(a,c,b);return z(function(g){return y("move",
"ng-move",f.element(k(a)),c,b,s,e,g)})},addClass:function(a,c,b){return this.setClass(a,c,[],b)},removeClass:function(a,c,b){return this.setClass(a,[],c,b)},setClass:function(a,c,b,e){e=J(e);a=f.element(a);a=f.element(k(a));if(A(a))return O.$$setClassImmediately(a,c,b,e);var m,l=a.data("$$animateClasses"),p=!!l;l||(l={classes:{}});m=l.classes;c=$(c)?c:c.split(" ");g(c,function(a){a&&a.length&&(m[a]=!0)});b=$(b)?b:b.split(" ");g(b,function(a){a&&a.length&&(m[a]=!1)});if(p)return e&&l.options&&(l.options=
f.extend(l.options||{},e)),l.promise;a.data("$$animateClasses",l={classes:m,options:e});return l.promise=z(function(b){var d=a.parent(),h=k(a),c=h.parentNode;if(!c||c.$$NG_REMOVED||h.$$NG_REMOVED)b();else{h=a.data("$$animateClasses");a.removeData("$$animateClasses");var c=a.data("$$ngAnimateState")||{},e=W(a,h,c.active);return e?y("setClass",e,a,d,null,function(){e[0]&&O.$$addClassImmediately(a,e[0]);e[1]&&O.$$removeClassImmediately(a,e[1])},h.options,b):b()}})},cancel:function(a){a.$$cancelFn()},
enabled:function(a,c){switch(arguments.length){case 2:if(a)l(c);else{var b=c.data("$$ngAnimateState")||{};b.disabled=!0;c.data("$$ngAnimateState",b)}break;case 1:t.disabled=!a;break;default:a=!t.disabled}return!!a}}}]);B.register("",["$window","$sniffer","$timeout","$$animateReflow",function(t,B,I,U){function x(){e||(e=U(function(){b=[];e=null;a={}}))}function C(c,d){e&&e();b.push(d);e=U(function(){g(b,function(a){a()});b=[];e=null;a={}})}function P(a,d){var h=k(a);a=f.element(h);p.push(a);h=Date.now()+
d;h<=N||(I.cancel(m),N=h,m=I(function(){T(p);p=[]},d,!1))}function T(a){g(a,function(a){(a=a.data("$$ngAnimateCSS3Data"))&&g(a.closeAnimationFns,function(a){a()})})}function V(b,d){var h=d?a[d]:null;if(!h){var c=0,e=0,f=0,k=0;g(b,function(a){if(1==a.nodeType){a=t.getComputedStyle(a)||{};c=Math.max(A(a[L+"Duration"]),c);e=Math.max(A(a[L+"Delay"]),e);k=Math.max(A(a[E+"Delay"]),k);var d=A(a[E+"Duration"]);0<d&&(d*=parseInt(a[E+"IterationCount"],10)||1);f=Math.max(d,f)}});h={total:0,transitionDelay:e,
transitionDuration:c,animationDelay:k,animationDuration:f};d&&(a[d]=h)}return h}function A(a){var d=0;a=ca(a)?a.split(/\s*,\s*/):[];g(a,function(a){d=Math.max(parseFloat(a)||0,d)});return d}function z(b,d,h,e){b=0<=["ng-enter","ng-leave","ng-move"].indexOf(h);var f,g=d.parent(),n=g.data("$$ngAnimateKey");n||(g.data("$$ngAnimateKey",++c),n=c);f=n+"-"+k(d).getAttribute("class");var g=f+" "+h,n=a[g]?++a[g].total:0,l={};if(0<n){var q=h+"-stagger",l=f+" "+q;(f=!a[l])&&d.addClass(q);l=V(d,l);f&&d.removeClass(q)}d.addClass(h);
var q=d.data("$$ngAnimateCSS3Data")||{},r=V(d,g);f=r.transitionDuration;r=r.animationDuration;if(b&&0===f&&0===r)return d.removeClass(h),!1;h=e||b&&0<f;b=0<r&&0<l.animationDelay&&0===l.animationDuration;d.data("$$ngAnimateCSS3Data",{stagger:l,cacheKey:g,running:q.running||0,itemIndex:n,blockTransition:h,closeAnimationFns:q.closeAnimationFns||[]});g=k(d);h&&(W(g,!0),e&&d.css(e));b&&(g.style[E+"PlayState"]="paused");return!0}function J(a,d,b,c,e){function f(){d.off(C,l);d.removeClass(q);d.removeClass(r);
z&&I.cancel(z);K(d,b);var a=k(d),c;for(c in p)a.style.removeProperty(p[c])}function l(a){a.stopPropagation();var d=a.originalEvent||a;a=d.$manualTimeStamp||d.timeStamp||Date.now();d=parseFloat(d.elapsedTime.toFixed(3));Math.max(a-B,0)>=A&&d>=x&&c()}var m=k(d);a=d.data("$$ngAnimateCSS3Data");if(-1!=m.getAttribute("class").indexOf(b)&&a){var q="",r="";g(b.split(" "),function(a,d){var b=(0<d?" ":"")+a;q+=b+"-active";r+=b+"-pending"});var p=[],t=a.itemIndex,v=a.stagger,s=0;if(0<t){s=0;0<v.transitionDelay&&
0===v.transitionDuration&&(s=v.transitionDelay*t);var y=0;0<v.animationDelay&&0===v.animationDuration&&(y=v.animationDelay*t,p.push(Y+"animation-play-state"));s=Math.round(100*Math.max(s,y))/100}s||(d.addClass(q),a.blockTransition&&W(m,!1));var D=V(d,a.cacheKey+" "+q),x=Math.max(D.transitionDuration,D.animationDuration);if(0===x)d.removeClass(q),K(d,b),c();else{!s&&e&&(D.transitionDuration||(d.css("transition",D.animationDuration+"s linear all"),p.push("transition")),d.css(e));var t=Math.max(D.transitionDelay,
D.animationDelay),A=1E3*t;0<p.length&&(v=m.getAttribute("style")||"",";"!==v.charAt(v.length-1)&&(v+=";"),m.setAttribute("style",v+" "));var B=Date.now(),C=X+" "+Z,t=1E3*(s+1.5*(t+x)),z;0<s&&(d.addClass(r),z=I(function(){z=null;0<D.transitionDuration&&W(m,!1);0<D.animationDuration&&(m.style[E+"PlayState"]="");d.addClass(q);d.removeClass(r);e&&(0===D.transitionDuration&&d.css("transition",D.animationDuration+"s linear all"),d.css(e),p.push("transition"))},1E3*s,!1));d.on(C,l);a.closeAnimationFns.push(function(){f();
c()});a.running++;P(d,t);return f}}else c()}function W(a,d){a.style[L+"Property"]=d?"none":""}function Q(a,d,b,c){if(z(a,d,b,c))return function(a){a&&K(d,b)}}function R(a,d,b,c,e){if(d.data("$$ngAnimateCSS3Data"))return J(a,d,b,c,e);K(d,b);c()}function y(a,d,b,c,e){var f=Q(a,d,b,e.from);if(f){var g=f;C(d,function(){g=R(a,d,b,c,e.to)});return function(a){(g||s)(a)}}x();c()}function K(a,d){a.removeClass(d);var b=a.data("$$ngAnimateCSS3Data");b&&(b.running&&b.running--,b.running&&0!==b.running||a.removeData("$$ngAnimateCSS3Data"))}
function l(a,d){var b="";a=$(a)?a:a.split(/\s+/);g(a,function(a,c){a&&0<a.length&&(b+=(0<c?" ":"")+a+d)});return b}var Y="",L,Z,E,X;M.ontransitionend===S&&M.onwebkittransitionend!==S?(Y="-webkit-",L="WebkitTransition",Z="webkitTransitionEnd transitionend"):(L="transition",Z="transitionend");M.onanimationend===S&&M.onwebkitanimationend!==S?(Y="-webkit-",E="WebkitAnimation",X="webkitAnimationEnd animationend"):(E="animation",X="animationend");var a={},c=0,b=[],e,m=null,N=0,p=[];return{animate:function(a,
d,b,c,e,f){f=f||{};f.from=b;f.to=c;return y("animate",a,d,e,f)},enter:function(a,b,c){c=c||{};return y("enter",a,"ng-enter",b,c)},leave:function(a,b,c){c=c||{};return y("leave",a,"ng-leave",b,c)},move:function(a,b,c){c=c||{};return y("move",a,"ng-move",b,c)},beforeSetClass:function(a,b,c,e,f){f=f||{};b=l(c,"-remove")+" "+l(b,"-add");if(f=Q("setClass",a,b,f.from))return C(a,e),f;x();e()},beforeAddClass:function(a,b,c,e){e=e||{};if(b=Q("addClass",a,l(b,"-add"),e.from))return C(a,c),b;x();c()},beforeRemoveClass:function(a,
b,c,e){e=e||{};if(b=Q("removeClass",a,l(b,"-remove"),e.from))return C(a,c),b;x();c()},setClass:function(a,b,c,e,f){f=f||{};c=l(c,"-remove");b=l(b,"-add");return R("setClass",a,c+" "+b,e,f.to)},addClass:function(a,b,c,e){e=e||{};return R("addClass",a,l(b,"-add"),c,e.to)},removeClass:function(a,b,c,e){e=e||{};return R("removeClass",a,l(b,"-remove"),c,e.to)}}}])}])})(window,window.angular);
//# sourceMappingURL=angular-animate.min.js.map

},{}],"angular.aria":[function(require,module,exports){
/*
 AngularJS v1.3.0
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(h,k,p){'use strict';h=["$aria",function(c){return function(e,f,a){c.config("tabindex")&&!f.attr("tabindex")&&f.attr("tabindex",0)}}];k.module("ngAria",["ng"]).provider("$aria",function(){function c(a){return a.replace(/-./g,function(b,a){return b[1].toUpperCase()})}function e(a,b,g){var d=c(b);return function(c,e,l){f[d]&&!l[d]&&c.$watch(l[a],function(a){g&&(a=!a);e.attr(b,a)})}}var f={ariaHidden:!0,ariaChecked:!0,ariaDisabled:!0,ariaRequired:!0,ariaInvalid:!0,ariaMultiline:!0,ariaValue:!0,
tabindex:!0};this.config=function(a){f=k.extend(f,a)};this.$get=function(){return{config:function(a){return f[c(a)]},$$watchExpr:e}}}).directive("ngShow",["$aria",function(c){return c.$$watchExpr("ngShow","aria-hidden",!0)}]).directive("ngHide",["$aria",function(c){return c.$$watchExpr("ngHide","aria-hidden",!1)}]).directive("ngModel",["$aria",function(c){function e(a,b){return c.config(a)&&!b.attr(a)}function f(a,b){var c=a.type,d=a.role;return"checkbox"===(c||d)||"menuitemcheckbox"===d?"checkbox":
"radio"===(c||d)||"menuitemradio"===d?"radio":"range"===c||"progressbar"===d||"slider"===d?"range":"textbox"===(c||d)||"TEXTAREA"===b[0].nodeName?"multiline":""}return{restrict:"A",require:"?ngModel",link:function(a,b,g,d){function h(){return d.$modelValue}function k(){return m?(m=!1,function(a){a=a===g.value;b.attr("aria-checked",a);b.attr("tabindex",0-!a)}):function(a){b.attr("aria-checked",a===g.value)}}function l(a){b.attr("aria-checked",!!a)}var n=f(g,b),m=e("tabindex",b);switch(n){case "radio":case "checkbox":e("aria-checked",
b)&&a.$watch(h,"radio"===n?k():l);break;case "range":c.config("ariaValue")&&(g.min&&!b.attr("aria-valuemin")&&b.attr("aria-valuemin",g.min),g.max&&!b.attr("aria-valuemax")&&b.attr("aria-valuemax",g.max),b.attr("aria-valuenow")||a.$watch(h,function(a){b.attr("aria-valuenow",a)}));break;case "multiline":e("aria-multiline",b)&&b.attr("aria-multiline",!0)}m&&b.attr("tabindex",0);d.$validators.required&&e("aria-required",b)&&a.$watch(function(){return d.$error.required},function(a){b.attr("aria-required",
!!a)});e("aria-invalid",b)&&a.$watch(function(){return d.$invalid},function(a){b.attr("aria-invalid",!!a)})}}}]).directive("ngDisabled",["$aria",function(c){return c.$$watchExpr("ngDisabled","aria-disabled")}]).directive("ngClick",h).directive("ngDblclick",h)})(window,window.angular);
//# sourceMappingURL=angular-aria.min.js.map

},{}],"angular.fileuploadshim":[function(require,module,exports){
/*! 1.6.12 */
!function(){var a=function(){try{var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(a)return!0}catch(b){if(void 0!=navigator.mimeTypes["application/x-shockwave-flash"])return!0}return!1},b=function(a,b){window.XMLHttpRequest.prototype[a]=b(window.XMLHttpRequest.prototype[a])};if(window.XMLHttpRequest){if(!window.FormData||window.FileAPI&&FileAPI.forceLoad){var c=function(a){if(!a.__listeners){a.upload||(a.upload={}),a.__listeners=[];var b=a.upload.addEventListener;a.upload.addEventListener=function(c,d){a.__listeners[c]=d,b&&b.apply(this,arguments)}}};b("open",function(a){return function(b,d,e){c(this),this.__url=d;try{a.apply(this,[b,d,e])}catch(f){f.message.indexOf("Access is denied")>-1&&a.apply(this,[b,"_fix_for_ie_crossdomain__",e])}}}),b("getResponseHeader",function(a){return function(b){return this.__fileApiXHR&&this.__fileApiXHR.getResponseHeader?this.__fileApiXHR.getResponseHeader(b):null==a?null:a.apply(this,[b])}}),b("getAllResponseHeaders",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.getAllResponseHeaders?this.__fileApiXHR.getAllResponseHeaders():null==a?null:a.apply(this)}}),b("abort",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.abort?this.__fileApiXHR.abort():null==a?null:a.apply(this)}}),b("setRequestHeader",function(a){return function(b,d){if("__setXHR_"===b){c(this);var e=d(this);e instanceof Function&&e(this)}else this.__requestHeaders=this.__requestHeaders||{},this.__requestHeaders[b]=d,a.apply(this,arguments)}}),b("send",function(b){return function(){var c=this;if(arguments[0]&&arguments[0].__isShim){var d=arguments[0],e={url:c.__url,jsonp:!1,cache:!0,complete:function(a,b){c.__completed=!0,!a&&c.__listeners.load&&c.__listeners.load({type:"load",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),!a&&c.__listeners.loadend&&c.__listeners.loadend({type:"loadend",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),"abort"===a&&c.__listeners.abort&&c.__listeners.abort({type:"abort",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),void 0!==b.status&&Object.defineProperty(c,"status",{get:function(){return 0==b.status&&a&&"abort"!==a?500:b.status}}),void 0!==b.statusText&&Object.defineProperty(c,"statusText",{get:function(){return b.statusText}}),Object.defineProperty(c,"readyState",{get:function(){return 4}}),void 0!==b.response&&Object.defineProperty(c,"response",{get:function(){return b.response}});var d=b.responseText||(a&&0==b.status&&"abort"!==a?a:void 0);Object.defineProperty(c,"responseText",{get:function(){return d}}),Object.defineProperty(c,"response",{get:function(){return d}}),a&&Object.defineProperty(c,"err",{get:function(){return a}}),c.__fileApiXHR=b,c.onreadystatechange&&c.onreadystatechange()},fileprogress:function(a){if(a.target=c,c.__listeners.progress&&c.__listeners.progress(a),c.__total=a.total,c.__loaded=a.loaded,a.total===a.loaded){var b=this;setTimeout(function(){c.__completed||(c.getAllResponseHeaders=function(){},b.complete(null,{status:204,statusText:"No Content"}))},1e4)}},headers:c.__requestHeaders};e.data={},e.files={};for(var f=0;f<d.data.length;f++){var g=d.data[f];null!=g.val&&null!=g.val.name&&null!=g.val.size&&null!=g.val.type?e.files[g.key]=g.val:e.data[g.key]=g.val}setTimeout(function(){if(!a())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';c.__fileApiXHR=FileAPI.upload(e)},1)}else b.apply(c,arguments)}})}else b("setRequestHeader",function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}});window.XMLHttpRequest.__isShim=!0}if(!window.FormData||window.FileAPI&&FileAPI.forceLoad){var d=function(b){if(!a())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';var c=angular.element(b);if(!(c.attr("disabled")||c.hasClass("js-fileapi-wrapper")||null==b.getAttribute("ng-file-select")&&null==b.getAttribute("data-ng-file-select")))if(FileAPI.wrapInsideDiv){var d=document.createElement("div");d.innerHTML='<div class="js-fileapi-wrapper" style="position:relative; overflow:hidden"></div>',d=d.firstChild;var e=b.parentNode;e.insertBefore(d,b),e.removeChild(b),d.appendChild(b)}else c.addClass("js-fileapi-wrapper"),c.parent()[0].__file_click_fn_delegate_&&((""===c.parent().css("position")||"static"===c.parent().css("position"))&&c.parent().css("position","relative"),c.css("top",0).css("bottom",0).css("left",0).css("right",0).css("width","100%").css("height","100%").css("padding",0).css("margin",0),c.parent().unbind("click",c.parent()[0].__file_click_fn_delegate_))},e=function(a){return function(b){for(var c=FileAPI.getFiles(b),d=0;d<c.length;d++)void 0===c[d].size&&(c[d].size=0),void 0===c[d].name&&(c[d].name="file"),void 0===c[d].type&&(c[d].type="undefined");b.target||(b.target={}),b.target.files=c,b.target.files!=c&&(b.__files_=c),(b.__files_||b.target.files).item=function(a){return(b.__files_||b.target.files)[a]||null},a&&a.apply(this,[b])}},f=function(a,b){return("change"===b.toLowerCase()||"onchange"===b.toLowerCase())&&"file"==a.getAttribute("type")};HTMLInputElement.prototype.addEventListener&&(HTMLInputElement.prototype.addEventListener=function(a){return function(b,c,g,h){f(this,b)?(d(this),a.apply(this,[b,e(c),g,h])):a.apply(this,[b,c,g,h])}}(HTMLInputElement.prototype.addEventListener)),HTMLInputElement.prototype.attachEvent&&(HTMLInputElement.prototype.attachEvent=function(a){return function(b,c){f(this,b)?(d(this),window.jQuery?angular.element(this).bind("change",e(null)):a.apply(this,[b,e(c)])):a.apply(this,[b,c])}}(HTMLInputElement.prototype.attachEvent)),window.FormData=FormData=function(){return{append:function(a,b,c){this.data.push({key:a,val:b,name:c})},data:[],__isShim:!0}},function(){if(window.FileAPI||(window.FileAPI={}),FileAPI.forceLoad&&(FileAPI.html5=!1),!FileAPI.upload){var b,c,d,e,f,g=document.createElement("script"),h=document.getElementsByTagName("script");if(window.FileAPI.jsUrl)b=window.FileAPI.jsUrl;else if(window.FileAPI.jsPath)c=window.FileAPI.jsPath;else for(d=0;d<h.length;d++)if(f=h[d].src,e=f.indexOf("angular-file-upload-shim.js"),-1==e&&(e=f.indexOf("angular-file-upload-shim.min.js")),e>-1){c=f.substring(0,e);break}null==FileAPI.staticPath&&(FileAPI.staticPath=c),g.setAttribute("src",b||c+"FileAPI.min.js"),document.getElementsByTagName("head")[0].appendChild(g),FileAPI.hasFlash=a()}}(),FileAPI.disableFileInput=function(a,b){b?a.removeClass("js-fileapi-wrapper"):a.addClass("js-fileapi-wrapper")}}window.FileReader||(window.FileReader=function(){var a=this,b=!1;this.listeners={},this.addEventListener=function(b,c){a.listeners[b]=a.listeners[b]||[],a.listeners[b].push(c)},this.removeEventListener=function(b,c){a.listeners[b]&&a.listeners[b].splice(a.listeners[b].indexOf(c),1)},this.dispatchEvent=function(b){var c=a.listeners[b.type];if(c)for(var d=0;d<c.length;d++)c[d].call(a,b)},this.onabort=this.onerror=this.onload=this.onloadstart=this.onloadend=this.onprogress=null;var c=function(b,c){var d={type:b,target:a,loaded:c.loaded,total:c.total,error:c.error};return null!=c.result&&(d.target.result=c.result),d},d=function(d){if(b||(b=!0,a.onloadstart&&this.onloadstart(c("loadstart",d))),"load"===d.type){a.onloadend&&a.onloadend(c("loadend",d));var e=c("load",d);a.onload&&a.onload(e),a.dispatchEvent(e)}else if("progress"===d.type){var e=c("progress",d);a.onprogress&&a.onprogress(e),a.dispatchEvent(e)}else{var e=c("error",d);a.onerror&&a.onerror(e),a.dispatchEvent(e)}};this.readAsArrayBuffer=function(a){FileAPI.readAsBinaryString(a,d)},this.readAsBinaryString=function(a){FileAPI.readAsBinaryString(a,d)},this.readAsDataURL=function(a){FileAPI.readAsDataURL(a,d)},this.readAsText=function(a){FileAPI.readAsText(a,d)}})}();
},{}],"angular.fileupload":[function(require,module,exports){
/*! 1.6.12 */
!function(){var a=angular.module("angularFileUpload",[]);a.service("$upload",["$http","$q","$timeout",function(a,b,c){function d(d){d.method=d.method||"POST",d.headers=d.headers||{},d.transformRequest=d.transformRequest||function(b,c){return window.ArrayBuffer&&b instanceof window.ArrayBuffer?b:a.defaults.transformRequest[0](b,c)};var e=b.defer();window.XMLHttpRequest.__isShim&&(d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){e.notify(a)},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&e.notify(a)},!1))}}),a(d).then(function(a){e.resolve(a)},function(a){e.reject(a)},function(a){e.notify(a)});var f=e.promise;return f.success=function(a){return f.then(function(b){a(b.data,b.status,b.headers,d)}),f},f.error=function(a){return f.then(null,function(b){a(b.data,b.status,b.headers,d)}),f},f.progress=function(a){return f.then(null,null,function(b){a(b)}),f},f.abort=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),f},f.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(f,arguments),a.apply(f,arguments)}}(d.xhrFn),f},f}this.upload=function(b){b.headers=b.headers||{},b.headers["Content-Type"]=void 0,b.transformRequest=b.transformRequest||a.defaults.transformRequest;var c=new FormData,e=b.transformRequest,f=b.data;return b.transformRequest=function(a,c){if(f)if(b.formDataAppender)for(var d in f){var g=f[d];b.formDataAppender(a,d,g)}else for(var d in f){var g=f[d];if("function"==typeof e)g=e(g,c);else for(var h=0;h<e.length;h++){var i=e[h];"function"==typeof i&&(g=i(g,c))}a.append(d,g)}if(null!=b.file){var j=b.fileFormDataName||"file";if("[object Array]"===Object.prototype.toString.call(b.file))for(var k="[object String]"===Object.prototype.toString.call(j),h=0;h<b.file.length;h++)a.append(k?j:j[h],b.file[h],b.fileName&&b.fileName[h]||b.file[h].name);else a.append(j,b.file,b.fileName||b.file.name)}return a},b.data=c,d(b)},this.http=function(a){return d(a)}}]),a.directive("ngFileSelect",["$parse","$timeout",function(a,b){return function(c,d,e){var f=a(e.ngFileSelect);if("input"!==d[0].tagName.toLowerCase()||"file"!==(d.attr("type")&&d.attr("type").toLowerCase())){for(var g=angular.element('<input type="file">'),h=d[0].attributes,i=0;i<h.length;i++)"type"!==h[i].name.toLowerCase()&&g.attr(h[i].name,h[i].value);e.multiple&&g.attr("multiple","true"),g.css("width","1px").css("height","1px").css("opacity",0).css("position","absolute").css("filter","alpha(opacity=0)").css("padding",0).css("margin",0).css("overflow","hidden"),g.attr("__wrapper_for_parent_",!0),d.append(g),d[0].__file_click_fn_delegate_=function(){g[0].click()},d.bind("click",d[0].__file_click_fn_delegate_),d.css("overflow","hidden"),d=g}d.bind("change",function(a){var d,e,g=[];if(d=a.__files_||a.target.files,null!=d)for(e=0;e<d.length;e++)g.push(d.item(e));b(function(){f(c,{$files:g,$event:a})})})}}]),a.directive("ngFileDropAvailable",["$parse","$timeout",function(a,b){return function(c,d,e){if("draggable"in document.createElement("span")){var f=a(e.ngFileDropAvailable);b(function(){f(c)})}}}]),a.directive("ngFileDrop",["$parse","$timeout","$location",function(a,b,c){return function(d,e,f){function g(a){return/^[\000-\177]*$/.test(a)}function h(a,d){var e=[],f=a.dataTransfer.items;if(f&&f.length>0&&f[0].webkitGetAsEntry&&"file"!=c.protocol()&&f[0].webkitGetAsEntry().isDirectory)for(var h=0;h<f.length;h++){var j=f[h].webkitGetAsEntry();null!=j&&(g(j.name)?i(e,j):f[h].webkitGetAsEntry().isDirectory||e.push(f[h].getAsFile()))}else{var k=a.dataTransfer.files;if(null!=k)for(var h=0;h<k.length;h++)e.push(k.item(h))}!function m(a){b(function(){l?m(10):d(e)},a||0)}()}function i(a,b,c){if(null!=b)if(b.isDirectory){var d=b.createReader();l++,d.readEntries(function(d){for(var e=0;e<d.length;e++)i(a,d[e],(c?c:"")+b.name+"/");l--})}else l++,b.file(function(b){l--,b._relativePath=(c?c:"")+b.name,a.push(b)})}if("draggable"in document.createElement("span")){var j=null;e[0].addEventListener("dragover",function(c){if(c.preventDefault(),b.cancel(j),!e[0].__drag_over_class_)if(f.ngFileDragOverClass&&f.ngFileDragOverClass.search(/\) *$/)>-1){var g=a(f.ngFileDragOverClass)(d,{$event:c});e[0].__drag_over_class_=g}else e[0].__drag_over_class_=f.ngFileDragOverClass||"dragover";e.addClass(e[0].__drag_over_class_)},!1),e[0].addEventListener("dragenter",function(a){a.preventDefault()},!1),e[0].addEventListener("dragleave",function(){j=b(function(){e.removeClass(e[0].__drag_over_class_),e[0].__drag_over_class_=null},f.ngFileDragOverDelay||1)},!1);var k=a(f.ngFileDrop);e[0].addEventListener("drop",function(a){a.preventDefault(),e.removeClass(e[0].__drag_over_class_),e[0].__drag_over_class_=null,h(a,function(b){k(d,{$files:b,$event:a})})},!1);var l=0}}}])}();
},{}],"angular.loadingbar":[function(require,module,exports){
/*! 
 * angular-loading-bar v0.6.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","cfpLoadingBar",function(b,c,d,e,f){function g(){d.cancel(i),f.complete(),k=0,j=0}function h(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var i,j=0,k=0,l=f.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||h(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===j&&(i=d(function(){f.start()},l)),j++,f.set(k/j)),a},response:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),a},responseError:function(a){return a.config.ignoreLoadingBar||h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),b.reject(a)}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){k||(k=a.get("$animate"));var e=b.find(n).eq(0);c.cancel(m),r||(d.$broadcast("cfpLoadingBar:started"),r=!0,u&&k.enter(o,e),t&&k.enter(q,e),f(v))}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,c.cancel(l),l=c(function(){g()},250)}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.includeSpinner,u=this.includeBar,v=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
},{}],"angular.material":[function(require,module,exports){
!function(){angular.module("ngMaterial",["ng","ngAnimate","ngAria","material.core","material.decorators","material.animations","material.components.backdrop","material.components.bottomSheet","material.components.button","material.components.card","material.components.checkbox","material.components.content","material.components.dialog","material.components.divider","material.components.icon","material.components.list","material.components.progressCircular","material.components.progressLinear","material.components.radioButton","material.components.sidenav","material.components.slider","material.components.sticky","material.components.subheader","material.components.swipe","material.components.switch","material.components.tabs","material.components.textField","material.components.toast","material.components.toolbar","material.components.tooltip","material.components.whiteframe","material.services.aria","material.services.attrBind","material.services.compiler","material.services.interimElement","material.services.media","material.services.registry","material.services.theming"])}(),function(){angular.module("material.core",[]).run(function(){if("undefined"==typeof Hammer)throw new Error("ngMaterial requires HammerJS to be preloaded.")})}(),function(){angular.module("material.core").constant("$mdConstant",{KEY_CODE:{ENTER:13,ESCAPE:27,SPACE:32,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40}})}(),function(){angular.module("material.core").factory("$mdUtil",["$cacheFactory",function(e){function t(e,t){function n(){return[].concat($)}function i(){return $.length}function r(e){return $.length&&e>-1&&e<$.length}function a(e){return e?r(d(e)+1):!1}function o(e){return e?r(d(e)-1):!1}function c(e){return r(e)?$[e]:null}function l(e,t){return $.filter(function(n){return n[e]===t})}function s(e,t){return e?(angular.isNumber(t)||(t=$.length),$.splice(t,0,e),d(e)):-1}function u(e){m(e)&&$.splice(d(e),1)}function d(e){return $.indexOf(e)}function m(e){return e&&d(e)>-1}function f(e,n){if(n=n||g,m(e)){var i=d(e)+1,a=r(i)?$[i]:t?v():null;return n(a)?a:f(a,n)}return null}function p(e,n){if(n=n||g,m(e)){var i=d(e)-1,a=r(i)?$[i]:t?h():null;return n(a)?a:p(a,n)}return null}function v(){return $.length?$[0]:null}function h(){return $.length?$[$.length-1]:null}var g=function(){return!0};t=!!t;var $=e||[];return{items:n,count:i,inRange:r,contains:m,indexOf:d,itemAt:c,findBy:l,add:s,remove:u,first:v,last:h,next:f,previous:p,hasPrevious:o,hasNext:a}}function n(t,n){var i=e(t,n),r={};return i._put=i.put,i.put=function(e,t){return r[e]=!0,i._put(e,t)},i._remove=i.remove,i.remove=function(e){return delete r[e],i._remove(e)},i.keys=function(){return Object.keys(r)},i}var i,r=/([\:\-\_]+(.))/g,a=["0","0","0"];return i={now:window.performance?angular.bind(window.performance,window.performance.now):Date.now,ancestorHasAttribute:function(e,t,n){n=n||4;for(var i=e;n--&&i.length;){if(i[0].hasAttribute&&i[0].hasAttribute(t))return!0;i=i.parent()}return!1},isParentDisabled:function(e,t){return i.ancestorHasAttribute(e,"disabled",t)},elementIsSibling:function(e,t){return e.parent().length&&e.parent()[0]===t.parent()[0]},camelCase:function(e){return e.replace(r,function(e,t,n,i){return i?n.toUpperCase():n})},stringFromTextBody:function(e,t){var n=e.trim();return n.split(/\s+/).length>t&&(n=e.split(/\s+/).slice(1,t+1).join(" ")+"..."),n},iterator:t,cacheFactory:n,debounce:function(e,t,n){var i;return function(){var r=this,a=arguments;clearTimeout(i),i=setTimeout(function(){i=null,n||e.apply(r,a)},t),n&&!i&&e.apply(r,a)}},throttle:function(e,t){var n;return function(){var r=this,a=arguments,o=i.now();(!n||n-o>t)&&(e.apply(r,a),n=o)}},wrap:function(e,t,n){e.hasOwnProperty(0)&&(e=e[0]);var i=document.createElement(t);return i.className+=n,i.appendChild(e.parentNode.replaceChild(i,e)),angular.element(i)},nextUid:function(){for(var e,t=a.length;t;){if(t--,e=a[t].charCodeAt(0),57==e)return a[t]="A",a.join("");if(90!=e)return a[t]=String.fromCharCode(e+1),a.join("");a[t]="0"}return a.unshift("0"),a.join("")},disconnectScope:function(e){if(e&&e.$root!==e&&!e.$$destroyed){var t=e.$parent;e.$$disconnected=!0,t.$$childHead===e&&(t.$$childHead=e.$$nextSibling),t.$$childTail===e&&(t.$$childTail=e.$$prevSibling),e.$$prevSibling&&(e.$$prevSibling.$$nextSibling=e.$$nextSibling),e.$$nextSibling&&(e.$$nextSibling.$$prevSibling=e.$$prevSibling),e.$$nextSibling=e.$$prevSibling=null}},reconnectScope:function(e){if(e&&e.$root!==e&&e.$$disconnected){var t=e,n=t.$parent;t.$$disconnected=!1,t.$$prevSibling=n.$$childTail,n.$$childHead?(n.$$childTail.$$nextSibling=t,n.$$childTail=t):n.$$childHead=n.$$childTail=t}}}}]),angular.element.prototype.focus=angular.element.prototype.focus||function(){return this.length&&this[0].focus(),this},angular.element.prototype.blur=angular.element.prototype.blur||function(){return this.length&&this[0].blur(),this}}(),function(){angular.module("material.decorators",[]).config(["$provide",function(e){function t(e){return e.debounce=function(t){var n,i,r,a;return function(){n=arguments,a=this,r=t,i||(i=!0,e(function(){r.apply(a,n),i=!1}))}},e}e.decorator("$$rAF",["$delegate","$rootScope",t])}])}(),function(){function e(e,t,n,i){function r(e){return l?"webkit"+e.charAt(0).toUpperCase()+e.substring(1):e}function a(e,n,r){function a(t){t.target===e[0]&&(e.off(c.TRANSITIONEND_EVENT,a),l.resolve())}var l=i.defer();n.append(e);var s;if(r){var u=r[0].getBoundingClientRect();s=o(u.left-e[0].offsetWidth,u.top-e[0].offsetHeight,0)+" scale(0.2)"}else s="translate3d(0,100%,0) scale(0.5)";return e.css(c.TRANSFORM,s).css("opacity",0),t(function(){t(function(){e.addClass("md-active").css(c.TRANSFORM,"").css("opacity","").on(c.TRANSITIONEND_EVENT,a)})}),l.promise}function o(e,t,n){return"translate3d("+Math.floor(e)+"px,"+Math.floor(t)+"px,"+Math.floor(n)+"px)"}var c,l=/webkit/i.test(n.vendorPrefix);return c={popIn:a,TRANSITIONEND_EVENT:"transitionend"+(l?" webkitTransitionEnd":""),ANIMATIONEND_EVENT:"animationend"+(l?" webkitAnimationEnd":""),TRANSFORM:r("transform"),TRANSITION:r("transition"),TRANSITION_DURATION:r("transitionDuration"),ANIMATION_PLAY_STATE:r("animationPlayState"),ANIMATION_DURATION:r("animationDuration"),ANIMATION_NAME:r("animationName"),ANIMATION_TIMING:r("animationTimingFunction"),ANIMATION_DIRECTION:r("animationDirection")}}angular.module("material.animations",["material.core"]).service("$mdEffects",["$rootElement","$$rAF","$sniffer","$q",e])}(),function(){function e(e){return function(t,n,i){"checkbox"==i.inkRipple?e.attachCheckboxBehavior(n):e.attachButtonBehavior(n)}}function t(e,t,n,i){function r(e){return o(e,{mousedown:!0,center:!1,animationDuration:350,mousedownPauseTime:175,animationName:"inkRippleButton",animationTimingFunction:"linear"})}function a(e){return o(e,{mousedown:!0,center:!0,animationDuration:300,mousedownPauseTime:180,animationName:"inkRippleCheckbox",animationTimingFunction:"linear"})}function o(t,r){function a(){return!t[0].hasAttribute("disabled")}function o(i,a,o){var c=angular.element('<div class="md-ripple">').css(n.ANIMATION_DURATION,r.animationDuration+"ms").css(n.ANIMATION_NAME,r.animationName).css(n.ANIMATION_TIMING,r.animationTimingFunction).on(n.ANIMATIONEND_EVENT,function(){c.remove()});s||(s=angular.element('<div class="md-ripple-container">'),t.append(s)),s.append(c);var d=s.prop("offsetWidth");if(r.center)i=d/2,a=s.prop("offsetHeight")/2;else if(o){var m=u.getBoundingClientRect();i-=m.left,a-=m.top}l&&(a+=l.$element.prop("scrollTop"));var f={"background-color":e.getComputedStyle(c[0]).color||e.getComputedStyle(u).color,"border-radius":d/2+"px",left:i-d/2+"px",width:d+"px",top:a-d/2+"px",height:d+"px"};return f[n.ANIMATION_DURATION]=r.fadeoutDuration+"ms",c.css(f),c}function c(e){e.eventType===Hammer.INPUT_START&&e.isFirst&&a()?(f=o(e.center.x,e.center.y,!0),m=i(function(){f&&f.css(n.ANIMATION_PLAY_STATE,"paused")},r.mousedownPauseTime,!1),f.on("$destroy",function(){f=null})):e.eventType===Hammer.INPUT_END&&e.isFinal&&(i.cancel(m),f&&f.css(n.ANIMATION_PLAY_STATE,""))}if(t.controller("noink"))return angular.noop;var l=t.controller("mdContent");r=angular.extend({mousedown:!0,hover:!0,focus:!0,center:!1,animationDuration:300,mousedownPauseTime:150,animationName:"",animationTimingFunction:"linear"},r||{});var s,u=t[0],d=new Hammer(u);return r.mousedown&&d.on("hammer.input",c),function(){d.destroy(),s&&s.remove()};var m,f}return{attachButtonBehavior:r,attachCheckboxBehavior:a,attach:o}}angular.module("material.animations").directive("inkRipple",["$mdInkRipple",e]).factory("$mdInkRipple",["$window","$$rAF","$mdEffects","$timeout","$mdUtil",t])}(),function(){function e(){return function(){return{controller:angular.noop}}}angular.module("material.animations").directive({noink:e(),nobar:e(),nostretch:e()})}(),function(){function e(e){return e}angular.module("material.components.backdrop",["material.services.theming"]).directive("mdBackdrop",["$mdTheming",e])}(),function(){function e(){return{restrict:"E"}}function t(e,t,n,i,r,a,o){function c(e,n,r){u=a('<md-backdrop class="md-opaque ng-enter">')(e),u.on("click touchstart",function(){i(d.cancel)}),o.inherit(u,r.parent),t.enter(u,r.parent,null);var c=new s(n);return r.bottomSheet=c,r.targetEvent&&angular.element(r.targetEvent.target).blur(),o.inherit(c.element,r.parent),t.enter(c.element,r.parent)}function l(e,n,i){var r=i.bottomSheet;return t.leave(u),t.leave(r.element).then(function(){r.cleanup(),i.targetEvent&&angular.element(i.targetEvent.target).focus()})}function s(e){function t(t){t.preventDefault(),p=t.target,s=o(t),f=e.css(n.TRANSITION_DURATION),e.css(n.TRANSITION_DURATION,"0s")}function r(t){e.css(n.TRANSITION_DURATION,f);var r=o(t);Math.abs(r-s)<5&&t.target==p?angular.element(t.target).triggerHandler("click"):m>g?i(d.cancel):c(void 0)}function a(e){var t=o(e),n=t-s;m=t-u,u=t,n=l(n),c(n+v)}function o(e){var t=e.touches&&e.touches.length?e.touches[0]:e.changedTouches[0];return t.clientY}function c(t){null===t||void 0===t?e.css(n.TRANSFORM,""):e.css(n.TRANSFORM,"translate3d(0, "+t+"px, 0)")}function l(e){if(0>e&&-v+h>e){e=-e;var t=v-h;e=Math.max(-v,-Math.min(v-5,t+h*(e-t)/v)-e/50)}return e}var s,u,m,f,p,v=80,h=20,g=10;return e=e.eq(0),e.on("touchstart",t),e.on("touchmove",a),e.on("touchend",r),{element:e,cleanup:function(){e.off("touchstart",t),e.off("touchmove",a),e.off("touchend",r)}}}var u,d;return d=e({themable:!0,targetEvent:null,onShow:c,onRemove:l})}angular.module("material.components.bottomSheet",["material.components.backdrop","material.services.interimElement","material.services.theming"]).directive("mdBottomSheet",[e]).factory("$mdBottomSheet",["$$interimElement","$animate","$mdEffects","$timeout","$$rAF","$compile","$mdTheming",t])}(),function(){function e(e,t,n,i,r){e[0];return{restrict:"E",compile:function(e,a){var o,c;return a.ngHref||a.href?(o=angular.element("<a>"),c=["ng-href","href","rel","target"]):(o=angular.element("<button>"),c=["type","disabled","ng-disabled","form"]),angular.forEach(c,function(e){var t=i.camelCase(e);a.hasOwnProperty(t)&&o.attr(e,a[t])}),o.addClass("md-button-inner").append(e.contents()).on("focus",function(){e.addClass("focus")}).on("blur",function(){e.removeClass("focus")}),e.append(o).attr("tabIndex",-1).on("focus",function(){o.focus()}),function(e,i){r(i),n.expect(i,"aria-label",i.text()),t.attachButtonBehavior(i)}}}}angular.module("material.components.button",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdButton",["ngHrefDirective","$mdInkRipple","$mdAria","$mdUtil","$mdTheming",e])}(),function(){function e(){return{restrict:"E",link:function(){}}}angular.module("material.components.card",[]).directive("mdCard",[e])}(),function(){function e(e,t,n,i,r){function a(e,t){return t.type="checkbox",t.tabIndex=0,e.attr("role",t.type),function(t,a,l,s){function u(e){e.which===i.KEY_CODE.SPACE&&(e.preventDefault(),d(e))}function d(e){a[0].hasAttribute("disabled")||t.$apply(function(){f=!f,s.$setViewValue(f,e&&e.type),s.$render()})}function m(){f=s.$viewValue,f?a.addClass(c):a.removeClass(c)}var f=!1;r(a),s=s||{$setViewValue:function(e){this.$viewValue=e},$parsers:[],$formatters:[]},n.expect(e,"aria-label",!0),o.link.pre(t,{on:angular.noop,0:{}},l,[s]),a.on("click",d),a.on("keypress",u),s.$render=m}}var o=e[0],c="md-checked";return{restrict:"E",transclude:!0,require:"?ngModel",template:'<div class="md-container" ink-ripple="checkbox"><div class="md-icon"></div></div><div ng-transclude class="md-label"></div>',compile:a}}angular.module("material.components.checkbox",["material.core","material.animations","material.services.theming","material.services.aria"]).directive("mdCheckbox",["inputDirective","$mdInkRipple","$mdAria","$mdConstant","$mdTheming",e])}(),function(){function e(e){function t(e,t){this.$scope=e,this.$element=t}return{restrict:"E",controller:["$scope","$element",t],link:function(t,n){e(n),t.$broadcast("$mdContentLoaded",n)}}}angular.module("material.components.content",["material.services.theming","material.services.registry"]).directive("mdContent",["$mdTheming",e])}(),function(){function e(e,t){return{restrict:"E",link:function(n,i){t(i),e(function(){var e=i[0].querySelector("md-content");e&&e.scrollHeight>e.clientHeight&&i.addClass("md-content-overflow")})}}}function t(e,t,n,i,r,a,o,c,l,s){function u(a,o,c){function u(){var e=o[0].querySelector(".dialog-close");if(!e){var t=o[0].querySelectorAll(".md-actions button");e=t[t.length-1]}return angular.element(e)}c.parent=angular.element(c.parent),c.popInTarget=angular.element((c.targetEvent||{}).target);var d=u();return m(o.find("md-dialog")),c.hasBackdrop&&(c.backdrop=n('<md-backdrop class="md-opaque ng-enter">')(a),s.inherit(c.backdrop,c.parent),r.enter(c.backdrop,c.parent,null)),i.popIn(o,c.parent,c.popInTarget.length&&c.popInTarget).then(function(){c.escapeToClose&&(c.rootElementKeyupCallback=function(t){t.keyCode===l.KEY_CODE.ESCAPE&&e(f.cancel)},t.on("keyup",c.rootElementKeyupCallback)),c.clickOutsideToClose&&(c.dialogClickOutsideCallback=function(t){t.target===o[0]&&e(f.cancel)},o.on("click",c.dialogClickOutsideCallback)),d.focus()})}function d(e,n,i){return i.backdrop&&(r.leave(i.backdrop),n.data("backdrop",void 0)),i.escapeToClose&&t.off("keyup",i.rootElementKeyupCallback),i.clickOutsideToClose&&n.off("click",i.dialogClickOutsideCallback),r.leave(n).then(function(){n.remove(),i.popInTarget&&i.popInTarget.focus()})}function m(e){e.attr({role:"dialog"});var t=e.find("md-content");0===t.length&&(t=e);var n=c.stringFromTextBody(t.text(),3);a.expect(e,"aria-label",!0,n)}var f;return f=o({hasBackdrop:!0,isolateScope:!0,onShow:u,onRemove:d,clickOutsideToClose:!0,escapeToClose:!0,targetEvent:null,transformTemplate:function(e){return'<div class="md-dialog-container">'+e+"</div>"}})}angular.module("material.components.dialog",["material.core","material.animations","material.components.backdrop","material.services.compiler","material.services.aria","material.services.interimElement","material.services.theming"]).directive("mdDialog",["$$rAF","$mdTheming",e]).factory("$mdDialog",["$timeout","$rootElement","$compile","$mdEffects","$animate","$mdAria","$$interimElement","$mdUtil","$mdConstant","$mdTheming",t])}(),function(){function e(){}function t(t){return{restrict:"E",link:t,controller:[e]}}angular.module("material.components.divider",["material.animations","material.services.aria","material.services.theming"]).directive("mdDivider",["$mdTheming",t])}(),function(){function e(){return{restrict:"E",template:'<object class="md-icon"></object>',compile:function(e,t){var n=angular.element(e[0].children[0]);angular.isDefined(t.icon)&&n.attr("data",t.icon)}}}angular.module("material.components.icon",[]).directive("mdIcon",[e])}(),function(){function e(){return{restrict:"E",link:function(e,t){t.attr({role:"list"})}}}function t(){return{restrict:"E",link:function(e,t){t.attr({role:"listitem"})}}}angular.module("material.components.list",[]).directive("mdList",[e]).directive("mdItem",[t])}(),function(){function e(e,t,n){function i(e){return e.attr("aria-valuemin",0),e.attr("aria-valuemax",100),e.attr("role","progressbar"),r}function r(e,i,r){n(i);var l,s,u,d,m=i[0],f=m.querySelectorAll(".md-fill, .md-mask.md-full"),p=m.querySelectorAll(".md-fill.md-fix"),v=r.diameter||48,h=v/48;m.style[t.TRANSFORM]="scale("+h.toString()+")",r.$observe("value",function(e){for(s=a(e),u=o[s],d=c[s],i.attr("aria-valuenow",s),l=0;l<f.length;l++)f[l].style[t.TRANSFORM]=u;for(l=0;l<p.length;l++)p[l].style[t.TRANSFORM]=d})}function a(e){return e>100?100:0>e?0:Math.ceil(e||0)}for(var o=new Array(101),c=new Array(101),l=0;101>l;l++){var s=l/100,u=Math.floor(180*s);o[l]="rotate("+u.toString()+"deg)",c[l]="rotate("+(2*u).toString()+"deg)"}return{restrict:"E",template:'<div class="md-wrapper1"><div class="md-wrapper2"><div class="md-circle"><div class="md-mask md-full"><div class="md-fill"></div></div><div class="md-mask md-half"><div class="md-fill"></div><div class="md-fill md-fix"></div></div><div class="md-shadow"></div></div><div class="md-inset"></div></div></div>',compile:i}}angular.module("material.components.progressCircular",["material.animations","material.services.aria","material.services.theming"]).directive("mdProgressCircular",["$$rAF","$mdEffects","$mdTheming",e])}(),function(){function e(e,n,i){function r(e){return e.attr("aria-valuemin",0),e.attr("aria-valuemax",100),e.attr("role","progressbar"),a}function a(r,a,c){i(a);var l=a[0].querySelector(".md-bar1").style,s=a[0].querySelector(".md-bar2").style,u=angular.element(a[0].querySelector(".md-container"));c.$observe("value",function(e){if("query"!=c.mode){var i=o(e);a.attr("aria-valuenow",i),s[n.TRANSFORM]=t[i]}}),c.$observe("secondaryvalue",function(e){l[n.TRANSFORM]=t[o(e)]}),e(function(){u.addClass("md-ready")})}function o(e){return e>100?100:0>e?0:Math.ceil(e||0)}return{restrict:"E",template:'<div class="md-container"><div class="md-dashed"></div><div class="md-bar md-bar1"></div><div class="md-bar md-bar2"></div></div>',compile:r}}angular.module("material.components.progressLinear",["material.animations","material.services.theming","material.services.aria"]).directive("mdProgressLinear",["$$rAF","$mdEffects","$mdTheming",e]);var t=function(){function e(e){var t=e/100,n=(e-100)/2;return"translateX("+n.toString()+"%) scale("+t.toString()+", 1)"}for(var t=new Array(101),n=0;101>n;n++)t[n]=e(n);return t}()}(),function(){function e(e,t,n){function i(e,i,r,a){function o(e){e.which===t.KEY_CODE.LEFT_ARROW?(e.preventDefault(),c.selectPrevious()):e.which===t.KEY_CODE.RIGHT_ARROW&&(e.preventDefault(),c.selectNext())}n(i);var c=a[0],l=a[1]||{$setViewValue:angular.noop};c.init(l),i.attr({role:"radiogroup",tabIndex:"0"}).on("keydown",o)}function r(e){this._radioButtonRenderFns=[],this.$element=e}function a(){return{init:function(e){this._ngModelCtrl=e,this._ngModelCtrl.$render=angular.bind(this,this.render)},add:function(e){this._radioButtonRenderFns.push(e)},remove:function(e){var t=this._radioButtonRenderFns.indexOf(e);-1!==t&&this._radioButtonRenderFns.splice(t,1)},render:function(){this._radioButtonRenderFns.forEach(function(e){e()})},setViewValue:function(e,t){this._ngModelCtrl.$setViewValue(e,t),this.render()},getViewValue:function(){return this._ngModelCtrl.$viewValue},selectNext:function(){return o(this.$element,1)},selectPrevious:function(){return o(this.$element,-1)},setActiveDescendant:function(e){this.$element.attr("aria-activedescendant",e)}}}function o(t,n){var i=e.iterator(Array.prototype.slice.call(t[0].querySelectorAll("md-radio-button")),!0);if(i.count()){var r=t[0].querySelector("md-radio-button.md-checked"),a=i[0>n?"previous":"next"](r)||i.first();angular.element(a).triggerHandler("click")}}return r.prototype=a(),{restrict:"E",controller:["$element",r],require:["mdRadioGroup","?ngModel"],link:i}}function t(e,t,n){function i(i,a,o,c){function l(e){a[0].hasAttribute("disabled")||i.$apply(function(){c.setViewValue(o.value,e&&e.type)})}function s(){var e=c.getViewValue()===o.value;e!==d&&(d=e,a.attr("aria-checked",e),e?(a.addClass(r),c.setActiveDescendant(a.attr("id"))):a.removeClass(r))}function u(n,i){function r(){return o.id||"radio_"+t.nextUid()}i.ariaId=r(),n.attr({id:i.ariaId,role:"radio","aria-checked":"false"}),e.expect(n,"aria-label",!0)}var d;n(a),u(a,i),c.add(s),o.$observe("value",s),a.on("click",l).on("$destroy",function(){c.remove(s)})}var r="md-checked";return{restrict:"E",require:"^mdRadioGroup",transclude:!0,template:'<div class="md-container" ink-ripple="checkbox"><div class="md-off"></div><div class="md-on"></div></div><div ng-transclude class="md-label"></div>',link:i}}angular.module("material.components.radioButton",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdRadioGroup",["$mdUtil","$mdConstant","$mdTheming",e]).directive("mdRadioButton",["$mdAria","$mdUtil","$mdTheming",t])}(),function(){function e(e,t,n,i,r,a){a.register(this,n.componentId),this.isOpen=function(){return!!e.isOpen},this.toggle=function(){e.isOpen=!e.isOpen},this.open=function(){e.isOpen=!0},this.close=function(){e.isOpen=!1}}function t(e){return function(t){var n=e.get(t);return n||e.notFoundError(t),{isOpen:function(){return n&&n.isOpen()},toggle:function(){n&&n.toggle()},open:function(){n&&n.open()},close:function(){n&&n.close()}}}}function n(e,t,n,i,r,a,o){function c(c,l,s,u){function d(e){var n=l.parent();n[e?"on":"off"]("keydown",m),t[e?"enter":"leave"](v,n),v[e?"on":"off"]("click",f),t[e?"removeClass":"addClass"](l,"md-closed").then(function(){c.isOpen&&l.focus()})}function m(e){e.which===r.KEY_CODE.ESCAPE&&(f(),e.preventDefault(),e.stopPropagation())}function f(){e(function(){u.close()})}var p=n(s.isLockedOpen),v=a('<md-backdrop class="md-sidenav-backdrop md-opaque">')(c);o.inherit(v,l),c.$watch("isOpen",d),c.$watch(function(){return p(c.$parent,{$media:i})},function(e){l.toggleClass("md-locked-open",!!e),v.toggleClass("md-locked-open",!!e)})}return{restrict:"E",scope:{isOpen:"=?"},controller:"$mdSidenavController",compile:function(e){return e.addClass("md-closed"),e.attr("tabIndex","-1"),c}}}angular.module("material.components.sidenav",["material.core","material.services.registry","material.services.media","material.components.backdrop","material.services.theming","material.animations"]).factory("$mdSidenav",["$mdComponentRegistry",t]).directive("mdSidenav",["$timeout","$animate","$parse","$mdMedia","$mdConstant","$compile","$mdTheming",n]).controller("$mdSidenavController",["$scope","$element","$attrs","$timeout","$mdSidenav","$mdComponentRegistry",e])}(),function(){function e(e){function n(t,n,i,r){e(n);var a=r[0]||{$setViewValue:function(e){this.$viewValue=e,this.$viewChangeListeners.forEach(function(e){e()})},$parsers:[],$formatters:[],$viewChangeListeners:[]},o=r[1];o.init(a)}return{scope:{},require:["?ngModel","mdSlider"],controller:["$scope","$element","$attrs","$$rAF","$window","$mdEffects","$mdAria","$mdUtil","$mdConstant",t],template:'<div class="md-track-container"><div class="md-track"></div><div class="md-track md-track-fill"></div><div class="md-track-ticks"></div></div><div class="md-thumb-container"><div class="md-thumb"></div><div class="md-focus-thumb"></div><div class="md-focus-ring"></div><div class="md-sign"><span class="md-thumb-text" ng-bind="modelValue"></span></div><div class="md-disabled-thumb"></div></div>',link:n}}function t(e,t,n,i,r,a,o,c,l){this.init=function(s){function u(){h(),T(),v()}function d(e){U=parseFloat(e),t.attr("aria-valuemin",e)}function m(e){L=parseFloat(e),t.attr("aria-valuemax",e)}function f(e){W=parseFloat(e),v()}function p(e){t.attr("aria-disabled",!!e)}function v(){if(angular.isDefined(n.discrete)){var e=Math.floor((L-U)/W);Y||(Y=angular.element('<canvas style="position:absolute;">'),K=Y[0].getContext("2d"),K.fillStyle="black",P.append(Y));var t=g();Y[0].width=t.width,Y[0].height=t.height;for(var i,r=0;e>=r;r++)i=Math.floor(t.width*(r/e)),K.fillRect(i-1,0,2,t.height)}}function h(){z=_[0].getBoundingClientRect()}function g(){return H(),z}function $(n){if(!t[0].hasAttribute("disabled")){var i;n.which===l.KEY_CODE.LEFT_ARROW?i=-W:n.which===l.KEY_CODE.RIGHT_ARROW&&(i=W),i&&((n.metaKey||n.ctrlKey||n.altKey)&&(i*=4),n.preventDefault(),n.stopPropagation(),e.$evalAsync(function(){b(s.$viewValue+i)}))}}function b(e){s.$setViewValue(w(y(e)))}function T(){isNaN(s.$viewValue)&&(s.$viewValue=s.$modelValue);var n=(s.$viewValue-U)/(L-U);e.modelValue=s.$viewValue,t.attr("aria-valuenow",s.$viewValue),k(n)}function w(e){return angular.isNumber(e)?Math.max(U,Math.min(L,e)):void 0}function y(e){return angular.isNumber(e)?Math.round(e/W)*W:void 0}function k(e){F.css("width",100*e+"%"),M.css(a.TRANSFORM,"translate3d("+g().width*e+"px,0,0)"),t.toggleClass("md-min",0===e)}function A(e){G||e.eventType!==Hammer.INPUT_START||t[0].hasAttribute("disabled")?G&&e.eventType===Hammer.INPUT_END&&(G&&j&&S(e),G=!1,t.removeClass("panning active")):(G=!0,t.addClass("active"),t[0].focus(),h(),C(e),e.srcEvent.stopPropagation())}function x(){G&&t.addClass("panning")}function C(e){G&&(j?R(e.center.x):E(e.center.x),e.preventDefault(),e.srcEvent.stopPropagation())}function S(e){if(j&&!t[0].hasAttribute("disabled")){var n=I(N(e.center.x)),r=w(y(n));k(O(r)),i(function(){b(r)}),e.preventDefault(),e.srcEvent.stopPropagation()}}function E(t){e.$evalAsync(function(){b(I(N(t)))})}function R(e){k(N(e))}function N(e){return Math.max(0,Math.min(1,(e-z.left)/z.width))}function I(e){return U+e*(L-U)}function O(e){return(e-U)/(L-U)}var D=angular.element(t[0].querySelector(".md-thumb")),M=D.parent(),_=angular.element(t[0].querySelector(".md-track-container")),F=angular.element(t[0].querySelector(".md-track-fill")),P=angular.element(t[0].querySelector(".md-track-ticks")),H=c.throttle(h,5e3);n.min?n.$observe("min",d):d(0),n.max?n.$observe("max",m):m(100),n.step?n.$observe("step",f):f(1);var V=angular.noop;n.ngDisabled?V=e.$parent.$watch(n.ngDisabled,p):p(!!n.disabled),o.expect(t,"aria-label",!1),t.attr("tabIndex",0),t.attr("role","slider"),t.on("keydown",$);var q=new Hammer(t[0],{recognizers:[[Hammer.Pan,{direction:Hammer.DIRECTION_HORIZONTAL}]]});q.on("hammer.input",A),q.on("panstart",x),q.on("pan",C),q.on("panend",S),setTimeout(u);var B=i.debounce(u);angular.element(r).on("resize",B),e.$on("$destroy",function(){angular.element(r).off("resize",B),q.destroy(),V()}),s.$render=T,s.$viewChangeListeners.push(T),s.$formatters.push(w),s.$formatters.push(y);var U,L,W,Y,K,z={};h();var G=!1,j=angular.isDefined(n.discrete);this._onInput=A,this._onPanStart=x,this._onPan=C}}angular.module("material.components.slider",["material.core","material.animations","material.services.aria","material.services.theming"]).directive("mdSlider",["$mdTheming",e])}(),function(){function e(e,t,n,i,r){function a(e){function n(e,t){t.addClass("md-sticky-clone");var n={element:e,clone:t};return f.items.push(n),d.parent().prepend(n.clone),m(),function(){f.items.forEach(function(t,n){t.element[0]===e[0]&&(f.items.splice(n,1),t.clone.remove())}),m()}}function r(){d[0].getBoundingClientRect();f.items.forEach(a),f.items=f.items.sort(function(e,t){return e.top<t.top?-1:1});for(var e,t=d.prop("scrollTop"),n=f.items.length-1;n>=0;n--)if(t>f.items[n].top){e=f.items[n];break}l(e)}function a(e){var t=e.element[0];for(e.top=0,e.left=0;t&&t!==d[0];)e.top+=t.offsetTop,e.left+=t.offsetLeft,t=t.offsetParent;e.height=e.element.prop("offsetHeight"),e.clone.css("margin-left",e.left+"px")}function o(){var e=d.prop("scrollTop"),t=e>(o.prevScrollTop||0);o.prevScrollTop=e,0===e?l(null):t&&f.next?f.next.top-e<=0?l(f.next):f.current&&(f.next.top-e<=f.next.height?u(f.current,f.next.top-f.next.height-e):u(f.current,null)):!t&&f.current&&(e<f.current.top&&l(f.prev),f.current&&f.next&&(e>=f.next.top-f.current.height?u(f.current,f.next.top-e-f.current.height):u(f.current,null)))}function l(e){if(f.current!==e){f.current&&(u(f.current,null),s(f.current,null)),e&&s(e,"active"),f.current=e;var t=f.items.indexOf(e);f.next=f.items[t+1],f.prev=f.items[t-1],s(f.next,"next"),s(f.prev,"prev")}}function s(e,t){e&&e.state!==t&&(e.state&&(e.clone.attr("sticky-prev-state",e.state),e.element.attr("sticky-prev-state",e.state)),e.clone.attr("sticky-state",t),e.element.attr("sticky-state",t),e.state=t)}function u(e,n){e&&(null===n||void 0===n?e.translateY&&(e.translateY=null,e.clone.css(t.TRANSFORM,"")):(e.translateY=n,e.clone.css(t.TRANSFORM,"translate3d("+e.left+"px,"+n+"px,0)")))}var d=e.$element,m=i.debounce(r);c(d),d.on("$scrollstart",m),d.on("$scroll",o);var f;return f={prev:null,current:null,next:null,items:[],add:n,refreshElements:r}}function o(){var t,n=angular.element("<div>");e[0].body.appendChild(n[0]);for(var i=["sticky","-webkit-sticky"],r=0;r<i.length;++r)if(n.css({position:i[r],top:0,"z-index":2}),n.css("position")==i[r]){t=i[r];break}return n.remove(),t}function c(e){function t(){+r.now()-a>o?(n=!1,e.triggerHandler("$scrollend")):(e.triggerHandler("$scroll"),i(t))}var n,a,o=200;e.on("scroll touchmove",function(){n||(n=!0,i(t),e.triggerHandler("$scrollstart")),e.triggerHandler("$scroll"),a=+r.now()})}var l=o();return function(e,t,n){var i=t.controller("mdContent");if(i)if(l)t.css({position:l,top:0,"z-index":2});else{var r=i.$element.data("$$sticky");r||(r=a(i),i.$element.data("$$sticky",r));var o=r.add(t,n||t.clone());e.$on("$destroy",o)}}}angular.module("material.components.sticky",["material.core","material.components.content","material.decorators","material.animations"]).factory("$mdSticky",["$document","$mdEffects","$compile","$$rAF","$mdUtil",e])}(),function(){function e(e,t,n){return{restrict:"E",replace:!0,transclude:!0,template:'<h2 class="md-subheader"><span class="md-subheader-content"></span></h2>',compile:function(i,r,a){var o=i[0].outerHTML;return function(i,r){function c(e){return angular.element(e[0].querySelector(".md-subheader-content"))}n(r),a(i,function(e){c(r).append(e)}),a(i,function(a){var l=t(angular.element(o))(i);n(l),c(l).append(a),e(i,r,l)})}}}}angular.module("material.components.subheader",["material.components.sticky","material.services.theming"]).directive("mdSubheader",["$mdSticky","$compile","$mdTheming",e])}(),function(){!function(){function e(e,t,n){return function(i,r,a){var o=n.toLowerCase(),c="md"+n,l=e(a[c])||angular.noop,s=t(i,o),u=function(e){l(i,e)};s(r,function(e){e.type==o&&u()})}}angular.module("material.components.swipe",["ng"]).factory("$mdSwipe",function(){return function(e,t){return t||(t="swipeleft swiperight"),function(n,i,r){function a(t){t.srcEvent.stopPropagation(),angular.isFunction(i)&&e.$apply(function(){i(t)})}function o(){return l.on(t,a),function(){l.off(t)}}function c(e,t){var n=t.indexOf("pan")>-1,i=t.indexOf("swipe")>-1;return n&&e.push([Hammer.Pan,{direction:Hammer.DIRECTION_HORIZONTAL}]),i&&e.push([Hammer.Swipe,{direction:Hammer.DIRECTION_HORIZONTAL}]),e}var l=new Hammer(n[0],{recognizers:c([],t)});return r||o(),e.$on("$destroy",function(){l.destroy()}),o}}}).directive("mdSwipeLeft",["$parse","$mdSwipe",function(t,n){return{restrict:"A",link:e(t,n,"SwipeLeft")}}]).directive("mdSwipeRight",["$parse","$mdSwipe",function(t,n){return{restrict:"A",link:e(t,n,"SwipeRight")}}])}()}(),function(){function e(e,t,n){function i(e,t){var i=angular.element(e[0].querySelector(".md-switch-thumb"));i.attr("disabled",t.disabled),i.attr("ngDisabled",t.ngDisabled);var a=r.compile(i,t);return function(e,t,i,r){n(t);var o=angular.element(t[0].querySelector(".md-switch-thumb"));return a(e,o,i,r)}}var r=e[0],a=t[0];return{restrict:"E",transclude:!0,template:'<div class="md-switch-bar"></div><div class="md-switch-thumb">'+a.template+"</div>",require:"?ngModel",compile:i}}angular.module("material.components.switch",["material.components.checkbox","material.components.radioButton","material.services.theming"]).directive("mdSwitch",["mdCheckboxDirective","mdRadioButtonDirective","$mdTheming",e])}(),function(){angular.module("material.components.tabs",["material.core","material.animations","material.components.swipe","material.services.theming"])
}(),function(){function e(e,t){return{restrict:"E",replace:!0,scope:{fid:"@?",label:"@?",value:"=ngModel"},compile:function(n,i){return angular.isUndefined(i.fid)&&(i.fid=t.nextUid()),{pre:function(e,t,n){angular.isDefined(n.disabled)&&(t.attr("disabled",!0),e.isDisabled=!0),e.inputType=n.type||"text",t.removeAttr("type"),t.attr("class",n.class)},post:e}},template:'<md-input-group ng-disabled="isDisabled" tabindex="-1"> <label for="{{fid}}" >{{label}}</label> <md-input id="{{fid}}" ng-model="value" type="{{inputType}}"></md-input></md-input-group>'}}function t(){return{restrict:"CE",controller:["$element",function(e){this.setFocused=function(t){e.toggleClass("md-input-focused",!!t)},this.setHasValue=function(t){e.toggleClass("md-input-has-value",t)}}]}}function n(e){return{restrict:"E",replace:!0,template:"<input >",require:["^?mdInputGroup","?ngModel"],link:function(t,n,i,r){function a(e){return e=angular.isUndefined(e)?n.val():e,angular.isDefined(e)&&null!==e&&""!=e.toString().trim()}var o=r[0],c=r[1];if(o){var l=e.isParentDisabled(n);n.attr("tabindex",l?-1:0),n.attr("aria-disabled",l?"true":"false"),n.attr("type",i.type||n.parent().attr("type")||"text"),c&&c.$formatters.push(function(e){return o.setHasValue(a(e)),e}),n.on("input",function(){o.setHasValue(a())}),n.on("focus",function(){o.setFocused(!0)}),n.on("blur",function(){o.setFocused(!1),o.setHasValue(a())}),t.$on("$destroy",function(){o.setFocused(!1),o.setHasValue(!1)})}}}}angular.module("material.components.textField",["material.core","material.services.theming"]).directive("mdInputGroup",[t]).directive("mdInput",["$mdUtil",n]).directive("mdTextFloat",["$mdTheming","$mdUtil",e])}(),function(){function e(){return{restrict:"E"}}function t(e,t,n,i){function r(t,r,a){r.addClass(a.position.split(" ").map(function(e){return"md-"+e}).join(" ")),a.parent.addClass(o(a.position));var c=i(t,"swipeleft swiperight");return a.detachSwipe=c(r,function(t){r.addClass("md-"+t.type),e(l.hide)}),n.enter(r,a.parent)}function a(e,t,i){return i.detachSwipe(),i.parent.removeClass(o(i.position)),n.leave(t)}function o(e){return"md-toast-open-"+(e.indexOf("top")>-1?"top":"bottom")}var c={onShow:r,onRemove:a,position:"bottom left",themable:!0,hideDelay:3e3},l=t(c);return l}angular.module("material.components.toast",["material.services.interimElement","material.components.swipe"]).directive("mdToast",[e]).factory("$mdToast",["$timeout","$$interimElement","$animate","$mdSwipe",t])}(),function(){function e(e,t,n,i){return{restrict:"E",controller:angular.noop,link:function(r,a,o){function c(){function i(t,i){n.elementIsSibling(a,i)&&(u&&u.off("scroll",p),i.on("scroll",p),i.attr("scroll-shrink","true"),u=i,e(c))}function c(){s=a.prop("offsetHeight"),u.css("margin-top",-s*f+"px"),l()}function l(e){var n=e?e.target.scrollTop:m;v(),d=Math.min(s/f,Math.max(0,d+n-m)),a.css(t.TRANSFORM,"translate3d(0,"+-d*f+"px,0)"),u.css(t.TRANSFORM,"translate3d(0,"+(s-d)*f+"px,0)"),m=n}var s,u,d=0,m=0,f=o.shrinkSpeedFactor||.5,p=e.debounce(l),v=n.debounce(c,5e3);r.$on("$mdContentLoaded",i)}i(a),angular.isDefined(o.scrollShrink)&&c()}}}angular.module("material.components.toolbar",["material.core","material.components.content","material.services.theming","material.animations"]).directive("mdToolbar",["$$rAF","$mdEffects","$mdUtil","$mdTheming",e])}(),function(){function e(e,t,n,i,r,a){function o(o,u,d,m){function f(){o.visible&&g()}function p(t){p.value=!!t,p.queued||(t?(p.queued=!0,e(function(){o.visible=p.value,p.queued=!1},c)):e(function(){o.visible=!1}))}function v(){u.removeClass("md-hide"),$.attr("aria-describedby",u.attr("id")),s.append(u),n(function(){n(function(){g(),o.visible&&u.addClass("md-show")})})}function h(){u.removeClass("md-show").addClass("md-hide"),$.removeAttr("aria-describedby"),e(function(){o.visible||u.detach()},200,!1)}function g(){var e=u[0].getBoundingClientRect(),n=$[0].getBoundingClientRect();m&&(n.top+=m.$element.prop("scrollTop"),n.left+=m.$element.prop("scrollLeft"));var i="bottom",r={left:n.left+n.width/2-e.width/2,top:n.top+n.height};r.left=Math.min(r.left,t.innerWidth-e.width-l),r.left=Math.max(r.left,l),r.top+e.height>t.innerHeight&&(r.top=n.top-e.height,i="top"),u.css({top:r.top+"px",left:r.left+"px"}),u.attr("width-32",Math.ceil(e.width/32)),u.attr("md-direction",i)}a(u);var $=u.parent();u.detach(),u.attr("role","tooltip"),u.attr("id",d.id||"tooltip_"+r.nextUid()),$.on("focus mouseenter touchstart",function(){p(!0)}),$.on("blur mouseleave touchend touchcancel",function(){i.activeElement!==$[0]&&p(!1)}),o.$watch("visible",function(e){e?v():h()});var b=n.debounce(f);angular.element(t).on("resize",b),o.$on("$destroy",function(){o.visible=!1,u.remove(),angular.element(t).off("resize",b)})}var c=400,l=8,s=angular.element(document.body);return{restrict:"E",transclude:!0,require:"^?mdContent",template:'<div class="md-background"></div><div class="md-content" ng-transclude></div>',scope:{visible:"=?"},link:o}}angular.module("material.components.tooltip",["material.core","material.services.theming"]).directive("mdTooltip",["$timeout","$window","$$rAF","$document","$mdUtil","$mdTheming",e])}(),function(){angular.module("material.components.whiteframe",[])}(),function(){function e(e,t){function n(n,r,a,o){e(function(){var e=n[0];if(!e.hasAttribute(r)){var c;a===!0&&(o||(o=n.text().trim()),c=angular.isDefined(o)&&o.length),c?(o=String(o).trim(),n.attr(r,o)):(t.warn(i,r,e),t.warn(e))}})}var i='ARIA: Attribute "%s", required for accessibility, is missing on "%s"';return{expect:n}}angular.module("material.services.aria",[]).service("$mdAria",["$$rAF","$log",e])}(),function(){function e(e,t){var n=/^\s*([@=&])(\??)\s*(\w*)\s*$/;return function(i,r,a,o){function c(e,t,n){if(!angular.isDefined(r[e])){var a=o&&o.hasOwnProperty(t);return i[t]=a?o[t]:n,!0}return!1}angular.forEach(a||{},function(a,o){var l,s,u=a.match(n)||[],d=u[3]||o,m=u[1];switch(m){case"@":r.$observe(d,function(e){i[o]=e}),r.$$observers[d].$$scope=i,c(d,o)||(i[o]=t(r[d])(i));break;case"=":c(d,o)||(i[o]=""===r[d]?!0:i.$eval(r[d]),s=i.$watch(r[d],function(e){i[o]=e}),i.$on("$destroy",s));break;case"&":if(!c(d,o,angular.noop)){if(r[d]&&r[d].match(RegExp(o+"(.*?)")))throw new Error('& expression binding "'+o+'" looks like it will recursively call "'+r[d]+'" and cause a stack overflow! Please choose a different scopeName.');l=e(r[d]),i[o]=function(e){return l(i,e)}}}})}}angular.module("material.services.attrBind",[]).factory("$attrBind",["$parse","$interpolate",e])}(),function(){function e(e,t,n,i,r,a){this.compile=function(o){var c=o.templateUrl,l=o.template||"",s=o.controller,u=o.controllerAs,d=o.resolve||{},m=o.locals||{},f=o.transformTemplate||angular.identity;return angular.forEach(d,function(e,t){d[t]=angular.isString(e)?n.get(e):n.invoke(e)}),angular.extend(d,m),d.$template=c?t.get(c,{cache:a}).then(function(e){return e.data}):e.when(l),e.all(d).then(function(e){var t=f(e.$template),n=angular.element("<div>").html(t).contents(),a=i(n);return{locals:e,element:n,link:function(t){if(e.$scope=t,s){var i=r(s,e);n.data("$ngControllerController",i),n.children().data("$ngControllerController",i),u&&(t[u]=i)}return a(t)}}})}}angular.module("material.services.compiler",[]).service("$mdCompiler",["$q","$http","$injector","$compile","$controller","$templateCache",e])}(),function(){function e(e,t,n,i,r,a,o){return function(c){function l(e){m.length&&f.hide();var t=new d(e);return m.push(t),t.show().then(function(){return t.deferred.promise})}function s(e){var t=m.shift();t&&t.remove().then(function(){t.deferred.resolve(e)})}function u(e){var t=m.shift();t&&t.remove().then(function(){t.deferred.reject(e)})}function d(r){var l,s,u;return r=r||{},r=angular.extend({scope:r.scope||t.$new(r.isolateScope)},c,r),l={options:r,deferred:e.defer(),show:function(){return a.compile(r).then(function(t){function a(){r.hideDelay&&(s=n(f.hide,r.hideDelay))}r.parent||(r.parent=i.find("body"),r.parent.length||(r.parent=i)),u=t.link(r.scope),r.themable&&o(u);var c=r.onShow(r.scope,u,r);return e.when(c).then(a)})},cancelTimeout:function(){s&&(n.cancel(s),s=void 0)},remove:function(){l.cancelTimeout();var t=r.onRemove(r.scope,u,r);return e.when(t).then(function(){r.scope.$destroy()})}}}var m=[];c=angular.extend({onShow:function(e,t,n){return r.enter(t,n.parent)},onRemove:function(e,t){return r.leave(t)}},c||{});var f;return f={show:l,hide:s,cancel:u}}}angular.module("material.services.interimElement",["material.services.compiler","material.services.theming"]).factory("$$interimElement",["$q","$rootScope","$timeout","$rootElement","$animate","$mdCompiler","$mdTheming",e])}(),function(){function e(e,t,n){function i(e){e=r(e);var t;return angular.isDefined(t=c.get(e))?t:a(e)}function r(e){return l[e]||("("!=e.charAt(0)?"("+e+")":e)}function a(t){return c.put(t,!!e.matchMedia(t).matches)}function o(){var t=c.keys();if(t.length){for(var i=0,r=t.length;r>i;i++)c.put(t[i],!!e.matchMedia(t[i]).matches);n(angular.noop)}}var c=t.cacheFactory("$mdMedia",{capacity:15}),l={sm:"(min-width: 600px)",md:"(min-width: 960px)",lg:"(min-width: 1200px)"};return angular.element(e).on("resize",o),i}angular.module("material.services.media",["material.core"]).factory("$mdMedia",["$window","$mdUtil","$timeout",e])}(),function(){function e(e){var t=[];return{notFoundError:function(t){e.error("No instance found for handle",t)},getInstances:function(){return t},get:function(e){var n,i,r;for(n=0,i=t.length;i>n;n++)if(r=t[n],r.$$mdHandle===e)return r;return null},register:function(e,n){return e.$$mdHandle=n,t.push(e),function(){var n=t.indexOf(e);-1!==n&&t.splice(n,1)}}}}angular.module("material.services.registry",[]).factory("$mdComponentRegistry",["$log",e])}(),function(){function e(){function e(e,n){function i(e,t){void 0===t&&(t=e,e=void 0),void 0===e&&(e=n),i.inherit(t,t)}return i.inherit=function(e,i){function r(t){var n=e.data("$mdThemeName");n&&e.removeClass("md-"+n+"-theme"),e.addClass("md-"+t+"-theme"),e.data("$mdThemeName",t)}var a=i.controller("mdTheme");if(angular.isDefined(e.attr("md-theme-watch"))){var o=n.$watch(function(){return a&&a.$mdTheme||t},r);e.on("$destroy",o)}else{var c=a&&a.$mdTheme||t;r(c)}},i}var t="default";return{setDefaultTheme:function(e){t=e},$get:["$rootElement","$rootScope",e]}}function t(e){return{priority:100,link:{pre:function(t,n,i){var r={$setTheme:function(e){r.$mdTheme=e}};n.data("$mdThemeController",r),r.$setTheme(e(i.mdTheme)(t)),i.$observe("mdTheme",r.$setTheme)}}}}function n(e){return e}angular.module("material.services.theming",[]).directive("mdTheme",["$interpolate",t]).directive("mdThemable",["$mdTheming",n]).provider("$mdTheming",[e])}(),function(){function e(e,t,n,i){function r(r,a,o,c){function l(){m(),i(m,100,!1)}function s(){var t=d.selected()&&d.selected().element;if(!t||d.count()<2)a.css({display:"none",width:"0px"});else{var n=t.prop("offsetWidth"),i=t.prop("offsetLeft")+(d.$$pagingOffset||0);a.css({display:n>0?"block":"none",width:n+"px"}),a.css(e.TRANSFORM,"translate3d("+i+"px,0,0)")}}var u=c[0],d=c[1];if(!u){var m=n.debounce(s);r.$watch(d.selected,s),r.$on("$mdTabsChanged",m),r.$on("$mdTabsPaginationChanged",m),angular.element(t).on("resize",l),r.$on("$destroy",function(){angular.element(t).off("resize",l)})}}return{restrict:"E",require:["^?nobar","^mdTabs"],link:r}}angular.module("material.components.tabs").directive("mdTabsInkBar",["$mdEffects","$window","$$rAF","$timeout",e])}(),function(){function e(e,t,n,i,r){function a(a,l,s,u){function d(e){if(b.active){var t=angular.element(e.target).controller("mdTab"),n=h(t);n!==b.page&&(t.element.blur(),g(n).then(function(){t.element.focus()}))}}function m(e){if(e)if(b.active){var t=h(e);g(t)}else T()}function f(e){var t,n=b.page+e;if(!u.selected()||h(u.selected())!==n){var i;0>e?(i=(n+1)*b.itemsPerPage,t=u.previous(u.itemAt(i))):(i=n*b.itemsPerPage-1,t=u.next(u.itemAt(i)))}g(n).then(function(){t&&t.element.focus()}),t&&u.select(t)}function p(){var e=l.find("md-tab"),t=l.parent().prop("clientWidth")-c,n=t&&o*u.count()>t,i=n!==b.active;if(b.active=n,n){b.pagesCount=Math.ceil(o*u.count()/t),b.itemsPerPage=Math.max(1,Math.floor(u.count()/b.pagesCount)),b.tabWidth=t/b.itemsPerPage,$.css("width",b.tabWidth*u.count()+"px"),e.css("width",b.tabWidth+"px");var a=h(u.selected());g(a)}else i&&r(function(){$.css("width",""),e.css("width",""),v(0),b.page=-1})}function v(t){function n(t){t.target===$[0]&&($.off(e.TRANSITIONEND_EVENT,n),r.resolve())}if(u.pagingOffset===t)return i.when();var r=i.defer();return u.$$pagingOffset=t,$.css(e.TRANSFORM,"translate3d("+t+"px,0,0)"),$.on(e.TRANSITIONEND_EVENT,n),r.promise}function h(e){var t=u.indexOf(e);return-1===t?0:Math.floor(t/b.itemsPerPage)}function g(e){if(e!==b.page){var t=b.pagesCount;return 0>e&&(e=0),e>t&&(e=t),b.hasPrev=e>0,b.hasNext=(e+1)*b.itemsPerPage<u.count(),b.page=e,r(function(){a.$broadcast("$mdTabsPaginationChanged")}),v(-e*b.itemsPerPage*b.tabWidth)}}var $=l.children(),b=a.pagination={page:-1,active:!1,clickNext:function(){f(1)},clickPrevious:function(){f(-1)}};p();var T=n.debounce(p);a.$on("$mdTabsChanged",T),angular.element(t).on("resize",T),$.on("focusin",d),a.$on("$destroy",function(){angular.element(t).off("resize",T),$.off("focusin",d)}),a.$watch(u.selected,m)}var o=96,c=64;return{restrict:"A",require:"^mdTabs",link:a}}angular.module("material.components.tabs").directive("mdTabsPagination",["$mdEffects","$window","$$rAF","$$q","$timeout",e])}(),function(){function e(e,t,n,i,r,a){function o(){return t[0].hasAttribute("disabled")}function c(t){d.content.length&&(d.contentContainer.append(d.content),d.contentScope=e.$parent.$new(),t.append(d.contentContainer),n(d.contentContainer)(d.contentScope),a.disconnectScope(d.contentScope),f=v(d.contentContainer,function(e){d.$$onSwipe(e.type)},!0))}function l(){i.leave(d.contentContainer).then(function(){d.contentScope&&d.contentScope.$destroy(),d.contentScope=null})}function s(){a.reconnectScope(d.contentScope),m=f(),t.addClass("active"),t.attr("aria-selected",!0),t.attr("tabIndex",0),i.removeClass(d.contentContainer,"ng-hide"),e.onSelect()}function u(){a.disconnectScope(d.contentScope),m(),t.removeClass("active"),t.attr("aria-selected",!1),t.attr("tabIndex",-1),i.addClass(d.contentContainer,"ng-hide"),e.onDeselect()}var d=this,m=angular.noop,f=function(){return m},p="swipeleft swiperight",v=r(e,p);d.$$onSwipe=angular.noop,d.contentContainer=angular.element('<div class="md-tab-content ng-hide">'),d.element=t,d.isDisabled=o,d.onAdd=c,d.onRemove=l,d.onSelect=s,d.onDeselect=u}angular.module("material.components.tabs").controller("$mdTab",["$scope","$element","$compile","$animate","$mdSwipe","$mdUtil",e])}(),function(){function e(e,t,n,i,r){function a(a,o){var c=a.find("md-tab-label");c.length?c.remove():c=angular.isDefined(o.label)?angular.element("<md-tab-label>").html(o.label):angular.element("<md-tab-label>").append(a.contents().remove());var l=a.contents().remove();return function(a,o,s,u){function d(){var e=c.clone();o.append(e),t(e)(a.$parent),$.content=l.clone()}function m(){a.$apply(function(){b.select($),$.element.focus()})}function f(e){if(e.which==r.KEY_CODE.SPACE)o.triggerHandler("click"),e.preventDefault();else if(e.which===r.KEY_CODE.LEFT_ARROW){var t=b.previous($);t&&t.element.focus()}else if(e.which===r.KEY_CODE.RIGHT_ARROW){var n=b.next($);n&&n.element.focus()}}function p(){a.$watch("$parent.$index",function(e){b.move($,e)})}function v(){function e(e){var t=b.selected()===$;e&&!t?b.select($):!e&&t&&b.deselect($)}var t=a.$parent.$watch("!!("+s.active+")",e);a.$on("$destroy",t)}function h(){function e(e){o.attr("aria-disabled",e);var t=b.selected()===$;t&&e&&b.select(b.next()||b.previous())}a.$watch($.isDisabled,e)}function g(){var e=s.id||i.nextUid(),t="content_"+e;o.attr({id:e,role:"tabItemCtrl",tabIndex:"-1","aria-controls":t}),$.contentContainer.attr({id:t,role:"tabpanel","aria-labelledby":e}),n.expect(o,"aria-label",!0)}var $=u[0],b=u[1];d();var T=e.attachButtonBehavior(o);b.add($),a.$on("$destroy",function(){T(),b.remove($)}),angular.isDefined(s.ngClick)||o.on("click",m),o.on("keydown",f),angular.isNumber(a.$parent.$index)&&p(),angular.isDefined(s.active)&&v(),h(),g()}}return{restrict:"E",require:["mdTab","^mdTabs"],controller:"$mdTab",scope:{onSelect:"&",onDeselect:"&",label:"@"},compile:a}}angular.module("material.components.tabs").directive("mdTab",["$mdInkRipple","$compile","$mdAria","$mdUtil","$mdConstant",e])}(),function(){function e(e,t,n){function i(){return p.itemAt(e.selectedIndex)}function r(t,n){f.add(t,n),t.onAdd(p.contentArea),t.$$onSwipe=m,(-1===e.selectedIndex||e.selectedIndex===p.indexOf(t))&&p.select(t),e.$broadcast("$mdTabsChanged")}function a(t,n){f.contains(t)&&(n||p.selected()===t&&(f.count()>1?p.select(p.previous()||p.next()):p.deselect(t)),f.remove(t),t.onRemove(),e.$broadcast("$mdTabsChanged"))}function o(t,n){var i=p.selected()===t;f.remove(t),f.add(t,n),i&&p.select(t),e.$broadcast("$mdTabsChanged")}function c(t){!t||t.isSelected||t.isDisabled()||f.contains(t)&&(p.deselect(p.selected()),e.selectedIndex=p.indexOf(t),t.isSelected=!0,t.onSelect())}function l(t){t&&t.isSelected&&f.contains(t)&&(e.selectedIndex=-1,t.isSelected=!1,t.onDeselect())}function s(e,t){return f.next(e||p.selected(),t||d)}function u(e,t){return f.previous(e||p.selected(),t||d)}function d(e){return e&&!e.isDisabled()}function m(e){if(p.selected())switch(e){case"swiperight":case"panright":p.select(p.previous());break;case"swipeleft":case"panleft":p.select(p.next())}}var f=n.iterator([],!1),p=this;p.element=t,p.contentArea=angular.element(t[0].querySelector(".md-tabs-content")),p.inRange=f.inRange,p.indexOf=f.indexOf,p.itemAt=f.itemAt,p.count=f.count,p.selected=i,p.add=r,p.remove=a,p.move=o,p.select=c,p.deselect=l,p.next=s,p.previous=u,p.swipe=m,e.$on("$destroy",function(){p.deselect(p.selected());for(var e=f.count()-1;e>=0;e--)p.remove(f[e],!0)})}angular.module("material.components.tabs").controller("$mdTabs",["$scope","$element","$mdUtil",e])}(),function(){function e(e,t){function n(e,n,i,r){function a(){n.attr({role:"tablist"})}function o(){e.$watch("selectedIndex",function(e,t){if(r.deselect(r.itemAt(t)),r.inRange(e)){var n=r.itemAt(e);n&&n.isDisabled()&&(n=e>t?r.next(n):r.previous(n)),r.select(n)}})}t(n),a(),o()}return{restrict:"E",controller:"$mdTabs",require:"mdTabs",transclude:!0,scope:{selectedIndex:"=?selected"},template:'<section class="md-header" ng-class="{\'md-paginating\': pagination.active}"><div class="md-paginator md-prev" ng-if="pagination.active && pagination.hasPrev" ng-click="pagination.clickPrevious()"></div><div class="md-header-items-container" md-tabs-pagination><div class="md-header-items" ng-transclude></div><md-tabs-ink-bar></md-tabs-ink-bar></div><div class="md-paginator md-next" ng-if="pagination.active && pagination.hasNext" ng-click="pagination.clickNext()"></div></section><section class="md-tabs-content"></section>',link:n}}angular.module("material.components.tabs").directive("mdTabs",["$parse","$mdTheming",e])}();
},{}],"angular.resource":[function(require,module,exports){
/*
 AngularJS v1.3.3
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(I,d,B){'use strict';function D(f,q){q=q||{};d.forEach(q,function(d,h){delete q[h]});for(var h in f)!f.hasOwnProperty(h)||"$"===h.charAt(0)&&"$"===h.charAt(1)||(q[h]=f[h]);return q}var w=d.$$minErr("$resource"),C=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;d.module("ngResource",["ng"]).provider("$resource",function(){var f=this;this.defaults={stripTrailingSlashes:!0,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}}};
this.$get=["$http","$q",function(q,h){function t(d,g){this.template=d;this.defaults=s({},f.defaults,g);this.urlParams={}}function v(x,g,l,m){function c(b,k){var c={};k=s({},g,k);r(k,function(a,k){u(a)&&(a=a());var d;if(a&&a.charAt&&"@"==a.charAt(0)){d=b;var e=a.substr(1);if(null==e||""===e||"hasOwnProperty"===e||!C.test("."+e))throw w("badmember",e);for(var e=e.split("."),n=0,g=e.length;n<g&&d!==B;n++){var h=e[n];d=null!==d?d[h]:B}}else d=a;c[k]=d});return c}function F(b){return b.resource}function e(b){D(b||
{},this)}var G=new t(x,m);l=s({},f.defaults.actions,l);e.prototype.toJSON=function(){var b=s({},this);delete b.$promise;delete b.$resolved;return b};r(l,function(b,k){var g=/^(POST|PUT|PATCH)$/i.test(b.method);e[k]=function(a,y,m,x){var n={},f,l,z;switch(arguments.length){case 4:z=x,l=m;case 3:case 2:if(u(y)){if(u(a)){l=a;z=y;break}l=y;z=m}else{n=a;f=y;l=m;break}case 1:u(a)?l=a:g?f=a:n=a;break;case 0:break;default:throw w("badargs",arguments.length);}var t=this instanceof e,p=t?f:b.isArray?[]:new e(f),
A={},v=b.interceptor&&b.interceptor.response||F,C=b.interceptor&&b.interceptor.responseError||B;r(b,function(b,a){"params"!=a&&"isArray"!=a&&"interceptor"!=a&&(A[a]=H(b))});g&&(A.data=f);G.setUrlParams(A,s({},c(f,b.params||{}),n),b.url);n=q(A).then(function(a){var c=a.data,g=p.$promise;if(c){if(d.isArray(c)!==!!b.isArray)throw w("badcfg",k,b.isArray?"array":"object",d.isArray(c)?"array":"object");b.isArray?(p.length=0,r(c,function(a){"object"===typeof a?p.push(new e(a)):p.push(a)})):(D(c,p),p.$promise=
g)}p.$resolved=!0;a.resource=p;return a},function(a){p.$resolved=!0;(z||E)(a);return h.reject(a)});n=n.then(function(a){var b=v(a);(l||E)(b,a.headers);return b},C);return t?n:(p.$promise=n,p.$resolved=!1,p)};e.prototype["$"+k]=function(a,b,c){u(a)&&(c=b,b=a,a={});a=e[k].call(this,a,this,b,c);return a.$promise||a}});e.bind=function(b){return v(x,s({},g,b),l)};return e}var E=d.noop,r=d.forEach,s=d.extend,H=d.copy,u=d.isFunction;t.prototype={setUrlParams:function(f,g,l){var m=this,c=l||m.template,h,
e,q=m.urlParams={};r(c.split(/\W/),function(b){if("hasOwnProperty"===b)throw w("badname");!/^\d+$/.test(b)&&b&&(new RegExp("(^|[^\\\\]):"+b+"(\\W|$)")).test(c)&&(q[b]=!0)});c=c.replace(/\\:/g,":");g=g||{};r(m.urlParams,function(b,k){h=g.hasOwnProperty(k)?g[k]:m.defaults[k];d.isDefined(h)&&null!==h?(e=encodeURIComponent(h).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),c=c.replace(new RegExp(":"+
k+"(\\W|$)","g"),function(b,a){return e+a})):c=c.replace(new RegExp("(/?):"+k+"(\\W|$)","g"),function(b,a,c){return"/"==c.charAt(0)?c:a+c})});m.defaults.stripTrailingSlashes&&(c=c.replace(/\/+$/,"")||"/");c=c.replace(/\/\.(?=\w+($|\?))/,".");f.url=c.replace(/\/\\\./,"/.");r(g,function(b,c){m.urlParams[c]||(f.params=f.params||{},f.params[c]=b)})}};return v}]})})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map

},{}],"angular.route":[function(require,module,exports){
/*
 AngularJS v1.3.3
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,d,C){'use strict';function v(r,h,g){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,c,b,f,y){function z(){k&&(g.cancel(k),k=null);l&&(l.$destroy(),l=null);m&&(k=g.leave(m),k.then(function(){k=null}),m=null)}function x(){var b=r.current&&r.current.locals;if(d.isDefined(b&&b.$template)){var b=a.$new(),f=r.current;m=y(b,function(b){g.enter(b,null,m||c).then(function(){!d.isDefined(t)||t&&!a.$eval(t)||h()});z()});l=f.scope=b;l.$emit("$viewContentLoaded");
l.$eval(w)}else z()}var l,m,k,t=b.autoscroll,w=b.onload||"";a.$on("$routeChangeSuccess",x);x()}}}function A(d,h,g){return{restrict:"ECA",priority:-400,link:function(a,c){var b=g.current,f=b.locals;c.html(f.$template);var y=d(c.contents());b.controller&&(f.$scope=a,f=h(b.controller,f),b.controllerAs&&(a[b.controllerAs]=f),c.data("$ngControllerController",f),c.children().data("$ngControllerController",f));y(a)}}}p=d.module("ngRoute",["ng"]).provider("$route",function(){function r(a,c){return d.extend(new (d.extend(function(){},
{prototype:a})),c)}function h(a,d){var b=d.caseInsensitiveMatch,f={originalPath:a,regexp:a},g=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(a,d,b,c){a="?"===c?c:null;c="*"===c?c:null;g.push({name:b,optional:!!a});d=d||"";return""+(a?"":d)+"(?:"+(a?d:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=new RegExp("^"+a+"$",b?"i":"");return f}var g={};this.when=function(a,c){var b=d.copy(c);d.isUndefined(b.reloadOnSearch)&&(b.reloadOnSearch=
!0);d.isUndefined(b.caseInsensitiveMatch)&&(b.caseInsensitiveMatch=this.caseInsensitiveMatch);g[a]=d.extend(b,a&&h(a,b));if(a){var f="/"==a[a.length-1]?a.substr(0,a.length-1):a+"/";g[f]=d.extend({redirectTo:a},h(f,b))}return this};this.caseInsensitiveMatch=!1;this.otherwise=function(a){"string"===typeof a&&(a={redirectTo:a});this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$templateRequest","$sce",function(a,c,b,f,h,p,x){function l(b){var e=s.current;
(v=(n=k())&&e&&n.$$route===e.$$route&&d.equals(n.pathParams,e.pathParams)&&!n.reloadOnSearch&&!w)||!e&&!n||a.$broadcast("$routeChangeStart",n,e).defaultPrevented&&b&&b.preventDefault()}function m(){var u=s.current,e=n;if(v)u.params=e.params,d.copy(u.params,b),a.$broadcast("$routeUpdate",u);else if(e||u)w=!1,(s.current=e)&&e.redirectTo&&(d.isString(e.redirectTo)?c.path(t(e.redirectTo,e.params)).search(e.params).replace():c.url(e.redirectTo(e.pathParams,c.path(),c.search())).replace()),f.when(e).then(function(){if(e){var a=
d.extend({},e.resolve),b,c;d.forEach(a,function(b,e){a[e]=d.isString(b)?h.get(b):h.invoke(b,null,null,e)});d.isDefined(b=e.template)?d.isFunction(b)&&(b=b(e.params)):d.isDefined(c=e.templateUrl)&&(d.isFunction(c)&&(c=c(e.params)),c=x.getTrustedResourceUrl(c),d.isDefined(c)&&(e.loadedTemplateUrl=c,b=p(c)));d.isDefined(b)&&(a.$template=b);return f.all(a)}}).then(function(c){e==s.current&&(e&&(e.locals=c,d.copy(e.params,b)),a.$broadcast("$routeChangeSuccess",e,u))},function(b){e==s.current&&a.$broadcast("$routeChangeError",
e,u,b)})}function k(){var a,b;d.forEach(g,function(f,g){var q;if(q=!b){var h=c.path();q=f.keys;var l={};if(f.regexp)if(h=f.regexp.exec(h)){for(var k=1,m=h.length;k<m;++k){var n=q[k-1],p=h[k];n&&p&&(l[n.name]=p)}q=l}else q=null;else q=null;q=a=q}q&&(b=r(f,{params:d.extend({},c.search(),a),pathParams:a}),b.$$route=f)});return b||g[null]&&r(g[null],{params:{},pathParams:{}})}function t(a,b){var c=[];d.forEach((a||"").split(":"),function(a,d){if(0===d)c.push(a);else{var f=a.match(/(\w+)(.*)/),g=f[1];
c.push(b[g]);c.push(f[2]||"");delete b[g]}});return c.join("")}var w=!1,n,v,s={routes:g,reload:function(){w=!0;a.$evalAsync(function(){l();m()})},updateParams:function(a){if(this.current&&this.current.$$route){var b={},f=this;d.forEach(Object.keys(a),function(c){f.current.pathParams[c]||(b[c]=a[c])});a=d.extend({},this.current.params,a);c.path(t(this.current.$$route.originalPath,a));c.search(d.extend({},c.search(),b))}else throw B("norout");}};a.$on("$locationChangeStart",l);a.$on("$locationChangeSuccess",
m);return s}]});var B=d.$$minErr("ngRoute");p.provider("$routeParams",function(){this.$get=function(){return{}}});p.directive("ngView",v);p.directive("ngView",A);v.$inject=["$route","$anchorScroll","$animate"];A.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map

},{}],"angular":[function(require,module,exports){
/*
 AngularJS v1.3.3
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(T,U,t){'use strict';function v(b){return function(){var a=arguments[0],c;c="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.3.3/"+(b?b+"/":"")+a;for(a=1;a<arguments.length;a++){c=c+(1==a?"?":"&")+"p"+(a-1)+"=";var d=encodeURIComponent,e;e=arguments[a];e="function"==typeof e?e.toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof e?"undefined":"string"!=typeof e?JSON.stringify(e):e;c+=d(e)}return Error(c)}}function Ra(b){if(null==b||Sa(b))return!1;var a=b.length;return b.nodeType===
la&&a?!0:I(b)||G(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function r(b,a,c){var d,e;if(b)if(u(b))for(d in b)"prototype"==d||"length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d)||a.call(c,b[d],d,b);else if(G(b)||Ra(b)){var f="object"!==typeof b;d=0;for(e=b.length;d<e;d++)(f||d in b)&&a.call(c,b[d],d,b)}else if(b.forEach&&b.forEach!==r)b.forEach(a,c,b);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d,b);return b}function Cd(b,a,c){for(var d=Object.keys(b).sort(),e=0;e<d.length;e++)a.call(c,
b[d[e]],d[e]);return d}function kc(b){return function(a,c){b(c,a)}}function Dd(){return++kb}function lc(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function H(b){for(var a=b.$$hashKey,c=1,d=arguments.length;c<d;c++){var e=arguments[c];if(e)for(var f=Object.keys(e),g=0,h=f.length;g<h;g++){var k=f[g];b[k]=e[k]}}lc(b,a);return b}function aa(b){return parseInt(b,10)}function mc(b,a){return H(new (H(function(){},{prototype:b})),a)}function w(){}function ma(b){return b}function ba(b){return function(){return b}}
function D(b){return"undefined"===typeof b}function A(b){return"undefined"!==typeof b}function L(b){return null!==b&&"object"===typeof b}function I(b){return"string"===typeof b}function W(b){return"number"===typeof b}function ea(b){return"[object Date]"===Ja.call(b)}function u(b){return"function"===typeof b}function lb(b){return"[object RegExp]"===Ja.call(b)}function Sa(b){return b&&b.window===b}function Ta(b){return b&&b.$evalAsync&&b.$watch}function Ua(b){return"boolean"===typeof b}function nc(b){return!(!b||
!(b.nodeName||b.prop&&b.attr&&b.find))}function Ed(b){var a={};b=b.split(",");var c;for(c=0;c<b.length;c++)a[b[c]]=!0;return a}function sa(b){return Q(b.nodeName||b[0].nodeName)}function Va(b,a){var c=b.indexOf(a);0<=c&&b.splice(c,1);return a}function Ca(b,a,c,d){if(Sa(b)||Ta(b))throw Wa("cpws");if(a){if(b===a)throw Wa("cpi");c=c||[];d=d||[];if(L(b)){var e=c.indexOf(b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(G(b))for(var f=a.length=0;f<b.length;f++)e=Ca(b[f],null,c,d),L(b[f])&&(c.push(b[f]),
d.push(e)),a.push(e);else{var g=a.$$hashKey;G(a)?a.length=0:r(a,function(b,c){delete a[c]});for(f in b)b.hasOwnProperty(f)&&(e=Ca(b[f],null,c,d),L(b[f])&&(c.push(b[f]),d.push(e)),a[f]=e);lc(a,g)}}else if(a=b)G(b)?a=Ca(b,[],c,d):ea(b)?a=new Date(b.getTime()):lb(b)?(a=new RegExp(b.source,b.toString().match(/[^\/]*$/)[0]),a.lastIndex=b.lastIndex):L(b)&&(e=Object.create(Object.getPrototypeOf(b)),a=Ca(b,e,c,d));return a}function ta(b,a){if(G(b)){a=a||[];for(var c=0,d=b.length;c<d;c++)a[c]=b[c]}else if(L(b))for(c in a=
a||{},b)if("$"!==c.charAt(0)||"$"!==c.charAt(1))a[c]=b[c];return a||b}function na(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(G(b)){if(!G(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!na(b[d],a[d]))return!1;return!0}}else{if(ea(b))return ea(a)?na(b.getTime(),a.getTime()):!1;if(lb(b)&&lb(a))return b.toString()==a.toString();if(Ta(b)||Ta(a)||Sa(b)||Sa(a)||G(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&
!u(b[d])){if(!na(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==t&&!u(a[d]))return!1;return!0}return!1}function Xa(b,a,c){return b.concat(Ya.call(a,c))}function oc(b,a){var c=2<arguments.length?Ya.call(arguments,2):[];return!u(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,Xa(c,arguments,0)):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Fd(b,a){var c=a;"string"===typeof b&&"$"===
b.charAt(0)&&"$"===b.charAt(1)?c=t:Sa(a)?c="$WINDOW":a&&U===a?c="$DOCUMENT":Ta(a)&&(c="$SCOPE");return c}function Za(b,a){return"undefined"===typeof b?t:JSON.stringify(b,Fd,a?"  ":null)}function pc(b){return I(b)?JSON.parse(b):b}function ua(b){b=y(b).clone();try{b.empty()}catch(a){}var c=y("<div>").append(b).html();try{return b[0].nodeType===mb?Q(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+Q(b)})}catch(d){return Q(c)}}function qc(b){try{return decodeURIComponent(b)}catch(a){}}
function rc(b){var a={},c,d;r((b||"").split("&"),function(b){b&&(c=b.replace(/\+/g,"%20").split("="),d=qc(c[0]),A(d)&&(b=A(c[1])?qc(c[1]):!0,Jb.call(a,d)?G(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Kb(b){var a=[];r(b,function(b,d){G(b)?r(b,function(b){a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))}):a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))});return a.length?a.join("&"):""}function nb(b){return Da(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function Da(b,a){return encodeURIComponent(b).replace(/%40/gi,
"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%20/g,a?"%20":"+")}function Gd(b,a){var c,d,e=ob.length;b=y(b);for(d=0;d<e;++d)if(c=ob[d]+a,I(c=b.attr(c)))return c;return null}function Hd(b,a){var c,d,e={};r(ob,function(a){a+="app";!c&&b.hasAttribute&&b.hasAttribute(a)&&(c=b,d=b.getAttribute(a))});r(ob,function(a){a+="app";var e;!c&&(e=b.querySelector("["+a.replace(":","\\:")+"]"))&&(c=e,d=e.getAttribute(a))});c&&(e.strictDi=null!==Gd(c,"strict-di"),
a(c,d?[d]:[],e))}function sc(b,a,c){L(c)||(c={});c=H({strictDi:!1},c);var d=function(){b=y(b);if(b.injector()){var d=b[0]===U?"document":ua(b);throw Wa("btstrpd",d.replace(/</,"&lt;").replace(/>/,"&gt;"));}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);c.debugInfoEnabled&&a.push(["$compileProvider",function(a){a.debugInfoEnabled(!0)}]);a.unshift("ng");d=Lb(a,c.strictDi);d.invoke(["$rootScope","$rootElement","$compile","$injector",function(a,b,c,d){a.$apply(function(){b.data("$injector",
d);c(b)(a)})}]);return d},e=/^NG_ENABLE_DEBUG_INFO!/,f=/^NG_DEFER_BOOTSTRAP!/;T&&e.test(T.name)&&(c.debugInfoEnabled=!0,T.name=T.name.replace(e,""));if(T&&!f.test(T.name))return d();T.name=T.name.replace(f,"");va.resumeBootstrap=function(b){r(b,function(b){a.push(b)});d()}}function Id(){T.name="NG_ENABLE_DEBUG_INFO!"+T.name;T.location.reload()}function Jd(b){return va.element(b).injector().get("$$testability")}function Mb(b,a){a=a||"_";return b.replace(Kd,function(b,d){return(d?a:"")+b.toLowerCase()})}
function Ld(){var b;tc||((oa=T.jQuery)&&oa.fn.on?(y=oa,H(oa.fn,{scope:Ka.scope,isolateScope:Ka.isolateScope,controller:Ka.controller,injector:Ka.injector,inheritedData:Ka.inheritedData}),b=oa.cleanData,oa.cleanData=function(a){var c;if(Nb)Nb=!1;else for(var d=0,e;null!=(e=a[d]);d++)(c=oa._data(e,"events"))&&c.$destroy&&oa(e).triggerHandler("$destroy");b(a)}):y=R,va.element=y,tc=!0)}function Ob(b,a,c){if(!b)throw Wa("areq",a||"?",c||"required");return b}function pb(b,a,c){c&&G(b)&&(b=b[b.length-1]);
Ob(u(b),a,"not a function, got "+(b&&"object"===typeof b?b.constructor.name||"Object":typeof b));return b}function La(b,a){if("hasOwnProperty"===b)throw Wa("badname",a);}function uc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&u(b)?oc(e,b):b}function qb(b){var a=b[0];b=b[b.length-1];var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return y(c)}function pa(){return Object.create(null)}function Md(b){function a(a,b,c){return a[b]||
(a[b]=c())}var c=v("$injector"),d=v("ng");b=a(b,"angular",Object);b.$$minErr=b.$$minErr||v;return a(b,"module",function(){var b={};return function(f,g,h){if("hasOwnProperty"===f)throw d("badname","module");g&&b.hasOwnProperty(f)&&(b[f]=null);return a(b,f,function(){function a(c,d,e,f){f||(f=b);return function(){f[e||"push"]([c,d,arguments]);return n}}if(!g)throw c("nomod",f);var b=[],d=[],e=[],q=a("$injector","invoke","push",d),n={_invokeQueue:b,_configBlocks:d,_runBlocks:e,requires:g,name:f,provider:a("$provide",
"provider"),factory:a("$provide","factory"),service:a("$provide","service"),value:a("$provide","value"),constant:a("$provide","constant","unshift"),animation:a("$animateProvider","register"),filter:a("$filterProvider","register"),controller:a("$controllerProvider","register"),directive:a("$compileProvider","directive"),config:q,run:function(a){e.push(a);return this}};h&&q(h);return n})}})}function Nd(b){H(b,{bootstrap:sc,copy:Ca,extend:H,equals:na,element:y,forEach:r,injector:Lb,noop:w,bind:oc,toJson:Za,
fromJson:pc,identity:ma,isUndefined:D,isDefined:A,isString:I,isFunction:u,isObject:L,isNumber:W,isElement:nc,isArray:G,version:Od,isDate:ea,lowercase:Q,uppercase:rb,callbacks:{counter:0},getTestability:Jd,$$minErr:v,$$csp:$a,reloadWithDebugInfo:Id});ab=Md(T);try{ab("ngLocale")}catch(a){ab("ngLocale",[]).provider("$locale",Pd)}ab("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Qd});a.provider("$compile",vc).directive({a:Rd,input:wc,textarea:wc,form:Sd,script:Td,select:Ud,style:Vd,
option:Wd,ngBind:Xd,ngBindHtml:Yd,ngBindTemplate:Zd,ngClass:$d,ngClassEven:ae,ngClassOdd:be,ngCloak:ce,ngController:de,ngForm:ee,ngHide:fe,ngIf:ge,ngInclude:he,ngInit:ie,ngNonBindable:je,ngPluralize:ke,ngRepeat:le,ngShow:me,ngStyle:ne,ngSwitch:oe,ngSwitchWhen:pe,ngSwitchDefault:qe,ngOptions:re,ngTransclude:se,ngModel:te,ngList:ue,ngChange:ve,pattern:xc,ngPattern:xc,required:yc,ngRequired:yc,minlength:zc,ngMinlength:zc,maxlength:Ac,ngMaxlength:Ac,ngValue:we,ngModelOptions:xe}).directive({ngInclude:ye}).directive(sb).directive(Bc);
a.provider({$anchorScroll:ze,$animate:Ae,$browser:Be,$cacheFactory:Ce,$controller:De,$document:Ee,$exceptionHandler:Fe,$filter:Cc,$interpolate:Ge,$interval:He,$http:Ie,$httpBackend:Je,$location:Ke,$log:Le,$parse:Me,$rootScope:Ne,$q:Oe,$$q:Pe,$sce:Qe,$sceDelegate:Re,$sniffer:Se,$templateCache:Te,$templateRequest:Ue,$$testability:Ve,$timeout:We,$window:Xe,$$rAF:Ye,$$asyncCallback:Ze})}])}function bb(b){return b.replace($e,function(a,b,d,e){return e?d.toUpperCase():d}).replace(af,"Moz$1")}function Dc(b){b=
b.nodeType;return b===la||!b||9===b}function Ec(b,a){var c,d,e=a.createDocumentFragment(),f=[];if(Pb.test(b)){c=c||e.appendChild(a.createElement("div"));d=(bf.exec(b)||["",""])[1].toLowerCase();d=ha[d]||ha._default;c.innerHTML=d[1]+b.replace(cf,"<$1></$2>")+d[2];for(d=d[0];d--;)c=c.lastChild;f=Xa(f,c.childNodes);c=e.firstChild;c.textContent=""}else f.push(a.createTextNode(b));e.textContent="";e.innerHTML="";r(f,function(a){e.appendChild(a)});return e}function R(b){if(b instanceof R)return b;var a;
I(b)&&(b=P(b),a=!0);if(!(this instanceof R)){if(a&&"<"!=b.charAt(0))throw Qb("nosel");return new R(b)}if(a){a=U;var c;b=(c=df.exec(b))?[a.createElement(c[1])]:(c=Ec(b,a))?c.childNodes:[]}Fc(this,b)}function Rb(b){return b.cloneNode(!0)}function tb(b,a){a||ub(b);if(b.querySelectorAll)for(var c=b.querySelectorAll("*"),d=0,e=c.length;d<e;d++)ub(c[d])}function Gc(b,a,c,d){if(A(d))throw Qb("offargs");var e=(d=vb(b))&&d.events,f=d&&d.handle;if(f)if(a)r(a.split(" "),function(a){if(A(c)){var d=e[a];Va(d||
[],c);if(d&&0<d.length)return}b.removeEventListener(a,f,!1);delete e[a]});else for(a in e)"$destroy"!==a&&b.removeEventListener(a,f,!1),delete e[a]}function ub(b,a){var c=b.ng339,d=c&&wb[c];d&&(a?delete d.data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),Gc(b)),delete wb[c],b.ng339=t))}function vb(b,a){var c=b.ng339,c=c&&wb[c];a&&!c&&(b.ng339=c=++ef,c=wb[c]={events:{},data:{},handle:t});return c}function Sb(b,a,c){if(Dc(b)){var d=A(c),e=!d&&a&&!L(a),f=!a;b=(b=vb(b,!e))&&b.data;if(d)b[a]=
c;else{if(f)return b;if(e)return b&&b[a];H(b,a)}}}function Tb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function Ub(b,a){a&&b.setAttribute&&r(a.split(" "),function(a){b.setAttribute("class",P((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+P(a)+" "," ")))})}function Vb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(a.split(" "),function(a){a=P(a);-1===
c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",P(c))}}function Fc(b,a){if(a)if(a.nodeType)b[b.length++]=a;else{var c=a.length;if("number"===typeof c&&a.window!==a){if(c)for(var d=0;d<c;d++)b[b.length++]=a[d]}else b[b.length++]=a}}function Hc(b,a){return xb(b,"$"+(a||"ngController")+"Controller")}function xb(b,a,c){9==b.nodeType&&(b=b.documentElement);for(a=G(a)?a:[a];b;){for(var d=0,e=a.length;d<e;d++)if((c=y.data(b,a[d]))!==t)return c;b=b.parentNode||11===b.nodeType&&b.host}}function Ic(b){for(tb(b,
!0);b.firstChild;)b.removeChild(b.firstChild)}function Jc(b,a){a||tb(b);var c=b.parentNode;c&&c.removeChild(b)}function ff(b,a){a=a||T;if("complete"===a.document.readyState)a.setTimeout(b);else y(a).on("load",b)}function Kc(b,a){var c=yb[a.toLowerCase()];return c&&Lc[sa(b)]&&c}function gf(b,a){var c=b.nodeName;return("INPUT"===c||"TEXTAREA"===c)&&Mc[a]}function hf(b,a){var c=function(c,e){c.isDefaultPrevented=function(){return c.defaultPrevented};var f=a[e||c.type],g=f?f.length:0;if(g){if(D(c.immediatePropagationStopped)){var h=
c.stopImmediatePropagation;c.stopImmediatePropagation=function(){c.immediatePropagationStopped=!0;c.stopPropagation&&c.stopPropagation();h&&h.call(c)}}c.isImmediatePropagationStopped=function(){return!0===c.immediatePropagationStopped};1<g&&(f=ta(f));for(var k=0;k<g;k++)c.isImmediatePropagationStopped()||f[k].call(b,c)}};c.elem=b;return c}function Ma(b,a){var c=b&&b.$$hashKey;if(c)return"function"===typeof c&&(c=b.$$hashKey()),c;c=typeof b;return c="function"==c||"object"==c&&null!==b?b.$$hashKey=
c+":"+(a||Dd)():c+":"+b}function cb(b,a){if(a){var c=0;this.nextUid=function(){return++c}}r(b,this.put,this)}function jf(b){return(b=b.toString().replace(Nc,"").match(Oc))?"function("+(b[1]||"").replace(/[\s\r\n]+/," ")+")":"fn"}function Wb(b,a,c){var d;if("function"===typeof b){if(!(d=b.$inject)){d=[];if(b.length){if(a)throw I(c)&&c||(c=b.name||jf(b)),Ea("strictdi",c);a=b.toString().replace(Nc,"");a=a.match(Oc);r(a[1].split(kf),function(a){a.replace(lf,function(a,b,c){d.push(c)})})}b.$inject=d}}else G(b)?
(a=b.length-1,pb(b[a],"fn"),d=b.slice(0,a)):pb(b,"fn",!0);return d}function Lb(b,a){function c(a){return function(b,c){if(L(b))r(b,kc(a));else return a(b,c)}}function d(a,b){La(a,"service");if(u(b)||G(b))b=q.instantiate(b);if(!b.$get)throw Ea("pget",a);return p[a+"Provider"]=b}function e(a,b){return function(){var c=s.invoke(b,this,t,a);if(D(c))throw Ea("undef",a);return c}}function f(a,b,c){return d(a,{$get:!1!==c?e(a,b):b})}function g(a){var b=[],c;r(a,function(a){function d(a){var b,c;b=0;for(c=
a.length;b<c;b++){var e=a[b],f=q.get(e[0]);f[e[1]].apply(f,e[2])}}if(!m.get(a)){m.put(a,!0);try{I(a)?(c=ab(a),b=b.concat(g(c.requires)).concat(c._runBlocks),d(c._invokeQueue),d(c._configBlocks)):u(a)?b.push(q.invoke(a)):G(a)?b.push(q.invoke(a)):pb(a,"module")}catch(e){throw G(a)&&(a=a[a.length-1]),e.message&&e.stack&&-1==e.stack.indexOf(e.message)&&(e=e.message+"\n"+e.stack),Ea("modulerr",a,e.stack||e.message||e);}}});return b}function h(b,c){function d(a){if(b.hasOwnProperty(a)){if(b[a]===k)throw Ea("cdep",
a+" <- "+l.join(" <- "));return b[a]}try{return l.unshift(a),b[a]=k,b[a]=c(a)}catch(e){throw b[a]===k&&delete b[a],e;}finally{l.shift()}}function e(b,c,f,g){"string"===typeof f&&(g=f,f=null);var k=[];g=Wb(b,a,g);var h,l,n;l=0;for(h=g.length;l<h;l++){n=g[l];if("string"!==typeof n)throw Ea("itkn",n);k.push(f&&f.hasOwnProperty(n)?f[n]:d(n))}G(b)&&(b=b[h]);return b.apply(c,k)}return{invoke:e,instantiate:function(a,b,c){var d=function(){};d.prototype=(G(a)?a[a.length-1]:a).prototype;d=new d;a=e(a,d,b,
c);return L(a)||u(a)?a:d},get:d,annotate:Wb,has:function(a){return p.hasOwnProperty(a+"Provider")||b.hasOwnProperty(a)}}}a=!0===a;var k={},l=[],m=new cb([],!0),p={$provide:{provider:c(d),factory:c(f),service:c(function(a,b){return f(a,["$injector",function(a){return a.instantiate(b)}])}),value:c(function(a,b){return f(a,ba(b),!1)}),constant:c(function(a,b){La(a,"constant");p[a]=b;n[a]=b}),decorator:function(a,b){var c=q.get(a+"Provider"),d=c.$get;c.$get=function(){var a=s.invoke(d,c);return s.invoke(b,
null,{$delegate:a})}}}},q=p.$injector=h(p,function(){throw Ea("unpr",l.join(" <- "));}),n={},s=n.$injector=h(n,function(a){var b=q.get(a+"Provider");return s.invoke(b.$get,b,t,a)});r(g(b),function(a){s.invoke(a||w)});return s}function ze(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;Array.prototype.some.call(a,function(a){if("a"===sa(a))return b=a,!0});return b}function f(b){if(b){b.scrollIntoView();var c;
c=g.yOffset;u(c)?c=c():nc(c)?(c=c[0],c="fixed"!==a.getComputedStyle(c).position?0:c.getBoundingClientRect().bottom):W(c)||(c=0);c&&(b=b.getBoundingClientRect().top,a.scrollBy(0,b-c))}else a.scrollTo(0,0)}function g(){var a=c.hash(),b;a?(b=h.getElementById(a))?f(b):(b=e(h.getElementsByName(a)))?f(b):"top"===a&&f(null):f(null)}var h=a.document;b&&d.$watch(function(){return c.hash()},function(a,b){a===b&&""===a||ff(function(){d.$evalAsync(g)})});return g}]}function Ze(){this.$get=["$$rAF","$timeout",
function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function mf(b,a,c,d){function e(a){try{a.apply(null,Ya.call(arguments,1))}finally{if(x--,0===x)for(;B.length;)try{B.pop()()}catch(b){c.error(b)}}}function f(a,b){(function ya(){r(J,function(a){a()});z=b(ya,a)})()}function g(){h();k()}function h(){F=b.history.state;F=D(F)?null:F;na(F,S)&&(F=S);S=F}function k(){if(C!==m.url()||N!==F)C=m.url(),N=F,r(V,function(a){a(m.url(),F)})}function l(a){try{return decodeURIComponent(a)}catch(b){return a}}
var m=this,p=a[0],q=b.location,n=b.history,s=b.setTimeout,O=b.clearTimeout,E={};m.isMock=!1;var x=0,B=[];m.$$completeOutstandingRequest=e;m.$$incOutstandingRequestCount=function(){x++};m.notifyWhenNoOutstandingRequests=function(a){r(J,function(a){a()});0===x?a():B.push(a)};var J=[],z;m.addPollFn=function(a){D(z)&&f(100,s);J.push(a);return a};var F,N,C=q.href,ca=a.find("base"),M=null;h();N=F;m.url=function(a,c,e){D(e)&&(e=null);q!==b.location&&(q=b.location);n!==b.history&&(n=b.history);if(a){var f=
N===e;if(C!==a||d.history&&!f){var g=C&&Fa(C)===Fa(a);C=a;N=e;!d.history||g&&f?(g||(M=a),c?q.replace(a):q.href=a):(n[c?"replaceState":"pushState"](e,"",a),h(),N=F);return m}}else return M||q.href.replace(/%27/g,"'")};m.state=function(){return F};var V=[],X=!1,S=null;m.onUrlChange=function(a){if(!X){if(d.history)y(b).on("popstate",g);y(b).on("hashchange",g);X=!0}V.push(a);return a};m.$$checkUrlChange=k;m.baseHref=function(){var a=ca.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};
var da={},A="",fa=m.baseHref();m.cookies=function(a,b){var d,e,f,g;if(a)b===t?p.cookie=encodeURIComponent(a)+"=;path="+fa+";expires=Thu, 01 Jan 1970 00:00:00 GMT":I(b)&&(d=(p.cookie=encodeURIComponent(a)+"="+encodeURIComponent(b)+";path="+fa).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(p.cookie!==A)for(A=p.cookie,d=A.split("; "),da={},f=0;f<d.length;f++)e=d[f],g=e.indexOf("="),0<g&&(a=l(e.substring(0,g)),da[a]===
t&&(da[a]=l(e.substring(g+1))));return da}};m.defer=function(a,b){var c;x++;c=s(function(){delete E[c];e(a)},b||0);E[c]=!0;return c};m.defer.cancel=function(a){return E[a]?(delete E[a],O(a),e(w),!0):!1}}function Be(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new mf(b,d,a,c)}]}function Ce(){this.$get=function(){function b(b,d){function e(a){a!=p&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,p),p=a,p.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw v("$cacheFactory")("iid",
b);var g=0,h=H({},d,{id:b}),k={},l=d&&d.capacity||Number.MAX_VALUE,m={},p=null,q=null;return a[b]={put:function(a,b){if(l<Number.MAX_VALUE){var c=m[a]||(m[a]={key:a});e(c)}if(!D(b))return a in k||g++,k[a]=b,g>l&&this.remove(q.key),b},get:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;e(b)}return k[a]},remove:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;b==p&&(p=b.p);b==q&&(q=b.n);f(b.n,b.p);delete m[a]}delete k[a];g--},removeAll:function(){k={};g=0;m={};p=q=null},destroy:function(){m=
h=k=null;delete a[b]},info:function(){return H({},h,{size:g})}}}var a={};b.info=function(){var b={};r(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function Te(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function vc(b,a){function c(a,b){var c=/^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,d={};r(a,function(a,e){var f=a.match(c);if(!f)throw ia("iscp",b,e,a);d[e]={mode:f[1][0],collection:"*"===f[2],optional:"?"===f[3],attrName:f[4]||e}});return d}var d=
{},e=/^\s*directive\:\s*([\w\-]+)\s+(.*)$/,f=/(([\w\-]+)(?:\:([^;]+))?;?)/,g=Ed("ngSrc,ngSrcset,src,srcset"),h=/^(?:(\^\^?)?(\?)?(\^\^?)?)?/,k=/^(on[a-z]+|formaction)$/;this.directive=function p(a,e){La(a,"directive");I(a)?(Ob(e,"directiveFactory"),d.hasOwnProperty(a)||(d[a]=[],b.factory(a+"Directive",["$injector","$exceptionHandler",function(b,e){var f=[];r(d[a],function(d,g){try{var h=b.invoke(d);u(h)?h={compile:ba(h)}:!h.compile&&h.link&&(h.compile=ba(h.link));h.priority=h.priority||0;h.index=
g;h.name=h.name||a;h.require=h.require||h.controller&&h.name;h.restrict=h.restrict||"EA";L(h.scope)&&(h.$$isolateBindings=c(h.scope,h.name));f.push(h)}catch(k){e(k)}});return f}])),d[a].push(e)):r(a,kc(p));return this};this.aHrefSanitizationWhitelist=function(b){return A(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return A(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};var l=!0;this.debugInfoEnabled=
function(a){return A(a)?(l=a,this):l};this.$get=["$injector","$interpolate","$exceptionHandler","$templateRequest","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,c,s,O,E,x,B,J,z,F){function N(a,b){try{a.addClass(b)}catch(c){}}function C(a,b,c,d,e){a instanceof y||(a=y(a));r(a,function(b,c){b.nodeType==mb&&b.nodeValue.match(/\S+/)&&(a[c]=y(b).wrap("<span></span>").parent()[0])});var f=ca(a,b,a,c,d,e);C.$$addScopeClass(a);var g=null;return function(b,
c,d){Ob(b,"scope");d=d||{};var e=d.parentBoundTranscludeFn,h=d.transcludeControllers;d=d.futureParentElement;e&&e.$$boundTransclude&&(e=e.$$boundTransclude);g||(g=(d=d&&d[0])?"foreignobject"!==sa(d)&&d.toString().match(/SVG/)?"svg":"html":"html");d="html"!==g?y(T(g,y("<div>").append(a).html())):c?Ka.clone.call(a):a;if(h)for(var k in h)d.data("$"+k+"Controller",h[k].instance);C.$$addScopeInfo(d,b);c&&c(d,b);f&&f(b,d,d,e);return d}}function ca(a,b,c,d,e,f){function g(a,c,d,e){var f,k,l,q,s,p,B;if(n)for(B=
Array(c.length),q=0;q<h.length;q+=3)f=h[q],B[f]=c[f];else B=c;q=0;for(s=h.length;q<s;)k=B[h[q++]],c=h[q++],f=h[q++],c?(c.scope?(l=a.$new(),C.$$addScopeInfo(y(k),l)):l=a,p=c.transcludeOnThisElement?M(a,c.transclude,e,c.elementTranscludeOnThisElement):!c.templateOnThisElement&&e?e:!e&&b?M(a,b):null,c(f,l,k,d,p)):f&&f(a,k.childNodes,t,e)}for(var h=[],k,l,q,s,n,p=0;p<a.length;p++){k=new W;l=V(a[p],[],k,0===p?d:t,e);(f=l.length?A(l,a[p],k,b,c,null,[],[],f):null)&&f.scope&&C.$$addScopeClass(k.$$element);
k=f&&f.terminal||!(q=a[p].childNodes)||!q.length?null:ca(q,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:b);if(f||k)h.push(p,f,k),s=!0,n=n||f;f=null}return s?g:null}function M(a,b,c,d){return function(d,e,f,g,h){d||(d=a.$new(!1,h),d.$$transcluded=!0);return b(d,e,{parentBoundTranscludeFn:c,transcludeControllers:f,futureParentElement:g})}}function V(b,c,g,h,k){var l=g.$attr,q;switch(b.nodeType){case la:fa(c,wa(sa(b)),"E",h,k);for(var s,n,B,O=b.attributes,E=0,J=O&&O.length;E<
J;E++){var F=!1,x=!1;s=O[E];q=s.name;s=P(s.value);n=wa(q);if(B=za.test(n))q=Mb(n.substr(6),"-");var N=n.replace(/(Start|End)$/,""),C;a:{var z=N;if(d.hasOwnProperty(z)){C=void 0;for(var z=a.get(z+"Directive"),V=0,r=z.length;V<r;V++)if(C=z[V],C.multiElement){C=!0;break a}}C=!1}C&&n===N+"Start"&&(F=q,x=q.substr(0,q.length-5)+"end",q=q.substr(0,q.length-6));n=wa(q.toLowerCase());l[n]=q;if(B||!g.hasOwnProperty(n))g[n]=s,Kc(b,n)&&(g[n]=!0);R(b,c,s,n,B);fa(c,n,"A",h,k,F,x)}b=b.className;if(I(b)&&""!==b)for(;q=
f.exec(b);)n=wa(q[2]),fa(c,n,"C",h,k)&&(g[n]=P(q[3])),b=b.substr(q.index+q[0].length);break;case mb:Y(c,b.nodeValue);break;case 8:try{if(q=e.exec(b.nodeValue))n=wa(q[1]),fa(c,n,"M",h,k)&&(g[n]=P(q[2]))}catch(ca){}}c.sort(v);return c}function X(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ia("uterdir",b,c);a.nodeType==la&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return y(d)}function S(a,b,c){return function(d,
e,f,g,h){e=X(e[0],b,c);return a(d,e,f,g,h)}}function A(a,d,e,f,g,k,l,s,p){function B(a,b,c,d){if(a){c&&(a=S(a,c,d));a.require=K.require;a.directiveName=ga;if(M===K||K.$$isolateScope)a=Z(a,{isolateScope:!0});l.push(a)}if(b){c&&(b=S(b,c,d));b.require=K.require;b.directiveName=ga;if(M===K||K.$$isolateScope)b=Z(b,{isolateScope:!0});s.push(b)}}function J(a,b,c,d){var e,f="data",g=!1,k=c,l;if(I(b)){l=b.match(h);b=b.substring(l[0].length);l[3]&&(l[1]?l[3]=null:l[1]=l[3]);"^"===l[1]?f="inheritedData":"^^"===
l[1]&&(f="inheritedData",k=c.parent());"?"===l[2]&&(g=!0);e=null;d&&"data"===f&&(e=d[b])&&(e=e.instance);e=e||k[f]("$"+b+"Controller");if(!e&&!g)throw ia("ctreq",b,a);return e||null}G(b)&&(e=[],r(b,function(b){e.push(J(a,b,c,d))}));return e}function F(a,c,f,g,h){function k(a,b,c){var d;Ta(a)||(c=b,b=a,a=t);H&&(d=N);c||(c=H?V.parent():V);return h(a,b,d,c,Xb)}var n,p,B,x,N,db,V,S;d===f?(S=e,V=e.$$element):(V=y(f),S=new W(V,e));M&&(x=c.$new(!0));h&&(db=k,db.$$boundTransclude=h);z&&(ca={},N={},r(z,function(a){var b=
{$scope:a===M||a.$$isolateScope?x:c,$element:V,$attrs:S,$transclude:db};B=a.controller;"@"==B&&(B=S[a.name]);b=E(B,b,!0,a.controllerAs);N[a.name]=b;H||V.data("$"+a.name+"Controller",b.instance);ca[a.name]=b}));if(M){C.$$addScopeInfo(V,x,!0,!(da&&(da===M||da===M.$$originalDirective)));C.$$addScopeClass(V,!0);g=ca&&ca[M.name];var X=x;g&&g.identifier&&!0===M.bindToController&&(X=g.instance);r(x.$$isolateBindings=M.$$isolateBindings,function(a,d){var e=a.attrName,f=a.optional,g,h,k,l;switch(a.mode){case "@":S.$observe(e,
function(a){X[d]=a});S.$$observers[e].$$scope=c;S[e]&&(X[d]=b(S[e])(c));break;case "=":if(f&&!S[e])break;h=O(S[e]);l=h.literal?na:function(a,b){return a===b||a!==a&&b!==b};k=h.assign||function(){g=X[d]=h(c);throw ia("nonassign",S[e],M.name);};g=X[d]=h(c);f=function(a){l(a,X[d])||(l(a,g)?k(c,a=X[d]):X[d]=a);return g=a};f.$stateful=!0;f=a.collection?c.$watchCollection(S[e],f):c.$watch(O(S[e],f),null,h.literal);x.$on("$destroy",f);break;case "&":h=O(S[e]),X[d]=function(a){return h(c,a)}}})}ca&&(r(ca,
function(a){a()}),ca=null);g=0;for(n=l.length;g<n;g++)p=l[g],$(p,p.isolateScope?x:c,V,S,p.require&&J(p.directiveName,p.require,V,N),db);var Xb=c;M&&(M.template||null===M.templateUrl)&&(Xb=x);a&&a(Xb,f.childNodes,t,h);for(g=s.length-1;0<=g;g--)p=s[g],$(p,p.isolateScope?x:c,V,S,p.require&&J(p.directiveName,p.require,V,N),db)}p=p||{};for(var x=-Number.MAX_VALUE,N,z=p.controllerDirectives,ca,M=p.newIsolateScopeDirective,da=p.templateDirective,fa=p.nonTlbTranscludeDirective,w=!1,Na=!1,H=p.hasElementTranscludeDirective,
Y=e.$$element=y(d),K,ga,v,Ga=f,Q,R=0,za=a.length;R<za;R++){K=a[R];var zb=K.$$start,aa=K.$$end;zb&&(Y=X(d,zb,aa));v=t;if(x>K.priority)break;if(v=K.scope)K.templateUrl||(L(v)?(ya("new/isolated scope",M||N,K,Y),M=K):ya("new/isolated scope",M,K,Y)),N=N||K;ga=K.name;!K.templateUrl&&K.controller&&(v=K.controller,z=z||{},ya("'"+ga+"' controller",z[ga],K,Y),z[ga]=K);if(v=K.transclude)w=!0,K.$$tlb||(ya("transclusion",fa,K,Y),fa=K),"element"==v?(H=!0,x=K.priority,v=Y,Y=e.$$element=y(U.createComment(" "+ga+
": "+e[ga]+" ")),d=Y[0],Ab(g,Ya.call(v,0),d),Ga=C(v,f,x,k&&k.name,{nonTlbTranscludeDirective:fa})):(v=y(Rb(d)).contents(),Y.empty(),Ga=C(v,f));if(K.template)if(Na=!0,ya("template",da,K,Y),da=K,v=u(K.template)?K.template(Y,e):K.template,v=Qc(v),K.replace){k=K;v=Pb.test(v)?Rc(T(K.templateNamespace,P(v))):[];d=v[0];if(1!=v.length||d.nodeType!==la)throw ia("tplrt",ga,"");Ab(g,Y,d);za={$attr:{}};v=V(d,[],za);var of=a.splice(R+1,a.length-(R+1));M&&D(v);a=a.concat(v).concat(of);Pc(e,za);za=a.length}else Y.html(v);
if(K.templateUrl)Na=!0,ya("template",da,K,Y),da=K,K.replace&&(k=K),F=nf(a.splice(R,a.length-R),Y,e,g,w&&Ga,l,s,{controllerDirectives:z,newIsolateScopeDirective:M,templateDirective:da,nonTlbTranscludeDirective:fa}),za=a.length;else if(K.compile)try{Q=K.compile(Y,e,Ga),u(Q)?B(null,Q,zb,aa):Q&&B(Q.pre,Q.post,zb,aa)}catch(ba){c(ba,ua(Y))}K.terminal&&(F.terminal=!0,x=Math.max(x,K.priority))}F.scope=N&&!0===N.scope;F.transcludeOnThisElement=w;F.elementTranscludeOnThisElement=H;F.templateOnThisElement=Na;
F.transclude=Ga;p.hasElementTranscludeDirective=H;return F}function D(a){for(var b=0,c=a.length;b<c;b++)a[b]=mc(a[b],{$$isolateScope:!0})}function fa(b,e,f,g,h,k,l){if(e===h)return null;h=null;if(d.hasOwnProperty(e)){var q;e=a.get(e+"Directive");for(var s=0,B=e.length;s<B;s++)try{q=e[s],(g===t||g>q.priority)&&-1!=q.restrict.indexOf(f)&&(k&&(q=mc(q,{$$start:k,$$end:l})),b.push(q),h=q)}catch(O){c(O)}}return h}function Pc(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;r(a,function(d,e){"$"!=e.charAt(0)&&
(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});r(b,function(b,f){"class"==f?(N(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function nf(a,b,c,d,e,f,g,h){var k=[],l,q,n=b[0],p=a.shift(),B=H({},p,{templateUrl:null,transclude:null,replace:null,$$originalDirective:p}),O=u(p.templateUrl)?p.templateUrl(b,c):p.templateUrl,E=p.templateNamespace;
b.empty();s(J.getTrustedResourceUrl(O)).then(function(s){var F,J;s=Qc(s);if(p.replace){s=Pb.test(s)?Rc(T(E,P(s))):[];F=s[0];if(1!=s.length||F.nodeType!==la)throw ia("tplrt",p.name,O);s={$attr:{}};Ab(d,b,F);var x=V(F,[],s);L(p.scope)&&D(x);a=x.concat(a);Pc(c,s)}else F=n,b.html(s);a.unshift(B);l=A(a,F,c,e,b,p,f,g,h);r(d,function(a,c){a==F&&(d[c]=b[0])});for(q=ca(b[0].childNodes,e);k.length;){s=k.shift();J=k.shift();var z=k.shift(),C=k.shift(),x=b[0];if(!s.$$destroyed){if(J!==n){var S=J.className;h.hasElementTranscludeDirective&&
p.replace||(x=Rb(F));Ab(z,y(J),x);N(y(x),S)}J=l.transcludeOnThisElement?M(s,l.transclude,C):C;l(q,s,x,d,J)}}k=null});return function(a,b,c,d,e){a=e;b.$$destroyed||(k?(k.push(b),k.push(c),k.push(d),k.push(a)):(l.transcludeOnThisElement&&(a=M(b,l.transclude,e)),l(q,b,c,d,a)))}}function v(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function ya(a,b,c,d){if(b)throw ia("multidir",b.name,c.name,a,ua(d));}function Y(a,c){var d=b(c,!0);d&&a.push({priority:0,
compile:function(a){a=a.parent();var b=!!a.length;b&&C.$$addBindingClass(a);return function(a,c){var e=c.parent();b||C.$$addBindingClass(e);C.$$addBindingInfo(e,d.expressions);a.$watch(d,function(a){c[0].nodeValue=a})}}})}function T(a,b){a=Q(a||"html");switch(a){case "svg":case "math":var c=U.createElement("div");c.innerHTML="<"+a+">"+b+"</"+a+">";return c.childNodes[0].childNodes;default:return b}}function Ga(a,b){if("srcdoc"==b)return J.HTML;var c=sa(a);if("xlinkHref"==b||"form"==c&&"action"==b||
"img"!=c&&("src"==b||"ngSrc"==b))return J.RESOURCE_URL}function R(a,c,d,e,f){var h=b(d,!0);if(h){if("multiple"===e&&"select"===sa(a))throw ia("selmulti",ua(a));c.push({priority:100,compile:function(){return{pre:function(c,d,l){d=l.$$observers||(l.$$observers={});if(k.test(e))throw ia("nodomevents");l[e]&&(h=b(l[e],!0,Ga(a,e),g[e]||f))&&(l[e]=h(c),(d[e]||(d[e]=[])).$$inter=!0,(l.$$observers&&l.$$observers[e].$$scope||c).$watch(h,function(a,b){"class"===e&&a!=b?l.$updateClass(a,b):l.$set(e,a)}))}}}})}}
function Ab(a,b,c){var d=b[0],e=b.length,f=d.parentNode,g,h;if(a)for(g=0,h=a.length;g<h;g++)if(a[g]==d){a[g++]=c;h=g+e-1;for(var k=a.length;g<k;g++,h++)h<k?a[g]=a[h]:delete a[g];a.length-=e-1;a.context===d&&(a.context=c);break}f&&f.replaceChild(c,d);a=U.createDocumentFragment();a.appendChild(d);y(c).data(y(d).data());oa?(Nb=!0,oa.cleanData([d])):delete y.cache[d[y.expando]];d=1;for(e=b.length;d<e;d++)f=b[d],y(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function Z(a,b){return H(function(){return a.apply(null,
arguments)},a,b)}function $(a,b,d,e,f,g){try{a(b,d,e,f,g)}catch(h){c(h,ua(d))}}var W=function(a,b){if(b){var c=Object.keys(b),d,e,f;d=0;for(e=c.length;d<e;d++)f=c[d],this[f]=b[f]}else this.$attr={};this.$$element=a};W.prototype={$normalize:wa,$addClass:function(a){a&&0<a.length&&z.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&z.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=Sc(a,b);c&&c.length&&z.addClass(this.$$element,c);(c=Sc(b,a))&&c.length&&z.removeClass(this.$$element,
c)},$set:function(a,b,d,e){var f=this.$$element[0],g=Kc(f,a),h=gf(f,a),f=a;g?(this.$$element.prop(a,b),e=g):h&&(this[h]=b,f=h);this[a]=b;e?this.$attr[a]=e:(e=this.$attr[a])||(this.$attr[a]=e=Mb(a,"-"));g=sa(this.$$element);if("a"===g&&"href"===a||"img"===g&&"src"===a)this[a]=b=F(b,"src"===a);else if("img"===g&&"srcset"===a){for(var g="",h=P(b),k=/(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,k=/\s/.test(h)?k:/(,)/,h=h.split(k),k=Math.floor(h.length/2),l=0;l<k;l++)var q=2*l,g=g+F(P(h[q]),!0),g=g+(" "+P(h[q+
1]));h=P(h[2*l]).split(/\s/);g+=F(P(h[0]),!0);2===h.length&&(g+=" "+P(h[1]));this[a]=b=g}!1!==d&&(null===b||b===t?this.$$element.removeAttr(e):this.$$element.attr(e,b));(a=this.$$observers)&&r(a[f],function(a){try{a(b)}catch(d){c(d)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers=pa()),e=d[a]||(d[a]=[]);e.push(b);x.$evalAsync(function(){!e.$$inter&&c.hasOwnProperty(a)&&b(c[a])});return function(){Va(e,b)}}};var Na=b.startSymbol(),ga=b.endSymbol(),Qc="{{"==Na||"}}"==ga?ma:function(a){return a.replace(/\{\{/g,
Na).replace(/}}/g,ga)},za=/^ngAttr[A-Z]/;C.$$addBindingInfo=l?function(a,b){var c=a.data("$binding")||[];G(b)?c=c.concat(b):c.push(b);a.data("$binding",c)}:w;C.$$addBindingClass=l?function(a){N(a,"ng-binding")}:w;C.$$addScopeInfo=l?function(a,b,c,d){a.data(c?d?"$isolateScopeNoTemplate":"$isolateScope":"$scope",b)}:w;C.$$addScopeClass=l?function(a,b){N(a,b?"ng-isolate-scope":"ng-scope")}:w;return C}]}function wa(b){return bb(b.replace(pf,""))}function Sc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),
f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function Rc(b){b=y(b);var a=b.length;if(1>=a)return b;for(;a--;)8===b[a].nodeType&&qf.call(b,a,1);return b}function De(){var b={},a=!1,c=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,c){La(a,"controller");L(a)?H(b,a):b[a]=c};this.allowGlobals=function(){a=!0};this.$get=["$injector","$window",function(d,e){function f(a,b,c,d){if(!a||!L(a.$scope))throw v("$controller")("noscp",d,
b);a.$scope[b]=c}return function(g,h,k,l){var m,p,q;k=!0===k;l&&I(l)&&(q=l);I(g)&&(l=g.match(c),p=l[1],q=q||l[3],g=b.hasOwnProperty(p)?b[p]:uc(h.$scope,p,!0)||(a?uc(e,p,!0):t),pb(g,p,!0));if(k)return k=function(){},k.prototype=(G(g)?g[g.length-1]:g).prototype,m=new k,q&&f(h,q,m,p||g.name),H(function(){d.invoke(g,m,h,p);return m},{instance:m,identifier:q});m=d.instantiate(g,h,p);q&&f(h,q,m,p||g.name);return m}}]}function Ee(){this.$get=["$window",function(b){return y(b.document)}]}function Fe(){this.$get=
["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Yb(b,a){if(I(b)){b=b.replace(rf,"");var c=a("Content-Type");if(c&&0===c.indexOf(Tc)&&b.trim()||sf.test(b)&&tf.test(b))b=pc(b)}return b}function Uc(b){var a={},c,d,e;if(!b)return a;r(b.split("\n"),function(b){e=b.indexOf(":");c=Q(P(b.substr(0,e)));d=P(b.substr(e+1));c&&(a[c]=a[c]?a[c]+", "+d:d)});return a}function Vc(b){var a=L(b)?b:t;return function(c){a||(a=Uc(b));return c?a[Q(c)]||null:a}}function Wc(b,a,c){if(u(c))return c(b,
a);r(c,function(c){b=c(b,a)});return b}function Ie(){var b=this.defaults={transformResponse:[Yb],transformRequest:[function(a){return L(a)&&"[object File]"!==Ja.call(a)&&"[object Blob]"!==Ja.call(a)?Za(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ta(Zb),put:ta(Zb),patch:ta(Zb)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},a=!1;this.useApplyAsync=function(b){return A(b)?(a=!!b,this):a};var c=this.interceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory",
"$rootScope","$q","$injector",function(d,e,f,g,h,k){function l(a){function c(a){var b=H({},a);b.data=a.data?Wc(a.data,a.headers,d.transformResponse):a.data;a=a.status;return 200<=a&&300>a?b:h.reject(b)}var d={method:"get",transformRequest:b.transformRequest,transformResponse:b.transformResponse},e=function(a){var c=b.headers,d=H({},a.headers),e,f,c=H({},c.common,c[Q(a.method)]);a:for(e in c){a=Q(e);for(f in d)if(Q(f)===a)continue a;d[e]=c[e]}(function(a){var b;r(a,function(c,d){u(c)&&(b=c(),null!=
b?a[d]=b:delete a[d])})})(d);return d}(a);H(d,a);d.headers=e;d.method=rb(d.method);var f=[function(a){e=a.headers;var d=Wc(a.data,Vc(e),a.transformRequest);D(d)&&r(e,function(a,b){"content-type"===Q(b)&&delete e[b]});D(a.withCredentials)&&!D(b.withCredentials)&&(a.withCredentials=b.withCredentials);return m(a,d,e).then(c,c)},t],g=h.when(d);for(r(n,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=
f.shift();var k=f.shift(),g=g.then(a,k)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,d)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,d)});return g};return g}function m(c,f,k){function n(b,c,d,e){function f(){m(c,b,d,e)}N&&(200<=b&&300>b?N.put(r,[b,c,Uc(d),e]):N.remove(r));a?g.$applyAsync(f):(f(),g.$$phase||g.$apply())}function m(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?z.resolve:z.reject)({data:a,status:b,headers:Vc(d),config:c,statusText:e})}
function J(){var a=l.pendingRequests.indexOf(c);-1!==a&&l.pendingRequests.splice(a,1)}var z=h.defer(),F=z.promise,N,C,r=p(c.url,c.params);l.pendingRequests.push(c);F.then(J,J);!c.cache&&!b.cache||!1===c.cache||"GET"!==c.method&&"JSONP"!==c.method||(N=L(c.cache)?c.cache:L(b.cache)?b.cache:q);if(N)if(C=N.get(r),A(C)){if(C&&u(C.then))return C.then(J,J),C;G(C)?m(C[1],C[0],ta(C[2]),C[3]):m(C,200,{},"OK")}else N.put(r,F);D(C)&&((C=Xc(c.url)?e.cookies()[c.xsrfCookieName||b.xsrfCookieName]:t)&&(k[c.xsrfHeaderName||
b.xsrfHeaderName]=C),d(c.method,r,f,n,k,c.timeout,c.withCredentials,c.responseType));return F}function p(a,b){if(!b)return a;var c=[];Cd(b,function(a,b){null===a||D(a)||(G(a)||(a=[a]),r(a,function(a){L(a)&&(a=ea(a)?a.toISOString():Za(a));c.push(Da(b)+"="+Da(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var q=f("$http"),n=[];r(c,function(a){n.unshift(I(a)?k.get(a):k.invoke(a))});l.pendingRequests=[];(function(a){r(arguments,function(a){l[a]=function(b,c){return l(H(c||
{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){r(arguments,function(a){l[a]=function(b,c,d){return l(H(d||{},{method:a,url:b,data:c}))}})})("post","put","patch");l.defaults=b;return l}]}function uf(){return new T.XMLHttpRequest}function Je(){this.$get=["$browser","$window","$document",function(b,a,c){return vf(b,uf,b.defer,a.angular.callbacks,c[0])}]}function vf(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),m=null;f.type="text/javascript";f.src=a;f.async=!0;
m=function(a){f.removeEventListener("load",m,!1);f.removeEventListener("error",m,!1);e.body.removeChild(f);f=null;var g=-1,n="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),n=a.type,g="error"===a.type?404:200);c&&c(g,n)};f.addEventListener("load",m,!1);f.addEventListener("error",m,!1);e.body.appendChild(f);return m}return function(e,h,k,l,m,p,q,n){function s(){x&&x();B&&B.abort()}function O(a,d,e,f,g){z&&c.cancel(z);x=B=null;a(d,e,f,g);b.$$completeOutstandingRequest(w)}b.$$incOutstandingRequestCount();
h=h||b.url();if("jsonp"==Q(e)){var E="_"+(d.counter++).toString(36);d[E]=function(a){d[E].data=a;d[E].called=!0};var x=f(h.replace("JSON_CALLBACK","angular.callbacks."+E),E,function(a,b){O(l,a,d[E].data,"",b);d[E]=w})}else{var B=a();B.open(e,h,!0);r(m,function(a,b){A(a)&&B.setRequestHeader(b,a)});B.onload=function(){var a=B.statusText||"",b="response"in B?B.response:B.responseText,c=1223===B.status?204:B.status;0===c&&(c=b?200:"file"==Aa(h).protocol?404:0);O(l,c,b,B.getAllResponseHeaders(),a)};e=
function(){O(l,-1,null,null,"")};B.onerror=e;B.onabort=e;q&&(B.withCredentials=!0);if(n)try{B.responseType=n}catch(J){if("json"!==n)throw J;}B.send(k||null)}if(0<p)var z=c(s,p);else p&&u(p.then)&&p.then(s)}}function Ge(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(a){return"\\\\\\"+a}function g(f,g,n,s){function O(c){return c.replace(l,b).replace(m,
a)}function E(a){try{var b=a;a=n?e.getTrusted(n,b):e.valueOf(b);var c;if(s&&!A(a))c=a;else if(null==a)c="";else{switch(typeof a){case "string":break;case "number":a=""+a;break;default:a=Za(a)}c=a}return c}catch(g){c=$b("interr",f,g.toString()),d(c)}}s=!!s;for(var x,B,J=0,z=[],F=[],N=f.length,C=[],r=[];J<N;)if(-1!=(x=f.indexOf(b,J))&&-1!=(B=f.indexOf(a,x+h)))J!==x&&C.push(O(f.substring(J,x))),J=f.substring(x+h,B),z.push(J),F.push(c(J,E)),J=B+k,r.push(C.length),C.push("");else{J!==N&&C.push(O(f.substring(J)));
break}if(n&&1<C.length)throw $b("noconcat",f);if(!g||z.length){var M=function(a){for(var b=0,c=z.length;b<c;b++){if(s&&D(a[b]))return;C[r[b]]=a[b]}return C.join("")};return H(function(a){var b=0,c=z.length,e=Array(c);try{for(;b<c;b++)e[b]=F[b](a);return M(e)}catch(g){a=$b("interr",f,g.toString()),d(a)}},{exp:f,expressions:z,$$watchDelegate:function(a,b,c){var d;return a.$watchGroup(F,function(c,e){var f=M(c);u(b)&&b.call(this,f,c!==e?d:f,a);d=f},c)}})}}var h=b.length,k=a.length,l=new RegExp(b.replace(/./g,
f),"g"),m=new RegExp(a.replace(/./g,f),"g");g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function He(){this.$get=["$rootScope","$window","$q","$$q",function(b,a,c,d){function e(e,h,k,l){var m=a.setInterval,p=a.clearInterval,q=0,n=A(l)&&!l,s=(n?d:c).defer(),O=s.promise;k=A(k)?k:0;O.then(null,null,e);O.$$intervalId=m(function(){s.notify(q++);0<k&&q>=k&&(s.resolve(q),p(O.$$intervalId),delete f[O.$$intervalId]);n||b.$apply()},h);f[O.$$intervalId]=s;return O}var f={};
e.cancel=function(b){return b&&b.$$intervalId in f?(f[b.$$intervalId].reject("canceled"),a.clearInterval(b.$$intervalId),delete f[b.$$intervalId],!0):!1};return e}]}function Pd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),
SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function ac(b){b=b.split("/");for(var a=b.length;a--;)b[a]=
nb(b[a]);return b.join("/")}function Yc(b,a){var c=Aa(b);a.$$protocol=c.protocol;a.$$host=c.hostname;a.$$port=aa(c.port)||wf[c.protocol]||null}function Zc(b,a){var c="/"!==b.charAt(0);c&&(b="/"+b);var d=Aa(b);a.$$path=decodeURIComponent(c&&"/"===d.pathname.charAt(0)?d.pathname.substring(1):d.pathname);a.$$search=rc(d.search);a.$$hash=decodeURIComponent(d.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function xa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Fa(b){var a=
b.indexOf("#");return-1==a?b:b.substr(0,a)}function bc(b){return b.substr(0,Fa(b).lastIndexOf("/")+1)}function cc(b,a){this.$$html5=!0;a=a||"";var c=bc(b);Yc(b,this);this.$$parse=function(a){var b=xa(c,a);if(!I(b))throw eb("ipthprfx",a,c);Zc(b,this);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Kb(this.$$search),b=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$parseLinkUrl=function(d,e){if(e&&
"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;(f=xa(b,d))!==t?(g=f,g=(f=xa(a,f))!==t?c+(xa("/",f)||f):b+g):(f=xa(c,d))!==t?g=c+f:c==d+"/"&&(g=c);g&&this.$$parse(g);return!!g}}function dc(b,a){var c=bc(b);Yc(b,this);this.$$parse=function(d){var e=xa(b,d)||xa(c,d),e="#"==e.charAt(0)?xa(a,e):this.$$html5?e:"";if(!I(e))throw eb("ihshprfx",d,a);Zc(e,this);d=this.$$path;var f=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};
this.$$compose=function(){var c=Kb(this.$$search),e=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$parseLinkUrl=function(a,c){return Fa(b)==Fa(a)?(this.$$parse(a),!0):!1}}function $c(b,a){this.$$html5=!0;dc.apply(this,arguments);var c=bc(b);this.$$parseLinkUrl=function(d,e){if(e&&"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;b==Fa(d)?f=d:(g=xa(c,d))?f=b+a+g:c===d+"/"&&(f=c);f&&this.$$parse(f);return!!f};this.$$compose=
function(){var c=Kb(this.$$search),e=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function Bb(b){return function(){return this[b]}}function ad(b,a){return function(c){if(D(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Ke(){var b="",a={enabled:!1,requireBase:!0,rewriteLinks:!0};this.hashPrefix=function(a){return A(a)?(b=a,this):b};this.html5Mode=function(b){return Ua(b)?(a.enabled=b,this):L(b)?(Ua(b.enabled)&&(a.enabled=
b.enabled),Ua(b.requireBase)&&(a.requireBase=b.requireBase),Ua(b.rewriteLinks)&&(a.rewriteLinks=b.rewriteLinks),this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function g(a,b,c){var e=k.url(),f=k.$$state;try{d.url(a,b,c),k.$$state=d.state()}catch(g){throw k.url(e),k.$$state=f,g;}}function h(a,b){c.$broadcast("$locationChangeSuccess",k.absUrl(),a,k.$$state,b)}var k,l;l=d.baseHref();var m=d.url(),p;if(a.enabled){if(!l&&a.requireBase)throw eb("nobase");p=m.substring(0,
m.indexOf("/",m.indexOf("//")+2))+(l||"/");l=e.history?cc:$c}else p=Fa(m),l=dc;k=new l(p,"#"+b);k.$$parseLinkUrl(m,m);k.$$state=d.state();var q=/^\s*(javascript|mailto):/i;f.on("click",function(b){if(a.rewriteLinks&&!b.ctrlKey&&!b.metaKey&&2!=b.which){for(var e=y(b.target);"a"!==sa(e[0]);)if(e[0]===f[0]||!(e=e.parent())[0])return;var g=e.prop("href"),h=e.attr("href")||e.attr("xlink:href");L(g)&&"[object SVGAnimatedString]"===g.toString()&&(g=Aa(g.animVal).href);q.test(g)||!g||e.attr("target")||b.isDefaultPrevented()||
!k.$$parseLinkUrl(g,h)||(b.preventDefault(),k.absUrl()!=d.url()&&(c.$apply(),T.angular["ff-684208-preventDefault"]=!0))}});k.absUrl()!=m&&d.url(k.absUrl(),!0);var n=!0;d.onUrlChange(function(a,b){c.$evalAsync(function(){var d=k.absUrl(),e=k.$$state,f;k.$$parse(a);k.$$state=b;f=c.$broadcast("$locationChangeStart",a,d,b,e).defaultPrevented;k.absUrl()===a&&(f?(k.$$parse(d),k.$$state=e,g(d,!1,e)):(n=!1,h(d,e)))});c.$$phase||c.$digest()});c.$watch(function(){var a=d.url(),b=d.state(),f=k.$$replace,l=a!==
k.absUrl()||k.$$html5&&e.history&&b!==k.$$state;if(n||l)n=!1,c.$evalAsync(function(){var d=k.absUrl(),e=c.$broadcast("$locationChangeStart",d,a,k.$$state,b).defaultPrevented;k.absUrl()===d&&(e?(k.$$parse(a),k.$$state=b):(l&&g(d,f,b===k.$$state?null:k.$$state),h(a,b)))});k.$$replace=!1});return k}]}function Le(){var b=!0,a=this;this.debugEnabled=function(a){return A(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?
"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||w;a=!1;try{a=!!e.apply}catch(k){}return a?function(){var a=[];r(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function qa(b,a){if("__defineGetter__"===
b||"__defineSetter__"===b||"__lookupGetter__"===b||"__lookupSetter__"===b||"__proto__"===b)throw ja("isecfld",a);return b}function ra(b,a){if(b){if(b.constructor===b)throw ja("isecfn",a);if(b.window===b)throw ja("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw ja("isecdom",a);if(b===Object)throw ja("isecobj",a);}return b}function ec(b){return b.constant}function Oa(b,a,c,d){ra(b,d);a=a.split(".");for(var e,f=0;1<a.length;f++){e=qa(a.shift(),d);var g=ra(b[e],d);g||(g={},b[e]=
g);b=g}e=qa(a.shift(),d);ra(b[e],d);return b[e]=c}function Pa(b){return"constructor"==b}function bd(b,a,c,d,e,f,g){qa(b,f);qa(a,f);qa(c,f);qa(d,f);qa(e,f);var h=function(a){return ra(a,f)},k=g||Pa(b)?h:ma,l=g||Pa(a)?h:ma,m=g||Pa(c)?h:ma,p=g||Pa(d)?h:ma,q=g||Pa(e)?h:ma;return function(f,g){var h=g&&g.hasOwnProperty(b)?g:f;if(null==h)return h;h=k(h[b]);if(!a)return h;if(null==h)return t;h=l(h[a]);if(!c)return h;if(null==h)return t;h=m(h[c]);if(!d)return h;if(null==h)return t;h=p(h[d]);return e?null==
h?t:h=q(h[e]):h}}function xf(b,a){return function(c,d){return b(c,d,ra,a)}}function cd(b,a,c){var d=a.expensiveChecks,e=d?yf:zf,f=e[b];if(f)return f;var g=b.split("."),h=g.length;if(a.csp)f=6>h?bd(g[0],g[1],g[2],g[3],g[4],c,d):function(a,b){var e=0,f;do f=bd(g[e++],g[e++],g[e++],g[e++],g[e++],c,d)(a,b),b=t,a=f;while(e<h);return f};else{var k="";d&&(k+="s = eso(s, fe);\nl = eso(l, fe);\n");var l=d;r(g,function(a,b){qa(a,c);var e=(b?"s":'((l&&l.hasOwnProperty("'+a+'"))?l:s)')+"."+a;if(d||Pa(a))e="eso("+
e+", fe)",l=!0;k+="if(s == null) return undefined;\ns="+e+";\n"});k+="return s;";a=new Function("s","l","eso","fe",k);a.toString=ba(k);l&&(a=xf(a,c));f=a}f.sharedGetter=!0;f.assign=function(a,c){return Oa(a,b,c,b)};return e[b]=f}function fc(b){return u(b.valueOf)?b.valueOf():Af.call(b)}function Me(){var b=pa(),a=pa();this.$get=["$filter","$sniffer",function(c,d){function e(a){var b=a;a.sharedGetter&&(b=function(b,c){return a(b,c)},b.literal=a.literal,b.constant=a.constant,b.assign=a.assign);return b}
function f(a,b){for(var c=0,d=a.length;c<d;c++){var e=a[c];e.constant||(e.inputs?f(e.inputs,b):-1===b.indexOf(e)&&b.push(e))}return b}function g(a,b){return null==a||null==b?a===b:"object"===typeof a&&(a=fc(a),"object"===typeof a)?!1:a===b||a!==a&&b!==b}function h(a,b,c,d){var e=d.$$inputs||(d.$$inputs=f(d.inputs,[])),h;if(1===e.length){var k=g,e=e[0];return a.$watch(function(a){var b=e(a);g(b,k)||(h=d(a),k=b&&fc(b));return h},b,c)}for(var l=[],q=0,n=e.length;q<n;q++)l[q]=g;return a.$watch(function(a){for(var b=
!1,c=0,f=e.length;c<f;c++){var k=e[c](a);if(b||(b=!g(k,l[c])))l[c]=k&&fc(k)}b&&(h=d(a));return h},b,c)}function k(a,b,c,d){var e,f;return e=a.$watch(function(a){return d(a)},function(a,c,d){f=a;u(b)&&b.apply(this,arguments);A(a)&&d.$$postDigest(function(){A(f)&&e()})},c)}function l(a,b,c,d){function e(a){var b=!0;r(a,function(a){A(a)||(b=!1)});return b}var f,g;return f=a.$watch(function(a){return d(a)},function(a,c,d){g=a;u(b)&&b.call(this,a,c,d);e(a)&&d.$$postDigest(function(){e(g)&&f()})},c)}function m(a,
b,c,d){var e;return e=a.$watch(function(a){return d(a)},function(a,c,d){u(b)&&b.apply(this,arguments);e()},c)}function p(a,b){if(!b)return a;var c=a.$$watchDelegate,c=c!==l&&c!==k?function(c,d){var e=a(c,d);return b(e,c,d)}:function(c,d){var e=a(c,d),f=b(e,c,d);return A(e)?f:e};a.$$watchDelegate&&a.$$watchDelegate!==h?c.$$watchDelegate=a.$$watchDelegate:b.$stateful||(c.$$watchDelegate=h,c.inputs=[a]);return c}var q={csp:d.csp,expensiveChecks:!1},n={csp:d.csp,expensiveChecks:!0};return function(d,
f,g){var r,B,J;switch(typeof d){case "string":J=d=d.trim();var z=g?a:b;r=z[J];r||(":"===d.charAt(0)&&":"===d.charAt(1)&&(B=!0,d=d.substring(2)),g=g?n:q,r=new gc(g),r=(new fb(r,c,g)).parse(d),r.constant?r.$$watchDelegate=m:B?(r=e(r),r.$$watchDelegate=r.literal?l:k):r.inputs&&(r.$$watchDelegate=h),z[J]=r);return p(r,f);case "function":return p(d,f);default:return p(w,f)}}}]}function Oe(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return dd(function(a){b.$evalAsync(a)},a)}]}function Pe(){this.$get=
["$browser","$exceptionHandler",function(b,a){return dd(function(a){b.defer(a)},a)}]}function dd(b,a){function c(a,b,c){function d(b){return function(c){e||(e=!0,b.call(a,c))}}var e=!1;return[d(b),d(c)]}function d(){this.$$state={status:0}}function e(a,b){return function(c){b.call(a,c)}}function f(c){!c.processScheduled&&c.pending&&(c.processScheduled=!0,b(function(){var b,d,e;e=c.pending;c.processScheduled=!1;c.pending=t;for(var f=0,g=e.length;f<g;++f){d=e[f][0];b=e[f][c.status];try{u(b)?d.resolve(b(c.value)):
1===c.status?d.resolve(c.value):d.reject(c.value)}catch(h){d.reject(h),a(h)}}}))}function g(){this.promise=new d;this.resolve=e(this,this.resolve);this.reject=e(this,this.reject);this.notify=e(this,this.notify)}var h=v("$q",TypeError);d.prototype={then:function(a,b,c){var d=new g;this.$$state.pending=this.$$state.pending||[];this.$$state.pending.push([d,a,b,c]);0<this.$$state.status&&f(this.$$state);return d.promise},"catch":function(a){return this.then(null,a)},"finally":function(a,b){return this.then(function(b){return l(b,
!0,a)},function(b){return l(b,!1,a)},b)}};g.prototype={resolve:function(a){this.promise.$$state.status||(a===this.promise?this.$$reject(h("qcycle",a)):this.$$resolve(a))},$$resolve:function(b){var d,e;e=c(this,this.$$resolve,this.$$reject);try{if(L(b)||u(b))d=b&&b.then;u(d)?(this.promise.$$state.status=-1,d.call(b,e[0],e[1],this.notify)):(this.promise.$$state.value=b,this.promise.$$state.status=1,f(this.promise.$$state))}catch(g){e[1](g),a(g)}},reject:function(a){this.promise.$$state.status||this.$$reject(a)},
$$reject:function(a){this.promise.$$state.value=a;this.promise.$$state.status=2;f(this.promise.$$state)},notify:function(c){var d=this.promise.$$state.pending;0>=this.promise.$$state.status&&d&&d.length&&b(function(){for(var b,e,f=0,g=d.length;f<g;f++){e=d[f][0];b=d[f][3];try{e.notify(u(b)?b(c):c)}catch(h){a(h)}}})}};var k=function(a,b){var c=new g;b?c.resolve(a):c.reject(a);return c.promise},l=function(a,b,c){var d=null;try{u(c)&&(d=c())}catch(e){return k(e,!1)}return d&&u(d.then)?d.then(function(){return k(a,
b)},function(a){return k(a,!1)}):k(a,b)},m=function(a,b,c,d){var e=new g;e.resolve(a);return e.promise.then(b,c,d)},p=function n(a){if(!u(a))throw h("norslvr",a);if(!(this instanceof n))return new n(a);var b=new g;a(function(a){b.resolve(a)},function(a){b.reject(a)});return b.promise};p.defer=function(){return new g};p.reject=function(a){var b=new g;b.reject(a);return b.promise};p.when=m;p.all=function(a){var b=new g,c=0,d=G(a)?[]:{};r(a,function(a,e){c++;m(a).then(function(a){d.hasOwnProperty(e)||
(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise};return p}function Ye(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,f=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};
f.supported=e;return f}]}function Ne(){var b=10,a=v("$rootScope"),c=null,d=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(e,f,g,h){function k(){this.$id=++kb;this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this.$root=this;this.$$destroyed=!1;this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings=null}function l(b){if(s.$$phase)throw a("inprog",
s.$$phase);s.$$phase=b}function m(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function p(){}function q(){for(;x.length;)try{x.shift()()}catch(a){f(a)}d=null}function n(){null===d&&(d=h.defer(function(){s.$apply(q)}))}k.prototype={constructor:k,$new:function(a,b){function c(){d.$$destroyed=!0}var d;b=b||this;a?(d=new k,d.$root=this.$root):(this.$$ChildScope||(this.$$ChildScope=function(){this.$$watchers=this.$$nextSibling=this.$$childHead=
this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=++kb;this.$$ChildScope=null},this.$$ChildScope.prototype=this),d=new this.$$ChildScope);d.$parent=b;d.$$prevSibling=b.$$childTail;b.$$childHead?(b.$$childTail.$$nextSibling=d,b.$$childTail=d):b.$$childHead=b.$$childTail=d;(a||b!=this)&&d.$on("$destroy",c);return d},$watch:function(a,b,d){var e=g(a);if(e.$$watchDelegate)return e.$$watchDelegate(this,b,d,e);var f=this.$$watchers,h={fn:b,last:p,get:e,exp:a,eq:!!d};c=null;u(b)||
(h.fn=w);f||(f=this.$$watchers=[]);f.unshift(h);return function(){Va(f,h);c=null}},$watchGroup:function(a,b){function c(){h=!1;k?(k=!1,b(e,e,g)):b(e,d,g)}var d=Array(a.length),e=Array(a.length),f=[],g=this,h=!1,k=!0;if(!a.length){var l=!0;g.$evalAsync(function(){l&&b(e,e,g)});return function(){l=!1}}if(1===a.length)return this.$watch(a[0],function(a,c,f){e[0]=a;d[0]=c;b(e,a===c?e:d,f)});r(a,function(a,b){var k=g.$watch(a,function(a,f){e[b]=a;d[b]=f;h||(h=!0,g.$evalAsync(c))});f.push(k)});return function(){for(;f.length;)f.shift()()}},
$watchCollection:function(a,b){function c(a){e=a;var b,d,g,h;if(!D(e)){if(L(e))if(Ra(e))for(f!==m&&(f=m,s=f.length=0,l++),a=e.length,s!==a&&(l++,f.length=s=a),b=0;b<a;b++)h=f[b],g=e[b],d=h!==h&&g!==g,d||h===g||(l++,f[b]=g);else{f!==q&&(f=q={},s=0,l++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,g=e[b],h=f[b],b in f?(d=h!==h&&g!==g,d||h===g||(l++,f[b]=g)):(s++,f[b]=g,l++));if(s>a)for(b in l++,f)e.hasOwnProperty(b)||(s--,delete f[b])}else f!==e&&(f=e,l++);return l}}c.$stateful=!0;var d=this,e,f,h,k=1<
b.length,l=0,p=g(a,c),m=[],q={},n=!0,s=0;return this.$watch(p,function(){n?(n=!1,b(e,e,d)):b(e,h,d);if(k)if(L(e))if(Ra(e)){h=Array(e.length);for(var a=0;a<e.length;a++)h[a]=e[a]}else for(a in h={},e)Jb.call(e,a)&&(h[a]=e[a]);else h=e})},$digest:function(){var e,g,k,m,n,r,x=b,M,t=[],X,S;l("$digest");h.$$checkUrlChange();this===s&&null!==d&&(h.defer.cancel(d),q());c=null;do{r=!1;for(M=this;O.length;){try{S=O.shift(),S.scope.$eval(S.expression)}catch(A){f(A)}c=null}a:do{if(m=M.$$watchers)for(n=m.length;n--;)try{if(e=
m[n])if((g=e.get(M))!==(k=e.last)&&!(e.eq?na(g,k):"number"===typeof g&&"number"===typeof k&&isNaN(g)&&isNaN(k)))r=!0,c=e,e.last=e.eq?Ca(g,null):g,e.fn(g,k===p?g:k,M),5>x&&(X=4-x,t[X]||(t[X]=[]),t[X].push({msg:u(e.exp)?"fn: "+(e.exp.name||e.exp.toString()):e.exp,newVal:g,oldVal:k}));else if(e===c){r=!1;break a}}catch(v){f(v)}if(!(m=M.$$childHead||M!==this&&M.$$nextSibling))for(;M!==this&&!(m=M.$$nextSibling);)M=M.$parent}while(M=m);if((r||O.length)&&!x--)throw s.$$phase=null,a("infdig",b,t);}while(r||
O.length);for(s.$$phase=null;E.length;)try{E.shift()()}catch(y){f(y)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;if(this!==s){for(var b in this.$$listenerCount)m(this,this.$$listenerCount[b],b);a.$$childHead==this&&(a.$$childHead=this.$$nextSibling);a.$$childTail==this&&(a.$$childTail=this.$$prevSibling);this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling);this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=
this.$$prevSibling);this.$destroy=this.$digest=this.$apply=this.$evalAsync=this.$applyAsync=w;this.$on=this.$watch=this.$watchGroup=function(){return w};this.$$listeners={};this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=this.$$watchers=null}}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){s.$$phase||O.length||h.defer(function(){O.length&&s.$digest()});O.push({scope:this,expression:a})},$$postDigest:function(a){E.push(a)},$apply:function(a){try{return l("$apply"),
this.$eval(a)}catch(b){f(b)}finally{s.$$phase=null;try{s.$digest()}catch(c){throw f(c),c;}}},$applyAsync:function(a){function b(){c.$eval(a)}var c=this;a&&x.push(b);n()},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){var d=c.indexOf(b);-1!==d&&(c[d]=null,m(e,1,a))}},$emit:function(a,b){var c=[],d,e=this,g=!1,h={name:a,targetScope:e,
stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=Xa([h],arguments,1),l,m;do{d=e.$$listeners[a]||c;h.currentScope=e;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(p){f(p)}else d.splice(l,1),l--,m--;if(g)return h.currentScope=null,h;e=e.$parent}while(e);h.currentScope=null;return h},$broadcast:function(a,b){var c=this,d=this,e={name:a,targetScope:this,preventDefault:function(){e.defaultPrevented=!0},defaultPrevented:!1};if(!this.$$listenerCount[a])return e;
for(var g=Xa([e],arguments,1),h,k;c=d;){e.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(l){f(l)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}e.currentScope=null;return e}};var s=new k,O=s.$$asyncQueue=[],E=s.$$postDigestQueue=[],x=s.$$applyAsyncQueue=[];return s}]}function Qd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*((https?|ftp|file|blob):|data:image\/)/;
this.aHrefSanitizationWhitelist=function(a){return A(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return A(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;f=Aa(c).href;return""===f||f.match(e)?c:"unsafe:"+f}}}function Bf(b){if("self"===b)return b;if(I(b)){if(-1<b.indexOf("***"))throw Ba("iwcard",b);b=ed(b).replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return new RegExp("^"+b+"$")}if(lb(b))return new RegExp("^"+b.source+"$");throw Ba("imatcher");}function fd(b){var a=
[];A(b)&&r(b,function(b){a.push(Bf(b))});return a}function Re(){this.SCE_CONTEXTS=ka;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=fd(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=fd(b));return a};this.$get=["$injector",function(c){function d(a,b){return"self"===a?Xc(b):!!a.exec(b.href)}function e(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};
b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var f=function(a){throw Ba("unsafe");};c.has("$sanitize")&&(f=c.get("$sanitize"));var g=e(),h={};h[ka.HTML]=e(g);h[ka.CSS]=e(g);h[ka.URL]=e(g);h[ka.JS]=e(g);h[ka.RESOURCE_URL]=e(h[ka.URL]);return{trustAs:function(a,b){var c=h.hasOwnProperty(a)?h[a]:null;if(!c)throw Ba("icontext",a,b);if(null===b||b===t||""===b)return b;if("string"!==typeof b)throw Ba("itype",a);return new c(b)},getTrusted:function(c,e){if(null===
e||e===t||""===e)return e;var g=h.hasOwnProperty(c)?h[c]:null;if(g&&e instanceof g)return e.$$unwrapTrustedValue();if(c===ka.RESOURCE_URL){var g=Aa(e.toString()),p,q,n=!1;p=0;for(q=b.length;p<q;p++)if(d(b[p],g)){n=!0;break}if(n)for(p=0,q=a.length;p<q;p++)if(d(a[p],g)){n=!1;break}if(n)return e;throw Ba("insecurl",e.toString());}if(c===ka.HTML)return f(e);throw Ba("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function Qe(){var b=!0;this.enabled=function(a){arguments.length&&
(b=!!a);return b};this.$get=["$parse","$sceDelegate",function(a,c){if(b&&8>Ha)throw Ba("iequirks");var d=ta(ka);d.isEnabled=function(){return b};d.trustAs=c.trustAs;d.getTrusted=c.getTrusted;d.valueOf=c.valueOf;b||(d.trustAs=d.getTrusted=function(a,b){return b},d.valueOf=ma);d.parseAs=function(b,c){var e=a(c);return e.literal&&e.constant?e:a(c,function(a){return d.getTrusted(b,a)})};var e=d.parseAs,f=d.getTrusted,g=d.trustAs;r(ka,function(a,b){var c=Q(b);d[bb("parse_as_"+c)]=function(b){return e(a,
b)};d[bb("get_trusted_"+c)]=function(b){return f(a,b)};d[bb("trust_as_"+c)]=function(b){return g(a,b)}});return d}]}function Se(){this.$get=["$window","$document",function(b,a){var c={},d=aa((/android (\d+)/.exec(Q((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g,h=/^(Moz|webkit|ms)(?=[A-Z])/,k=f.body&&f.body.style,l=!1,m=!1;if(k){for(var p in k)if(l=h.exec(p)){g=l[0];g=g.substr(0,1).toUpperCase()+g.substr(1);break}g||(g="WebkitOpacity"in k&&"webkit");
l=!!("transition"in k||g+"Transition"in k);m=!!("animation"in k||g+"Animation"in k);!d||l&&m||(l=I(f.body.style.webkitTransition),m=I(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hasEvent:function(a){if("input"==a&&9==Ha)return!1;if(D(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:$a(),vendorPrefix:g,transitions:l,animations:m,android:d}}]}function Ue(){this.$get=["$templateCache","$http","$q",function(b,a,c){function d(e,f){d.totalPendingRequests++;
var g=a.defaults&&a.defaults.transformResponse;if(G(g))for(var h=g,g=[],k=0;k<h.length;++k){var l=h[k];l!==Yb&&g.push(l)}else g===Yb&&(g=null);return a.get(e,{cache:b,transformResponse:g}).then(function(a){a=a.data;d.totalPendingRequests--;b.put(e,a);return a},function(){d.totalPendingRequests--;if(!f)throw ia("tpload",e);return c.reject()})}d.totalPendingRequests=0;return d}]}function Ve(){this.$get=["$rootScope","$browser","$location",function(b,a,c){return{findBindings:function(a,b,c){a=a.getElementsByClassName("ng-binding");
var g=[];r(a,function(a){var d=va.element(a).data("$binding");d&&r(d,function(d){c?(new RegExp("(^|\\s)"+ed(b)+"(\\s|\\||$)")).test(d)&&g.push(a):-1!=d.indexOf(b)&&g.push(a)})});return g},findModels:function(a,b,c){for(var g=["ng-","data-ng-","ng\\:"],h=0;h<g.length;++h){var k=a.querySelectorAll("["+g[h]+"model"+(c?"=":"*=")+'"'+b+'"]');if(k.length)return k}},getLocation:function(){return c.url()},setLocation:function(a){a!==c.url()&&(c.url(a),b.$digest())},whenStable:function(b){a.notifyWhenNoOutstandingRequests(b)}}}]}
function We(){this.$get=["$rootScope","$browser","$q","$$q","$exceptionHandler",function(b,a,c,d,e){function f(f,k,l){var m=A(l)&&!l,p=(m?d:c).defer(),q=p.promise;k=a.defer(function(){try{p.resolve(f())}catch(a){p.reject(a),e(a)}finally{delete g[q.$$timeoutId]}m||b.$apply()},k);q.$$timeoutId=k;g[k]=p;return q}var g={};f.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return f}]}function Aa(b){Ha&&(Z.setAttribute("href",
b),b=Z.href);Z.setAttribute("href",b);return{href:Z.href,protocol:Z.protocol?Z.protocol.replace(/:$/,""):"",host:Z.host,search:Z.search?Z.search.replace(/^\?/,""):"",hash:Z.hash?Z.hash.replace(/^#/,""):"",hostname:Z.hostname,port:Z.port,pathname:"/"===Z.pathname.charAt(0)?Z.pathname:"/"+Z.pathname}}function Xc(b){b=I(b)?Aa(b):b;return b.protocol===gd.protocol&&b.host===gd.host}function Xe(){this.$get=ba(T)}function Cc(b){function a(c,d){if(L(c)){var e={};r(c,function(b,c){e[c]=a(c,b)});return e}return b.factory(c+
"Filter",d)}this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+"Filter")}}];a("currency",hd);a("date",id);a("filter",Cf);a("json",Df);a("limitTo",Ef);a("lowercase",Ff);a("number",jd);a("orderBy",kd);a("uppercase",Gf)}function Cf(){return function(b,a,c){if(!G(b))return b;var d=typeof c,e=[];e.check=function(a,b){for(var c=0;c<e.length;c++)if(!e[c](a,b))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return va.equals(a,b)}:function(a,b){if(a&&
b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Jb.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"===typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=
0;d<a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)(function(b){"undefined"!==typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var h=b[g];e.check(h,g)&&d.push(h)}return d}}function hd(b){var a=b.NUMBER_FORMATS;return function(b,d,e){D(d)&&(d=a.CURRENCY_SYM);D(e)&&(e=2);return null==
b?b:ld(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,e).replace(/\u00A4/g,d)}}function jd(b){var a=b.NUMBER_FORMATS;return function(b,d){return null==b?b:ld(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function ld(b,a,c,d,e){if(!isFinite(b)||L(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",h="",k=[],l=!1;if(-1!==g.indexOf("e")){var m=g.match(/([\d\.]+)e(-?)(\d+)/);m&&"-"==m[2]&&m[3]>e+1?(g="0",b=0):(h=g,l=!0)}if(l)0<e&&-1<b&&1>b&&(h=b.toFixed(e));else{g=(g.split(md)[1]||"").length;D(e)&&(e=Math.min(Math.max(a.minFrac,
g),a.maxFrac));b=+(Math.round(+(b.toString()+"e"+e)).toString()+"e"+-e);0===b&&(f=!1);b=(""+b).split(md);g=b[0];b=b[1]||"";var m=0,p=a.lgSize,q=a.gSize;if(g.length>=p+q)for(m=g.length-p,l=0;l<m;l++)0===(m-l)%q&&0!==l&&(h+=c),h+=g.charAt(l);for(l=m;l<g.length;l++)0===(g.length-l)%p&&0!==l&&(h+=c),h+=g.charAt(l);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}k.push(f?a.negPre:a.posPre);k.push(h);k.push(f?a.negSuf:a.posSuf);return k.join("")}function Cb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=
""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Cb(e,a,d)}}function Db(b,a){return function(c,d){var e=c["get"+b](),f=rb(a?"SHORT"+b:b);return d[f][e]}}function nd(b){var a=(new Date(b,0,1)).getDay();return new Date(b,0,(4>=a?5:12)-a)}function od(b){return function(a){var c=nd(a.getFullYear());a=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+(4-a.getDay()))-+c;a=1+Math.round(a/
6048E5);return Cb(a,b)}}function id(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?a.setUTCFullYear:a.setFullYear,k=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=aa(b[9]+b[10]),g=aa(b[9]+b[11]));h.call(a,aa(b[1]),aa(b[2])-1,aa(b[3]));f=aa(b[4]||0)-f;g=aa(b[5]||0)-g;h=aa(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));k.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e,f){var g=
"",h=[],k,l;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;I(c)&&(c=Hf.test(c)?aa(c):a(c));W(c)&&(c=new Date(c));if(!ea(c))return c;for(;e;)(l=If.exec(e))?(h=Xa(h,l,1),e=h.pop()):(h.push(e),e=null);f&&"UTC"===f&&(c=new Date(c.getTime()),c.setMinutes(c.getMinutes()+c.getTimezoneOffset()));r(h,function(a){k=Jf[a];g+=k?k(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function Df(){return function(b){return Za(b,!0)}}function Ef(){return function(b,a){W(b)&&(b=b.toString());
if(!G(b)&&!I(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):aa(a);if(I(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function kd(b){return function(a,c,d){function e(a,b){return b?function(b,c){return a(c,b)}:a}function f(a,b){var c=typeof a,d=typeof b;return c==d?(ea(a)&&ea(b)&&(a=a.valueOf(),b=b.valueOf()),"string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),
a===b?0:a<b?-1:1):c<d?-1:1}if(!Ra(a))return a;c=G(c)?c:[c];0===c.length&&(c=["+"]);c=c.map(function(a){var c=!1,d=a||ma;if(I(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);if(""===a)return e(function(a,b){return f(a,b)},c);d=b(a);if(d.constant){var l=d();return e(function(a,b){return f(a[l],b[l])},c)}}return e(function(a,b){return f(d(a),d(b))},c)});return Ya.call(a).sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function Ia(b){u(b)&&
(b={link:b});b.restrict=b.restrict||"AC";return ba(b)}function pd(b,a,c,d,e){var f=this,g=[],h=f.$$parentForm=b.parent().controller("form")||Eb;f.$error={};f.$$success={};f.$pending=t;f.$name=e(a.name||a.ngForm||"")(c);f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;f.$submitted=!1;h.$addControl(f);f.$rollbackViewValue=function(){r(g,function(a){a.$rollbackViewValue()})};f.$commitViewValue=function(){r(g,function(a){a.$commitViewValue()})};f.$addControl=function(a){La(a.$name,"input");g.push(a);
a.$name&&(f[a.$name]=a)};f.$$renameControl=function(a,b){var c=a.$name;f[c]===a&&delete f[c];f[b]=a;a.$name=b};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];r(f.$pending,function(b,c){f.$setValidity(c,null,a)});r(f.$error,function(b,c){f.$setValidity(c,null,a)});Va(g,a)};qd({ctrl:this,$element:b,set:function(a,b,c){var d=a[b];d?-1===d.indexOf(c)&&d.push(c):a[b]=[c]},unset:function(a,b,c){var d=a[b];d&&(Va(d,c),0===d.length&&delete a[b])},parentForm:h,$animate:d});f.$setDirty=
function(){d.removeClass(b,Qa);d.addClass(b,Fb);f.$dirty=!0;f.$pristine=!1;h.$setDirty()};f.$setPristine=function(){d.setClass(b,Qa,Fb+" ng-submitted");f.$dirty=!1;f.$pristine=!0;f.$submitted=!1;r(g,function(a){a.$setPristine()})};f.$setUntouched=function(){r(g,function(a){a.$setUntouched()})};f.$setSubmitted=function(){d.addClass(b,"ng-submitted");f.$submitted=!0;h.$setSubmitted()}}function hc(b){b.$formatters.push(function(a){return b.$isEmpty(a)?a:a.toString()})}function gb(b,a,c,d,e,f){var g=
a[0].placeholder,h={},k=Q(a[0].type);if(!e.android){var l=!1;a.on("compositionstart",function(a){l=!0});a.on("compositionend",function(){l=!1;m()})}var m=function(b){if(!l){var e=a.val(),f=b&&b.type;Ha&&"input"===(b||h).type&&a[0].placeholder!==g?g=a[0].placeholder:("password"===k||c.ngTrim&&"false"===c.ngTrim||(e=P(e)),(d.$viewValue!==e||""===e&&d.$$hasNativeValidators)&&d.$setViewValue(e,f))}};if(e.hasEvent("input"))a.on("input",m);else{var p,q=function(a){p||(p=f.defer(function(){m(a);p=null}))};
a.on("keydown",function(a){var b=a.keyCode;91===b||15<b&&19>b||37<=b&&40>=b||q(a)});if(e.hasEvent("paste"))a.on("paste cut",q)}a.on("change",m);d.$render=function(){a.val(d.$isEmpty(d.$modelValue)?"":d.$viewValue)}}function Gb(b,a){return function(c,d){var e,f;if(ea(c))return c;if(I(c)){'"'==c.charAt(0)&&'"'==c.charAt(c.length-1)&&(c=c.substring(1,c.length-1));if(Kf.test(c))return new Date(c);b.lastIndex=0;if(e=b.exec(c))return e.shift(),f=d?{yyyy:d.getFullYear(),MM:d.getMonth()+1,dd:d.getDate(),
HH:d.getHours(),mm:d.getMinutes(),ss:d.getSeconds(),sss:d.getMilliseconds()/1E3}:{yyyy:1970,MM:1,dd:1,HH:0,mm:0,ss:0,sss:0},r(e,function(b,c){c<a.length&&(f[a[c]]=+b)}),new Date(f.yyyy,f.MM-1,f.dd,f.HH,f.mm,f.ss||0,1E3*f.sss||0)}return NaN}}function hb(b,a,c,d){return function(e,f,g,h,k,l,m){function p(a){return A(a)?ea(a)?a:c(a):t}rd(e,f,g,h);gb(e,f,g,h,k,l);var q=h&&h.$options&&h.$options.timezone,n;h.$$parserName=b;h.$parsers.push(function(b){return h.$isEmpty(b)?null:a.test(b)?(b=c(b,n),"UTC"===
q&&b.setMinutes(b.getMinutes()-b.getTimezoneOffset()),b):t});h.$formatters.push(function(a){if(h.$isEmpty(a))n=null;else{if(!ea(a))throw Hb("datefmt",a);if((n=a)&&"UTC"===q){var b=6E4*n.getTimezoneOffset();n=new Date(n.getTime()+b)}return m("date")(a,d,q)}return""});if(A(g.min)||g.ngMin){var s;h.$validators.min=function(a){return h.$isEmpty(a)||D(s)||c(a)>=s};g.$observe("min",function(a){s=p(a);h.$validate()})}if(A(g.max)||g.ngMax){var r;h.$validators.max=function(a){return h.$isEmpty(a)||D(r)||c(a)<=
r};g.$observe("max",function(a){r=p(a);h.$validate()})}h.$isEmpty=function(a){return!a||a.getTime&&a.getTime()!==a.getTime()}}}function rd(b,a,c,d){(d.$$hasNativeValidators=L(a[0].validity))&&d.$parsers.push(function(b){var c=a.prop("validity")||{};return c.badInput&&!c.typeMismatch?t:b})}function sd(b,a,c,d,e){if(A(d)){b=b(d);if(!b.constant)throw v("ngModel")("constexpr",c,d);return b(a)}return e}function qd(b){function a(a,b){b&&!f[a]?(l.addClass(e,a),f[a]=!0):!b&&f[a]&&(l.removeClass(e,a),f[a]=
!1)}function c(b,c){b=b?"-"+Mb(b,"-"):"";a(ib+b,!0===c);a(td+b,!1===c)}var d=b.ctrl,e=b.$element,f={},g=b.set,h=b.unset,k=b.parentForm,l=b.$animate;f[td]=!(f[ib]=e.hasClass(ib));d.$setValidity=function(b,e,f){e===t?(d.$pending||(d.$pending={}),g(d.$pending,b,f)):(d.$pending&&h(d.$pending,b,f),ud(d.$pending)&&(d.$pending=t));Ua(e)?e?(h(d.$error,b,f),g(d.$$success,b,f)):(g(d.$error,b,f),h(d.$$success,b,f)):(h(d.$error,b,f),h(d.$$success,b,f));d.$pending?(a(vd,!0),d.$valid=d.$invalid=t,c("",null)):(a(vd,
!1),d.$valid=ud(d.$error),d.$invalid=!d.$valid,c("",d.$valid));e=d.$pending&&d.$pending[b]?t:d.$error[b]?!1:d.$$success[b]?!0:null;c(b,e);k.$setValidity(b,e,d)}}function ud(b){if(b)for(var a in b)return!1;return!0}function ic(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],m=0;m<b.length;m++)if(e==b[m])continue a;c.push(e)}return c}function e(a){if(!G(a)){if(I(a))return a.split(" ");if(L(a)){var b=[];r(a,function(a,c){a&&(b=b.concat(c.split(" ")))});
return b}}return a}return{restrict:"AC",link:function(f,g,h){function k(a,b){var c=g.data("$classCounts")||{},d=[];r(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});g.data("$classCounts",c);return d.join(" ")}function l(b){if(!0===a||f.$index%2===a){var l=e(b||[]);if(!m){var n=k(l,1);h.$addClass(n)}else if(!na(b,m)){var s=e(m),n=d(l,s),l=d(s,l),n=k(n,1),l=k(l,-1);n&&n.length&&c.addClass(g,n);l&&l.length&&c.removeClass(g,l)}}m=ta(b)}var m;f.$watch(h[b],l,!0);h.$observe("class",
function(a){l(f.$eval(h[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var g=c&1;if(g!==(d&1)){var l=e(f.$eval(h[b]));g===a?(g=k(l,1),h.$addClass(g)):(g=k(l,-1),h.$removeClass(g))}})}}}]}var Lf=/^\/(.+)\/([a-z]*)$/,Q=function(b){return I(b)?b.toLowerCase():b},Jb=Object.prototype.hasOwnProperty,rb=function(b){return I(b)?b.toUpperCase():b},Ha,y,oa,Ya=[].slice,qf=[].splice,Mf=[].push,Ja=Object.prototype.toString,Wa=v("ng"),va=T.angular||(T.angular={}),ab,kb=0;Ha=U.documentMode;w.$inject=[];ma.$inject=
[];var G=Array.isArray,P=function(b){return I(b)?b.trim():b},ed=function(b){return b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")},$a=function(){if(A($a.isActive_))return $a.isActive_;var b=!(!U.querySelector("[ng-csp]")&&!U.querySelector("[data-ng-csp]"));if(!b)try{new Function("")}catch(a){b=!0}return $a.isActive_=b},ob=["ng-","data-ng-","ng:","x-ng-"],Kd=/[A-Z]/g,tc=!1,Nb,la=1,mb=3,Od={full:"1.3.3",major:1,minor:3,dot:3,codeName:"undersea-arithmetic"};R.expando="ng339";
var wb=R.cache={},ef=1;R._data=function(b){return this.cache[b[this.expando]]||{}};var $e=/([\:\-\_]+(.))/g,af=/^moz([A-Z])/,Nf={mouseleave:"mouseout",mouseenter:"mouseover"},Qb=v("jqLite"),df=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Pb=/<|&#?\w+;/,bf=/<([\w:]+)/,cf=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ha={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],
td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ha.optgroup=ha.option;ha.tbody=ha.tfoot=ha.colgroup=ha.caption=ha.thead;ha.th=ha.td;var Ka=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===U.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(T).on("load",a))},toString:function(){var b=[];r(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?y(this[b]):y(this[this.length+b])},length:0,push:Mf,sort:[].sort,
splice:[].splice},yb={};r("multiple selected checked disabled readOnly required open".split(" "),function(b){yb[Q(b)]=b});var Lc={};r("input select option textarea button form details".split(" "),function(b){Lc[b]=!0});var Mc={ngMinlength:"minlength",ngMaxlength:"maxlength",ngMin:"min",ngMax:"max",ngPattern:"pattern"};r({data:Sb,removeData:ub},function(b,a){R[a]=b});r({data:Sb,inheritedData:xb,scope:function(b){return y.data(b,"$scope")||xb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return y.data(b,
"$isolateScope")||y.data(b,"$isolateScopeNoTemplate")},controller:Hc,injector:function(b){return xb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Tb,css:function(b,a,c){a=bb(a);if(A(c))b.style[a]=c;else return b.style[a]},attr:function(b,a,c){var d=Q(a);if(yb[d])if(A(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||w).specified?d:t;else if(A(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,
2),null===b?t:b},prop:function(b,a,c){if(A(c))b[a]=c;else return b[a]},text:function(){function b(a,b){if(D(b)){var d=a.nodeType;return d===la||d===mb?a.textContent:""}a.textContent=b}b.$dv="";return b}(),val:function(b,a){if(D(a)){if(b.multiple&&"select"===sa(b)){var c=[];r(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(D(a))return b.innerHTML;tb(b,!0);b.innerHTML=a},empty:Ic},function(b,a){R.prototype[a]=function(a,
d){var e,f,g=this.length;if(b!==Ic&&(2==b.length&&b!==Tb&&b!==Hc?a:d)===t){if(L(a)){for(e=0;e<g;e++)if(b===Sb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;g=e===t?Math.min(g,1):g;for(f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<g;e++)b(this[e],a,d);return this}});r({removeData:ub,on:function a(c,d,e,f){if(A(f))throw Qb("onargs");if(Dc(c)){var g=vb(c,!0);f=g.events;var h=g.handle;h||(h=g.handle=hf(c,f));for(var g=0<=d.indexOf(" ")?d.split(" "):[d],k=g.length;k--;){d=
g[k];var l=f[d];l||(f[d]=[],"mouseenter"===d||"mouseleave"===d?a(c,Nf[d],function(a){var c=a.relatedTarget;c&&(c===this||this.contains(c))||h(a,d)}):"$destroy"!==d&&c.addEventListener(d,h,!1),l=f[d]);l.push(e)}}},off:Gc,one:function(a,c,d){a=y(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;tb(a);r(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];r(a.childNodes,function(a){a.nodeType===
la&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){var d=a.nodeType;if(d===la||11===d){c=new R(c);for(var d=0,e=c.length;d<e;d++)a.appendChild(c[d])}},prepend:function(a,c){if(a.nodeType===la){var d=a.firstChild;r(new R(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=y(c).eq(0).clone()[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:Jc,detach:function(a){Jc(a,!0)},after:function(a,c){var d=a,e=a.parentNode;
c=new R(c);for(var f=0,g=c.length;f<g;f++){var h=c[f];e.insertBefore(h,d.nextSibling);d=h}},addClass:Vb,removeClass:Ub,toggleClass:function(a,c,d){c&&r(c.split(" "),function(c){var f=d;D(f)&&(f=!Tb(a,c));(f?Vb:Ub)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){return a.nextElementSibling},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Rb,triggerHandler:function(a,c,d){var e,f,g=c.type||c,h=vb(a);if(h=(h=h&&h.events)&&
h[g])e={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopImmediatePropagation:function(){this.immediatePropagationStopped=!0},isImmediatePropagationStopped:function(){return!0===this.immediatePropagationStopped},stopPropagation:w,type:g,target:a},c.type&&(e=H(e,c)),c=ta(h),f=d?[e].concat(d):[e],r(c,function(c){e.isImmediatePropagationStopped()||c.apply(a,f)})}},function(a,c){R.prototype[c]=function(c,e,f){for(var g,h=0,k=this.length;h<
k;h++)D(g)?(g=a(this[h],c,e,f),A(g)&&(g=y(g))):Fc(g,a(this[h],c,e,f));return A(g)?g:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});cb.prototype={put:function(a,c){this[Ma(a,this.nextUid)]=c},get:function(a){return this[Ma(a,this.nextUid)]},remove:function(a){var c=this[a=Ma(a,this.nextUid)];delete this[a];return c}};var Oc=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,kf=/,/,lf=/^\s*(_?)(\S+?)\1\s*$/,Nc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ea=v("$injector");Lb.$$annotate=Wb;var Of=
v("$animate"),Ae=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Of("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$$q","$$asyncCallback","$rootScope",function(a,d,e){function f(d){var f,g=a.defer();g.promise.$$cancelFn=function(){f&&f()};e.$$postDigest(function(){f=
d(function(){g.resolve()})});return g.promise}function g(a,c){var d=[],e=[],f=pa();r((a.attr("class")||"").split(/\s+/),function(a){f[a]=!0});r(c,function(a,c){var g=f[c];!1===a&&g?e.push(c):!0!==a||g||d.push(c)});return 0<d.length+e.length&&[d.length?d:null,e.length?e:null]}function h(a,c,d){for(var e=0,f=c.length;e<f;++e)a[c[e]]=d}function k(){m||(m=a.defer(),d(function(){m.resolve();m=null}));return m.promise}function l(a,c){if(va.isObject(c)){var d=H(c.from||{},c.to||{});a.css(d)}}var m;return{animate:function(a,
c,d){l(a,{from:c,to:d});return k()},enter:function(a,c,d,e){l(a,e);d?d.after(a):c.prepend(a);return k()},leave:function(a,c){a.remove();return k()},move:function(a,c,d,e){return this.enter(a,c,d,e)},addClass:function(a,c,d){return this.setClass(a,c,[],d)},$$addClassImmediately:function(a,c,d){a=y(a);c=I(c)?c:G(c)?c.join(" "):"";r(a,function(a){Vb(a,c)});l(a,d);return k()},removeClass:function(a,c,d){return this.setClass(a,[],c,d)},$$removeClassImmediately:function(a,c,d){a=y(a);c=I(c)?c:G(c)?c.join(" "):
"";r(a,function(a){Ub(a,c)});l(a,d);return k()},setClass:function(a,c,d,e){var k=this,l=!1;a=y(a);var m=a.data("$$animateClasses");m?e&&m.options&&(m.options=va.extend(m.options||{},e)):(m={classes:{},options:e},l=!0);e=m.classes;c=G(c)?c:c.split(" ");d=G(d)?d:d.split(" ");h(e,c,!0);h(e,d,!1);l&&(m.promise=f(function(c){var d=a.data("$$animateClasses");a.removeData("$$animateClasses");if(d){var e=g(a,d.classes);e&&k.$$setClassImmediately(a,e[0],e[1],d.options)}c()}),a.data("$$animateClasses",m));
return m.promise},$$setClassImmediately:function(a,c,d,e){c&&this.$$addClassImmediately(a,c);d&&this.$$removeClassImmediately(a,d);l(a,e);return k()},enabled:w,cancel:w}}]}],ia=v("$compile");vc.$inject=["$provide","$$sanitizeUriProvider"];var pf=/^((?:x|data)[\:\-_])/i,Tc="application/json",Zb={"Content-Type":Tc+";charset=utf-8"},sf=/^\s*(\[|\{[^\{])/,tf=/[\}\]]\s*$/,rf=/^\)\]\}',?\n/,$b=v("$interpolate"),Pf=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,wf={http:80,https:443,ftp:21},eb=v("$location"),Qf={$$html5:!1,
$$replace:!1,absUrl:Bb("$$absUrl"),url:function(a){if(D(a))return this.$$url;a=Pf.exec(a);a[1]&&this.path(decodeURIComponent(a[1]));(a[2]||a[1])&&this.search(a[3]||"");this.hash(a[5]||"");return this},protocol:Bb("$$protocol"),host:Bb("$$host"),port:Bb("$$port"),path:ad("$$path",function(a){a=null!==a?a.toString():"";return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(I(a)||W(a))a=a.toString(),this.$$search=rc(a);else if(L(a))a=Ca(a,
{}),r(a,function(c,e){null==c&&delete a[e]}),this.$$search=a;else throw eb("isrcharg");break;default:D(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:ad("$$hash",function(a){return null!==a?a.toString():""}),replace:function(){this.$$replace=!0;return this}};r([$c,dc,cc],function(a){a.prototype=Object.create(Qf);a.prototype.state=function(c){if(!arguments.length)return this.$$state;if(a!==cc||!this.$$html5)throw eb("nostate");this.$$state=D(c)?null:c;return this}});
var ja=v("$parse"),Rf=Function.prototype.call,Sf=Function.prototype.apply,Tf=Function.prototype.bind,Ib=pa();r({"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:function(){}},function(a,c){a.constant=a.literal=a.sharedGetter=!0;Ib[c]=a});Ib["this"]=function(a){return a};Ib["this"].sharedGetter=!0;var jb=H(pa(),{"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return A(d)?A(e)?d+e:d:A(e)?e:t},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(A(d)?d:0)-(A(e)?e:0)},
"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,
c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"!":function(a,c,d){return!d(a,c)},"=":!0,"|":!0}),Uf={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},gc=function(a){this.options=a};gc.prototype={constructor:gc,lex:function(a){this.text=a;this.index=0;for(this.tokens=[];this.index<this.text.length;)if(a=this.text.charAt(this.index),'"'===a||"'"===a)this.readString(a);else if(this.isNumber(a)||"."===a&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(a))this.readIdent();
else if(this.is(a,"(){}[].,;:?"))this.tokens.push({index:this.index,text:a}),this.index++;else if(this.isWhitespace(a))this.index++;else{var c=a+this.peek(),d=c+this.peek(2),e=jb[c],f=jb[d];jb[a]||e||f?(a=f?d:e?c:a,this.tokens.push({index:this.index,text:a,operator:!0}),this.index+=a.length):this.throwError("Unexpected next character ",this.index,this.index+1)}return this.tokens},is:function(a,c){return-1!==c.indexOf(a)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+
a):!1},isNumber:function(a){return"0"<=a&&"9">=a&&"string"===typeof a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=A(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw ja("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<
this.text.length;){var d=Q(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}this.tokens.push({index:c,text:a,constant:!0,value:Number(a)})},readIdent:function(){for(var a=this.index;this.index<this.text.length;){var c=
this.text.charAt(this.index);if(!this.isIdent(c)&&!this.isNumber(c))break;this.index++}this.tokens.push({index:a,text:this.text.slice(a,this.index),identifier:!0})},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):
d+=Uf[g]||g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,constant:!0,value:d});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var fb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};fb.ZERO=H(function(){return 0},{sharedGetter:!0,constant:!0});fb.prototype={constructor:fb,parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);
a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;this.expect("(")?(a=this.filterChain(),this.consume(")")):this.expect("[")?a=this.arrayDeclaration():this.expect("{")?a=this.object():this.peek().identifier?a=this.identifier():this.peek().constant?a=this.constant():this.throwError("not a primary expression",this.peek());for(var c,d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=
this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw ja("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw ja("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){return this.peekAhead(0,a,c,d,e)},peekAhead:function(a,c,d,e,f){if(this.tokens.length>a){a=this.tokens[a];var g=a.text;if(g===c||g===d||g===e||g===f||!(c||d||e||f))return a}return!1},expect:function(a,c,d,e){return(a=
this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){if(0===this.tokens.length)throw ja("ueoe",this.text);var c=this.expect(a);c||this.throwError("is unexpected, expecting ["+a+"]",this.peek());return c},unaryFn:function(a,c){var d=jb[a];return H(function(a,f){return d(a,f,c)},{constant:c.constant,inputs:[c]})},binaryFn:function(a,c,d,e){var f=jb[c];return H(function(c,e){return f(c,e,a,d)},{constant:a.constant&&d.constant,inputs:!e&&[a,d]})},identifier:function(){for(var a=this.consume().text;this.peek(".")&&
this.peekAhead(1).identifier&&!this.peekAhead(2,"(");)a+=this.consume().text+this.consume().text;return Ib[a]||cd(a,this.options,this.text)},constant:function(){var a=this.consume().value;return H(function(){return a},{constant:!0,literal:!0})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0,g=a.length;f<g;f++)e=a[f](c,d);return e}},filterChain:function(){for(var a=
this.expression();this.expect("|");)a=this.filter(a);return a},filter:function(a){var c=this.$filter(this.consume().text),d,e;if(this.peek(":"))for(d=[],e=[];this.expect(":");)d.push(this.expression());var f=[a].concat(d||[]);return H(function(f,h){var k=a(f,h);if(e){e[0]=k;for(k=d.length;k--;)e[k+1]=d[k](f,h);return c.apply(t,e)}return c(k)},{constant:!c.$stateful&&f.every(ec),inputs:!c.$stateful&&f})},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;
return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),H(function(d,f){return a.assign(d,c(d,f),f)},{inputs:[a,c]})):a},ternary:function(){var a=this.logicalOR(),c;if(this.expect("?")&&(c=this.assignment(),this.consume(":"))){var d=this.assignment();return H(function(e,f){return a(e,f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})}return a},logicalOR:function(){for(var a=this.logicalAND(),
c;c=this.expect("||");)a=this.binaryFn(a,c.text,this.logicalAND(),!0);return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.text,this.logicalAND(),!0);return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.text,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.text,this.relational());return a},additive:function(){for(var a=
this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.text,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.text,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(fb.ZERO,a.text,this.unary()):(a=this.expect("!"))?this.unaryFn(a.text,this.unary()):this.primary()},fieldAccess:function(a){var c=this.text,d=this.consume().text,e=cd(d,this.options,
c);return H(function(c,d,h){return e(h||a(c,d))},{assign:function(e,g,h){(h=a(e,h))||a.assign(e,h={});return Oa(h,d,g,c)}})},objectIndex:function(a){var c=this.text,d=this.expression();this.consume("]");return H(function(e,f){var g=a(e,f),h=d(e,f);qa(h,c);return g?ra(g[h],c):t},{assign:function(e,f,g){var h=qa(d(e,g),c);(g=ra(a(e,g),c))||a.assign(e,g={});return g[h]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");
var e=this.text,f=d.length?[]:null;return function(g,h){var k=c?c(g,h):g,l=a(g,h,k)||w;if(f)for(var m=d.length;m--;)f[m]=ra(d[m](g,h),e);ra(k,e);if(l){if(l.constructor===l)throw ja("isecfn",e);if(l===Rf||l===Sf||l===Tf)throw ja("isecff",e);}k=l.apply?l.apply(k,f):l(f[0],f[1],f[2],f[3],f[4]);return ra(k,e)}},arrayDeclaration:function(){var a=[];if("]"!==this.peekToken().text){do{if(this.peek("]"))break;a.push(this.expression())}while(this.expect(","))}this.consume("]");return H(function(c,d){for(var e=
[],f=0,g=a.length;f<g;f++)e.push(a[f](c,d));return e},{literal:!0,constant:a.every(ec),inputs:a})},object:function(){var a=[],c=[];if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.consume();d.constant?a.push(d.value):d.identifier?a.push(d.text):this.throwError("invalid key",d);this.consume(":");c.push(this.expression())}while(this.expect(","))}this.consume("}");return H(function(d,f){for(var g={},h=0,k=c.length;h<k;h++)g[a[h]]=c[h](d,f);return g},{literal:!0,constant:c.every(ec),
inputs:c})}};var zf=pa(),yf=pa(),Af=Object.prototype.valueOf,Ba=v("$sce"),ka={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},ia=v("$compile"),Z=U.createElement("a"),gd=Aa(T.location.href);Cc.$inject=["$provide"];hd.$inject=["$locale"];jd.$inject=["$locale"];var md=".",Jf={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:Db("Month"),MMM:Db("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",1),hh:$("Hours",
2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:Db("Day"),EEE:Db("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Cb(Math[0<a?"floor":"ceil"](a/60),2)+Cb(Math.abs(a%60),2))},ww:od(2),w:od(1)},If=/((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,Hf=/^\-?\d+$/;id.$inject=["$locale"];var Ff=ba(Q),Gf=ba(rb);
kd.$inject=["$parse"];var Rd=ba({restrict:"E",compile:function(a,c){if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Ja.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||a.preventDefault()})}}}),sb={};r(yb,function(a,c){if("multiple"!=a){var d=wa("ng-"+c);sb[d]=function(){return{restrict:"A",priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});r(Mc,function(a,c){sb[c]=function(){return{priority:100,
link:function(a,e,f){if("ngPattern"===c&&"/"==f.ngPattern.charAt(0)&&(e=f.ngPattern.match(Lf))){f.$set("ngPattern",new RegExp(e[1],e[2]));return}a.$watch(f[c],function(a){f.$set(c,a)})}}}});r(["src","srcset","href"],function(a){var c=wa("ng-"+a);sb[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===Ja.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(c){c?(f.$set(h,c),Ha&&g&&e.prop(g,f[h])):"href"===
a&&f.$set(h,null)})}}}});var Eb={$addControl:w,$$renameControl:function(a,c){a.$name=c},$removeControl:w,$setValidity:w,$setDirty:w,$setPristine:w,$setSubmitted:w};pd.$inject=["$element","$attrs","$scope","$animate","$interpolate"];var wd=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:pd,compile:function(a){a.addClass(Qa).addClass(ib);return{pre:function(a,d,g,h){if(!("action"in g)){var k=function(c){a.$apply(function(){h.$commitViewValue();h.$setSubmitted()});
c.preventDefault?c.preventDefault():c.returnValue=!1};d[0].addEventListener("submit",k,!1);d.on("$destroy",function(){c(function(){d[0].removeEventListener("submit",k,!1)},0,!1)})}var l=h.$$parentForm,m=h.$name;m&&(Oa(a,m,h,m),g.$observe(g.name?"name":"ngForm",function(c){m!==c&&(Oa(a,m,t,m),m=c,Oa(a,m,h,m),l.$$renameControl(h,m))}));d.on("$destroy",function(){l.$removeControl(h);m&&Oa(a,m,t,m);H(h,Eb)})}}}}}]},Sd=wd(),ee=wd(!0),Kf=/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
Vf=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,Wf=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,Xf=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,xd=/^(\d{4})-(\d{2})-(\d{2})$/,yd=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,jc=/^(\d{4})-W(\d\d)$/,zd=/^(\d{4})-(\d\d)$/,Ad=/^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Yf=/(\s+|^)default(\s+|$)/,Hb=new v("ngModel"),Bd={text:function(a,c,d,e,f,g){gb(a,
c,d,e,f,g);hc(e)},date:hb("date",xd,Gb(xd,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":hb("datetimelocal",yd,Gb(yd,"yyyy MM dd HH mm ss sss".split(" ")),"yyyy-MM-ddTHH:mm:ss.sss"),time:hb("time",Ad,Gb(Ad,["HH","mm","ss","sss"]),"HH:mm:ss.sss"),week:hb("week",jc,function(a,c){if(ea(a))return a;if(I(a)){jc.lastIndex=0;var d=jc.exec(a);if(d){var e=+d[1],f=+d[2],g=d=0,h=0,k=0,l=nd(e),f=7*(f-1);c&&(d=c.getHours(),g=c.getMinutes(),h=c.getSeconds(),k=c.getMilliseconds());return new Date(e,0,l.getDate()+
f,d,g,h,k)}}return NaN},"yyyy-Www"),month:hb("month",zd,Gb(zd,["yyyy","MM"]),"yyyy-MM"),number:function(a,c,d,e,f,g){rd(a,c,d,e);gb(a,c,d,e,f,g);e.$$parserName="number";e.$parsers.push(function(a){return e.$isEmpty(a)?null:Xf.test(a)?parseFloat(a):t});e.$formatters.push(function(a){if(!e.$isEmpty(a)){if(!W(a))throw Hb("numfmt",a);a=a.toString()}return a});if(d.min||d.ngMin){var h;e.$validators.min=function(a){return e.$isEmpty(a)||D(h)||a>=h};d.$observe("min",function(a){A(a)&&!W(a)&&(a=parseFloat(a,
10));h=W(a)&&!isNaN(a)?a:t;e.$validate()})}if(d.max||d.ngMax){var k;e.$validators.max=function(a){return e.$isEmpty(a)||D(k)||a<=k};d.$observe("max",function(a){A(a)&&!W(a)&&(a=parseFloat(a,10));k=W(a)&&!isNaN(a)?a:t;e.$validate()})}},url:function(a,c,d,e,f,g){gb(a,c,d,e,f,g);hc(e);e.$$parserName="url";e.$validators.url=function(a){return e.$isEmpty(a)||Vf.test(a)}},email:function(a,c,d,e,f,g){gb(a,c,d,e,f,g);hc(e);e.$$parserName="email";e.$validators.email=function(a){return e.$isEmpty(a)||Wf.test(a)}},
radio:function(a,c,d,e){D(d.name)&&c.attr("name",++kb);c.on("click",function(a){c[0].checked&&e.$setViewValue(d.value,a&&a.type)});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e,f,g,h,k){var l=sd(k,a,"ngTrueValue",d.ngTrueValue,!0),m=sd(k,a,"ngFalseValue",d.ngFalseValue,!1);c.on("click",function(a){e.$setViewValue(c[0].checked,a&&a.type)});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==l};e.$formatters.push(function(a){return na(a,
l)});e.$parsers.push(function(a){return a?l:m})},hidden:w,button:w,submit:w,reset:w,file:w},wc=["$browser","$sniffer","$filter","$parse",function(a,c,d,e){return{restrict:"E",require:["?ngModel"],link:{pre:function(f,g,h,k){k[0]&&(Bd[Q(h.type)]||Bd.text)(f,g,h,k[0],c,a,d,e)}}}}],ib="ng-valid",td="ng-invalid",Qa="ng-pristine",Fb="ng-dirty",vd="ng-pending",Zf=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate","$timeout","$rootScope","$q","$interpolate",function(a,c,d,e,f,g,h,k,l,
m){this.$modelValue=this.$viewValue=Number.NaN;this.$validators={};this.$asyncValidators={};this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$untouched=!0;this.$touched=!1;this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$error={};this.$$success={};this.$pending=t;this.$name=m(d.name||"",!1)(a);var p=f(d.ngModel),q=null,n=this,s=function(){var c=p(a);n.$options&&n.$options.getterSetter&&u(c)&&(c=c());return c},O=function(c){var d;n.$options&&n.$options.getterSetter&&
u(d=p(a))?d(n.$modelValue):p.assign(a,n.$modelValue)};this.$$setOptions=function(a){n.$options=a;if(!(p.assign||a&&a.getterSetter))throw Hb("nonassign",d.ngModel,ua(e));};this.$render=w;this.$isEmpty=function(a){return D(a)||""===a||null===a||a!==a};var E=e.inheritedData("$formController")||Eb,x=0;qd({ctrl:this,$element:e,set:function(a,c){a[c]=!0},unset:function(a,c){delete a[c]},parentForm:E,$animate:g});this.$setPristine=function(){n.$dirty=!1;n.$pristine=!0;g.removeClass(e,Fb);g.addClass(e,Qa)};
this.$setUntouched=function(){n.$touched=!1;n.$untouched=!0;g.setClass(e,"ng-untouched","ng-touched")};this.$setTouched=function(){n.$touched=!0;n.$untouched=!1;g.setClass(e,"ng-touched","ng-untouched")};this.$rollbackViewValue=function(){h.cancel(q);n.$viewValue=n.$$lastCommittedViewValue;n.$render()};this.$validate=function(){W(n.$modelValue)&&isNaN(n.$modelValue)||this.$$parseAndValidate()};this.$$runValidators=function(a,c,d,e){function f(){var a=!0;r(n.$validators,function(e,f){var g=e(c,d);
a=a&&g;h(f,g)});return a?!0:(r(n.$asyncValidators,function(a,c){h(c,null)}),!1)}function g(){var a=[],e=!0;r(n.$asyncValidators,function(f,g){var k=f(c,d);if(!k||!u(k.then))throw Hb("$asyncValidators",k);h(g,t);a.push(k.then(function(){h(g,!0)},function(a){e=!1;h(g,!1)}))});a.length?l.all(a).then(function(){k(e)},w):k(!0)}function h(a,c){m===x&&n.$setValidity(a,c)}function k(a){m===x&&e(a)}x++;var m=x;(function(a){var c=n.$$parserName||"parse";if(a===t)h(c,null);else if(h(c,a),!a)return r(n.$validators,
function(a,c){h(c,null)}),r(n.$asyncValidators,function(a,c){h(c,null)}),!1;return!0})(a)?f()?g():k(!1):k(!1)};this.$commitViewValue=function(){var a=n.$viewValue;h.cancel(q);if(n.$$lastCommittedViewValue!==a||""===a&&n.$$hasNativeValidators)n.$$lastCommittedViewValue=a,n.$pristine&&(n.$dirty=!0,n.$pristine=!1,g.removeClass(e,Qa),g.addClass(e,Fb),E.$setDirty()),this.$$parseAndValidate()};this.$$parseAndValidate=function(){var a=n.$$lastCommittedViewValue,c=a,d=D(c)?t:!0;if(d)for(var e=0;e<n.$parsers.length;e++)if(c=
n.$parsers[e](c),D(c)){d=!1;break}W(n.$modelValue)&&isNaN(n.$modelValue)&&(n.$modelValue=s());var f=n.$modelValue,g=n.$options&&n.$options.allowInvalid;g&&(n.$modelValue=c,n.$modelValue!==f&&n.$$writeModelToScope());n.$$runValidators(d,c,a,function(a){g||(n.$modelValue=a?c:t,n.$modelValue!==f&&n.$$writeModelToScope())})};this.$$writeModelToScope=function(){O(n.$modelValue);r(n.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}})};this.$setViewValue=function(a,c){n.$viewValue=a;n.$options&&!n.$options.updateOnDefault||
n.$$debounceViewValueCommit(c)};this.$$debounceViewValueCommit=function(c){var d=0,e=n.$options;e&&A(e.debounce)&&(e=e.debounce,W(e)?d=e:W(e[c])?d=e[c]:W(e["default"])&&(d=e["default"]));h.cancel(q);d?q=h(function(){n.$commitViewValue()},d):k.$$phase?n.$commitViewValue():a.$apply(function(){n.$commitViewValue()})};a.$watch(function(){var a=s();if(a!==n.$modelValue){n.$modelValue=a;for(var c=n.$formatters,d=c.length,e=a;d--;)e=c[d](e);n.$viewValue!==e&&(n.$viewValue=n.$$lastCommittedViewValue=e,n.$render(),
n.$$runValidators(t,a,e,w))}return a})}],te=function(){return{restrict:"A",require:["ngModel","^?form","^?ngModelOptions"],controller:Zf,priority:1,compile:function(a){a.addClass(Qa).addClass("ng-untouched").addClass(ib);return{pre:function(a,d,e,f){var g=f[0],h=f[1]||Eb;g.$$setOptions(f[2]&&f[2].$options);h.$addControl(g);e.$observe("name",function(a){g.$name!==a&&h.$$renameControl(g,a)});a.$on("$destroy",function(){h.$removeControl(g)})},post:function(a,d,e,f){var g=f[0];if(g.$options&&g.$options.updateOn)d.on(g.$options.updateOn,
function(a){g.$$debounceViewValueCommit(a&&a.type)});d.on("blur",function(d){g.$touched||a.$apply(function(){g.$setTouched()})})}}}}},ve=ba({restrict:"A",require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),yc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){e&&(d.required=!0,e.$validators.required=function(a){return!d.required||!e.$isEmpty(a)},d.$observe("required",function(){e.$validate()}))}}},xc=function(){return{restrict:"A",
require:"?ngModel",link:function(a,c,d,e){if(e){var f,g=d.ngPattern||d.pattern;d.$observe("pattern",function(a){I(a)&&0<a.length&&(a=new RegExp("^"+a+"$"));if(a&&!a.test)throw v("ngPattern")("noregexp",g,a,ua(c));f=a||t;e.$validate()});e.$validators.pattern=function(a){return e.$isEmpty(a)||D(f)||f.test(a)}}}}},Ac=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=0;d.$observe("maxlength",function(a){f=aa(a)||0;e.$validate()});e.$validators.maxlength=function(a,c){return e.$isEmpty(a)||
c.length<=f}}}}},zc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=0;d.$observe("minlength",function(a){f=aa(a)||0;e.$validate()});e.$validators.minlength=function(a,c){return e.$isEmpty(a)||c.length>=f}}}}},ue=function(){return{restrict:"A",priority:100,require:"ngModel",link:function(a,c,d,e){var f=c.attr(d.$attr.ngList)||", ",g="false"!==d.ngTrim,h=g?P(f):f;e.$parsers.push(function(a){if(!D(a)){var c=[];a&&r(a.split(h),function(a){a&&c.push(g?P(a):a)});return c}});
e.$formatters.push(function(a){return G(a)?a.join(f):t});e.$isEmpty=function(a){return!a||!a.length}}}},$f=/^(true|false|\d+)$/,we=function(){return{restrict:"A",priority:100,compile:function(a,c){return $f.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},xe=function(){return{restrict:"A",controller:["$scope","$attrs",function(a,c){var d=this;this.$options=a.$eval(c.ngModelOptions);this.$options.updateOn!==t?
(this.$options.updateOnDefault=!1,this.$options.updateOn=P(this.$options.updateOn.replace(Yf,function(){d.$options.updateOnDefault=!0;return" "}))):this.$options.updateOnDefault=!0}]}},Xd=["$compile",function(a){return{restrict:"AC",compile:function(c){a.$$addBindingClass(c);return function(c,e,f){a.$$addBindingInfo(e,f.ngBind);e=e[0];c.$watch(f.ngBind,function(a){e.textContent=a===t?"":a})}}}}],Zd=["$interpolate","$compile",function(a,c){return{compile:function(d){c.$$addBindingClass(d);return function(d,
f,g){d=a(f.attr(g.$attr.ngBindTemplate));c.$$addBindingInfo(f,d.expressions);f=f[0];g.$observe("ngBindTemplate",function(a){f.textContent=a===t?"":a})}}}}],Yd=["$sce","$parse","$compile",function(a,c,d){return{restrict:"A",compile:function(e,f){var g=c(f.ngBindHtml),h=c(f.ngBindHtml,function(a){return(a||"").toString()});d.$$addBindingClass(e);return function(c,e,f){d.$$addBindingInfo(e,f.ngBindHtml);c.$watch(h,function(){e.html(a.getTrustedHtml(g(c))||"")})}}}}],$d=ic("",!0),be=ic("Odd",0),ae=ic("Even",
1),ce=Ia({compile:function(a,c){c.$set("ngCloak",t);a.removeClass("ng-cloak")}}),de=[function(){return{restrict:"A",scope:!0,controller:"@",priority:500}}],Bc={},ag={blur:!0,focus:!0};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=wa("ng-"+a);Bc[c]=["$parse","$rootScope",function(d,e){return{restrict:"A",compile:function(f,g){var h=d(g[c],null,!0);return function(c,d){d.on(a,
function(d){var f=function(){h(c,{$event:d})};ag[a]&&e.$$phase?c.$evalAsync(f):c.$apply(f)})}}}}]});var ge=["$animate",function(a){return{multiElement:!0,transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,k,l;c.$watch(e.ngIf,function(c){c?k||g(function(c,f){k=f;c[c.length++]=U.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)}):(l&&(l.remove(),l=null),k&&(k.$destroy(),k=null),h&&(l=qb(h.clone),a.leave(l).then(function(){l=null}),
h=null))})}}}],he=["$templateRequest","$anchorScroll","$animate","$sce",function(a,c,d,e){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:va.noop,compile:function(f,g){var h=g.ngInclude||g.src,k=g.onload||"",l=g.autoscroll;return function(f,g,q,n,r){var t=0,E,x,B,v=function(){x&&(x.remove(),x=null);E&&(E.$destroy(),E=null);B&&(d.leave(B).then(function(){x=null}),x=B,B=null)};f.$watch(e.parseAsResourceUrl(h),function(e){var h=function(){!A(l)||l&&!f.$eval(l)||c()},q=
++t;e?(a(e,!0).then(function(a){if(q===t){var c=f.$new();n.template=a;a=r(c,function(a){v();d.enter(a,null,g).then(h)});E=c;B=a;E.$emit("$includeContentLoaded",e);f.$eval(k)}},function(){q===t&&(v(),f.$emit("$includeContentError",e))}),f.$emit("$includeContentRequested",e)):(v(),n.template=null)})}}}}],ye=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){/SVG/.test(d[0].toString())?(d.empty(),a(Ec(f.template,U).childNodes)(c,function(a){d.append(a)},
{futureParentElement:d})):(d.html(f.template),a(d.contents())(c))}}}],ie=Ia({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),je=Ia({terminal:!0,priority:1E3}),ke=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var h=g.count,k=g.$attr.when&&f.attr(g.$attr.when),l=g.offset||0,m=e.$eval(k)||{},p={},q=c.startSymbol(),n=c.endSymbol(),s=/^when(Minus)?(.+)$/;r(g,function(a,c){s.test(c)&&(m[Q(c.replace("when","").replace("Minus",
"-"))]=f.attr(g.$attr[c]))});r(m,function(a,e){p[e]=c(a.replace(d,q+h+"-"+l+n))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in m||(c=a.pluralCat(c-l));return p[c](e)},function(a){f.text(a)})}}}],le=["$parse","$animate",function(a,c){var d=v("ngRepeat"),e=function(a,c,d,e,l,m,p){a[d]=e;l&&(a[l]=m);a.$index=c;a.$first=0===c;a.$last=c===p-1;a.$middle=!(a.$first||a.$last);a.$odd=!(a.$even=0===(c&1))};return{restrict:"A",multiElement:!0,transclude:"element",priority:1E3,terminal:!0,
$$tlb:!0,compile:function(f,g){var h=g.ngRepeat,k=U.createComment(" end ngRepeat: "+h+" "),l=h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if(!l)throw d("iexp",h);var m=l[1],p=l[2],q=l[3],n=l[4],l=m.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",m);var s=l[3]||l[1],A=l[2];if(q&&(!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(q)||/^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(q)))throw d("badident",
q);var v,x,B,J,z={$id:Ma};n?v=a(n):(B=function(a,c){return Ma(c)},J=function(a){return a});return function(a,f,g,l,n){v&&(x=function(c,d,e){A&&(z[A]=c);z[s]=d;z.$index=e;return v(a,z)});var m=pa();a.$watchCollection(p,function(g){var l,p,C=f[0],v,z=pa(),E,H,w,D,G,u,I;q&&(a[q]=g);if(Ra(g))G=g,p=x||B;else{p=x||J;G=[];for(I in g)g.hasOwnProperty(I)&&"$"!=I.charAt(0)&&G.push(I);G.sort()}E=G.length;I=Array(E);for(l=0;l<E;l++)if(H=g===G?l:G[l],w=g[H],D=p(H,w,l),m[D])u=m[D],delete m[D],z[D]=u,I[l]=u;else{if(z[D])throw r(I,
function(a){a&&a.scope&&(m[a.id]=a)}),d("dupes",h,D,w);I[l]={id:D,scope:t,clone:t};z[D]=!0}for(v in m){u=m[v];D=qb(u.clone);c.leave(D);if(D[0].parentNode)for(l=0,p=D.length;l<p;l++)D[l].$$NG_REMOVED=!0;u.scope.$destroy()}for(l=0;l<E;l++)if(H=g===G?l:G[l],w=g[H],u=I[l],u.scope){v=C;do v=v.nextSibling;while(v&&v.$$NG_REMOVED);u.clone[0]!=v&&c.move(qb(u.clone),null,y(C));C=u.clone[u.clone.length-1];e(u.scope,l,s,w,A,H,E)}else n(function(a,d){u.scope=d;var f=k.cloneNode(!1);a[a.length++]=f;c.enter(a,
null,y(C));C=f;u.clone=a;z[u.id]=u;e(u.scope,l,s,w,A,H,E)});m=z})}}}}],me=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngShow,function(c){a[c?"removeClass":"addClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],fe=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngHide,function(c){a[c?"addClass":"removeClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],ne=Ia(function(a,c,d){a.$watch(d.ngStyle,
function(a,d){d&&a!==d&&r(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),oe=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g=[],h=[],k=[],l=[],m=function(a,c){return function(){a.splice(c,1)}};c.$watch(e.ngSwitch||e.on,function(c){var d,e;d=0;for(e=k.length;d<e;++d)a.cancel(k[d]);d=k.length=0;for(e=l.length;d<e;++d){var s=qb(h[d].clone);l[d].$destroy();(k[d]=a.leave(s)).then(m(k,d))}h.length=0;l.length=0;
(g=f.cases["!"+c]||f.cases["?"])&&r(g,function(c){c.transclude(function(d,e){l.push(e);var f=c.element;d[d.length++]=U.createComment(" end ngSwitchWhen: ");h.push({clone:d});a.enter(d,f.parent(),f)})})})}}}],pe=Ia({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),qe=Ia({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,
link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),se=Ia({restrict:"EAC",link:function(a,c,d,e,f){if(!f)throw v("ngTransclude")("orphan",ua(c));f(function(a){c.empty();c.append(a)})}}),Td=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],bg=v("ngOptions"),re=ba({restrict:"A",terminal:!0}),Ud=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
e={$setViewValue:w};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var k=this,l={},m=e,p;k.databound=d.ngModel;k.init=function(a,c,d){m=a;p=d};k.addOption=function(c,d){La(c,'"option value"');l[c]=!0;m.$viewValue==c&&(a.val(c),p.parent()&&p.remove());d&&d[0].hasAttribute("selected")&&(d[0].selected=!0)};k.removeOption=function(a){this.hasOption(a)&&(delete l[a],m.$viewValue==a&&this.renderUnknownOption(a))};k.renderUnknownOption=function(c){c=
"? "+Ma(c)+" ?";p.val(c);a.prepend(p);a.val(c);p.prop("selected",!0)};k.hasOption=function(a){return l.hasOwnProperty(a)};c.$on("$destroy",function(){k.renderUnknownOption=w})}],link:function(e,g,h,k){function l(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(z.parent()&&z.remove(),c.val(a),""===a&&u.prop("selected",!0)):D(a)&&u?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){z.parent()&&z.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;
d.$render=function(){var a=new cb(d.$viewValue);r(c.find("option"),function(c){c.selected=A(a.get(c.value))})};a.$watch(function(){na(e,d.$viewValue)||(e=ta(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];r(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function p(e,f,g){function h(a,c,d){T[z]=d;F&&(T[F]=c);return a(e,T)}function k(a){var c;if(n)if(L&&G(a)){c=new cb([]);for(var d=0;d<a.length;d++)c.put(h(L,null,a[d]),!0)}else c=
new cb(a);else L&&(a=h(L,null,a));return function(d,e){var f;f=L?L:w?w:E;return n?A(c.remove(h(f,d,e))):a===h(f,d,e)}}function l(){x||(e.$$postDigest(p),x=!0)}function m(a,c,d){a[c]=a[c]||0;a[c]+=d?1:-1}function p(){x=!1;var a={"":[]},c=[""],d,l,s,t,u;s=g.$viewValue;t=N(e)||[];var z=F?Object.keys(t).sort():t,w,y,G,E,S={};u=k(s);var P=!1,U,W;R={};for(E=0;G=z.length,E<G;E++){w=E;if(F&&(w=z[E],"$"===w.charAt(0)))continue;y=t[w];d=h(I,w,y)||"";(l=a[d])||(l=a[d]=[],c.push(d));d=u(w,y);P=P||d;y=h(D,w,y);
y=A(y)?y:"";W=L?L(e,T):F?z[E]:E;L&&(R[W]=w);l.push({id:W,label:y,selected:d})}n||(v||null===s?a[""].unshift({id:"",label:"",selected:!P}):P||a[""].unshift({id:"?",label:"",selected:!0}));w=0;for(z=c.length;w<z;w++){d=c[w];l=a[d];Q.length<=w?(s={element:H.clone().attr("label",d),label:l.label},t=[s],Q.push(t),f.append(s.element)):(t=Q[w],s=t[0],s.label!=d&&s.element.attr("label",s.label=d));P=null;E=0;for(G=l.length;E<G;E++)d=l[E],(u=t[E+1])?(P=u.element,u.label!==d.label&&(m(S,u.label,!1),m(S,d.label,
!0),P.text(u.label=d.label),P.prop("label",u.label)),u.id!==d.id&&P.val(u.id=d.id),P[0].selected!==d.selected&&(P.prop("selected",u.selected=d.selected),Ha&&P.prop("selected",u.selected))):(""===d.id&&v?U=v:(U=B.clone()).val(d.id).prop("selected",d.selected).attr("selected",d.selected).prop("label",d.label).text(d.label),t.push(u={element:U,label:d.label,id:d.id,selected:d.selected}),m(S,d.label,!0),P?P.after(U):s.element.append(U),P=U);for(E++;t.length>E;)d=t.pop(),m(S,d.label,!1),d.element.remove();
r(S,function(a,c){0<a?q.addOption(c):0>a&&q.removeOption(c)})}for(;Q.length>w;)Q.pop()[0].element.remove()}var u;if(!(u=s.match(d)))throw bg("iexp",s,ua(f));var D=c(u[2]||u[1]),z=u[4]||u[6],y=/ as /.test(u[0])&&u[1],w=y?c(y):null,F=u[5],I=c(u[3]||""),E=c(u[2]?u[1]:z),N=c(u[7]),L=u[8]?c(u[8]):null,R={},Q=[[{element:f,label:""}]],T={};v&&(a(v)(e),v.removeClass("ng-scope"),v.remove());f.empty();f.on("change",function(){e.$apply(function(){var a=N(e)||[],c;if(n)c=[],r(f.val(),function(d){d=L?R[d]:d;c.push("?"===
d?t:""===d?null:h(w?w:E,d,a[d]))});else{var d=L?R[f.val()]:f.val();c="?"===d?t:""===d?null:h(w?w:E,d,a[d])}g.$setViewValue(c);p()})});g.$render=p;e.$watchCollection(N,l);e.$watchCollection(function(){var a=N(e),c;if(a&&G(a)){c=Array(a.length);for(var d=0,f=a.length;d<f;d++)c[d]=h(D,d,a[d])}else if(a)for(d in c={},a)a.hasOwnProperty(d)&&(c[d]=h(D,d,a[d]));return c},l);n&&e.$watchCollection(function(){return g.$modelValue},l)}if(k[1]){var q=k[0];k=k[1];var n=h.multiple,s=h.ngOptions,v=!1,u,x=!1,B=y(U.createElement("option")),
H=y(U.createElement("optgroup")),z=B.clone();h=0;for(var F=g.children(),w=F.length;h<w;h++)if(""===F[h].value){u=v=F.eq(h);break}q.init(k,v,z);n&&(k.$isEmpty=function(a){return!a||0===a.length});s?p(e,g,k):n?m(e,g,k):l(e,g,k,q)}}}}],Wd=["$interpolate",function(a){var c={addOption:w,removeOption:w};return{restrict:"E",priority:100,compile:function(d,e){if(D(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var l=d.parent(),m=l.data("$selectController")||l.parent().data("$selectController");
m&&m.databound||(m=c);f?a.$watch(f,function(a,c){e.$set("value",a);c!==a&&m.removeOption(c);m.addOption(a,d)}):m.addOption(e.value,d);d.on("$destroy",function(){m.removeOption(e.value)})}}}}],Vd=ba({restrict:"E",terminal:!1});T.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):(Ld(),Nd(va),y(U).ready(function(){Hd(U,sc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map

},{}],"hammer":[function(require,module,exports){
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];s(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function w(){return ob++}function x(a){var b=a.ownerDocument;return b.defaultView||b.parentWindow}function y(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){l(a.options.enable,[a])&&c.handler(b)},this.init()}function z(a){var b,c=a.options.inputClass;return new(b=c?c:rb?N:sb?Q:qb?S:M)(a,A)}function A(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&yb&&d-e===0,g=b&(Ab|Bb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,B(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function B(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=E(b)),e>1&&!c.firstMultiple?c.firstMultiple=E(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=F(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=J(h,i),b.distance=I(h,i),C(c,b),b.offsetDirection=H(b.deltaX,b.deltaY),b.scale=g?L(g.pointers,d):1,b.rotation=g?K(g.pointers,d):0,D(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function C(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===yb||f.eventType===Ab)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function D(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Bb&&(i>xb||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=G(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=H(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function E(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:F(b),deltaX:a.deltaX,deltaY:a.deltaY}}function F(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function G(a,b,c){return{x:b/a||0,y:c/a||0}}function H(a,b){return a===b?Cb:mb(a)>=mb(b)?a>0?Db:Eb:b>0?Fb:Gb}function I(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function J(a,b,c){c||(c=Kb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function K(a,b){return J(b[1],b[0],Lb)-J(a[1],a[0],Lb)}function L(a,b){return I(b[0],b[1],Lb)/I(a[0],a[1],Lb)}function M(){this.evEl=Nb,this.evWin=Ob,this.allow=!0,this.pressed=!1,y.apply(this,arguments)}function N(){this.evEl=Rb,this.evWin=Sb,y.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function O(){this.evTarget=Ub,this.evWin=Vb,this.started=!1,y.apply(this,arguments)}function P(a,b){var c=t(a.touches),d=t(a.changedTouches);return b&(Ab|Bb)&&(c=u(c.concat(d),"identifier",!0)),[c,d]}function Q(){this.evTarget=Xb,this.targetIds={},y.apply(this,arguments)}function R(a,b){var c=t(a.touches),d=this.targetIds;if(b&(yb|zb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return p(a.target,i)}),b===yb)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ab|Bb)&&delete d[g[e].identifier],e++;return h.length?[u(f.concat(h),"identifier",!0),h]:void 0}function S(){y.apply(this,arguments);var a=k(this.handler,this);this.touch=new Q(this.manager,a),this.mouse=new M(this.manager,a)}function T(a,b){this.manager=a,this.set(b)}function U(a){if(q(a,bc))return bc;var b=q(a,cc),c=q(a,dc);return b&&c?cc+" "+dc:b||c?b?cc:dc:q(a,ac)?ac:_b}function V(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=ec,this.simultaneous={},this.requireFail=[]}function W(a){return a&jc?"cancel":a&hc?"end":a&gc?"move":a&fc?"start":""}function X(a){return a==Gb?"down":a==Fb?"up":a==Db?"left":a==Eb?"right":""}function Y(a,b){var c=b.manager;return c?c.get(a):a}function Z(){V.apply(this,arguments)}function $(){Z.apply(this,arguments),this.pX=null,this.pY=null}function _(){Z.apply(this,arguments)}function ab(){V.apply(this,arguments),this._timer=null,this._input=null}function bb(){Z.apply(this,arguments)}function cb(){Z.apply(this,arguments)}function db(){V.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function eb(a,b){return b=b||{},b.recognizers=m(b.recognizers,eb.defaults.preset),new fb(a,b)}function fb(a,b){b=b||{},this.options=i(b,eb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=z(this),this.touchAction=new T(this,this.options.touchAction),gb(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function gb(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function hb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ib=["","webkit","moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now,ob=1,pb=/mobile|tablet|ip(ad|hone|od)|android/i,qb="ontouchstart"in a,rb=v(a,"PointerEvent")!==d,sb=qb&&pb.test(navigator.userAgent),tb="touch",ub="pen",vb="mouse",wb="kinect",xb=25,yb=1,zb=2,Ab=4,Bb=8,Cb=1,Db=2,Eb=4,Fb=8,Gb=16,Hb=Db|Eb,Ib=Fb|Gb,Jb=Hb|Ib,Kb=["x","y"],Lb=["clientX","clientY"];y.prototype={handler:function(){},init:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(x(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(x(this.element),this.evWin,this.domHandler)}};var Mb={mousedown:yb,mousemove:zb,mouseup:Ab},Nb="mousedown",Ob="mousemove mouseup";j(M,y,{handler:function(a){var b=Mb[a.type];b&yb&&0===a.button&&(this.pressed=!0),b&zb&&1!==a.which&&(b=Ab),this.pressed&&this.allow&&(b&Ab&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:vb,srcEvent:a}))}});var Pb={pointerdown:yb,pointermove:zb,pointerup:Ab,pointercancel:Bb,pointerout:Bb},Qb={2:tb,3:ub,4:vb,5:wb},Rb="pointerdown",Sb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Rb="MSPointerDown",Sb="MSPointerMove MSPointerUp MSPointerCancel"),j(N,y,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Pb[d],f=Qb[a.pointerType]||a.pointerType,g=f==tb,h=s(b,a.pointerId,"pointerId");e&yb&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ab|Bb)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Tb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Ub="touchstart",Vb="touchstart touchmove touchend touchcancel";j(O,y,{handler:function(a){var b=Tb[a.type];if(b===yb&&(this.started=!0),this.started){var c=P.call(this,a,b);b&(Ab|Bb)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}});var Wb={touchstart:yb,touchmove:zb,touchend:Ab,touchcancel:Bb},Xb="touchstart touchmove touchend touchcancel";j(Q,y,{handler:function(a){var b=Wb[a.type],c=R.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:tb,srcEvent:a})}}),j(S,y,{handler:function(a,b,c){var d=c.pointerType==tb,e=c.pointerType==vb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ab|Bb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Yb=v(jb.style,"touchAction"),Zb=Yb!==d,$b="compute",_b="auto",ac="manipulation",bc="none",cc="pan-x",dc="pan-y";T.prototype={set:function(a){a==$b&&(a=this.compute()),Zb&&(this.manager.element.style[Yb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),U(a.join(" "))},preventDefaults:function(a){if(!Zb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,bc),f=q(d,dc),g=q(d,cc);return e||f&&c&Hb||g&&c&Ib?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var ec=1,fc=2,gc=4,hc=8,ic=hc,jc=16,kc=32;V.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=Y(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=Y(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=Y(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=Y(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?W(d):""),a)}var c=this,d=this.state;hc>d&&b(!0),b(),d>=hc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=kc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(kc|ec)))return!1;a++}return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(ic|jc|kc)&&(this.state=ec),this.state=this.process(b),void(this.state&(fc|gc|hc|jc)&&this.tryEmit(b))):(this.reset(),void(this.state=kc))},process:function(){},getTouchAction:function(){},reset:function(){}},j(Z,V,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(fc|gc),e=this.attrTest(a);return d&&(c&Bb||!e)?b|jc:d||e?c&Ab?b|hc:b&fc?b|gc:fc:kc}}),j($,Z,{defaults:{event:"pan",threshold:10,pointers:1,direction:Jb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Hb&&b.push(dc),a&Ib&&b.push(cc),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Hb?(e=0===f?Cb:0>f?Db:Eb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Cb:0>g?Fb:Gb,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Z.prototype.attrTest.call(this,a)&&(this.state&fc||!(this.state&fc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(_,Z,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&fc)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(ab,V,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[_b]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ab|Bb)&&!f)this.reset();else if(a.eventType&yb)this.reset(),this._timer=e(function(){this.state=ic,this.tryEmit()},b.time,this);else if(a.eventType&Ab)return ic;return kc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===ic&&(a&&a.eventType&Ab?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),j(bb,Z,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[bc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&fc)}}),j(cb,Z,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Hb|Ib,pointers:1},getTouchAction:function(){return $.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Hb|Ib)?b=a.velocity:c&Hb?b=a.velocityX:c&Ib&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&a.distance>this.options.threshold&&mb(b)>this.options.velocity&&a.eventType&Ab},emit:function(a){var b=X(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(db,V,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[ac]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&yb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ab)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||I(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=ic,this.tryEmit()},b.interval,this),fc):ic}return kc},failTimeout:function(){return this._timer=e(function(){this.state=kc},this.options.interval,this),kc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==ic&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),eb.VERSION="2.0.4",eb.defaults={domEvents:!1,touchAction:$b,enable:!0,inputTarget:null,inputClass:null,preset:[[bb,{enable:!1}],[_,{enable:!1},["rotate"]],[cb,{direction:Hb}],[$,{direction:Hb},["swipe"]],[db],[db,{event:"doubletap",taps:2},["tap"]],[ab]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var lc=1,mc=2;fb.prototype={set:function(a){return h(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?mc:lc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&ic)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===mc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(fc|gc|hc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof V)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&hb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&gb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(eb,{INPUT_START:yb,INPUT_MOVE:zb,INPUT_END:Ab,INPUT_CANCEL:Bb,STATE_POSSIBLE:ec,STATE_BEGAN:fc,STATE_CHANGED:gc,STATE_ENDED:hc,STATE_RECOGNIZED:ic,STATE_CANCELLED:jc,STATE_FAILED:kc,DIRECTION_NONE:Cb,DIRECTION_LEFT:Db,DIRECTION_RIGHT:Eb,DIRECTION_UP:Fb,DIRECTION_DOWN:Gb,DIRECTION_HORIZONTAL:Hb,DIRECTION_VERTICAL:Ib,DIRECTION_ALL:Jb,Manager:fb,Input:y,TouchAction:T,TouchInput:Q,MouseInput:M,PointerEventInput:N,TouchMouseInput:S,SingleTouchInput:O,Recognizer:V,AttrRecognizer:Z,Tap:db,Pan:$,Swipe:cb,Pinch:_,Rotate:bb,Press:ab,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==kb&&define.amd?define(function(){return eb}):"undefined"!=typeof module&&module.exports?module.exports=eb:a[c]=eb}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map
},{}]},{},[1]);
