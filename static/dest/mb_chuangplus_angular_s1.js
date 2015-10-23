/*! chuangplus 2015-10-23 */
// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 

var app = angular.module('chuangplus_mobile', [
    "ngRoute",
    "ngTouch",
    'ngCookies',
    "mobile-angular-ui",
    'mobile-angular-ui.gestures',
    'chuangplus_mobile.filters',
    'chuangplus_mobile.services',
    'chuangplus_mobile.directives',
    "chuangplus_mobile.controllers"
    ]).
    constant('urls', {'part_mobile': '/static/partials/mobile','part_desktop': '/static/partials/desktop','part_admin': '/static/partials/admin', 'api': '/api','mobile_index':'/mobile/index'}).
    config(['$interpolateProvider', function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }]).
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }]).
    config(['$routeProvider', '$locationProvider', 'urls', function($routeProvider, $locationProvider, urls) {
        //Route configure
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix = '';
       // $routeProvider.when('/user/info', {templateUrl: urls.part_desktop + '/user/info.html', controller: 'DT_UserInfoCtrl', title: 'UserInfoPage'});

        //mobile configure
        $routeProvider.when('/mobile/index', {templateUrl: urls.part_mobile + '/company/list.html',title:'公司列表'});
        //$routeProvider.when('/mobile/index/', {templateUrl: urls.part_mobile + '/company/list.html',title:'公司列表'});
        $routeProvider.when('/mobile/test', {templateUrl: urls.part_mobile + '/test.html',title:'公司列表'});
        $routeProvider.when('/mobile/notlogin', {templateUrl: urls.part_mobile + '/notlogin.html',title:'未登录'});

        $routeProvider.when('/mobile/register', {templateUrl: urls.part_mobile + '/register.html', title:'注册'});
        $routeProvider.when('/mobile/login', {templateUrl: urls.part_mobile + '/login.html', title:'登录'});
        $routeProvider.when('/mobile/info', {templateUrl: urls.part_mobile + '/info.html',title:'基本信息填写'});

        //$routeProvider.when('/mobile/position/filter', {templateUrl: urls.part_mobile + '/position/filter.html',title:'筛选'});
        $routeProvider.when('/mobile/position/list', {templateUrl: urls.part_mobile + '/position/list.html',title:'职位列表'});
        $routeProvider.when('/mobile/position/import', {templateUrl: urls.part_mobile + '/position/import.html',title:'职位导入'});
        $routeProvider.when('/mobile/position/detail', {templateUrl: urls.part_mobile + '/position/detail.html',title:'职位详情'});
        $routeProvider.when('/mobile/position/collect', {templateUrl: urls.part_mobile + '/position/collect.html',title:'职位收藏列表'});

        //$routeProvider.when('/mobile/company/filter', {templateUrl: urls.part_mobile + '/company/filter.html',title:'公司筛选'});
        $routeProvider.when('/mobile/company/detail', {templateUrl: urls.part_mobile + '/company/detail.html',title:'公司详情'});
        $routeProvider.when('/mobile/company/posi/:company_id', {templateUrl: urls.part_mobile + '/company/posi.html',title:'公司所有职位'});
        //$routeProvider.when('/mobile/company/list', {templateUrl: urls.part_mobile + '/company/list.html',controller:'MB_CompanyListCtrl', title:'公司列表'});
        $routeProvider.when('/mobile/company/collect', {templateUrl: urls.part_mobile + '/company/collect.html',title:'公司收藏列表'});

        $routeProvider.when('/mobile/home/infoupdate', {templateUrl: urls.part_mobile + '/home/infoupdate.html',title:'更新用户信息'});
        $routeProvider.when('/mobile/home/editresume/:position_id', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'编辑简历'});
        $routeProvider.when('/mobile/home/editresume/', {templateUrl: urls.part_mobile + '/home/editresume.html',title:'编辑简历'});
        $routeProvider.when('/mobile/home/uploadresume', {templateUrl: urls.part_mobile + '/home/uploadresume.html',title:'上传简历'});
        $routeProvider.when('/mobile/home', {templateUrl: urls.part_mobile + '/home/pcenter.html',title:'个人中心'});
        $routeProvider.when('/mobile/home/mypost', {templateUrl: urls.part_mobile + '/home/mypost.html',title:'我的投递'});
        $routeProvider.otherwise({redirectTo: '/'});
        
}]);


  app.run(['$rootScope', '$location', 'UserService', function($rootScope, $location, $user){
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous){
            $rootScope.title = current.$$route.title;
        });
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.is_login = $user.is_login();

        var login_exception = [
            '/mobile/login',
            '/mobile/index',
            '/mobile/register',
            '/mobile/info',
            '/mobile/company/detail',
            '/mobile/position/detail',
            '/mobile/home',
            '/mobile/position/list'
        ];

        if($user.username() == undefined)
        {
            var pass = false;
            for (var i = login_exception.length - 1; i >= 0; i--) {
                if($location.path() == login_exception[i])
                    pass = true;
            };
            if(!pass){
                //$rootScope.loading = true;
                $rootScope.login_url = $location.path();
                $location.path('/mobile/login');
//                window.location.href='/mobile/login';
                return;
            }
        }
        if($location.path() != '/mobile/info' && $location.path() != '/mobile/login' && $location.path() != '/mobile/register')
            $user.check_info();
        $rootScope.loading = true;
        //console.log('route begin change');
    });
}]);

;'use strict';
/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chuangplus_mobile.services', ['chuangplus_mobile.services']).
    value('version', '0.1')
    .service('CsrfService', ['$cookies' ,function($cookies){
        return {
            'val': function() {
                return $cookies.csrftoken;
            },
            'set_csrf': function(data) {
                data['csrfmiddlewaretoken'] = $cookies.csrftoken;
            },
            'set_csrf_array': function(data){
                data.push({'csrfmiddlewaretoken': $cookies.csrftoken});
            }
        };
    }])
    .service('NoticeService',['$cookies',function($cookies){
        $(".notice-bar").html("欢迎来到犀牛");
        return {
            'show': function(data) {
                $(".notice-bar").html(data);
                $(".notice-bar").slideDown("fast");
                setTimeout(function(){$(".notice-bar").slideUp("fast");},1800);
            }
        };
    }])
    .service("ErrorService",['$cookies' ,function($cookies){
        var error_message = {
            'code15':"文件大小超过10M",
            'code18':"没有上传文件权限",
            'code19':'上传文件为空',
            'code20':'要下载的文件不存在',
            'code30':'没有删除文件的权限',
            'code31':'文件不存在，删除失败',
            'code98':"验证码已经失效，请刷新验证码重试",
            'code99':"需要验证码",
            'code100':'没有权限 ',
            'code101':'验证码错误',
            'code103':'用户不存在',
            'code104':'用户信息不存在',
            'code105':'公司信息不存在',
            'code106':'注册失败',
            'code107':'用户名已存在或用户名包含特殊字符',
            'code108':'用户名或密码错误',
            'code109':'新旧密码一样',
            'code110':'没有修改权限',
            'code112':'公司成员不存在',
            'code113':'您是hr，请到hr页面登录',
            'code114':'您是实习生，请到实习生页面登录',
            'code115':'邮箱已经被注册',
            'code116':'邮箱格式不正确',
            'code117':'密码错误',
            'code120':'简历不存在',
            'code121':'融资信息不存在',
            'code210':'职位名太长或者太短',
            'code211':'职位名中包含非法字符',
            'code212':'非法的职位类别',
            'code213':'工作城市字数长度过长或过短',
            'code214':'工作城市中包含非法字符',
            'code215':'工作地址字数长度过长或过短',
            'code216':'工作地址中包含非法字符',
            'code217':'非法的时间形式',
            'code218':'截止时间不能早于发布时间',
            'code219':'职位描述长度超出限度',
            'code220':'职位描述包含非法字符',
            'code221':'职位要求长度超出限度 ',
            'code222':'职位描述中包含非法字符 ',
            'code223':'每周工作时间选择错误，在1到7之间 ',
            'code224':'实习时间错误，应该是一个非负整数 ',
            'code225':'薪资最低值填写错误',
            'code226':'薪资最高值填写错误',
            'code227':'薪资上限应该大于薪酬下限',
            'code228':'职位状态错误',
            'code231':'错误的搜索值：id',
            'code232':'错误的搜索值：城市',
            'code233':'错误的搜索值：每周至少工作的天数',
            'code234':'错误的搜索值：每周最多工作的天数',
            'code235':'错误的搜索值：最低薪资',
            'code236':'错误的搜索值：最高薪资',
            'code237':'错误的搜索值：职位状态',
            'code249':'对象不存在',
            'code250':'存储失败',
            'code251':'搜索失败',
            'code252':'删除失败',
            'code260':'职位不存在',
            'code261':'关注关系不存在，不能取消关注',
            'code262':'职位只能是兼职或全职',
            'code263':'关注公司关系不存在',
            'code264':'用户未投递该职位',
            'code265':'用户未投递任何职位',
            'code266':"已经投递了该职位",
            'code267':'没有实习生投递该职位',
            'code268':'没有岗位消息要处理',
            'code269':'邀请码错误，请联系创加获取邀请码',
            'code270':'邮箱验证码错误',
            'code271':'邮箱验证码失效，请重新发送邮箱验证码',
            'code272':"登录错误",
            'code273':"您的info用户名已经被注册，请去普通登录页登录",
            'code299':'未知错误'
        };
        return {
            'format_error': function (msg,error) {
                if(msg != '' && error.code == 1){
                    error.message = msg;
                    error.class = "alert alert-success";
                }
                else{
                    error.class = "alert alert-danger";
                    error.message = msg;
                    if(error.code != -1){
                        error.code_key = 'code'+error.code;
                        error.message = error_message[error.code_key];
                    }
                }
                error.show = true;
                return error;
            },
            'remove_error':function(error){
                error.show = false;
            }
        };
    }]).
    service('UserService', ['urls', '$http', '$cookies', '$location', '$rootScope', function(urls, $http, $cookies, $location, $rootScope){
        var user = {};
        // $.get(urls.api + '/user/status', function(data){
        //     user = data;
        // });
        if($cookies.username){
            user.username = $cookies.username;
        }
        if($cookies.id){
            user.id = $cookies.id;
        }
        if($cookies.role){
            user.role = $cookies.role;
        }
        //alert(user.username);
        //if(user.username == undefined && $location.path() != '/mobile/login' && $location.path() != '/mobile/register')
        //{
        //   window.location.href='/mobile/login';
        //}
        return {
            'check_info' : function(){
                if(user.username != undefined)
                {
                    $http.get(urls.api+"/account/userinfo/get").
                        success(function(udata){
                        if(udata.error.code == 1){
                            $rootScope.is_tsinghua = udata.data.is_info;
                            if( udata.data.major == undefined ||
                                udata.data.university == undefined ||
                                udata.data.grade == undefined ||
                                ($rootScope.is_tsinghua && udata.data.email == undefined))
                            {
                                console.log('需要填写信息');
                                window.location.href='/mobile/info';
                            }
                        }
                        else
                            $notice.show($errMsg.format_error("",udata.error).message);
                    });
                }
            },
            'check_login' : function(){
                if(user.username == undefined)
                {
                    window.location.href='/mobile/login';
                    return;
                }
                $http.get(urls.api+"/account/userinfo/get").
                    success(function(udata){
                    if(udata.error.code == 1){
                        if( udata.data.major == undefined ||
                            udata.data.university == undefined)
                        {
                            console.log('需要填写信息');
                            window.location.href='/mobile/info';
                        }
                    }
                    else
                        $notice.show($errMsg.format_error("",udata.error).message);
                });
            },
            'is_login' : function(){
                return (user.username != undefined)
            },
            'username': function(){
                return user.username;
            },
            'refresh': function(){
                $.get(urls.api + '/user/status', function(data){
                    user = data;
                });
            },
            'id': function(){
                return user.id;
            },
            'role': function(){
                return user.role;
            },
            'school_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 4;
            },
            'department_manager': function(){
                if(!('role' in user)){
                    return false;
                }
                return parseInt(user.role) == 0 || parseInt(user.role) == 3;
            },
            'logout': function(){
                //delete $cookies['username'];
                $.cookie('username','',{path:"/"});
                //delete $cookies['role'];
                $.cookie('role', '',{path:"/"}); 
            }
        };
    }]).
    factory('safeApply',['$rootScope',function($rootScope){
    return function(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && ( typeof (fn) === 'function')) {
                fn();
            }
        } else {
            scope.$apply(fn);
        }
    }
    }]);

;'use strict';

/* Filters */

angular.module('chuangplus_mobile.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).
    filter('id2date', function(){
        return function(value) {
            var secs = parseInt(value.substring(0,8), 16)*1000;
            var tmp_date = new Date(secs);
            return tmp_date.getFullYear() + '年' + (tmp_date.getMonth() + 1) + '月' + tmp_date.getDate() + '日';
        };
    });;'use strict';

/* Directives */

angular.module('chuangplus_mobile.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('onFinishRenderFilters',['$timeout',function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }])
    .directive('onBlur',['safeApply',function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('blur', function() {
            safeApply(scope, attrs.onBlur);
          });
        }
      };
    }]).
    directive('onFocus',['safeApply',function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('focus', function() {
            safeApply(scope, attrs.onFocus);
          });
        }
      };
    }]).
    directive('onMouseover',['safeApply',function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('mouseover', function() {
            safeApply(scope, attrs.onMouseover);
          });
        }
      };
    }]).
    directive('onMouseout',['safeApply',function(safeApply) {
      return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
          elm.bind('mouseout', function() {
            safeApply(scope, attrs.onMouseout);
          });
        }
      };
    }]).
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
                scope.$watch('numPages',function(value){
                   scope.pages = [];
                   for(var i=1;i<=value;i++){
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
                    }
                };
                scope.selectNext = function(){
                    if( !scope.noNext()){
                        scope.selectPage(scope.currentPage+1);
                    }
                };
                scope.selectPrevious = function(){
                    if( !scope.noPrevious()){
                        scope.selectPage(scope.currentPage-1);
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
;'use strict';

/* Controllers */

angular.module('chuangplus_mobile.controllers', [])
    .controller('MB_CompanyListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope','$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location ) {
        console.log('MB_CompanyListCtrl');
        $scope.company_list = {};
        $scope.filter_show = false;
        $scope.pagenow = 2;
        $scope.filter_params = "";
        $scope.filed_notice = '行业/领域';
        $scope.scale_notice = '公司规模';
        $scope.stage = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.ptype = {
            'technology':'技术',
            'product':'产品',
            'design':'设计',
            'operate':'运营',
            'marketing':'市场',
            'functions':'职能',
            'others':'其它'
        };
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.filter = {
            "field":{
                'social':false,
                'e_commerce':false,
                'education':false,
                'health_medical':false,
                'culture_creativity':false,
                'living_consumption':false,
                'hardware':false,
                'O2O':false,
                'others':false
            },
            "scale": '-1',
            search_name : ""
            //,"csrfmiddlewaretoken" : $csrf.val()
        };
        $scope.go_detail = function(id){
            $location.path('/mobile/company/detail').search({'company_id':id});
        };
        $scope.filter_all = function (id) {
            for (var ele in $scope.filter.field) 
                $scope.filter.field[ele] = !$scope.filter.field.all;
        
        };
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/company/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    if (data.page == data.page_number) 
                        $scope.pagenow = -23333;
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                        $scope.company_list[i].field_value = $scope.cfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].position_type_value = {};

                        for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                    }
                    $rootScope.company_list_page = $scope.pagenow;
                    $rootScope.company_list_filter = $scope.filter;
                    $rootScope.company_list_response = $scope.company_list;
                }
                $rootScope.loading = false;
            });
        };

        $scope.refresh_params = function(){
            $scope.filed_notice = '行业/领域';
            $scope.scale_notice = '公司规模';
            $scope.filter_params = "";
            //?field=others&scale=0&name=科技

            for (var ele in $scope.filter.field) {
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == "")
                    {
                        if(ele == 'e_commerce')
                        {
                            $scope.filter_params = '?fields=e-commerce';
                            $scope.filed_notice = '电子商务';
                        }
                        else
                        {
                            $scope.filter_params = '?fields=' + ele;
                            $scope.filed_notice = $scope.cfield[ele];
                        }
                    }
                    else
                    {
                        if(ele == 'e_commerce')
                            $scope.filter_params += ',e-commerce';
                        else
                            $scope.filter_params += ','+ele;
                        if($scope.filed_notice.indexOf("等") == -1)
                            $scope.filed_notice += ' 等 ';
                    }
                }
            }
            if($scope.filter.scale != '-1' && $scope.filter.scale != "")
            {
                $scope.scale_notice = $scope.stage[$scope.filter.scale];
                if($scope.filter_params != "")
                    $scope.filter_params += '&scale=' + $scope.filter.scale;
                else
                    $scope.filter_params += '?scale=' + $scope.filter.scale;
            }

            var submitparam = "";
            if($scope.filter.search_name == "" || $scope.filter.search_name == undefined)
                submitparam = $scope.filter_params;
            else if($scope.filter_params == "")
                submitparam = $scope.filter_params + "?text=" + $scope.filter.search_name;
            else
                submitparam = $scope.filter_params + "&text=" + $scope.filter.search_name;
            return submitparam;
        };
        if($rootScope.company_list_response != undefined)
        {
            $rootScope.loading = false;
            $scope.company_list = $rootScope.company_list_response;
            $scope.pagenow = $rootScope.company_list_page;
            $scope.filter = $rootScope.company_list_filter;
            $scope.refresh_params();
        }
        else
            $scope.get_company_list();
        $scope.filter_now = -1;
        $scope.show_filter = function(id)
        {
            //$("#filter-content"+id).slideDown("normal");
            //$("#filter-content"+id).show();

            if ($scope.filter_now == id) 
            {
                $scope.hide_filter(id);
                return;   
            }
            $scope.hide_filter(3-id);
            $("#filter-content"+id).animate({top:90},"200");
            $scope.filter_now = id;
            //$scope.filter_show = true;
        };
        $scope.hide_filter = function(id)
        {
            //$("#filter-content"+id).slideUp("fast");
            $("#filter-content"+id).animate({top:(-400)},"200");
            $scope.filter_now = -1;
            //setTimeout($("#filter-content"+id).hide(),400);
            //$scope.filter_show = false;
        };
        $scope.submit_filter = function(id)
        {
            var submitparam = $scope.refresh_params();
            $scope.hide_filter(id);
            $rootScope.loading = true;
            $rootScope.company_param = submitparam;

            $http.get(urls.api+"/account/company/list" + submitparam).
            success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    console.log(data);
                    if (data.page == data.page_number) 
                        $scope.pagenow = -23333;
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                        $scope.company_list[i].field_value = $scope.cfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].position_type_value = {};

                        for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                    
                    }
                    $rootScope.company_list_page = $scope.pagenow;
                    $rootScope.company_list_filter = $scope.filter;
                    $rootScope.company_list_response = $scope.company_list;
                }
                $rootScope.loading = false;
            });
        };
        $scope.submit_search = function()
        {
            if ($scope.filter.search_name != "" && $scope.filter.search_name != undefined) 
            {
                //$scope.filter.search_name.replace(' ','+');
                var submitparam = $scope.refresh_params();
                $rootScope.loading = true;
                $http.get(urls.api+"/account/company/list" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_list = data.data;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0;i<$scope.company_list.length;i++){
                            $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                            $scope.company_list[i].field_value = $scope.cfield[$scope.company_list[i].field];
                            $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                            $scope.company_list[i].position_type_value = {};

                            for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                                $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        
                        }
                        $rootScope.company_list_page = $scope.pagenow;
                        $rootScope.company_list_filter = $scope.filter;
                        $rootScope.company_list_response = $scope.company_list;
                    }
                    $rootScope.loading = false;
                });
            }
            else
            {
                $rootScope.loading = true;
                $http.get(urls.api+"/account/company/list" + $scope.filter_params).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_list = data.data;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0;i<$scope.company_list.length;i++){
                            $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                            $scope.company_list[i].field_value = $scope.cfield[$scope.company_list[i].field];
                            $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                            $scope.company_list[i].position_type_value = {};

                            for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                                $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        
                        }
                        $rootScope.company_list_page = $scope.pagenow;
                        $rootScope.company_list_filter = $scope.filter;
                        $rootScope.company_list_response = $scope.company_list;
                    }
                    $rootScope.loading = false;
                });
            }
        };
        $scope.loading = false;
        $scope.load_more_item = function()
        {
            if($scope.pagenow < 0)
                return;
            var submitparam = "";
            if($scope.filter_params == "")
            {
                if($scope.filter.search_name != "" && $scope.filter.search_name != undefined)
                    submitparam = "?text=" + $scope.filter.search_name;
            }
            else
            {
                if($scope.filter.search_name != "" && $scope.filter.search_name != undefined)
                    submitparam = $scope.filter_params + "&text=" + $scope.filter.search_name;
                else
                    submitparam = $scope.filter_params;
            }

            if(submitparam != "")
                submitparam += '&page=' + $scope.pagenow;
            else
                submitparam += '?page=' + $scope.pagenow;

            $scope.more_loading = true;
            $scope.first_load = false;
            $http.get(urls.api+"/account/company/list" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        var newdata = data.data;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0;i<newdata.length;i++){
                            newdata[i].scale_value = $scope.stage[newdata[i].scale];
                            newdata[i].field_value = $scope.cfield[newdata[i].field];
                            newdata[i].type_value = $scope.ptype[newdata[i].type];
                            newdata[i].position_number = newdata[i].positions.length;
                            newdata[i].position_type_value = {};

                            for(var j=0;j<newdata[i].position_type.length;j++)
                                newdata[i].position_type_value[j] = $scope.position_type[newdata[i].position_type[j]];
                        
                        }
                        $scope.company_list = $scope.company_list.concat(newdata);
                        $rootScope.company_list_response = $scope.company_list;
                        $rootScope.company_list_filter = $scope.filter;
                        $scope.pagenow ++;
                        $rootScope.company_list_page = $scope.pagenow;
                    }
                    $scope.more_loading = false;
                });
        };
        $scope.first_load = true;
        document.getElementById('scrollable-content').onscroll = function record_position(){
            $rootScope.company_list_position = document.getElementById('scrollable-content').scrollTop;
        };

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          //下面是在table render完成后执行的js
          //alert('finish');
            if($rootScope.company_list_response != undefined && $scope.first_load)
            {
                document.getElementById('scrollable-content').scrollTop = $rootScope.company_list_position;
             }
        });
    }])
    .controller('MB_PositionListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location ) {
        console.log('MB_PositionListCtrl');
        $scope.positions = {};
        $scope.filter_show = false;
        $scope.pagenow = 2;
        $scope.workdays_notice = '工作时间';
        $scope.salary_notice = '月薪下限';
        $scope.filed_notice = '行业/领域';
        $scope.type_notice = '职位类型';
        
        $scope.filter_params = "";
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.filter = {
            "workdays": 0,
            "field":{
                'social':false,
                'e_commerce':false,
                'education':false,
                'health_medical':false,
                'culture_creativity':false,
                'living_consumption':false,
                'hardware':false,
                'O2O':false,
                'others':false
            },
            "type":{
                'technology':false,
                'product':false,
                'design':false,
                'operate':false,
                'marketing':false,
                'functions':false,
                'others':false
            },
            "search_name" : "",
            "salary": ""
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.go_detail = function(id){
            $location.path('/mobile/position/detail').search({'position_id':id});
        };
        $scope.filter_all = function (id) {
            var now;
            if(id == 3)
                now = $scope.filter.field;
            else
                now = $scope.filter.type;
            for (var ele in now) {
                if(id == 3)
                    $scope.filter.field[ele] = !now.all;
                else
                    $scope.filter.type[ele] = !now.all;
            }
        };
        $scope.refresh_params = function(){

            $scope.workdays_notice = '工作时间';
            $scope.salary_notice = '月薪下限';
            $scope.filed_notice = '行业/领域';
            $scope.type_notice = '职位类型';
            var isSelected = false;
            $scope.filter_params = "";

            //?field=others&scale=0&name=科技
            for (var ele in $scope.filter.field) 
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == "")
                    {
                        if(ele == 'e_commerce')
                        {
                            $scope.filter_params = '?fields=e-commerce';
                            $scope.filed_notice = '电子商务';
                        }
                        else
                        {
                            $scope.filter_params = '?fields=' + ele;
                            $scope.filed_notice = $scope.cfield[ele];
                        }
                    }
                    else 
                    {
                        if(ele == 'e_commerce')
                            $scope.filter_params += ',e-commerce';
                        else
                            $scope.filter_params += ','+ele;
                        if($scope.filed_notice.indexOf("等") == -1)
                            $scope.filed_notice += ' 等 '; 
                    }
                }

            if($scope.filter.workdays != 0)
            {
                if($scope.filter_params == "")
                    $scope.filter_params += '?max_workday=' + $scope.filter.workdays;
                else
                    $scope.filter_params += '&max_workday=' + $scope.filter.workdays;
                $scope.workdays_notice = '每周' + $scope.filter.workdays + '天';
            }
            else
                $scope.workdays_notice = '弹性时间';

            isSelected = false;
            for (var ele in $scope.filter.type) {
                if($scope.filter.type[ele] == true)
                {
                    if($scope.filter_params == "")
                    {
                        $scope.filter_params = '?types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else if (!isSelected) 
                    {
                        $scope.filter_params += '&types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else
                    {
                        $scope.filter_params += ','+ele;
                        if($scope.type_notice.indexOf("等") == -1)
                            $scope.type_notice += ' 等 '; 
                    }
                    isSelected = true;
                }
            }

            
            if($scope.filter.salary != "" && $scope.filter.salary != undefined)
            {
                if($scope.filter_params != "")
                    $scope.filter_params += '&salary_min=' + $scope.filter.salary;
                else
                    $scope.filter_params += '?salary_min=' + $scope.filter.salary;
                $scope.salary_notice = $scope.filter.salary + 'K';
            }


            var submitparam = "";
            if($scope.filter.search_name == undefined || $scope.filter.search_name == "")
                submitparam = $scope.filter_params;
            else if($scope.filter_params == "")
                submitparam = "?name=" + $scope.filter.search_name;
            else
                submitparam = $scope.filter_params + "&name=" + $scope.filter.search_name;
            return submitparam;
        };
        $scope.get_positions = function(){
            $http.get(urls.api+"/position/search").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                        $rootScope.position_list_page = $scope.pagenow;
                        $rootScope.position_list_filter = $scope.filter;
                        $rootScope.position_list_response = $scope.positions;
                    }
                    else{
                        console.log(data.error.message);
                    }
                    $rootScope.loading = false;
                });
        };
        if($rootScope.position_list_response != undefined)
        {
            $rootScope.loading = false;
            $scope.positions = $rootScope.position_list_response;
            $scope.pagenow = $rootScope.position_list_page;
            $scope.filter = $rootScope.position_list_filter;
            $scope.refresh_params();
        }
        else
            $scope.get_positions();
        $scope.filter_now = -1;
        $scope.show_filter = function(id)
        {
            //$("#filter-content"+id).slideDown("normal");
            //$("#filter-content"+id).show();
            if ($scope.filter_now == id) 
            {
                $scope.hide_filter(id);
                return;   
            }
            for (var i = 4; i >= 1; i--) {
                if (i != id) 
                    $scope.hide_filter(i);
            }   
            $scope.filter_now = id;
            $("#filter-content"+id).animate({top:90},"200");
            //$scope.filter_show = true;
        };
        $scope.hide_filter = function(id)
        {
            //$("#filter-content"+id).slideUp("fast");
            $("#filter-content"+id).animate({top:(-400)},"200");
            $scope.filter_now = -1;
            //setTimeout($("#filter-content"+id).hide(),300);
            //$scope.filter_show = false;
        };
        $scope.submit_filter = function(id)
        {
            var isSelected = false;
            $scope.workdays_notice = '工作时间';
            $scope.salary_notice = '月薪下限';
            $scope.filed_notice = '行业/领域';
            $scope.type_notice = '职位类型';
            $scope.filter_params = null;

            //?field=others&scale=0&name=科技
            for (var ele in $scope.filter.field) 
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == null)
                    {
                        $scope.filed_notice = $scope.cfield[ele];
                        $scope.filter_params = '?fields=' + ele;
                    }
                    else
                        $scope.filter_params += ','+ele;
                }

            if($scope.filter.workdays != 0)
            {
                if($scope.filter_params == null)
                    $scope.filter_params += '?max_workday=' + $scope.filter.workdays;
                else
                    $scope.filter_params += '&max_workday=' + $scope.filter.workdays;
                $scope.workdays_notice = '每周' + $scope.filter.workdays + '天';
            }
            else
                $scope.workdays_notice = '弹性时间';

            isSelected = false;
            for (var ele in $scope.filter.type) {
                if($scope.filter.type[ele] == true)
                {
                    if($scope.filter_params == null)
                    {
                        $scope.filter_params = '?types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else if (!isSelected) 
                    {
                        $scope.filter_params = '&types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else
                        $scope.filter_params += ','+ele;
                    isSelected = true;
                }
            }

            
            if($scope.filter.salary != "" && $scope.filter.salary != undefined)
            {
                if($scope.filter_params != null)
                    $scope.filter_params += '&salary_min=' + $scope.filter.salary;
                else
                    $scope.filter_params += '?salary_min=' + $scope.filter.salary;
                $scope.salary_notice = $scope.filter.salary + 'K';
            }


            var submitparam = "";
            if($scope.filter.search_name == null || $scope.filter.search_name == undefined)
                submitparam = $scope.filter_params;
            else if($scope.filter_params == null)
                submitparam = "?name=" + $scope.filter.search_name;
            else
                submitparam = $scope.filter_params + "&name=" + $scope.filter.search_name;

            var submitparam = $scope.refresh_params();
            $scope.hide_filter(id);
            $rootScope.loading = true;
            $http.get(urls.api+"/position/search" + submitparam).
            success(function(data){
                if(data.error.code == 1){
                    $scope.positions = data.positions;
                    if (data.page == data.page_number) 
                        $scope.pagenow = -23333;
                    for(var i=0; i<$scope.positions.length;i++){
                        $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                        $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                        if($scope.positions[i].company.scale == 0){
                            $scope.positions[i].company.scale_value = "初创";
                        }
                        else if($scope.positions[i].company.scale == 1){
                            $scope.positions[i].company.scale_value = "快速发展";
                        }
                        else{
                            $scope.positions[i].company.scale_value = "成熟";
                        }
                    }
                    $rootScope.position_list_page = $scope.pagenow;
                    $rootScope.position_list_filter = $scope.filter;
                    $rootScope.position_list_response = $scope.positions;
                }
                $rootScope.loading = false;
            });
        };
        $scope.reset_search = function(){
            if($scope.filter.search_name == "")
                $scope.submit_search();
        }
        $scope.submit_search = function()
        {

            if ($scope.filter.search_name != "" && $scope.filter.search_name != undefined) 
            {
                //$scope.filter.search_name.replace(' ','+');
            $scope.filter_params = "";
            var isSelected = false;

            //?field=others&scale=0&name=科技
            for (var ele in $scope.filter.field) 
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == "")
                    {
                        $scope.filed_notice = $scope.cfield[ele];
                        $scope.filter_params = '?fields=' + ele;
                    }
                    else
                        $scope.filter_params += ','+ele;
                }

            if($scope.filter.workdays != 0)
            {
                if($scope.filter_params == "")
                    $scope.filter_params += '?max_workday=' + $scope.filter.workdays;
                else
                    $scope.filter_params += '&max_workday=' + $scope.filter.workdays;
                $scope.workdays_notice = '每周' + $scope.filter.workdays + '天';
            }
            else
                $scope.workdays_notice = '弹性时间';

            isSelected = false;
            for (var ele in $scope.filter.type) {
                if($scope.filter.type[ele] == true)
                {
                    if($scope.filter_params == "")
                    {
                        $scope.filter_params = '?types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else if (!isSelected) 
                    {
                        $scope.filter_params = '&types=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else
                        $scope.filter_params += ','+ele;
                    isSelected = true;
                }
            }

            
            if($scope.filter.salary != "" && $scope.filter.salary != undefined)
            {
                if($scope.filter_params != "")
                    $scope.filter_params += '&salary_min=' + $scope.filter.salary;
                else
                    $scope.filter_params += '?salary_min=' + $scope.filter.salary;
                $scope.salary_notice = $scope.filter.salary + 'K';
            }
                var submitparam = "";
                if($scope.filter_params == "")
                    submitparam = "?name=" + $scope.filter.search_name;
                else
                    submitparam = $scope.filter_params + "&name=" + $scope.filter.search_name;
            

                $rootScope.loading = true;
                $http.get(urls.api+"/position/search" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                        $rootScope.position_list_response = $scope.positions;
                        $rootScope.position_list_page = $scope.pagenow;
                        $rootScope.position_list_filter = $scope.filter;
                    }
                    $rootScope.loading = false;
                });
            }
            else
            {
                $rootScope.loading = true;
                $http.get(urls.api+"/position/search" + $scope.filter_params).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0; i<$scope.positions.length;i++){
                            $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                        }
                        $rootScope.position_list_page = $scope.pagenow;
                        $rootScope.position_list_response = $scope.positions;
                        $rootScope.position_list_filter = $scope.filter;
                    }
                    $rootScope.loading = false;
                });
            }

        };
        $scope.more_loading = false;
        $scope.load_more_item = function()
        {
            if($scope.pagenow < 0)
                return;
            var submitparam = "";
            if($scope.filter_params == "")
            {
                if($scope.filter.search_name != "" && $scope.filter.search_name != undefined)
                    submitparam = "?name=" + $scope.filter.search_name;
            }
            else
            {
                if($scope.filter.search_name != "" && $scope.filter.search_name != undefined)
                    submitparam = $scope.filter_params + "&name=" + $scope.filter.search_name;
                else
                    submitparam = $scope.filter_params;
            }
            if(submitparam != "")
                submitparam += '&page=' + $scope.pagenow;
            else
                submitparam += '?page=' + $scope.pagenow;

            $scope.more_loading = true;
            $scope.first_load = false;
            $http.get(urls.api+"/position/search" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        //$scope.positions = data.positions;
                        var newdata = data.positions;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0; i<newdata.length;i++){
                            newdata[i].field_value = $scope.cfield[newdata[i].company.field];
                            newdata[i].position_type_value = $scope.position_type[newdata[i].position_type];
                            if(newdata[i].company.scale == 0){
                                newdata[i].company.scale_value = "初创";
                            }
                            else if(newdata[i].company.scale == 1){
                                newdata[i].company.scale_value = "快速发展";
                            }
                            else{
                                newdata[i].company.scale_value = "成熟";
                            }
                        }
                        $scope.positions = $scope.positions.concat(newdata);
                        $scope.pagenow ++;
                        $rootScope.position_list_page = $scope.pagenow;
                        $rootScope.position_list_response = $scope.positions;
                        $rootScope.position_list_filter = $scope.filter;
                    }
                    $scope.more_loading = false;
            });

        };
        $scope.first_load = true;
        document.getElementById('scrollable-content').onscroll = function record_position(){
            $rootScope.position_list_position = document.getElementById('scrollable-content').scrollTop;
        };

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            if($rootScope.position_list_response != undefined && $scope.first_load)
            {
                document.getElementById('scrollable-content').scrollTop = $rootScope.position_list_position;
             }
        });
    }])
    .controller('MB_PositionFilterCtrl', ['$scope', '$http', 'urls', '$routeParams',
         function($scope, $http, urls, $routeParams) {
    
    }])
    .controller('MB_CompanyPositionCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope,$location ) {
        $scope.get_company = function(){
        $scope.company_id = $routeParams.company_id;
        console.log($scope.company_id);
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.company_id = $routeParams.company_id;
        $scope.go_detail_position = function(id){
            $location.path('/mobile/position/detail').search({'position_id':id});
        };
        $scope.go_detail_company = function(){
            $location.path('/mobile/company/detail').search({'company_id':$scope.company_id});
        };
        $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail_with_positions").
          success(function(data,status,headers,config){
            console.log(data);   
            if(data.error.code == 1){
                $scope.company = data.data;
                $scope.company.field_value = $scope.cfield[$scope.company.field];
                $scope.company.scale_value = $scope.latest_scale[$scope.company.scale];
                $scope.company.position_number = $scope.company.positions.length;

                $scope.company.position_type_value = {};
                for(var i=0;i<$scope.company.position_type.length;i++)
                    $scope.company.position_type_value[i] = $scope.position_type[$scope.company.position_type[i]];
                        
                for(var i=0;i<$scope.company.position_number;i++){
                    $scope.company.position_list[i].position_type_value = $scope.position_type[$scope.company.position_list[i].position_type];
                }
            }
            else{

            }
            $rootScope.loading = false;
            });
        };
        $scope.get_company();


        $scope.post_value = "收藏公司";       

        //获取关注信息
        $scope.check_favor_company = function(){
            $http.get(urls.api+"/account/userinfo/"+$scope.company_id+"/check_favor_company").
                success(function(data){
                if(data.error.code == 1){
                    console.log(data);
                    $scope.favor_exist = data.data.exist;
                    if($scope.favor_exist == true)
                    {
                        $scope.post_value = "取消收藏";
                    }
                    else
                        $scope.post_value = "收藏公司";
                }
                else{
                }
            });
        };
        $scope.check_favor_company();

        //进行收藏和取消 
        $scope.post = function(){
            if($user.is_login())
                if($scope.favor_exist == false){
                    $scope.param = {
                        "csrfmiddlewaretoken" : $csrf.val()
                    };
                    $http.post(urls.api + "/account/company/"+$scope.company_id+"/like", $.param($scope.param)).
                    success(function(data){
                        if(data.error.code == 1){
                            $scope.post_value = "取消收藏";
                            $scope.favor_exist = true;
                            $notice.show("已收藏");
                        }
                        else{
                            $notice.show($errMsg.format_error("",udata.error).message);
                        }
                    });
                }
                else{
                    $scope.param = {
                        "csrfmiddlewaretoken" : $csrf.val()
                    };
                    $http.post(urls.api + "/account/company/"+$scope.company_id+"/unlike", $.param($scope.param)).
                        success(function(data){
                            if(data.error.code == 1){
                                $scope.post_value = "收藏公司";
                                $scope.favor_exist = false;
                                $notice.show("已取消收藏");
                            }
                            else{
                                $notice.show($errMsg.format_error("",udata.error).message);
                            }
                    });
                }
            else
                $notice.show("请先登录");

        };
    }])
    .controller('MB_CompanyDetailCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope','$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location) {
        $scope.company_id = $routeParams.company_id;
        console.log('MB_CompanyDetailCtrl ' + $scope.company_id);
        $scope.company = {};
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.stage = {
            "seed" :"种子轮",
            "angel":"天使轮",
            "A":"A轮",
            "B":"B轮",
            "C":"C轮",
            "D_plus":"D及以上轮"
        };
        $scope.amount = {
            "ten":"十万级",
            "hundred":"百万级",
            "thousand":"千万级",
            "thousand_plus":"亿级"
        };

        //获取公司相关信息
        $scope.get_company = function(){
            $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail_with_positions").
              success(function(data){
                if(data.error.code == 1){
                    $scope.company = data.data;
                    console.log($scope.company.position_type);
                    $scope.company.field_value = $scope.cfield[$scope.company.field];
                    $scope.company.scale_value = $scope.latest_scale[$scope.company.scale];
                    $scope.company.position_type_value = {};
                    for(var i=0;i<$scope.company.position_type.length;i++)
                        $scope.company.position_type_value[i] = $scope.position_type[$scope.company.position_type[i]];
                    
                    if($scope.company.homepage.indexOf("http://") == -1 && $scope.company.homepage.indexOf("https://") == -1)
                        $scope.company.homepage = "http://" + $scope.company.homepage;
                

                    $http.get(urls.api+"/account/financing/" + $scope.company_id + "/list").
                        success(function(fdata){
                            if(data.error.code == 1){
                                $scope.company.financing_data = fdata.data;
                                $scope.company.financing_number = fdata.data.length;
                            
                            for(var i=0; i<$scope.company.financing_number; i++){
                                $scope.company.financing_data[i].organization = $scope.company.financing_data[i].organization;
                                $scope.company.financing_data[i].scale_value = $scope.stage[$scope.company.financing_data[i].stage];
                                $scope.company.financing_data[i].amount_value = $scope.amount[$scope.company.financing_data[i].amount];
                            }
                    }
                    });
                    $http.get(urls.api+"/account/member/"+$scope.company_id+"/list").
                        success(function(data){
                            if(data.error.code == 1){
                                $scope.member_list = data.data;
                                $scope.member_number = data.data.length;
                            }
                            else{

                            }
                            $rootScope.loading = false;
                        }); 

                }
                else{

                }
                });
                
                //alert();
        };
        $scope.get_company();

        $scope.post_value = "收藏公司";       

        //获取关注信息
        $scope.check_favor_company = function(){
            $http.get(urls.api+"/account/userinfo/"+$scope.company_id+"/check_favor_company").
                success(function(data){
                if(data.error.code == 1){
                    console.log(data);
                    $scope.favor_exist = data.data.exist;
                    if($scope.favor_exist == true)
                    {
                        $scope.post_value = "取消收藏";
                    }
                    else
                        $scope.post_value = "收藏公司";
                }
                else{
                }
            });
        };
        $scope.check_favor_company();

        //进行收藏和取消 
        $scope.post = function(){
            if($user.is_login())
                if($scope.favor_exist == false){
                    $scope.param = {
                        "csrfmiddlewaretoken" : $csrf.val()
                    };
                    $http.post(urls.api + "/account/company/"+$scope.company_id+"/like", $.param($scope.param)).
                    success(function(data){
                        if(data.error.code == 1){
                            $scope.post_value = "取消收藏";
                            $scope.favor_exist = true;
                            $notice.show("已收藏");
                        }
                        else{
                            $notice.show($errMsg.format_error("",udata.error).message);
                        }
                    });
                }
                else{
                    $scope.param = {
                        "csrfmiddlewaretoken" : $csrf.val()
                    };
                    $http.post(urls.api + "/account/company/"+$scope.company_id+"/unlike", $.param($scope.param)).
                        success(function(data){
                            if(data.error.code == 1){
                                $scope.post_value = "收藏公司";
                                $scope.favor_exist = false;
                                $notice.show("已取消收藏");
                            }
                            else{
                                $notice.show($errMsg.format_error("",udata.error).message);
                            }
                    });
                }
            else
                $notice.show("请先登录");
        };
    }])

    .controller('MB_PositionDetailCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location ) {
        $scope.position_id = $routeParams.position_id;
        console.log($scope.position_id);
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.post_value = "收藏职位";
        $scope.go_detail = function(){
            $location.path('/mobile/company/detail').search({'company_id':$scope.position.company._id.$oid});
        };

        //取得该职位信息
        $http.get(urls.api+"/position/"+ $scope.position_id +"/get_with_company").
            success(function(data){
            if(data.error.code == 1){
                $scope.position = data.data;
                $scope.position.scale_value = $scope.latest_scale[$scope.position.company.scale];
                $scope.position.field_value = $scope.cfield[$scope.position.company.field];
                $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
                $scope.position.position_number = $scope.position.company.positions.length;

                $http.get(urls.api+"/account/company/"+ $scope.position.company._id.$oid +"/detail_with_positions").
                    success(function(data){
                        console.log(data);
                        if(data.error.code == 1){
                            $scope.position.company.position_type_value = {};
                            for(var i=0;i<data.data.position_type.length;i++)
                                $scope.position.company.position_type_value[i] = $scope.position_type[data.data.position_type[i]];
                        }
                        else{
                            console.log(data.error.message)
                        }
                        $rootScope.loading = false;
                    });

            }
            else{
                console.log(data.error.message)
            }
        });

        //获取该职位和登录用户相关信息
        $http.get(urls.api+"/account/userinfo/"+$scope.position_id+"/check_favor_position").
            success(function(data){
            console.log(data);
            if(data.error.code == 1){
                $scope.favor_exist = data.data.exist;
                if($scope.favor_exist == true)
                {
                    $scope.post_value = "取消收藏";
                }
                else
                    $scope.post_value = "收藏职位";
            }
            else{
                console.log(data.error.message);
            }
        });

        //进行收藏和取消 
        $scope.post = function(){
            if($user.is_login())
                if($scope.favor_exist == false){
                    $scope.submitFavor = {};
                    $scope.submitFavor.position_id = $scope.position_id;
                    $csrf.set_csrf($scope.submitFavor);
                    $http.post(urls.api + "/position/"+$scope.position_id+"/userlikeposition", $.param($scope.submitFavor)).
                    success(function(data){
                        $scope.post_value = "取消收藏";
                        $scope.favor_exist = true;
                    });
                }
                else{
                    $scope.submitUnFavor = {};
                    $scope.submitUnFavor.position_id = $scope.position_id;
                    $csrf.set_csrf($scope.submitUnFavor);
                    $http.post(urls.api+"/position/"+$scope.position_id+"/userunlikeposition", $.param($scope.submitUnFavor)).
                    success(function(data){
                        $scope.post_value = "收藏职位";
                        $scope.favor_exist = false;
                    });
                }
            else
                $notice.show("请先登录");
        };

        //检查简历是否完善
        $scope.userinfo = {};
        $http.get(urls.api + "/account/userinfo/get").
            success(function(data){
                if(data.error.code == 1){
                    $scope.userinfo = data.data;
                    $scope.submitResume = {};
                    $scope.submitResume.position_id = $scope.position_id;
                    console.log($scope.userinfo.resume_id);

                    if($scope.userinfo.real_name != undefined && $scope.userinfo.real_name != null && $scope.userinfo.real_name != "")
                        $scope.resume_compelete = true;
                    else
                        $scope.resume_compelete = false;

                    if($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null)
                        $scope.resume_submitted = true;
                    else
                        $scope.resume_submitted = false;
                }
                else{
                    console.log($errMsg.format_error("",data.error).message);
                }
        });

        $scope.is_submit = "投简历";
        $http.get(urls.api + "/position/" +$scope.position_id+ "/check_submit").
            success(function(data){
                if(data.error.code == 1){
                    if(data.exist)
                        $scope.is_submit = "已投递";
                }
                else{
                }
        });
        
        //投递职位
        $scope.submit_posi = function(){
            if($scope.resume_submitted == true)
                $scope.submitResume.resume_choice = 1;
            else
                $scope.submitResume.resume_choice = 3;
            if($scope.resume_compelete)
            {
                $csrf.set_csrf($scope.submitResume);
                $http.post(urls.api + "/position/"+$scope.position_id+"/submit", $.param($scope.submitResume)).
                    success(function(data){
                        if(data.error.code == 1){
                            $scope.is_submit = "已投递";
                            $notice.show("投递成功");
                        }
                            else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    }
                ); 
            }

        };
        $scope.notice = function(msg)
        {
            $notice.show(msg);
        }
        //提醒完善简历
        $scope.complete_resume = function(){
             setTimeout(function(){window.location.href='/intern/resume'},2000);
             
        };
    }])
    .controller('MB_LoginCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location ) {
        console.log("MB_LoginCtrl");
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.login_info = {};
        $scope.capcha_info = {};
//        $scope.$apply(function(){
  //          $rootScope.loading = false;
    //    });

        $scope.refresh_captcha = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.is_captcha_ok = 0;
        $rootScope.tsinghua_occu = '0';

        $scope.check_captcha = function(){
            $csrf.set_csrf($scope.capcha_info);
            $scope.capcha_info.captcha = $scope.login_info.captcha;
            console.log( $scope.login_info.captcha);
            $http.post(urls.api+"/captcha/check/", $.param($scope.capcha_info)).
                success(function(data){
                    if(data != 'yes')
                    {
                        $notice.show('验证码错误');
                        $('#captcha-pass').hide();
                        $scope.is_captcha_ok = 0;
                        return false;
                    }
                    else
                    {
                        $('#captcha-pass').show();
                        $scope.is_captcha_ok = 1;
                        return true;
                    }

                });
            
        }

        $scope.login_user = function(){
            console.log($scope.is_captcha_ok);
            ///if($scope.is_captcha_ok == 1)
            //{
                $csrf.set_csrf($scope.login_info);
                console.log($scope.login_info);

                if($scope.is_tsinghua != true)
                $http.post(urls.api+"/account/login", $.param($scope.login_info)).
                    success(function(data){
                        console.log(data);
                        if(data.error.code == 1){
                            $rootScope.is_tsinghua = false;
                            if(data.completive == 1)
                            {
                                if($rootScope.login_url != undefined)
                                    window.location.href = $rootScope.login_url;
                                else
                                    window.location.href = urls.mobile_index;
                            }
                            else
                                window.location.href = '/mobile/info';
                        }
                        else
                        {
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                });
                else
                $http.post(urls.api+"/account/login_by_tsinghua", $.param($scope.login_info)).
                    success(function(data){
                        console.log(data);
                        if(data.error.code == 1){
                            $rootScope.is_tsinghua = true;
                            if(data.completive == 1)
                            {
                                if($rootScope.login_url != undefined)
                                    window.location.href = $rootScope.login_url;
                                else
                                    window.location.href = urls.mobile_index;
                            }
                            else
                                window.location.href = '/mobile/info';
                        }
                        else if(data.error.code == 32){
                            console.log("存在");
                            $rootScope.tsinghua_occu = '1';
                            $rootScope.student_id = data.student_id;
                            $location.path('/mobile/info');
//                            window.location.href='/mobile/info';
                        }
                        else
                        {
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                });

            //}
            //else
            //    $notice.show('验证码错误');
        };
        $scope.refresh_captcha();
        $rootScope.loading = false;
    }
    ])
    .controller('MB_RegisterCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log("MB_RegisterCtrl");

        $scope.info_check = [0, 0, 0, 0];
        $scope.reg_info = {};
        $scope.capcha_info = {};
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.check_username = {};
        $scope.e_check = {};
        $scope.refresh_captcha = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };

        $scope.check_captcha = function(){
            $csrf.set_csrf($scope.capcha_info);
            $scope.capcha_info.captcha = $scope.reg_info.captcha;
            console.log( $scope.reg_info.captcha);
            $http.post(urls.api+"/captcha/check/", $.param($scope.capcha_info)).
                success(function(data){
                    if(data != 'yes')
                    {
                        $notice.show('验证码错误');
                        $('#captcha-pass').hide();
                        $scope.info_check[3] = 0;
                        return false;
                    }
                    else
                    {
                        $('#captcha-pass').show();
                        $scope.info_check[3] = 1;
                        return true;
                    }

                });
        }

        $scope.check_username = function(){
            $scope.check_username.username = $scope.reg_info.username;
            $csrf.set_csrf($scope.check_username);

            if($scope.check_username.username.length > 5)
                $http.post(urls.api+"/account/checkusername", $.param($scope.check_username)).
                success(function(data){
                    if(data.error.code == 1){
                        console.log(data);
                        if(data.username.exist != 'false')
                        {
                            $notice.show('用户名已存在');
                            $('#username-pass').hide();
                            $scope.info_check[0] = 0;
                            return false;
                        }
                        else
                            $('#username-pass').show();
                    }
                });
            else
            {
                $notice.show('用户名长度最短6位');
                $scope.info_check[0] = 0;
                return false;
            }
            $scope.info_check[0] = 1;
            return true;
        };
        $scope.check_email = function(){
            $scope.e_check.email = $scope.reg_info.email;
            $csrf.set_csrf($scope.e_check);

            console.log($scope.reg_info.email);
            if($scope.reg_info.email != undefined)
                $http.post(urls.api+"/account/checkemail", $.param($scope.e_check)).
                success(function(data){
                    if(data.error.code == 1){
                        console.log(data);
                        if(data.email.exist != 'false')
                        {
                            $notice.show('该邮箱已使用');
                            $('#email-pass').hide();
                            $scope.info_check[1] = 0;
                            return false;
                        }
                    }
                });
            else
            {
                $notice.show('请输入合法的邮箱地址');
                $('#email-pass').hide();
                $scope.info_check[1] = 0;
                return false;
            }
            $('#email-pass').show();
            $scope.info_check[1] = 1;
            return true;
        };
        $scope.check_pass_len = function(){
            if($scope.reg_info.password == undefined)
            {
                $notice.show('为保证安全，密码最少为6位');
                $('#pass1-pass').hide();
                $scope.info_check[2] = 0;
                return false;
            }
            $('#pass1-pass').show();
            $scope.info_check[2] = 1;
            return true;
        };
        $scope.check_pass_same = function(){
            if($scope.reg_info.password != $scope.repeate_password && $scope.reg_info.password != undefined)
            {
                $notice.show('两次输入密码需一致');
                $('#pass2-pass').hide();
                $scope.info_check[2] = 0;
                return false;
            }
            $('#pass2-pass').show();
            $scope.info_check[2] = 1;
            return true;
        };
        $scope.refresh_captcha();
        $scope.info_check_flist = [$scope.check_username, $scope.check_email, $scope.check_pass_len, $scope.check_pass_same, $scope.check_captcha];
        
        $scope.register = function(){
            var checked_info = 0;
            if($scope.check_username())
                if($scope.check_email())
                    if($scope.check_pass_len())
                        if($scope.check_pass_same())
                            if($scope.check_captcha())
                                checked_info = 4;
            for (var i = $scope.info_check.length - 1; i >= 0; i--) {
                checked_info += $scope.info_check[i];
            };
            if(checked_info == 4)
            {
                console.log($scope.reg_info);
                $csrf.set_csrf($scope.reg_info);
                $http.post(urls.api+"/account/register", $.param($scope.reg_info)).
                    success(function(data){
                        if(data.error.code == 1){
                            setTimeout(window.location.href='/mobile/info',1000);
                        }
                        else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    });
            }
        };
        $rootScope.loading = false;
    }
    ])
    .controller('MB_PositionFavorCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope','$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope,$location) {
        console.log('MB_PositionFavorCtrl');
        $user.check_login();
        $scope.positions = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.go_detail = function(id){
            $location.path('/mobile/position/detail').search({'position_id':id});
        };
        $scope.get_userInfo = function(){
            $scope.userinfo = {};
            $http.get(urls.api + "/account/userinfo/get").
                success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        $scope.userinfo = data.data;
                        $scope.submitResume = {};
                        $scope.submitResume.position_id = $scope.position_id;
                        console.log($scope.userinfo.resume_id);
                        if($scope.userinfo.real_name != undefined && $scope.userinfo.real_name != null && $scope.userinfo.real_name != "")
                            $scope.resume_compelete = true;
                        else
                            $scope.resume_compelete = false;

                        if($scope.userinfo.resume_id != undefined && $scope.userinfo.resume_id != null)
                        {
                            $scope.submitResume.resume_choice = 1;
                            $scope.resume_submitted = true;
                            console.log("here");
                        }
                        else{
                            $scope.resume_submitted = false;
                        }
                    }
                    else{
                        console.log(data.error).message;
                    }
            });
       };
        $scope.get_positions = function(){
        $http.get(urls.api+"/account/userinfo/position/favor/list").
            success(function(data){
                console.log(data);
                if(data.error.code == 1){
                    $scope.positions = data.data;
                    for(var i = 0; i < $scope.positions.length; i ++){
                        $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                        $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                        if($scope.positions[i].company.scale == 0){
                            $scope.positions[i].company.scale_value = "初创";
                        }
                        else if($scope.positions[i].company.scale == 1){
                            $scope.positions[i].company.scale_value = "快速发展";
                        }
                        else{
                            $scope.positions[i].company.scale_value = "成熟";
                        }
                    }
                }
                else{
                    console.log(data.error.message);
                }
                $rootScope.loading = false;
            });
        };
        $scope.check_submit = function(index){
        $http.get(urls.api+"/position/"+$scope.positions[index]._id.$oid+"/check_submit").
                success(function(data){
                    if(data.error.code == 1){
                        if(data.exist == true){
                            $scope.positions[index].resume_submitted = true;
                        }
                        else{$index
                            $scope.positions[index].resume_submitted = false;
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
            });
        };
        $scope.get_userInfo();
        $scope.get_positions();

        $scope.submit_posi = function(index){
            if($scope.resume_submitted == true)
                $scope.submitResume.resume_choice = 1;
            else
                $scope.submitResume.resume_choice = 3;
            if($scope.resume_compelete)
            {
                $csrf.set_csrf($scope.submitResume);
                $http.post(urls.api + "/position/"+$scope.positions[index]._id.$oid+"/submit", $.param($scope.submitResume)).
                    success(function(data){
                        if(data.error.code == 1){
                            $notice.show("已投递");
                            $scope.positions[index].resume_submitted = true;
                        }
                            else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    }
                ); 
            }
        };

        $scope.submit_all = function(){
            if($scope.resume_compelete)
            {
                $scope.submitResume = {};
                $csrf.set_csrf($scope.submitResume);
                $http.post(urls.api + "/account/userinfo/position/favor/submitall", $.param($scope.submitResume)).
                    success(function(data){
                        if(data.error.code == 1){
                            $scope.submit_value = "已投递";
                            $notice.show("全部投递成功");
                            for(var i = 0; i < $scope.positions.length; i ++){
                                $scope.positions[i].resume_submitted = true;
                            }
                        }
                            else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    }
                ); 
            }
        };

        $scope.clear_invalid = function(){
            $scope.submitResume = {};
            $csrf.set_csrf($scope.submitResume);
            $http.post(urls.api + "/account/userinfo/remove/closed_position", $.param($scope.submitResume)).
                success(function(data){
                    if(data.error.code == 1){
                        window.location.href="/mobile/position/collect";
                    }
                    else{
                        $notice.show($errMsg.format_error("",data.error).message);
                    }
                }
            ); 
        };
    }])
    .controller('MB_CompanyFavorCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ,$location) {
        $user.check_login();
        $scope.company_list = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
        };
        $scope.position_index = {
            "technology":0,
            "product":1,
            "design":2,
            "operate":3,
            "marketing":4,
            "functions":5,
            "others":6
        };
        $scope.scale = {
            0:"初创",
            1:"快速发展",
            2:"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.go_detail = function(id){
            $location.path('/mobile/company/detail').search({'company_id':id});
        };
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/userinfo/company/favor/list").
            success(function(data){
                if(data.error.code == 1){
                $scope.company_list = data.data;
                $scope.company_num = $scope.company_list.length;
                for(var i = 0; i < $scope.company_list.length; i ++){
                    $scope.company_list[i].field_value = $scope.cfield[$scope.company_list[i].field];
                    $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                    $scope.company_list[i].position_types = {};
                    $scope.company_list[i].scale_value = $scope.scale[$scope.company_list[i].scale];
                    for(var j = 0; j < $scope.company_list[i].positions.length; j ++)
                    {
                        $scope.company_list[i].position_types[$scope.position_index[$scope.company_list[i].positions[j].position_type]] = $scope.position_type[$scope.company_list[i].positions[j].position_type];
                    }
                }
                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
                $rootScope.loading = false;
            });
        };
        $scope.get_company_list();
    }])
    .controller('MB_EditResumeCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_EditResumeCtrl');
        $user.check_login();
        $scope.position_id = $routeParams.position_id;
        $scope.filename = "无简历附件";
        $scope.intern_info = {};
        $scope.get_intern_info = function(){
            $http.get(urls.api+"/account/userinfo/get").
              success(function(data){
                if(data.error.code == 1){
                    $scope.intern_info = data.data;
                    if($scope.intern_info.resume_name != undefined && $scope.intern_info.resume_id != undefined){
                        $scope.filename = $scope.intern_info.resume_name;
                    }
                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
                $rootScope.loading = false;
              });
        };
        $scope.get_intern_info();
        $scope.save_intern_info = function(){
            if( $scope.intern_info.real_name    != undefined &&
                $scope.intern_info.description  != undefined &&
                $scope.intern_info.gender       != undefined &&
                $scope.intern_info.cellphone    != undefined &&
                $scope.intern_info.work_days    != undefined)
            {
                $csrf.set_csrf($scope.intern_info);
                $http.post(urls.api+"/account/userinfo/set", $.param($scope.intern_info)).
                    success(function(data){
                        if(data.error.code == 1){
                            $notice.show("修改简历成功");
                            if($scope.position_id != undefined)
                                window.location.href="/mobile/position/detail/"+$scope.position_id;
                            else
                                setTimeout("window.location.href='/mobile/home'",1800);
                        }
                        else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    }); 
            }
            else
            {
                $notice.show("请填写合法的内容");
            }
        };
        $scope.upload = function(file,file_t){
            var param = {
               "file_type": file_t,
               "description": $user.username(),
               "category": $user.username() + '_'+file_t
            };
            var headers = {
                   'X-CSRFToken': $csrf.val(),
                   'Content-Type': file.type
               };
            Upload.upload({
               url:urls.api+'/file/upload',
               data: param,
               headers:headers,
               file: file
            }).
            progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress= 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
            }).
            success(function(data, status, headers, config){
                if(data.error.code == 1){
                    $scope.intern_info.resume_name = config.file.name;
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data.data);
                    $scope.intern_info.resume_id = data.data;
                    $scope.filename = config.file.name;
                }
                else{
                    console.log(data.error.message);
                    $scope.error = $errMsg.format_error("",data.error);
                }
            });
        };
    }])

    .controller('MB_UserInfoUpdateCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_UserInfoUpdateCtrl');
        $user.check_login();
        $scope.info = {};
        $scope.tab_now = 2;
        $scope.user_info = {};
        $scope.user_pwd = {};
        $scope.info.username = $user.username();
        $scope.e_check = {};

        $http.get(urls.api+"/account/userinfo/get").
            success(function(data){
            if(data.error.code == 1){
                $scope.user_info = data.data;
                $rootScope.loading = false;
            }
        });


        $scope.check_pass_len = function(){
            if($scope.user_pwd.new_password == undefined)
            {
                $notice.show('为保证安全，密码最少为6位');
                $('#pass1-pass').hide();
                $scope.info_check = 0;
                return false;
            }
            $('#pass1-pass').show();
            $scope.info_check = 1;
            return true;
        };
        $scope.check_pass_same = function(){
            if($scope.user_pwd.new_password != $scope.repeate_password && $scope.user_pwd.new_password != undefined)
            {
                $notice.show('两次输入密码需一致');
                $('#pass2-pass').hide();
                $scope.info_check = 0;
                return false;
            }
            $('#pass2-pass').show();
            $scope.info_check = 1;
            return true;
        };


        $scope.update_info = function(){
            if( $scope.user_info.email != undefined &&
                $scope.user_info.major != undefined &&
                $scope.user_info.university != undefined)
            {
                $csrf.set_csrf($scope.user_info);
                $http.post(urls.api+"/account/userinfo/set", $.param($scope.user_info))
                    .success(function(data){
                    if(data.error.code == 1){
                        $notice.show("修改信息成功");
                        setTimeout(window.location.href="/mobile/home",500);
                    }
                    else{
                        $notice.show($errMsg.format_error("",data.error).message);
                    }
                });
            }
            else
                $notice.show("请填写合法的信息");
        };
        $scope.update_password = function(){
            if($scope.info_check == 1)
            {
                $csrf.set_csrf($scope.user_pwd);
                $http.post(urls.api+"/account/password/set", $.param($scope.user_pwd))
                    .success(function(data){
                    console.log(data.message);
                    if(data.error.code == 1){
                        $notice.show("修改密码成功");
                        setTimeout(window.location.href="/mobile/home",500);
                    }
                    else{

                        $notice.show($errMsg.format_error("",data.error).message);
                    }
                });
            }
        }  
    }])
    .controller('MB_LeftSidebarCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {

        console.log($user.username());

        $scope.is_login = ($user.username() != undefined && $user.username() != "");
        $scope.username = $user.username();
        $scope.logout = function(){
            console.log("logout");
            $http.get(urls.api+"/account/logout").
                success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        $user.logout();
                        window.location.href="/mobile/index";
                    }
                });
        };
    }])

    .controller('MB_UserInfoEditCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope, $location ) {
        console.log('MB_UserInfoEditCtrl');

        if($user.username == undefined)
            window.location.href='/mobile/login';
        $scope.info = {};
        $scope.user_info = {};
        $scope.info.username = $user.username();

        $scope.tsinghua_occu = ($rootScope.tsinghua_occu == '1');
        if ($scope.tsinghua_occu) 
        {
            $scope.user_info.student_id = $rootScope.student_id;
            $rootScope.loading = false;
            $scope.user_info.university = "清华大学";
            $rootScope.is_tsinghua = true;
            $scope.is_tsinghua_local = $rootScope.is_tsinghua;
        }
        else
        $http.get(urls.api+"/account/userinfo/get").
            success(function(data){
            if(data.error.code == 1){
                $rootScope.is_tsinghua = data.data.is_info;
                $scope.is_tsinghua_local = $rootScope.is_tsinghua;
                $scope.user_info.major = data.data.major;
                $scope.user_info.university = data.data.university;
                $scope.user_info.grade = data.data.grade;
                $scope.user_info.email = data.data.email;
                if ($scope.is_tsinghua_local)
                    $scope.user_info.university = "清华大学";
                //$rootScope.is_tsinghua = true;
                $rootScope.loading = false;
            }
        });


        $scope.check_username = {};

        $scope.check_username = function(){
            $scope.check_username.username = $scope.user_info.username;
            $csrf.set_csrf($scope.check_username);

            if($scope.check_username.username.length > 5)
                $http.post(urls.api+"/account/checkusername", $.param($scope.check_username)).
                success(function(data){
                    if(data.error.code == 1){
                        console.log(data);
                        if(data.username.exist != 'false')
                        {
                            $notice.show('用户名已存在');
                        //    $('#username-pass').hide();
                            $scope.info_check = 0;
                            ///return false;
                        }
                        //else
                            //$('#username-pass').show();
                    }
                });
            else
            {
                $notice.show('用户名长度最短6位');
                $scope.info_check = 0;
                ///return false;
            }
            $scope.info_check = 1;
            ///return true;
        };
        

        $scope.update_info = function(){
            if($rootScope.is_tsinghua)
            {
                if( $scope.user_info.major != undefined &&
                    $scope.user_info.university != undefined &&
                    $scope.user_info.grade != undefined && 
                    (($rootScope.is_tsinghua && $scope.user_info.email != undefined) || !$rootScope.is_tsinghua))
                {
                    $csrf.set_csrf($scope.user_info);
                    if($scope.tsinghua_occu)
                    {
                        if($scope.info_check == 1)
                            $http.post(urls.api+"/account/userinfo/set_username_by_tsinghua", $.param($scope.user_info))
                            .success(function(data){
                            if(data.error.code == 1){
                            {
                                if($rootScope.login_url != undefined)
                                    window.location.href = $rootScope.login_url;
                                else
                                    window.location.href = urls.mobile_index;
                            }
                            }
                            else{
                                $notice.show($errMsg.format_error("",data.error).message);
                            }
                        });
                        else
                            $notice.show("请填写合法的信息");
                    }
                    else
                    $http.post(urls.api+"/account/userinfo/set_by_tsinghua", $.param($scope.user_info))
                        .success(function(data){
                        if(data.error.code == 1){
                            {
                                if($rootScope.login_url != undefined)
                                    window.location.href = $rootScope.login_url;
                                else
                                    window.location.href = urls.mobile_index;
                            }
                        }
                        else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    });
                    
                }
                else
                    $notice.show("请填写合法的信息");
            }
            else
            {
                if( $scope.user_info.major != undefined &&
                    $scope.user_info.university != undefined &&
                    $scope.user_info.grade != undefined)
                {
                    $csrf.set_csrf($scope.user_info);
                    $http.post(urls.api+"/account/userinfo/set", $.param($scope.user_info))
                        .success(function(data){
                        if(data.error.code == 1)
                        {
                            if($rootScope.login_url != undefined)
                                window.location.href = $rootScope.login_url;
                            else
                                window.location.href = urls.mobile_index;
                        }
                        else{
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    });
                }
                else
                    $notice.show("请填写合法的信息");
            }
        };
    }])
    .controller('MB_PostListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope', '$location',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope,$location ) {
        console.log('MB_PostListCtrl');
        $user.check_login();
        $scope.positions = {};
        $scope.position_type = {
            "technology":"技术",
            'product':"产品",
            'design':"设计",
            'operate':"运营",
            'marketing':"市场",
            'functions':"职能",
            'others':"其他"
            }; 
        $scope.position_condition = {
            "open":"职位在招",
            'closed':"职位关闭"
            }; 
        $scope.cfield = {
                'social':'社交',
                'e-commerce':'电子商务',
                'education':'教育',
                'health_medical':'健康医疗',
                'culture_creativity':'文化创意',
                'living_consumption':'生活消费',
                'hardware':'硬件',
                'O2O':'O2O',
                'others':'其它'
        };
        $scope.is_processed = {
            true:'HR已处理',
            false:'HR未处理'
        };
        $scope.go_detail = function(id){
            $location.path('/mobile/position/detail').search({'position_id':id});
        };
        $scope.get_positions = function(){
            $http.get(urls.api+"/account/userinfo/position/submit/list").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.data;
                        for(var i = 0; i < $scope.positions.length; i ++){
                            $scope.positions[i].field_value = $scope.cfield[$scope.positions[i].company.field];
                            $scope.positions[i].is_processed = $scope.is_processed[$scope.positions[i].processed];
                            $scope.positions[i].position_cond = $scope.position_condition[$scope.positions[i].status];
                            $scope.positions[i].position_type_value = $scope.position_type[$scope.positions[i].position_type];
                            if($scope.positions[i].company.scale == 0){
                                $scope.positions[i].company.scale_value = "初创";
                            }
                            else if($scope.positions[i].company.scale == 1){
                                $scope.positions[i].company.scale_value = "快速发展";
                            }
                            else{
                                $scope.positions[i].company.scale_value = "成熟";
                            }
                            $scope.positions[i].submit_value = "投递简历";
                        }
                    }
                    else{
                        console.log(data.error.message);
                    }
                    $rootScope.loading = false;
            });
        };
        $scope.get_positions();
    }])
    .controller('MB_NotLoginCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_NotLoginCtrl');

        setTimeout(function(){window.location.href='/mobile/login';},2000);
        
    }])
    .controller('MB_HomeCenterCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        $rootScope.loading = false;
    }])
    .controller('MB_ResizeImgCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        $rootScope.loading = false;
        var resizeableImage = function(image_target) {
          // Some variable and settings
          var $container,
              orig_src = new Image(),
              image_target = $(image_target).get(0),
              event_state = {},
              constrain = false,
              min_width = 60, // Change as required
              min_height = 60,
              max_width = 800, // Change as required
              max_height = 900,
              resize_canvas = document.createElement('canvas');

          var init = function(){

            // When resizing, we will always use this copy of the original as the base
            orig_src.src=image_target.src;

            // Wrap the image with the container and add resize handles
            $(image_target).wrap('<div class="resize-container"></div>')
            .before('<span class="resize-handle resize-handle-nw"></span>')
            .before('<span class="resize-handle resize-handle-ne"></span>')
            .after('<span class="resize-handle resize-handle-se"></span>')
            .after('<span class="resize-handle resize-handle-sw"></span>');

            // Assign the container to a variable
            $container =  $(image_target).parent('.resize-container');

            // Add events
            $container.on('mousedown touchstart', '.resize-handle', startResize);
            $container.on('mousedown touchstart', 'img', startMoving);
            $('.js-crop').on('click', crop);
          };

          var startResize = function(e){
            e.preventDefault();
            e.stopPropagation();
            saveEventState(e);
            $(document).on('mousemove touchmove', resizing);
            $(document).on('mouseup touchend', endResize);
          };

          var endResize = function(e){
            e.preventDefault();
            $(document).off('mouseup touchend', endResize);
            $(document).off('mousemove touchmove', resizing);
          };

          var saveEventState = function(e){
            // Save the initial event details and container state
            event_state.container_width = $container.width();
            event_state.container_height = $container.height();
            event_state.container_left = $container.offset().left; 
            event_state.container_top = $container.offset().top;
            event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
            event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
            
            // This is a fix for mobile safari
            // For some reason it does not allow a direct copy of the touches property
            if(typeof e.originalEvent.touches !== 'undefined'){
                event_state.touches = [];
                $.each(e.originalEvent.touches, function(i, ob){
                  event_state.touches[i] = {};
                  event_state.touches[i].clientX = 0+ob.clientX;
                  event_state.touches[i].clientY = 0+ob.clientY;
                });
            }
            event_state.evnt = e;
          };

          var resizing = function(e){
            var mouse={},width,height,left,top,offset=$container.offset();
            mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft(); 
            mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
            
            // Position image differently depending on the corner dragged and constraints
            if( $(event_state.evnt.target).hasClass('resize-handle-se') ){
              width = mouse.x - event_state.container_left;
              height = mouse.y  - event_state.container_top;
              left = event_state.container_left;
              top = event_state.container_top;
            } else if($(event_state.evnt.target).hasClass('resize-handle-sw') ){
              width = event_state.container_width - (mouse.x - event_state.container_left);
              height = mouse.y  - event_state.container_top;
              left = mouse.x;
              top = event_state.container_top;
            } else if($(event_state.evnt.target).hasClass('resize-handle-nw') ){
              width = event_state.container_width - (mouse.x - event_state.container_left);
              height = event_state.container_height - (mouse.y - event_state.container_top);
              left = mouse.x;
              top = mouse.y;
              if(constrain || e.shiftKey){
                top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
              }
            } else if($(event_state.evnt.target).hasClass('resize-handle-ne') ){
              width = mouse.x - event_state.container_left;
              height = event_state.container_height - (mouse.y - event_state.container_top);
              left = event_state.container_left;
              top = mouse.y;
              if(constrain || e.shiftKey){
                top = mouse.y - ((width / orig_src.width * orig_src.height) - height);
              }
            }
            
            // Optionally maintain aspect ratio
            if(constrain || e.shiftKey){
              height = width / orig_src.width * orig_src.height;
            }

            if(width > min_width && height > min_height && width < max_width && height < max_height){
              // To improve performance you might limit how often resizeImage() is called
              resizeImage(width, height);  
              // Without this Firefox will not re-calculate the the image dimensions until drag end
              $container.offset({'left': left, 'top': top});
            }
          };

          var resizeImage = function(width, height){
            resize_canvas.width = width;
            resize_canvas.height = height;
            resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);   
            $(image_target).attr('src', resize_canvas.toDataURL("image/png"));  
          };

          var startMoving = function(e){
            e.preventDefault();
            e.stopPropagation();
            saveEventState(e);
            $(document).on('mousemove touchmove', moving);
            $(document).on('mouseup touchend', endMoving);
          };

          var endMoving = function(e){
            e.preventDefault();
            $(document).off('mouseup touchend', endMoving);
            $(document).off('mousemove touchmove', moving);
          };

          var moving = function(e){
            var  mouse={}, touches;
            e.preventDefault();
            e.stopPropagation();
            
            touches = e.originalEvent.touches;
            
            mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft(); 
            mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
            $container.offset({
              'left': mouse.x - ( event_state.mouse_x - event_state.container_left ),
              'top': mouse.y - ( event_state.mouse_y - event_state.container_top ) 
            });
            // Watch for pinch zoom gesture while moving
            if(event_state.touches && event_state.touches.length > 1 && touches.length > 1){
              var width = event_state.container_width, height = event_state.container_height;
              var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
              a = a * a; 
              var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
              b = b * b; 
              var dist1 = Math.sqrt( a + b );
              
              a = e.originalEvent.touches[0].clientX - touches[1].clientX;
              a = a * a; 
              b = e.originalEvent.touches[0].clientY - touches[1].clientY;
              b = b * b; 
              var dist2 = Math.sqrt( a + b );

              var ratio = dist2 /dist1;

              width = width * ratio;
              height = height * ratio;
              // To improve performance you might limit how often resizeImage() is called
              resizeImage(width, height);
            }
          };

          var crop = function(){
            //Find the part of the image that is inside the crop box
            var crop_canvas,
                left = $('.overlay').offset().left - $container.offset().left,
                top =  $('.overlay').offset().top - $container.offset().top,
                width = $('.overlay').width(),
                height = $('.overlay').height();
                
            crop_canvas = document.createElement('canvas');
            crop_canvas.width = width;
            crop_canvas.height = height;
            
            crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
            window.open(crop_canvas.toDataURL("image/png"));
            var data=crop_canvas.toDataURL();
            // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
            data=data.split(',')[1];
            data=window.atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            // canvas.toDataURL 返回的默认格式就是 image/png
            var blob=new Blob([ia], {type:"image/png"});
          }

          init();
        };

        // Kick everything off with the target image
        resizeableImage($('.resize-image'));
    }]);