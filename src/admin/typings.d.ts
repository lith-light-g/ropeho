/**
 * @file Type definitions used in the admin application
 * @author François Nguyen <https://github.com/lith-light-g>
 */
/// <reference types="node" />
/// <reference types="socket.io" />
/// <reference path="../../definitions/http-proxy/index.d.ts" />
/// <reference path="../../definitions/react-router-config/index.d.ts" />
/// <reference path="../../definitions/spark-md5/index.d.ts" />
/// <reference path="../ropeho.d.ts" />

interface Window {
    __REDUX_STATE__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    File: typeof File;
    Image: typeof Image;
}
