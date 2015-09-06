'use strict';

/* Controllers */

angular.module('chuangplus_mobile.controllers', []).
    controller('MB_LoginCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('MB_LoginCtrl');
    }])
    .controller('MB_CompanyListCtrl', ['$scope', '$http', 'urls',
     function($scope, $http, urls) {
       $scope.name = "Arii";
        console.log('MB_CompanyListCtrl'+urls.api);
        $scope.company_list = {};
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
        $scope.get_company_list = function(){
            $http.get(urls.api+"/account/company/list").
                success(function(data){
                if(data.error.code == 1){
                    $scope.company_list = data.data;

                    for(var i=0;i<$scope.company_list.length;i++){
                        $scope.company_list[i].stage_value = $scope.stage[$scope.company_list[i].scale];
                        $scope.company_list[i].field_value = $scope.pfield[$scope.company_list[i].field];
                        $scope.company_list[i].type_value = $scope.ptype[$scope.company_list[i].type];
                        $scope.company_list[i].position_number = $scope.company_list[i].positions.length;
                    }

                }
                else{
                     $scope.error = $errMsg.format_error('',data.error);
                }
            });
        };
        $scope.get_company_list();
    }])
    .controller('MB_PositionListCtrl', ['$scope', '$http', 'urls',
     function($scope, $http, urls) {
        console.log('MB_PositionListCtrl');

        $scope.positions = {};
        $scope.get_positions = function(){
            $http.get(urls.api+"/position/search").
                success(function(data){
                    if(data.error.code == 1){
                        $scope.positions = data.positions;
                        for(i=0; i<$scope.positions.length;i++){
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
                });
        };
        $scope.get_positions();

    }])
    .controller('MB_CompanyDetailCtrl', ['$scope', '$http', 'urls', '$routeParams',
     function($scope, $http, urls, $routeParams) {
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

        $scope.get_company = function(){
            $http.get(urls.api+"/account/company/" + $scope.company_id + "/detail").
              success(function(data){
                if(data.error.code == 1){
                    $scope.company = data.data;
                    $scope.company.position_number = $scope.company.positions.length;
                        $scope.company.field_value = $scope.cfield[$scope.company.field];
                        $scope.company.scale_value = $scope.latest_scale[$scope.company.scale];

                    $http.get(urls.api+"/account/financing/" + $scope.company_id + "/list").
                        success(function(fdata){
                            if(data.error.code == 1){
                                $scope.company.financing_data = fdata.data;
                                $scope.company.financing_number = fdata.data.length;
                            
                            for(var i=0; i<$scope.company.financing_number; i++){
                                $scope.company.financing_data[i].organization = $scope.company.financing_data[i].organization;
                                $scope.company.financing_data[i].stage_value = $scope.stage[$scope.company.financing_data[i].stage];

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
                                $scope.error = $errMsg.format_error('',data.error);
                            }
                        }); 

                }
                else{
                    $scope.error = $errMsg.format_error("",data.error);
                }
                });
        };
        $scope.get_company();
    }])
    .controller('MB_InfoCtrl', ['$scope', '$http', 'CsrfService', 'urls', '$filter', '$routeParams', 'UserService', function($scope, $http, $csrf, urls, $filter, $routeParams, $user){
        console.log('MB_InfoCtrl');
    }]);