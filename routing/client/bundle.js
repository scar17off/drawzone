/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/bundle.js":
/*!******************************!*\
  !*** ./client-src/bundle.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat.js */ \"./client-src/chat.js\");\n/* harmony import */ var _network_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network.js */ \"./client-src/network.js\");\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./camera.js */ \"./client-src/camera.js\");\n/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./renderer.js */ \"./client-src/renderer.js\");\n/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mouse.js */ \"./client-src/mouse.js\");\n\r\n\r\n\r\n\r\n\r\n\r\nwindow.DrawZone = {\r\n    chunks: {},\r\n    chat: _chat_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\r\n    net: {\r\n        io: _network_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\r\n    },\r\n    camera: _camera_js__WEBPACK_IMPORTED_MODULE_2__.camera,\r\n    renderer: _renderer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\r\n    world: {\r\n        name: location.pathname.substring(1) || \"main\"\r\n    },\r\n    mouse: _mouse_js__WEBPACK_IMPORTED_MODULE_4__.mouse\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawZone);\n\n//# sourceURL=webpack://drawzone/./client-src/bundle.js?");

/***/ }),

/***/ "./client-src/camera.js":
/*!******************************!*\
  !*** ./client-src/camera.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   camera: () => (/* binding */ camera),\n/* harmony export */   canvas: () => (/* binding */ canvas),\n/* harmony export */   isVisible: () => (/* binding */ isVisible)\n/* harmony export */ });\nvar camera = {\r\n    x: 0,\r\n    y: 0,\r\n    zoom: 16,\r\n    minZoom: 2,\r\n    maxZoom: 24,\r\n    zoomStrength: 1\r\n};\r\n\r\nconst canvas = document.getElementById(\"game\");\r\n\r\nlet mouseDown = false;\r\n\r\nfunction isVisible(x, y, w, h) {\r\n\tif(document.visibilityState === \"hidden\") return;\r\n\tvar cx = camera.x;\r\n\tvar cy = camera.y;\r\n\tvar czoom = camera.zoom;\r\n\tvar cw = window.innerWidth;\r\n\tvar ch = window.innerHeight;\r\n\treturn x + w > cx && y + h > cy && x <= cx + cw / czoom && y <= cy + ch / czoom;\r\n};\r\n\r\nfunction zoomIn() {\r\n    let nzoom = camera.zoom * (1 + camera.zoomStrength);\r\n\r\n    if (nzoom > camera.maxZoom) {\r\n        camera.zoom = camera.maxZoom;\r\n    } else {\r\n        camera.zoom = Math.round(nzoom);\r\n    }\r\n}\r\n\r\nfunction zoomOut() {\r\n    let nzoom = camera.zoom / (1 + camera.zoomStrength);\r\n\r\n    if (nzoom > camera.maxZoom) {\r\n        camera.zoom = camera.maxZoom;\r\n    } else {\r\n        camera.zoom = Math.round(nzoom);\r\n    }\r\n}\r\n\r\nfunction handleMouseDown() {\r\n    mouseDown = true;\r\n}\r\n\r\nfunction handleMouseUp() {\r\n    mouseDown = false;\r\n}\r\n\r\nfunction handleMouseMove(event) {\r\n    if (mouseDown) {\r\n        camera.x -= event.movementX;\r\n        camera.y -= event.movementY;\r\n    }\r\n}\r\n\r\nfunction handleKeyDown(event) {\r\n    switch (event.key) {\r\n        case 'ArrowUp':\r\n            camera.y -= 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowDown':\r\n            camera.y += 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowLeft':\r\n            camera.x -= 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowRight':\r\n            camera.x += 1 * camera.zoom;\r\n            break;\r\n    }\r\n}\r\n\r\nfunction handleWheel(event) {\r\n    if (!event.ctrlKey) {\r\n        event.preventDefault();\r\n        if (event.deltaY < 0) zoomIn();\r\n        else zoomOut();\r\n    };\r\n};\r\n\r\ncanvas.addEventListener('wheel', handleWheel);\r\ncanvas.addEventListener('mousedown', handleMouseDown);\r\ncanvas.addEventListener('mouseup', handleMouseUp);\r\ncanvas.addEventListener('mousemove', handleMouseMove);\r\n\r\nwindow.addEventListener('keydown', handleKeyDown);\n\n//# sourceURL=webpack://drawzone/./client-src/camera.js?");

/***/ }),

/***/ "./client-src/chat.js":
/*!****************************!*\
  !*** ./client-src/chat.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    send: function(message) {\r\n        socket.emit(\"send\", message);\r\n    }\r\n});\n\n//# sourceURL=webpack://drawzone/./client-src/chat.js?");

/***/ }),

/***/ "./client-src/mouse.js":
/*!*****************************!*\
  !*** ./client-src/mouse.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mouse: () => (/* binding */ mouse)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./client-src/camera.js\");\n/* harmony import */ var _network__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network */ \"./client-src/network.js\");\n\r\n\r\n\r\nconst canvas = document.querySelector(\"canvas\");\r\n\r\nconst mouse = {\r\n    x: 0, /* clientX */\r\n\ty: 0, /* clientY */\r\n\tget worldX() { return _camera__WEBPACK_IMPORTED_MODULE_0__.camera.x * 16 + this.x / (_camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom / 16); },\r\n\tget worldY() { return _camera__WEBPACK_IMPORTED_MODULE_0__.camera.y * 16 + this.y / (_camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom / 16); },\r\n\tget tileX() { return Math.floor(this.worldX / 16); },\r\n\tget tileY() { return Math.floor(this.worldY / 16); }\r\n};\r\n\r\nfunction getGameCoordinates(clientX, clientY) {\r\n    mouse.x = clientX;\r\n    mouse.y = clientY;\r\n\r\n    const mouseX = mouse.x - canvas.getBoundingClientRect().left + _camera__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const mouseY = mouse.y - canvas.getBoundingClientRect().top + _camera__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    const gameX = Math.floor(mouseX / _camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n    const gameY = Math.floor(mouseY / _camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n\r\n    return { x: Math.floor(gameX), y: Math.floor(gameY) };\r\n};\r\n\r\ncanvas.addEventListener('mousemove', event => {\r\n    const pos = getGameCoordinates(event.clientX, event.clientY);\r\n\r\n    document.getElementById(\"xy-display\").innerText = `XY: ${pos.x},${pos.y}`;\r\n\r\n    (0,_network__WEBPACK_IMPORTED_MODULE_1__.unloadInvisibleChunks)();\r\n    (0,_network__WEBPACK_IMPORTED_MODULE_1__.loadVisibleChunks)();\r\n});\n\n//# sourceURL=webpack://drawzone/./client-src/mouse.js?");

/***/ }),

/***/ "./client-src/network.js":
/*!*******************************!*\
  !*** ./client-src/network.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   loadVisibleChunks: () => (/* binding */ loadVisibleChunks),\n/* harmony export */   unloadInvisibleChunks: () => (/* binding */ unloadInvisibleChunks)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./client-src/camera.js\");\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer */ \"./client-src/renderer.js\");\n\r\n\r\n\r\nconst socket = io();\r\n\r\nsocket.on(\"connect\", () => {\r\n    console.log(\"Connected!\");\r\n\r\n    socket.on(\"message\", message => {\r\n        console.log(message);\r\n    });\r\n    \r\n    socket.on(\"chunkLoaded\", (x, y, chunkData) => {\r\n        window.DrawZone.chunks[[x, y].join(\",\")] = chunkData;\r\n    });\r\n});\r\n\r\nfunction loadVisibleChunks() {\r\n    const chunkSizeInPixels = _renderer__WEBPACK_IMPORTED_MODULE_1__.CHUNK_SIZE * _camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n    const leftChunkIndex = Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.camera.x / chunkSizeInPixels);\r\n    const rightChunkIndex = Math.ceil((_camera__WEBPACK_IMPORTED_MODULE_0__.camera.x + _camera__WEBPACK_IMPORTED_MODULE_0__.canvas.width) / chunkSizeInPixels);\r\n    const topChunkIndex = Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.camera.y / chunkSizeInPixels);\r\n    const bottomChunkIndex = Math.ceil((_camera__WEBPACK_IMPORTED_MODULE_0__.camera.y + _camera__WEBPACK_IMPORTED_MODULE_0__.canvas.height) / chunkSizeInPixels);\r\n\r\n    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {\r\n        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {\r\n            const chunkKey = `${x},${y}`;\r\n            if (!_renderer__WEBPACK_IMPORTED_MODULE_1__.chunks.hasOwnProperty(chunkKey)) {\r\n                socket.emit(\"loadChunk\", x, y);\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\nfunction unloadInvisibleChunks() {\r\n    const chunkSizeInPixels = _renderer__WEBPACK_IMPORTED_MODULE_1__.CHUNK_SIZE * _camera__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n    const leftChunkIndex = Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.camera.x / chunkSizeInPixels);\r\n    const rightChunkIndex = Math.ceil((_camera__WEBPACK_IMPORTED_MODULE_0__.camera.x + _camera__WEBPACK_IMPORTED_MODULE_0__.canvas.width) / chunkSizeInPixels);\r\n    const topChunkIndex = Math.floor(_camera__WEBPACK_IMPORTED_MODULE_0__.camera.y / chunkSizeInPixels);\r\n    const bottomChunkIndex = Math.ceil((_camera__WEBPACK_IMPORTED_MODULE_0__.camera.y + _camera__WEBPACK_IMPORTED_MODULE_0__.canvas.height) / chunkSizeInPixels);\r\n\r\n    // Create a set of visible chunk keys\r\n    const visibleChunks = new Set();\r\n    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {\r\n        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {\r\n            visibleChunks.add(`${x},${y}`);\r\n        }\r\n    }\r\n\r\n    // Iterate over the keys in the chunks object\r\n    Object.keys(_renderer__WEBPACK_IMPORTED_MODULE_1__.chunks).forEach(chunkKey => {\r\n        if (!visibleChunks.has(chunkKey)) {\r\n            // If the chunk is not in the set of visible chunks, delete it\r\n            delete _renderer__WEBPACK_IMPORTED_MODULE_1__.chunks[chunkKey];\r\n        }\r\n    });\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);\n\n//# sourceURL=webpack://drawzone/./client-src/network.js?");

/***/ }),

/***/ "./client-src/renderer.js":
/*!********************************!*\
  !*** ./client-src/renderer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CHUNK_SIZE: () => (/* binding */ CHUNK_SIZE),\n/* harmony export */   chunks: () => (/* binding */ chunks),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   drawGrid: () => (/* binding */ drawGrid),\n/* harmony export */   renderAllChunks: () => (/* binding */ renderAllChunks),\n/* harmony export */   renderChunk: () => (/* binding */ renderChunk),\n/* harmony export */   renderText: () => (/* binding */ renderText)\n/* harmony export */ });\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera.js */ \"./client-src/camera.js\");\n\r\n\r\nconst canvas = document.querySelector(\"canvas\");\r\nconst ctx = canvas.getContext(\"2d\");\r\n\r\ncanvas.width = window.innerWidth;\r\ncanvas.height = window.innerHeight;\r\n\r\nwindow.addEventListener(\"resize\", () => {\r\n    canvas.width = window.innerWidth;\r\n    canvas.height = window.innerHeight;\r\n});\r\n\r\nconst chunks = {};\r\nconst CHUNK_SIZE = 16;\r\n\r\nfunction drawGrid() {\r\n    const gridColor = 'rgba(0, 0, 0, 0.2)';\r\n    ctx.strokeStyle = gridColor;\r\n    ctx.lineWidth = 1;\r\n\r\n    // chunk grid\r\n    for (let x = 0; x < canvas.width; x += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE), 0);\r\n        ctx.lineTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE), canvas.height);\r\n        ctx.stroke();\r\n    }\r\n\r\n    for (let y = 0; y < canvas.height; y += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(0, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE));\r\n        ctx.lineTo(canvas.width, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE));\r\n        ctx.stroke();\r\n    }\r\n\r\n    // pixel grid\r\n    ctx.strokeStyle = gridColor;\r\n    ctx.lineWidth = 1;\r\n\r\n    for (let x = 0; x < canvas.width; x += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, 0);\r\n        ctx.lineTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, canvas.height);\r\n        ctx.stroke();\r\n    }\r\n\r\n    for (let y = 0; y < canvas.height; y += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(0, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n        ctx.lineTo(canvas.width, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n        ctx.stroke();\r\n    }\r\n}\r\n\r\nfunction renderText(text, x, y) {\r\n    ctx.font = _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom / 2 + \"px Arial\";\r\n    ctx.fillStyle = \"black\";\r\n    ctx.fillText(text, x, y);\r\n};\r\n\r\nfunction renderChunk(chunkData, chunkX, chunkY) {\r\n    const startX = chunkX * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const startY = chunkY * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    for (let x = 0; x < CHUNK_SIZE; x++) {\r\n        for (let y = 0; y < CHUNK_SIZE; y++) {\r\n            const pixel = chunkData[x][y];\r\n            const pixelX = startX + x * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n            const pixelY = startY + y * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n\r\n            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;\r\n            ctx.fillRect(pixelX, pixelY, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n        }\r\n    }\r\n}\r\n\r\nfunction renderAllChunks() {\r\n    for (const key in chunks) {\r\n        if (chunks.hasOwnProperty(key)) {\r\n            const [chunkX, chunkY] = key.split(',').map(Number);\r\n            const chunkData = chunks[key];\r\n            renderChunk(chunkData, chunkX, chunkY);\r\n        };\r\n    };\r\n};\r\n\r\nfunction onRender() {\r\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\r\n\r\n    drawGrid();\r\n\r\n    renderAllChunks();\r\n\r\n    requestAnimationFrame(onRender);\r\n};\r\nonRender();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    chunks,\r\n    CHUNK_SIZE,\r\n    renderText,\r\n    renderChunk,\r\n    renderAllChunks\r\n});\n\n//# sourceURL=webpack://drawzone/./client-src/renderer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client-src/bundle.js");
/******/ 	
/******/ })()
;