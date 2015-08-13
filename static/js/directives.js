'use strict';

/* Directives */

angular.module('chuangplus.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('onBlur', function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('blur', function() {
            safeApply(scope, attrs.onBlur);
          });
        }
      };
    }).
    directive('onFocus', function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('focus', function() {
            safeApply(scope, attrs.onFocus);
          });
        }
      };
    }).
    directive('onMouseover', function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('mouseover', function() {
            safeApply(scope, attrs.onMouseover);
          });
        }
      };
    }).
    directive('onMouseout', function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('mouseout', function() {
            safeApply(scope, attrs.onMouseout);
          });
        }
      };
    });
