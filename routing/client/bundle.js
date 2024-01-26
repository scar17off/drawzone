/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/bundle.js":
/*!******************************!*\
  !*** ./client-src/bundle.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _network_chat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./network/chat.js */ \"./client-src/network/chat.js\");\n/* harmony import */ var _network_network_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network/network.js */ \"./client-src/network/network.js\");\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./camera.js */ \"./client-src/camera.js\");\n/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./renderer.js */ \"./client-src/renderer.js\");\n/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mouse.js */ \"./client-src/mouse.js\");\n/* harmony import */ var _sharedState_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sharedState.js */ \"./client-src/sharedState.js\");\n/* harmony import */ var _local_player_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./local_player.js */ \"./client-src/local_player.js\");\n/* harmony import */ var _tools_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tools.js */ \"./client-src/tools.js\");\n/* harmony import */ var _tools_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_tools_js__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _network_players_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./network/players.js */ \"./client-src/network/players.js\");\n/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./events.js */ \"./client-src/events.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nwindow.DrawZone = {\r\n    chunks: {},\r\n    chat: _network_chat_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\r\n    network: {\r\n        io: _network_network_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\r\n    },\r\n    camera: _camera_js__WEBPACK_IMPORTED_MODULE_2__.camera,\r\n    renderer: _renderer_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\r\n    world: {\r\n        name: location.pathname.substring(1) || \"main\",\r\n        chunks: _sharedState_js__WEBPACK_IMPORTED_MODULE_5__.chunks,\r\n        lines: _sharedState_js__WEBPACK_IMPORTED_MODULE_5__.lines,\r\n        texts: _sharedState_js__WEBPACK_IMPORTED_MODULE_5__.texts\r\n    },\r\n    mouse: _mouse_js__WEBPACK_IMPORTED_MODULE_4__.mouse,\r\n    player: _local_player_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\r\n    cursors: _tools_js__WEBPACK_IMPORTED_MODULE_7__.cursors,\r\n    events: _events_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"],\r\n    players: _network_players_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawZone);\n\n//# sourceURL=webpack://drawzone/./client-src/bundle.js?");

/***/ }),

/***/ "./client-src/camera.js":
/*!******************************!*\
  !*** ./client-src/camera.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   camera: () => (/* binding */ camera),\n/* harmony export */   canvas: () => (/* binding */ canvas),\n/* harmony export */   isVisible: () => (/* binding */ isVisible)\n/* harmony export */ });\nvar camera = {\r\n    x: 0,\r\n    y: 0,\r\n    zoom: 16,\r\n    minZoom: 8,\r\n    maxZoom: 16,\r\n    zoomStrength: 1\r\n};\r\n\r\nconst canvas = document.getElementById(\"game\");\r\n\r\nlet mouseDown = false;\r\n\r\nfunction isVisible(x, y, w, h) {\r\n\tif(document.visibilityState === \"hidden\") return;\r\n\tvar cx = camera.x;\r\n\tvar cy = camera.y;\r\n\tvar czoom = camera.zoom;\r\n\tvar cw = window.innerWidth;\r\n\tvar ch = window.innerHeight;\r\n\treturn x + w > cx && y + h > cy && x <= cx + cw / czoom && y <= cy + ch / czoom;\r\n};\r\n\r\nfunction zoomIn() {\r\n    let nzoom = camera.zoom * (1 + camera.zoomStrength);\r\n\r\n    if (nzoom > camera.maxZoom) {\r\n        camera.zoom = camera.maxZoom;\r\n    } else if (nzoom < camera.minZoom) {\r\n        camera.zoom = camera.minZoom;\r\n    } else {\r\n        camera.zoom = Math.round(nzoom);\r\n    }\r\n}\r\n\r\nfunction zoomOut() {\r\n    let nzoom = camera.zoom / (1 + camera.zoomStrength);\r\n\r\n    if (nzoom > camera.maxZoom) {\r\n        camera.zoom = camera.maxZoom;\r\n    } else if (nzoom < camera.minZoom) {\r\n        camera.zoom = camera.minZoom;\r\n    } else {\r\n        camera.zoom = Math.round(nzoom);\r\n    }\r\n}\r\n\r\nfunction handleMouseDown(event) {\r\n    if (event.button === 1) {\r\n        mouseDown = true;\r\n    }\r\n}\r\n\r\nfunction handleMouseUp() {\r\n    mouseDown = false;\r\n}\r\n\r\nfunction handleMouseMove(event) {\r\n    if (mouseDown) {\r\n        camera.x -= event.movementX;\r\n        camera.y -= event.movementY;\r\n    }\r\n}\r\n\r\nfunction handleKeyDown(event) {\r\n    switch (event.key) {\r\n        case 'ArrowUp':\r\n            camera.y -= 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowDown':\r\n            camera.y += 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowLeft':\r\n            camera.x -= 1 * camera.zoom;\r\n            break;\r\n        case 'ArrowRight':\r\n            camera.x += 1 * camera.zoom;\r\n            break;\r\n    }\r\n}\r\n\r\nfunction handleWheel(event) {\r\n    if (!event.ctrlKey) {\r\n        event.preventDefault();\r\n        if (event.deltaY < 0) zoomIn();\r\n        else zoomOut();\r\n    };\r\n};\r\n\r\ncanvas.addEventListener('wheel', handleWheel);\r\ncanvas.addEventListener('mousedown', handleMouseDown);\r\ncanvas.addEventListener('mouseup', handleMouseUp);\r\ncanvas.addEventListener('mousemove', handleMouseMove);\r\n\r\nwindow.addEventListener('keydown', handleKeyDown);\n\n//# sourceURL=webpack://drawzone/./client-src/camera.js?");

/***/ }),

/***/ "./client-src/events.js":
/*!******************************!*\
  !*** ./client-src/events.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new EventEmitter());\n\n//# sourceURL=webpack://drawzone/./client-src/events.js?");

/***/ }),

/***/ "./client-src/local_player.js":
/*!************************************!*\
  !*** ./client-src/local_player.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events.js */ \"./client-src/events.js\");\n/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse.js */ \"./client-src/mouse.js\");\n\r\n\r\n\r\nclass Bucket {\r\n    constructor(rate, time, infinite) {\r\n        this.lastCheck = Date.now();\r\n        this.allowance = rate;\r\n\t\tthis.rate = rate;\r\n        this.time = time;\r\n\t\tthis.infinite = infinite || false;\r\n\t}\r\n\tupdate() {\r\n\t\tthis.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);\r\n\t\tthis.lastCheck = Date.now();\r\n\r\n\t\tif (this.allowance > this.rate) {\r\n\t\t\tthis.allowance = this.rate;\r\n\t\t}\r\n\t}\r\n\tcanSpend(count) {\r\n\t\tif (this.infinite) {\r\n\t\t\treturn true;\r\n\t\t}\r\n\r\n\t\tthis.update();\r\n\r\n\t\tif (this.allowance < count) {\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tthis.allowance -= count;\r\n\r\n\t\treturn true;\r\n\t}\r\n\tgetTimeToRestore() {\r\n\t\tif (this.allowance >= this.rate) return 0;\r\n        return (this.rate - this.allowance) / (this.rate / this.time);\r\n\t}\r\n\tasync waitUntilRestore() {\r\n        const restoreTime = this.getTimeToRestore() * 1000;\r\n        await new Promise(resolve => setTimeout(resolve, restoreTime));\r\n\t}\r\n}\r\n\r\nconst local_player = {\r\n    selectedColor: [0, 0, 0],\r\n    palette: [[0, 0, 0]],\r\n    nickname: localStorage.nickname || null,\r\n    rank: 0,\r\n    pixelQuota: new Bucket(100, 2),\r\n    tool: 0,\r\n\tid: null,\r\n\t_text: '',\r\n\tget text() {\r\n\t\treturn this._text;\r\n\t},\r\n\tset text(value) {\r\n\t\tthis._text = value;\r\n\t\tdocument.getElementById(\"text-input\").innerText = this._text;\r\n\t}\r\n}\r\n\r\nwindow.addEventListener('keypress', event => {\r\n    if (event.key.length === 1) local_player.text += event.key;\r\n})\r\n\r\nwindow.addEventListener('keydown', event => {\r\n    if (event.key === 'Enter' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {\r\n\t\t_events_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].emit(\"addText\", local_player.text, _mouse_js__WEBPACK_IMPORTED_MODULE_1__.mouse.tileX, _mouse_js__WEBPACK_IMPORTED_MODULE_1__.mouse.tileY);\r\n        local_player.text = '';\r\n\t} else if (event.key === 'Backspace') {\r\n\t\tlocal_player.text = local_player.text.slice(0, -1);\r\n\t}\r\n})\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (local_player);\n\n//# sourceURL=webpack://drawzone/./client-src/local_player.js?");

/***/ }),

/***/ "./client-src/mouse.js":
/*!*****************************!*\
  !*** ./client-src/mouse.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getGameCoordinates: () => (/* binding */ getGameCoordinates),\n/* harmony export */   mouse: () => (/* binding */ mouse)\n/* harmony export */ });\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera.js */ \"./client-src/camera.js\");\n/* harmony import */ var _network_network_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./network/network.js */ \"./client-src/network/network.js\");\n\r\n\r\n\r\nconst canvas = document.querySelector(\"canvas\");\r\n\r\nconst mouse = {\r\n    x: 0, /* clientX */\r\n    y: 0, /* clientY */\r\n    mouseX: 0,\r\n    mouseY: 0,\r\n    get tileX() { return this.mouseX / _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom },\r\n    get tileY() { return this.mouseY / _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom },\r\n    prevLineX: null,\r\n    prevLineY: null,\r\n    lineX: null,\r\n    lineY: null,\r\n    buttons: 0\r\n}\r\n\r\ncanvas.addEventListener('click', event => {\r\n    mouse.buttons = event.buttons;\r\n})\r\n\r\nfunction getGameCoordinates(clientX, clientY) {\r\n    const rect = canvas.getBoundingClientRect();\r\n    const offsetX = clientX - rect.left + _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const offsetY = clientY - rect.top + _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    mouse.mouseX = offsetX, mouse.mouseY = offsetY;\r\n\r\n    const gameX = offsetX / _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n    const gameY = offsetY / _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n\r\n    return { x: gameX, y: gameY };\r\n}\r\n\r\ncanvas.addEventListener('mousemove', event => {\r\n    mouse.x = event.clientX, mouse.y = event.clientY;\r\n\r\n    const pos = getGameCoordinates(event.clientX, event.clientY);\r\n\r\n    document.getElementById(\"xy-display\").innerText = `XY: ${Math.floor(pos.x)},${Math.floor(pos.y)}`;\r\n\r\n    (0,_network_network_js__WEBPACK_IMPORTED_MODULE_1__.unloadInvisibleChunks)();\r\n    (0,_network_network_js__WEBPACK_IMPORTED_MODULE_1__.loadVisibleChunks)();\r\n})\n\n//# sourceURL=webpack://drawzone/./client-src/mouse.js?");

/***/ }),

/***/ "./client-src/network/chat.js":
/*!************************************!*\
  !*** ./client-src/network/chat.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _network_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./network.js */ \"./client-src/network/network.js\");\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    send: function(message) {\r\n        _network_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].emit(\"send\", message);\r\n    },\r\n    local: function(message) {\r\n        console.log(message);\r\n    }\r\n});\n\n//# sourceURL=webpack://drawzone/./client-src/network/chat.js?");

/***/ }),

/***/ "./client-src/network/network.js":
/*!***************************************!*\
  !*** ./client-src/network/network.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   loadVisibleChunks: () => (/* binding */ loadVisibleChunks),\n/* harmony export */   unloadInvisibleChunks: () => (/* binding */ unloadInvisibleChunks)\n/* harmony export */ });\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../camera.js */ \"./client-src/camera.js\");\n/* harmony import */ var _renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../renderer.js */ \"./client-src/renderer.js\");\n/* harmony import */ var _sharedState_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sharedState.js */ \"./client-src/sharedState.js\");\n/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../mouse.js */ \"./client-src/mouse.js\");\n/* harmony import */ var _local_player_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../local_player.js */ \"./client-src/local_player.js\");\n/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../events.js */ \"./client-src/events.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nvar loadQueue = [];\r\n\r\nconst socket = io();\r\n\r\nsocket.on(\"connect\", () => {\r\n    console.log(\"Connected!\");\r\n\r\n    socket.on(\"message\", message => {\r\n        console.log(message);\r\n    })\r\n    \r\n    socket.on(\"chunkLoaded\", (chunkDatas) => {\r\n        for(let key in chunkDatas) {\r\n            const [x, y] = key.split(',').map(Number);\r\n            addChunk(chunkDatas[key], x, y);\r\n        }\r\n    })\r\n\r\n    socket.on(\"newLine\", (from, to) => {\r\n        _sharedState_js__WEBPACK_IMPORTED_MODULE_2__.lines.push([from, to]);\r\n    })\r\n\r\n    socket.on(\"newText\", (text, x, y) => {\r\n        _sharedState_js__WEBPACK_IMPORTED_MODULE_2__.texts[`${x},${y}`] = text;\r\n    })\r\n})\r\n\r\n_events_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"].on(\"addText\", (text, x, y) => {\r\n    socket.emit(\"setText\", text, x, y);\r\n})\r\n\r\n_events_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"].on(\"addLine\", (from, to) => {\r\n    socket.emit(\"setLine\", from, to);\r\n})\r\n\r\n_camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.addEventListener('mousemove', () => {\r\n    const pos = { x: _mouse_js__WEBPACK_IMPORTED_MODULE_3__.mouse.tileX, y: _mouse_js__WEBPACK_IMPORTED_MODULE_3__.mouse.tileY };\r\n\r\n    socket.emit(\"move\", pos.x, pos.y);\r\n})\r\n\r\n_camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.addEventListener('mousemove', event => {\r\n    if(event.buttons === 1 && !event.ctrlKey) {\r\n        if(!_local_player_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"].pixelQuota.canSpend(1)) return;\r\n\r\n        const pos = { x: _mouse_js__WEBPACK_IMPORTED_MODULE_3__.mouse.tileX, y: _mouse_js__WEBPACK_IMPORTED_MODULE_3__.mouse.tileY };\r\n\r\n        const chunkX = Math.floor(pos.x / 16);\r\n        const chunkY = Math.floor(pos.y / 16);\r\n        const pixelX = Math.floor(pos.x % 16);\r\n        const pixelY = Math.floor(pos.y % 16);\r\n        \r\n        socket.emit(\"setPixel\", pos.x, pos.y, _local_player_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"].selectedColor);\r\n\r\n        if(_sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks[`${chunkX},${chunkY}`]) {\r\n            _sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks[`${chunkX},${chunkY}`][pixelX][pixelY] = _local_player_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"].selectedColor; // bruh\r\n        }\r\n    }\r\n})\r\n\r\nsetInterval(() => {\r\n    if(loadQueue.length > 0) {\r\n        socket.emit(\"loadChunk\", loadQueue);\r\n        loadQueue = [];\r\n    };\r\n}, 1000);\r\n\r\nfunction addChunk(chunkData, chunkX, chunkY) {\r\n    const key = `${chunkX},${chunkY}`;\r\n    _sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks[key] = chunkData;\r\n}\r\n\r\nfunction loadVisibleChunks() {\r\n    const chunkSizeInPixels = _renderer_js__WEBPACK_IMPORTED_MODULE_1__.CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n    const leftChunkIndex = Math.floor(_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x / chunkSizeInPixels);\r\n    const rightChunkIndex = Math.ceil((_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x + _camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width) / chunkSizeInPixels);\r\n    const topChunkIndex = Math.floor(_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y / chunkSizeInPixels);\r\n    const bottomChunkIndex = Math.ceil((_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y + _camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height) / chunkSizeInPixels);\r\n\r\n    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {\r\n        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {\r\n            const chunkKey = `${x},${y}`;\r\n            if (!_sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks.hasOwnProperty(chunkKey)) {\r\n                loadQueue.push([x, y]);\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\nfunction unloadInvisibleChunks() {\r\n    const chunkSizeInPixels = _renderer_js__WEBPACK_IMPORTED_MODULE_1__.CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n    const leftChunkIndex = Math.floor(_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x / chunkSizeInPixels);\r\n    const rightChunkIndex = Math.ceil((_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x + _camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.width) / chunkSizeInPixels);\r\n    const topChunkIndex = Math.floor(_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y / chunkSizeInPixels);\r\n    const bottomChunkIndex = Math.ceil((_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y + _camera_js__WEBPACK_IMPORTED_MODULE_0__.canvas.height) / chunkSizeInPixels);\r\n\r\n    const visibleChunks = new Set();\r\n    for (let y = topChunkIndex; y < bottomChunkIndex; y++) {\r\n        for (let x = leftChunkIndex; x < rightChunkIndex; x++) {\r\n            visibleChunks.add(`${x},${y}`);\r\n        }\r\n    }\r\n\r\n    Object.keys(_sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks).forEach(chunkKey => {\r\n        if (!visibleChunks.has(chunkKey)) {\r\n            delete _sharedState_js__WEBPACK_IMPORTED_MODULE_2__.chunks[chunkKey];\r\n        }\r\n    })\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);\n\n//# sourceURL=webpack://drawzone/./client-src/network/network.js?");

/***/ }),

/***/ "./client-src/network/players.js":
/*!***************************************!*\
  !*** ./client-src/network/players.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _network_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./network.js */ \"./client-src/network/network.js\");\n\r\n\r\nconst players = {};\r\n\r\nconst structure = {\r\n    x: 0,\r\n    y: 0,\r\n    color: [0, 0, 0],\r\n    tool: 0\r\n}\r\n\r\n_network_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].on(\"playerJoin\", (id) => {\r\n    players[id] = structure;\r\n})\r\n\r\n_network_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].on(\"playerLeft\", (id) => {\r\n    delete players[id];\r\n})\r\n\r\n_network_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].on(\"playerUpdate\", (id, tool, color) => {\r\n    if(!players[id]) players[id] = structure;\r\n    players[id].tool = tool, players[id].color = color;\r\n})\r\n\r\n_network_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].on(\"playerMoved\", (id, x, y) => {\r\n    if(!players[id]) players[id] = structure;\r\n    players[id].x = x, players[id].y = y;\r\n})\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (players);\n\n//# sourceURL=webpack://drawzone/./client-src/network/players.js?");

/***/ }),

/***/ "./client-src/renderer.js":
/*!********************************!*\
  !*** ./client-src/renderer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CHUNK_SIZE: () => (/* binding */ CHUNK_SIZE),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   drawGrid: () => (/* binding */ drawGrid),\n/* harmony export */   renderAllChunks: () => (/* binding */ renderAllChunks),\n/* harmony export */   renderAllTexts: () => (/* binding */ renderAllTexts),\n/* harmony export */   renderChunk: () => (/* binding */ renderChunk),\n/* harmony export */   renderChunkOutline: () => (/* binding */ renderChunkOutline),\n/* harmony export */   renderLine: () => (/* binding */ renderLine),\n/* harmony export */   renderText: () => (/* binding */ renderText)\n/* harmony export */ });\n/* harmony import */ var _camera_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera.js */ \"./client-src/camera.js\");\n/* harmony import */ var _sharedState_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sharedState.js */ \"./client-src/sharedState.js\");\n/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mouse.js */ \"./client-src/mouse.js\");\n/* harmony import */ var _local_player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./local_player.js */ \"./client-src/local_player.js\");\n/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./events.js */ \"./client-src/events.js\");\n\r\n\r\n\r\n\r\n\r\n\r\nconst canvas = document.querySelector(\"canvas\");\r\nconst ctx = canvas.getContext(\"2d\");\r\n\r\ncanvas.width = window.innerWidth;\r\ncanvas.height = window.innerHeight;\r\n\r\nwindow.addEventListener(\"resize\", () => {\r\n    canvas.width = window.innerWidth;\r\n    canvas.height = window.innerHeight;\r\n})\r\n\r\nconst CHUNK_SIZE = 16;\r\n\r\nfunction drawGrid() {\r\n    const gridColor = 'rgba(0, 0, 0, 0.2)';\r\n    ctx.strokeStyle = gridColor;\r\n    ctx.lineWidth = 1;\r\n\r\n    // chunk grid\r\n    for (let x = 0; x < canvas.width; x += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE), 0);\r\n        ctx.lineTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE), canvas.height);\r\n        ctx.stroke();\r\n    }\r\n\r\n    for (let y = 0; y < canvas.height; y += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(0, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE));\r\n        ctx.lineTo(canvas.width, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % (_camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom * CHUNK_SIZE));\r\n        ctx.stroke();\r\n    }\r\n\r\n    // pixel grid\r\n    ctx.strokeStyle = gridColor;\r\n    ctx.lineWidth = 1;\r\n\r\n    for (let x = 0; x < canvas.width; x += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, 0);\r\n        ctx.lineTo(x - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, canvas.height);\r\n        ctx.stroke();\r\n    }\r\n\r\n    for (let y = 0; y < canvas.height; y += _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom) {\r\n        ctx.beginPath();\r\n        ctx.moveTo(0, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n        ctx.lineTo(canvas.width, y - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y % _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n        ctx.stroke();\r\n    }\r\n}\r\n\r\nfunction renderLine(x1, y1, x2, y2) {\r\n    ctx.strokeStyle = '#000000';\r\n    ctx.beginPath();\r\n    ctx.moveTo(x1 * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x, y1 * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y);\r\n    ctx.lineTo(x2 * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x, y2 * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y);\r\n    ctx.stroke();\r\n}\r\n\r\nfunction renderChunkOutline(chunkX, chunkY) {\r\n    const startX = chunkX * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const startY = chunkY * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    ctx.strokeStyle = \"black\";\r\n    ctx.lineWidth = 1;\r\n    ctx.strokeRect(startX, startY, CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n}\r\n\r\nfunction renderText(text, x, y) {\r\n    const startX = x * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const startY = y * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    ctx.font = _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom + \"px Arial\";\r\n    ctx.fillStyle = \"black\";\r\n    ctx.fillText(text, startX, startY);\r\n}\r\n\r\nfunction renderChunk(chunkData, chunkX, chunkY) {\r\n    const startX = chunkX * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.x;\r\n    const startY = chunkY * CHUNK_SIZE * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom - _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.y;\r\n\r\n    for (let x = 0; x < CHUNK_SIZE; x++) {\r\n        for (let y = 0; y < CHUNK_SIZE; y++) {\r\n            const pixel = chunkData[x][y];\r\n            const pixelX = startX + x * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n            const pixelY = startY + y * _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom;\r\n\r\n            ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;\r\n            ctx.fillRect(pixelX, pixelY, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n\r\n            if (_mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.x > pixelX && _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.x < pixelX + _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom && _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.y > pixelY && _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.y < pixelY + _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom) {\r\n                ctx.strokeStyle = `rgb(${_local_player_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].selectedColor.join(\", \")}, 1.0)`;\r\n                ctx.lineWidth = 2;\r\n                ctx.strokeRect(pixelX, pixelY, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom, _camera_js__WEBPACK_IMPORTED_MODULE_0__.camera.zoom);\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\nfunction renderAllChunks() {\r\n    for (const key in _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.chunks) {\r\n        if (_sharedState_js__WEBPACK_IMPORTED_MODULE_1__.chunks.hasOwnProperty(key)) {\r\n            const [chunkX, chunkY] = key.split(',').map(Number);\r\n            const chunkData = _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.chunks[key];\r\n            renderChunk(chunkData, chunkX, chunkY);\r\n        }\r\n    }\r\n}\r\n\r\nfunction renderAllLines() {\r\n    for (let i = 0; i < _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.lines.length; i++) {\r\n        const [start, end] = _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.lines[i];\r\n        renderLine(start[0], start[1], end[0], end[1]);\r\n    }\r\n}\r\n\r\nfunction renderAllTexts() {\r\n    for (const key in _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.texts) {\r\n        if (_sharedState_js__WEBPACK_IMPORTED_MODULE_1__.texts.hasOwnProperty(key)) {\r\n            const [text, pos] = [_sharedState_js__WEBPACK_IMPORTED_MODULE_1__.texts[key], key];\r\n            const [x, y] = pos.split(',').map(Number);\r\n            renderText(text, x, y);\r\n        }\r\n    }\r\n}\r\n\r\n// line drawing\r\nlet intervalId;\r\ncanvas.addEventListener('mousedown', event => {\r\n    _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineX = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileX;\r\n    _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineY = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileY;\r\n\r\n    if (event.buttons === 1 && event.ctrlKey) {\r\n        if (_mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineX === null && _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineY === null) {\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineX = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileX;\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineY = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileY;\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineX = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileX;\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineY = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileY;\r\n        }\r\n\r\n        intervalId = setInterval(() => {\r\n            const prevPos = [_mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineX, _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineY];\r\n            const currPos = [_mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileX, _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.tileY];\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineX = currPos[0];\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineY = currPos[1];\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineX = currPos[0];\r\n            _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineY = currPos[1];\r\n\r\n            _events_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"].emit(\"addLine\", prevPos, currPos);\r\n\r\n            _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.lines.push([prevPos, currPos]);\r\n        }, 1000 / 10);\r\n    }\r\n})\r\n\r\ncanvas.addEventListener('mouseup', () => {\r\n    clearInterval(intervalId);\r\n    _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineX = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineX;\r\n    _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.prevLineY = _mouse_js__WEBPACK_IMPORTED_MODULE_2__.mouse.lineY;\r\n})\r\n\r\n_events_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"].on(\"addText\", (text, x, y) => {\r\n    _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.texts[`${x},${y}`] = text;\r\n})\r\n\r\nfunction onRender() {\r\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\r\n\r\n    renderAllChunks();\r\n    drawGrid();\r\n    renderAllLines();\r\n\r\n    renderAllTexts();\r\n\r\n    requestAnimationFrame(onRender);\r\n}\r\nonRender();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    chunks: _sharedState_js__WEBPACK_IMPORTED_MODULE_1__.chunks,\r\n    CHUNK_SIZE,\r\n    renderText,\r\n    renderChunk,\r\n    renderAllChunks\r\n});\n\n//# sourceURL=webpack://drawzone/./client-src/renderer.js?");

/***/ }),

/***/ "./client-src/sharedState.js":
/*!***********************************!*\
  !*** ./client-src/sharedState.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   chunks: () => (/* binding */ chunks),\n/* harmony export */   lines: () => (/* binding */ lines),\n/* harmony export */   texts: () => (/* binding */ texts)\n/* harmony export */ });\nconst chunks = {};\r\nconst lines = [];\r\nconst texts = {\"11,5\": \"Welcome to DrawZone!\"};\n\n//# sourceURL=webpack://drawzone/./client-src/sharedState.js?");

/***/ }),

/***/ "./client-src/tools.js":
/*!*****************************!*\
  !*** ./client-src/tools.js ***!
  \*****************************/
/***/ (() => {

eval("\n\n//# sourceURL=webpack://drawzone/./client-src/tools.js?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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