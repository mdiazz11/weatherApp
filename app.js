//Module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//ROUTES
weatherApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.htm',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        })
});


//SERVICES
weatherApp.service('cityService', function () {
    this.city = "New York, NY";

});

//FACTORIES
//NOTE: This will not work. You need to go to openweathermap.org to get an API key!!!!!
weatherApp.factory('weather', ['$resource', function ($resource) {
    var weatherData;
    return {
        getWeather: function (callback) {
            if (weatherData) {
                callback(weatherData)
            } else {
                //Enter you key here it says [YOUR KEY HERE]
                weatherData = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=[YOUR KEY HERE]", {
                    callback: "JSON_CALLBACK"
                }, {
                    get: {
                        method: "JSONP"
                    }
                });
                callback(weatherData);
            }
        }
    }
}])



//Controller
weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function ($scope, $location, cityService) {
    $scope.city = cityService.city;

    $scope.$watch('city', function () {
        cityService.city = $scope.city;
    });

    $scope.submit = function () {
        $location.path("/forecast");
    }

}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', 'weather', function ($scope, $resource, $routeParams, cityService, weather) {
    //Get the city from the user.
    $scope.city = cityService.city;

    //Defaulted to 3
    $scope.days = $routeParams.days || '3';

    weather.getWeather(function (weather) {
        $scope.weatherAPI = weather;
    })

    $scope.weatherResult = $scope.weatherAPI.get({
        q: $scope.city,
        cnt: $scope.days
    });

    $scope.convertToFahrenheit = function (degK) {
        return Math.round((1.8 * (degK - 273)) + 32);
    }

    $scope.convertToDate = function (dt) {
        return new Date(dt * 1000);
    }

    $scope.group = {
        Snow: "wi-snow",
        Rain: "wi-rain",
        Drizzle: "wi-day-rain-mix",
        Thunderstorm: "wi-thunderstorm",
        Clear: "wi-day-sunny",
        Clouds: "wi-day-cloudy"
    };

    $scope.getIcon = function (index) {
        return $scope.group[index];

    };
}]);


//Directives
weatherApp.directive("weatherReport", function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: "=",
            convertToStandard: "&",
            convertToDate: "&",
            dateformat: "@",
            getIcon: "&"

        }

    }

});
