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
    }).
    directive('myText', function() {
        return{
            restrict : 'E',
            scope : {text : '='},
            replace : true,
            templateUrl : "/static/partials/desktop/directive_templates/myText.html" ,
            link : function(scope,elem,attr){
                scope.$watch('text',function(value){
                    if(value == undefined){
                        return;
                    }
                    scope.texts = value.split('\n');
                    var timestamp = Date.parse(new Date());
                    if(elem.children() != []){
                        elem.empty();
                    }
                    for(var i=0;i<scope.texts.length;i++){
                        if(scope.texts[i]!=''){
                            elem.append("<li>"+scope.texts[i]+"</li>");
                        }
                        else{
                            elem.append("</br>");
                        }
                    }
                });
            }
        }
    }).
    directive('page',function(){
        return{
            restrict : 'E',
            scope : {
                numPages: '=',
                currentPage: '=',
                onSelectPage : '&'
            },
            replace : true,
            templateUrl : '/static/partials/desktop/directive_templates/pagination.html',
            link : function(scope){
                scope.update = function(){
                    scope.pages = [];
                    var start = 1;
                    //更新列表
                    if (scope.currentPage > 4) 
                        start = scope.currentPage - 3;
                    for(var i=start;i<=start + 6 && i <= scope.pageNum ;i++){
                       scope.pages.push(i);
                    }
                };
                scope.$watch('numPages',function(value){
                scope.pages = [];
                scope.pageNum = value;
                var start = 1;
                //更新列表
                if (scope.currentPage > 4) 
                {
                    start = scope.currentPage - 3;
                }
                for(var i=start;i<=start + 6 && i <= scope.pageNum ;i++){
                   scope.pages.push(i);
                }
                if(scope.currentPage > value){
                   scope.selectPage(value);
                }
                });
                scope.isActive = function(page){
                    return scope.currentPage == page;
                };
                scope.selectPage = function(page){
                    if(! scope.isActive(page)){
                        scope.currentPage = page;
                        scope.onSelectPage({page:page});
                        scope.update();
                    }
                };
                scope.selectNext = function(){
                    if( !scope.noNext()){
                        scope.selectPage(scope.currentPage+1);
                        scope.update();
                    }
                };
                scope.selectPrevious = function(){
                    if( !scope.noPrevious()){
                        scope.selectPage(scope.currentPage-1);
                        scope.update();
                    }
                };
                scope.noPrevious = function(){
                    return scope.currentPage == 1
                };
                scope.noNext = function(){
                    return scope.currentPage == scope.numPages
                };
            }

        }
    });
