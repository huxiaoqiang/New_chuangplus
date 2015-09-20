'use strict';

/* Controllers */

angular.module('chuangplus_mobile.controllers', [])
    .controller('MB_CompanyListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_CompanyListCtrl');
        $scope.company_list = {};
        $scope.filter_show = false;
        $scope.pagenow = 2;
        $scope.filter_params = '';
        $scope.filed_notice = '行业/领域';
        $scope.scale_notice = '公司规模';
        $scope.stage = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.pfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
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
            "scale": ''
            //,"csrfmiddlewaretoken" : $csrf.val()
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
                        $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].position_type_value = {};

                        for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                    }
                    $rootScope.loading = false;
                }
            });
        };
        $scope.get_company_list();
        $scope.show_filter = function()
        {
            $("#filter-content").slideDown("normal");
            $scope.filter_show = true;
        };
        $scope.hide_filter = function()
        {
            $("#filter-content").slideUp("fast");
            $scope.filter_show = false;
        };
        $scope.submit_filter = function()
        {
            $scope.filed_notice = '行业/领域';
            $scope.scale_notice = '公司规模';
            $scope.filter_params = '';
            //?field=others&scale=0&name=科技

            for (var ele in $scope.filter.field) {
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == '')
                    {
                        $scope.filed_notice = $scope.pfield[ele];
                        $scope.filter_params = '?field=' + ele;
                    }
                    else
                        $scope.filter_params += ','+ele;
                }
            }
            if($scope.filter.scale != '')
            {
                $scope.scale_notice = $scope.stage[$scope.filter.scale];
                if($scope.filter_params != '')
                    $scope.filter_params += '&scale=' + $scope.filter.scale;
                else
                    $scope.filter_params += '?scale=' + $scope.filter.scale;
            }

            var submitparam = '';
            if($scope.search_name == '' || $scope.search_name == undefined)
                submitparam = $scope.filter_params;
            else if($scope.filter_params == '')
                submitparam = $scope.filter_params + "?text=" + $scope.search_name;
            else
                submitparam = $scope.filter_params + "&text=" + $scope.search_name;

            $http.get(urls.api+"/account/company/list" + submitparam).
            success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;
                    console.log(data);
                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                        $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                        $scope.company_list[i].position_type_value = {};

                        for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                            $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                    
                    }
                    $scope.hide_filter();
                }
            });
        };
        $scope.submit_search = function()
        {
            if ($scope.search_name != '' && $scope.search_name != undefined) 
            {
                //$scope.search_name.replace(' ','+');

                var submitparam = '';
                if($scope.search_name == '' || $scope.search_name == undefined)
                    submitparam = $scope.filter_params;
                else if($scope.filter_params == '')
                    submitparam = $scope.filter_params + "?text=" + $scope.search_name;
                else
                    submitparam = $scope.filter_params + "&text=" + $scope.search_name;
            
                $http.get(urls.api+"/account/company/list" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_list = data.data;
                        for(var i=0;i<$scope.company_list.length;i++){
                            $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                            $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                            $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                            $scope.company_list[i].position_type_value = {};

                            for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                                $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        
                        }
                    }
                });
            }
            else
            {
                $http.get(urls.api+"/account/company/list" + $scope.filter_params).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.company_list = data.data;
                        for(var i=0;i<$scope.company_list.length;i++){
                            $scope.company_list[i].scale_value = $scope.stage[$scope.company_list[i].scale];
                            $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                            $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                            $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                            $scope.company_list[i].position_type_value = {};

                            for(var j=0;j<$scope.company_list[i].position_type.length;j++)
                                $scope.company_list[i].position_type_value[j] = $scope.position_type[$scope.company_list[i].position_type[j]];
                        
                        }
                    }
                });
            }
        };

        $scope.load_more_item = function()
        {
            if($scope.pagenow < 0)
                return;
            var submitparam = '';
            if($scope.filter_params == '')
                if($scope.search_name != '' && $scope.search_name != undefined)
                    submitparam = "?text=" + $scope.search_name;
            else
                if($scope.search_name != '' && $scope.search_name != undefined)
                    submitparam = $scope.filter_params + "&text=" + $scope.search_name;
            if(submitparam != '')
                submitparam += '&page=' + $scope.pagenow;
            else
                submitparam += '?page=' + $scope.pagenow;

            $http.get(urls.api+"/account/company/list" + $scope.filter_params).
                success(function(data){
                    if(data.error.code == 1){
                        var newdata = data.data;
                        if (data.page == data.page_number) 
                            $scope.pagenow = -23333;
                        for(var i=0;i<newdata.length;i++){
                            newdata[i].scale_value = $scope.stage[newdata[i].scale];
                            newdata[i].field_value = $scope.pfield[newdata[i].field];
                            newdata[i].type_value = $scope.ptype[newdata[i].type];
                            newdata[i].position_number = newdata[i].positions.length;
                            newdata[i].position_type_value = {};

                            for(var j=0;j<newdata[i].position_type.length;j++)
                                newdata[i].position_type_value[j] = $scope.position_type[newdata[i].position_type[j]];
                        
                        }
                        $scope.company_list.concat(newdata);
                        $scope.pagenow ++;
                    }
                });
        };
    }])
    .controller('MB_PositionListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_PositionListCtrl');
        $scope.positions = {};
        $scope.filter_show = false;
        $scope.pagenow = 2;
        $scope.workdays_notice = '工作时间';
        $scope.salary_notice = '月薪下限';
        $scope.filed_notice = '行业/领域';
        $scope.type_notice = '职位类型';
        
        $scope.filter_params = '';
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
            "salary": ''
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.testLoading = function()
        {
            $rootScope.loading = !$rootScope.loading;
        }
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
                    }
                    else{
                        console.log(data.error.message);
                    }
                    $rootScope.loading = false;
                });
        };
        $scope.get_positions();
        $scope.show_filter = function()
        {
            $("#filter-content").slideDown("normal");
            $scope.filter_show = true;
        };
        $scope.hide_filter = function()
        {
            $("#filter-content").slideUp("fast");
            $scope.filter_show = false;
        };
        $scope.submit_filter = function()
        {

            var isSelected = false;
            $scope.filter_params = '';
            $scope.workdays_notice = '工作时间';
            $scope.salary_notice = '月薪下限';
            $scope.filed_notice = '行业/领域';
            $scope.type_notice = '职位类型';

            //?field=others&scale=0&name=科技
            for (var ele in $scope.filter.field) 
                if($scope.filter.field[ele] == true)
                {
                    if($scope.filter_params == '')
                    {
                        $scope.filed_notice = $scope.cfield[ele];
                        $scope.filter_params = '?fields=' + ele;
                    }
                    else
                        $scope.filter_params += ','+ele;
                }

            if($scope.filter.workdays != 0)
            {
                if($scope.filter_params == '')
                    $scope.filter_params += '?workdays=' + $scope.filter.workdays;
                else
                    $scope.filter_params += '&workdays=' + $scope.filter.workdays;
                $scope.workdays_notice = '每周' + $scope.filter.workdays + '天';
            }
            else
                $scope.workdays_notice = '弹性时间';

            isSelected = false;
            for (var ele in $scope.filter.type) {
                if($scope.filter.type[ele] == true)
                {
                    if($scope.filter_params == '')
                    {
                        $scope.filter_params = '?type=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else if (!isSelected) 
                    {
                        $scope.filter_params = '&type=' + ele;
                        $scope.type_notice = $scope.position_type[ele];
                    }
                    else
                        $scope.filter_params += ','+ele;
                    isSelected = true;
                }
            }

            
            if($scope.filter.salary != '' && $scope.filter.salary != undefined)
            {
                if($scope.filter_params != '')
                    $scope.filter_params += '&salary=' + $scope.filter.salary;
                else
                    $scope.filter_params += '?salary=' + $scope.filter.salary;
                $scope.salary_notice = $scope.filter.salary + 'K';
            }


            var submitparam = '';
            if($scope.search_name == '' || $scope.search_name == undefined)
                submitparam = $scope.filter_params;
            else if($scope.filter_params == '')
                submitparam = "?name=" + $scope.search_name;
            else
                submitparam = $scope.filter_params + "&name=" + $scope.search_name;

            $http.get(urls.api+"/position/search" + submitparam).
            success(function(data){
                if(data.error.code == 1){
                    $scope.positions = data.positions;
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
                    $scope.hide_filter();
                }
            });
        };
        $scope.submit_search = function()
        {

            if ($scope.search_name != '' && $scope.search_name != undefined) 
            {
                //$scope.search_name.replace(' ','+');
                var submitparam = '';
                if($scope.filter_params == '')
                    submitparam = "?name=" + $scope.search_name;
                else
                    submitparam = $scope.filter_params + "&name=" + $scope.search_name;
            

                $http.get(urls.api+"/position/search" + submitparam).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
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
                    }
                });
            }
            else
            {
                $http.get(urls.api+"/position/search" + $scope.filter_params).
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
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
                    }
                });
            }

        };
        $scope.load_more_item = function()
        {
            if($scope.pagenow < 0)
                return;
            var submitparam = '';
            if($scope.filter_params == '')
                if($scope.search_name != '' && $scope.search_name != undefined)
                    submitparam = "?name=" + $scope.search_name;
            else
                if($scope.search_name != '' && $scope.search_name != undefined)
                    submitparam = $scope.filter_params + "&name=" + $scope.search_name;
            if(submitparam != '')
                submitparam += '&page=' + $scope.pagenow;
            else
                submitparam += '?page=' + $scope.pagenow;

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
                    }
            });

        };
    }])
    .controller('MB_PositionFilterCtrl', ['$scope', '$http', 'urls', '$routeParams',
         function($scope, $http, urls, $routeParams) {
    
    }])
    .controller('MB_CompanyPositionCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
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
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
        };
        $scope.company_id = $routeParams.company_id;
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
    .controller('MB_CompanyDetailCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
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
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
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

    .controller('MB_PositionDetailCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        $scope.position_id = $routeParams.position_id;
        $scope.is_login = $user.is_login();
        console.log($scope.position_id);
        $scope.latest_scale = {
            "0":"初创",
            "1":"快速发展",
            "2":"成熟"
        };
        $scope.cfield = {
                'social':'社交',
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
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

        //取得该职位信息
        $http.get(urls.api+"/position/"+ $scope.position_id +"/get_with_company").
            success(function(data){
            if(data.error.code == 1){
                $scope.position = data.data;
                $scope.position.scale_value = $scope.latest_scale[$scope.position.company.scale];
                $scope.position.field_value = $scope.cfield[$scope.position.company.field];
                $scope.position.position_type_value = $scope.position_type[$scope.position.position_type];
                $scope.position.position_number = $scope.position.company.positions.length;
                console.log($scope.position.position_number);

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

                    if($scope.userinfo.real_name != undefined && $scope.userinfo.real_name != null && $scope.userinfo.real_name != '')
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
                $rootScope.loading = false;
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
                            $scope.submit_value = "已投递";
                            $notice.show("已投递");
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
    .controller('MB_LoginCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log("MB_LoginCtrl");
        $scope.captcha_url = urls.api+"/captcha/image/";
        $scope.login_info = {};
        $scope.capcha_info = {};

        $scope.refresh_captcha = function(){
            $scope.captcha_url = urls.api+'/captcha/image/?'+Math.random();
        };
        $scope.is_captcha_ok = 0;

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
                    }
                    else
                    {
                        $('#captcha-pass').show();
                        $scope.is_captcha_ok = 1;
                    }

                });
            
        }

        $scope.user_info = {};
        $http.get(urls.api+"/account/userinfo/get").
            success(function(data){
            if(data.error.code == 1){
                $scope.user_info = data.data;
            }
        });

        $scope.login_user = function(){
            if($scope.is_captcha_ok == 1)
            {
                $csrf.set_csrf($scope.login_info);
                console.log($scope.login_info);
                $http.post(urls.api+"/account/login", $.param($scope.login_info)).
                    success(function(data){
                        console.log(data);
                        if(data.error.code == 1){
                            console.log("登陆成功");
                            $scope.user_info = {};
                            $http.get(urls.api+"/account/userinfo/get").
                                success(function(udata){
                                if(udata.error.code == 1){
                                    if( udata.data.major != undefined &&
                                        udata.data.university != undefined)
                                        window.location.href=urls.mobile_index;
                                    else
                                    {
                                        console.log('需要填写信息');
                                        window.location.href='/mobile/info';
                                    }
                                }
                                else
                                    $notice.show($errMsg.format_error("",udata.error).message);
                            });
                        }
                        else
                        {
                            $notice.show($errMsg.format_error("",data.error).message);
                        }
                    });
            }
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
                            window.location.href='/mobile/info';
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
    .controller('MB_PositionFavorCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
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
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
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
                        if($scope.userinfo.real_name != undefined && $scope.userinfo.real_name != null && $scope.userinfo.real_name != '')
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
                            $notice.show("已全部投递");
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
    .controller('MB_CompanyFavorCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
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
                'e_commerce':'电子商务',
                'education':'健康医疗',
                'health_medical':'文化创意',
                'culture_creativity':'硬件',
                'living_consumption':'O2O',
                'hardware':'生活消费',
                'O2O':'教育',
                'others':'其它'
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
                    $scope.error = $errMsg.format_error('',data.error);
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
                    $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $rootScope.loading = false;
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

        $scope.is_login = ($user.username() != undefined && $user.username() != '');
        $scope.username = $user.username();
        $scope.logout = function(){
            console.log("logout");
            $http.get(urls.api+"/account/logout").
                success(function(data){
                    console.log(data);
                    if(data.error.code == 1){
                        $user.logout();
                        window.location.href=urls.mobile_index;
                    }
                });
        };
    }])

    .controller('MB_UserInfoEditCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_UserInfoEditCtrl');
        if($user.username == undefined)
            window.location.href='/mobile/notlogin';
        $scope.info = {};
        $scope.user_info = {};
        $scope.info.username = $user.username();

        $http.get(urls.api+"/account/userinfo/get").
            success(function(data){
            if(data.error.code == 1){
                $scope.user_info = data.data;
            }
        });

        $scope.update_info = function(){
            if( $scope.user_info.major != undefined &&
                $scope.user_info.university != undefined)
            {
                $csrf.set_csrf($scope.user_info);
                $http.post(urls.api+"/account/userinfo/set", $.param($scope.user_info))
                    .success(function(data){
                    if(data.error.code == 1){
                        window.location.href=urls.mobile_index;
                    }
                    else{
                        $notice.show($errMsg.format_error("",data.error).message);
                    }
                });
            }
            else
                $notice.show("请填写合法的信息");
        };
        $rootScope.loading = false;
    }])
    .controller('MB_PostListCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
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
            'e_commerce':'电子商务',
            'education':'健康医疗',
            'health_medical':'文化创意',
            'culture_creativity':'硬件',
            'living_consumption':'O2O',
            'hardware':'生活消费',
            'O2O':'教育',
            'others':'其它'
        };
        $scope.is_processed = {
            true:'HR已处理',
            false:'HR未处理'
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
        $rootScope.loading = false;
    }])
    .controller('MB_NotLoginCtrl', ['$scope', '$http', 'urls', 'CsrfService', '$routeParams', 'NoticeService', 'UserService','ErrorService', '$rootScope',
    function($scope, $http, urls, $csrf, $routeParams, $notice, $user, $errMsg, $rootScope ) {
        console.log('MB_NotLoginCtrl');

        setTimeout(function(){window.location.href='/mobile/login';},2000);
        
    }])
    .controller('MB_InfoCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('MB_InfoCtrl');
    }]);