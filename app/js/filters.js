/**
 * Created by ian on 10.02.15.
 */

angular.module('janeFilters', [])
    .filter('camera', function () {
        return function (input) {

            var camera_code_start = input.lastIndexOf('_') + 1;
            var camera_code_end = input.lastIndexOf('.mp4') + 2;
            var camera_code = input.substr(camera_code_start, input.length-camera_code_end);

            switch(camera_code){
                case 'cn':
                case 'ce':
                    return 'close';
                case 'co':
                case 'ca':
                    return 'face'
                case '2s':
                    return 'wide';
                case '2o':
                    return 'wide right'
                case '2a':
                    return 'wide left'
                default:
                    return 'not sure';
            }

            return camera_code;
        };

    });