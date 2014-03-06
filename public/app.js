'use strict';

angular.module('app', [
        'btford.socket-io',
        'ngTouch'
    ])

    .directive('emotion', ['$timeout', function ($timeout) {
        return {
            template: '' +
                '<div ng-touch="submit-name" ng-click="submit(emotion)" style="background-color: {{ emotion.color }}">' +
                '<span class="name">{{ emotion.name }}</span>' +
                '<span class="count">{{ emotion.count }}</span>' +
                '</div>',
            scope: true,
            link: function (scope, elm) {
                scope.$watch('emotion', function (a, b) {
                    if (a.count == b.count) return;
                    elm.removeClass('glow');
                    elm.addClass('glow');
                    $timeout(function () {
                        elm.removeClass('glow');
                    }, 500);
                }, true);
            }
        };
    }])

    .controller('AppController', ['$scope', 'socket', function ($scope, socket) {
        socket.forward('emotions', $scope);
        socket.forward('emotion', $scope);
        $scope.emotions = [];

        $scope.$on('socket:emotions', function (ev, items) {
            $scope.emotions = items;
        });

        $scope.$on('socket:emotion', function (ev, item) {
            _.forEach($scope.emotions, function(emotion){
                if (emotion.name == item.name) {
                    emotion = item;
                }
            });
        });

        $scope.submit = function (item) {
            _.forEach($scope.emotions, function(emotion){
                if (emotion.name == item.name) {
                    emotion.count++;
                    socket.emit('submit', emotion.name);
                }
            });
        };
    }])

;