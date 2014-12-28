'use strict';

angular.module('timelineApp')
  .controller('MainCtrl', function ($scope, $http) {

    var userinfo = {
      name : 'matsunaga'
    };

    $scope.companies = [{
      name	 : "Sony Corporation",
      link	 : "http://www.sony.co.jp",
      period : { start : '2008/04/01', end : '2014/11/01' },
      description : "2008年ソニーに入社、入社後はコンテンツ解析を行なう部署に所属になり、音楽の解析技術の開発を行なう。その後、スポーツの上達をサポートする技術の開発、プロトタイプの開発から事業部の立ち上げ、ソニーとしては初のスポーツセンサ、スマートテニスセンサの商品化を実現。"
    }];

    $scope.positions = [{
      title : "Software Engineer, Researcher",
      unit : "Sect1 Intelligence Application Development Division, Technology Development Group, R&D",
      period : {start : '2008/04/01', end : '2011/04/01'},
      description : "音楽の解析技術の開発及び、それを使った新しい音楽アプリケーションの開発",
      episodes : [],
      upvotes : 0
    },
    {
      title : "Lead Software Engineer, Researcher",
      unit : "Sect1 Intelligence Application Development Division, Technology Development Group, R&D",
      period : {start : '2011/04/01', end : '2014/11/01'},
      description : "振動解析技術とモーション解析技術を使ったスポーツアシスト技術の開発",
      episodes : [],
      upvotes : 0
    }];

    $scope.projects = [{
      title : 'Development of music visualization prototype',
      period : {start : '2008/04/01', end : '2008/10/01'},
      description : "音楽の可視化アプリケーションの開発",
      episodes : [],
      upvotes : 0
    },
    {
      title : 'Concept Development of Vibration Analysis',
      period : {start : '2011/04/01', end : '2012/3/31'},
      description : "振動を解析することによボールの当たった位置を推定する技術を開発　社内展示会にて上位入賞",
      episodes : [],
      upvotes : 0
    },
    {
      title : 'Development of Smart Tennis Sensor',
      period : {start : '2012/04/01', end : '2014/11/01'},
      description : "スマートテニスセンサの商品化　アルゴリズム開発リーダとして、スマートテニスに搭載されている機能開発",
      episodes : [],
      upvotes : 0
    }];

    var work_hist = {
      companies	 : $scope.companies,
      positions : $scope.positions,
      projects : $scope.projects
    };

    $scope.userinfo = userinfo;
    $scope.work_hist = work_hist;

    // timeline 生成
		var timeline_model = tl.models.timeline()
			.data(work_hist);

		d3.select('#user-timeline')
			.call(timeline_model);

    /*
    $scope.awesomeThings = [];
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
    */
  });
