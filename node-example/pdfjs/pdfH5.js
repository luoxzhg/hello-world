"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PDFH5 = function () {
    function PDFH5(dom, options) {
        _classCallCheck(this, PDFH5);

        var self = this;
        this.dom = dom;
        this.container = $(dom);
        this.options = options;
        this.thePDF = null; //pdfjs
        this.totalNum = null; //总页数
        this.pages = null;
        this.initTime = 0;
        this.scale = 1;
        this.currentNum = 1;
        this.loadedCount = 0;
        this.endTime = 0;
        this.timer = null;
        this.cache = {};
        this.eventType = {};
        this.cacheNum = 1;
        this.resizeEvent = false;
        this.cacheData = null;
        this.pdfjsLibPromise = null;
        this.jsonTextData = null; //后台每页文字数据
        this.rectDataByPage = null; //计算过后的每页差异块的数据
        this.rectForPage = []; //当前页面的矩形坐标集合
        this.fabricCanvasForPage = new Map();
        this.rectForId = new Map();
        this.scaledViewport = $(window).width() <= 1440 ? 1.3 : 2;
        this.init(options);
    }
    //初始化


    _createClass(PDFH5, [{
        key: "init",
        value: function init(options) {
            var self = this;
            this.docWidth = this.container.width();
            if (this.container[0].pdfLoaded) {
                this.destroy();
            }
            if (options.cMapUrl) {
                PDFJS.cMapUrl = options.cMapUrl;
            } else {
                PDFJS.cMapUrl = 'http://data.shenht.com:9027/static/js/pdf-ie9/cmaps/';
            }
            PDFJS.cMapPacked = true;
            PDFJS.rangeChunkSize = 65536;
            this.container[0].pdfLoaded = false;
            this.container.addClass("pdfjs");
            this.initTime = new Date().getTime();
            setTimeout(function () {
                var arr1 = self.eventType["scroll"];
                if (arr1 && arr1 instanceof Array) {
                    for (var i = 0; i < arr1.length; i++) {
                        arr1[i] && arr1[i].call(self, self.initTime);
                    }
                }
            }, 0);
            this.options = this.options ? this.options : {};
            this.options.pdfurl = this.options.pdfurl ? this.options.pdfurl : null;
            this.options.data = this.options.data ? this.options.data : null;
            this.options.scale = this.options.scale ? this.options.scale : this.scale;
            this.options.zoomEnable = this.options.zoomEnable === false ? false : true;
            this.options.scrollEnable = this.options.scrollEnable === false ? false : true;
            this.options.loadingBar = this.options.loadingBar === false ? false : true;
            this.options.pageNum = this.options.pageNum === false ? false : true;
            this.options.backTop = this.options.backTop === true ? true : false;
            this.options.URIenable = this.options.URIenable === true ? true : false;
            this.options.fullscreen = this.options.fullscreen === false ? false : true;
            this.options.lazy = this.options.lazy === true ? true : false;
            this.options.renderType = this.options.renderType === "svg" ? "svg" : "canvas";
            this.options.resize = this.options.resize === false ? false : true;
            this.options.textLayer = this.options.textLayer === true ? true : false;
            this.options.goto = isNaN(this.options.goto) ? 0 : this.options.goto;
            this.options.isDifference = this.options.isDifference === true ? true : false; //是否显示比较差异
            this.options.diffArray = this.options.diffArray ? this.options.diffArray : []; //差异数据
            this.options.PDF_DEBUG = this.options.PDF_DEBUG === true ? true : false; //是否为测试模式
            if (this.options.limit) {
                var n = parseFloat(this.options.limit);
                this.options.limit = isNaN(n) ? 0 : n < 0 ? 0 : n;
            } else {
                this.options.limit = 0;
            }
            this.options.type = this.options.type === "fetch" ? "fetch" : "ajax";
            var html = '<div class="loadingBar">' + '<div class="progress">' + ' <div class="glimmer">' + '</div>' + ' </div>' + '</div>' + '<div class="pageNum">' + '<div class="pageNum-bg"></div>' + ' <div class="pageNum-num">' + ' <span class="pageNow">1</span>/' + '<span class="pageTotal">1</span>' + '</div>' + ' </div>' + '<div class="backTop">' + '</div>' + '<div class="loadEffect loading"></div>';
            if (!this.container.find('.pageNum')[0]) {
                this.container.append(html);
            }
            var viewer = document.createElement("div");
            viewer.className = 'pdfViewer';
            var viewerContainer = document.createElement("div");
            viewerContainer.className = 'viewerContainer';
            viewerContainer.appendChild(viewer);
            this.container.append(viewerContainer);
            this.viewer = $(viewer);
            this.viewerContainer = $(viewerContainer);
            this.pageNum = this.container.find('.pageNum');
            this.pageNow = this.pageNum.find('.pageNow');
            this.pageTotal = this.pageNum.find('.pageTotal');
            this.loadingBar = this.container.find('.loadingBar');
            this.progress = this.loadingBar.find('.progress');
            this.progressDom = this.progress[0];
            this.backTop = this.container.find('.backTop');
            this.loading = this.container.find('.loading');
            this.showPageNum = true;
            if (!this.options.loadingBar) {
                this.loadingBar.hide();
            }
            var containerH = this.container.height(),
                height = containerH * (1 / 5);

            //监听容器大小发生改变
            this.viewerContainer.resize(function () {
                // 处理操作
                // self.resize();
            });
            //监听容器大小发生改变
            /**
             * 监听滚动
             */
            this.viewerContainer.off('scroll').on('scroll', function () {
                // div 滚动了
                var scrollTop = self.viewerContainer.scrollTop();
                var pageNum = Number(self.pageNow.text());
                if (scrollTop >= 150) {
                    if (self.options.backTop) {
                        self.backTop.show();
                    }
                } else {
                    if (self.options.backTop) {
                        self.backTop.fadeOut(200);
                    }
                }
                if (self.viewerContainer) {
                    self.pages = self.viewerContainer.find('.pageContainer');
                }
                clearTimeout(self.timer);
                if (self.options.pageNum && self.pageNum && self.showPageNum) {
                    self.pageNum.show();
                }
                var h = containerH;
                if (self.pages) {
                    self.pages.each(function (index, obj) {
                        var top = obj.getBoundingClientRect().top;
                        var bottom = obj.getBoundingClientRect().bottom;
                        if (top <= height && bottom > height) {
                            if (self.options.pageNum) {
                                if (self.currentNum != index + 1) {
                                    self.pageNow.text(index + 1);
                                    self.currentNum = index + 1;
                                    self._setEvent("pageChange", self.currentNum);
                                }
                            }
                        }
                        if (top <= h && bottom > h) {
                            self.cacheNum = index + 1;
                        }
                    });
                }
                if (scrollTop + self.container.height() >= self.viewer[0].offsetHeight) {
                    self.pageNow.text(self.totalNum);
                    self.currentNum = self.totalNum;
                    self._setEvent("pageChange", self.currentNum);
                }
                if (scrollTop === 0) {
                    self.pageNow.text(1);
                    self.currentNum = 1;
                    self._setEvent("pageChange", self.currentNum);
                }
                self.timer = window.setTimeout(function () {
                    if (self.options.pageNum && self.pageNum) {
                        self.pageNum.fadeOut(200);
                    }
                }, 1500);
                var arr1 = self.eventType["scroll"];
                if (arr1 && arr1 instanceof Array) {
                    for (var i = 0; i < arr1.length; i++) {
                        arr1[i] && arr1[i].call(self, scrollTop, self.pageNow.text());
                    }
                }
            });
            //监听滚动结束
            var url = self.options.pdfurl;
            if (self.options.loadingBar) {
                self.loadingBar.show();
                self.progress.css({
                    width: "3%"
                });
            }

            //读取所有页面的文字数据
            if (this.options.isDifference && !this.jsonTextData && !this.rectDataByPage) {
                this.jsonTextData = [];
                this.rectDataByPage = [];
                this.initAjax().then(function () {
                    loadPdf();
                }, function () {
                    throw Error("读取ajax 数据出错!");
                });
                return;
            } else {
                loadPdf();
            }

            //加载pdf
            function loadPdf() {
                if (url) {
                    self.renderPdf(self.options, {
                        url: url
                    });
                } else {
                    var time = new Date().getTime();
                    self.endTime = time - self.initTime;
                    var arr1 = self.eventType["complete"];
                    if (arr1 && arr1 instanceof Array) {
                        for (var i = 0; i < arr1.length; i++) {
                            arr1[i] && arr1[i].call(self, "error", "Expect options.pdfurl or options.data!", self.endTime);
                        }
                    }
                    var arr2 = self.eventType["error"];
                    if (arr2 && arr2 instanceof Array) {
                        for (var i = 0; i < arr2.length; i++) {
                            arr2[i] && arr2[i].call(self, "Expect options.pdfurl or options.data!", self.endTime);
                        }
                    }
                    throw Error("Expect options.pdfurl or options.data!");
                }
            }
        }

        /**
         * 事件传参数
         * @param eventType
         * @param args
         * @private
         */

    }, {
        key: "_setEvent",
        value: function _setEvent(eventType) {
            var arr1 = this.eventType[eventType];
            if (arr1 && arr1 instanceof Array) {
                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key = 1; _key < _len2; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                for (var i = 0; i < arr1.length; i++) {
                    arr1[i] && arr1[i].call(this, args);
                }
            }
        }

        /**
         * 渲染pdf
         * @param options
         * @param obj
         */

    }, {
        key: "renderPdf",
        value: function renderPdf(options, obj) {
            this.container[0].pdfLoaded = true;
            var self = this;
            if (options.httpHeaders) {
                obj.httpHeaders = options.httpHeaders;
            }
            if (options.withCredentials) {
                obj.withCredentials = true;
            }
            if (options.password) {
                obj.password = options.password;
                console.log(obj.password);
            }
            if (options.stopAtErrors) {
                obj.stopAtErrors = false;
            }
            if (options.disableFontFace) {
                obj.disableFontFace = true;
            }
            if (options.disableRange) {
                obj.disableRange = true;
            }
            if (options.disableStream) {
                obj.disableStream = true;
            }
            if (options.disableAutoFetch) {
                obj.disableAutoFetch = true;
            }
            obj.cMapPacked = true;
            obj.rangeChunkSize = 65536;
            this.pdfjsLibPromise = PDFJS.getDocument(obj).then(function (pdf) {
                self.loading.hide();
                self.thePDF = pdf;
                self.totalNum = pdf.numPages;
                if (options.limit > 0) {
                    self.totalNum = options.limit;
                }
                self.pageTotal.text(self.totalNum);
                var promise = Promise.resolve();
                var num = Math.floor(100 / self.totalNum).toFixed(2);
                var i = 1;
                for (i = 1; i <= self.totalNum; i++) {
                    self.cache[i + ""] = {
                        page: null,
                        loaded: false,
                        container: null,
                        scaledViewport: null
                    };
                    promise = promise.then(function (pageNum) {
                        return self.thePDF.getPage(pageNum).then(function (page) {
                            window.setTimeout(function () {
                                if (self.options.goto) {
                                    if (pageNum == self.options.goto) {
                                        self.goto(pageNum);
                                    }
                                }
                            }, 0);
                            self.cache[pageNum + ""].page = page;
                            var viewport = page.getViewport(options.scale);
                            var scale = (self.docWidth / viewport.width).toFixed(2);
                            var scaledViewport = page.getViewport(self.scaledViewport);
                            var div = self.container.find('.pageContainer' + pageNum)[0];
                            var container;
                            if (!div) {
                                container = document.createElement('div');
                                container.className = 'pageContainer pageContainer' + pageNum;
                                container.setAttribute('name', 'page=' + pageNum);
                                container.setAttribute('title', 'Page ' + pageNum);
                                var loadEffect = document.createElement('div');
                                loadEffect.className = 'loadEffect';
                                container.appendChild(loadEffect);
                                self.viewer[0].appendChild(container);
                                if (window.ActiveXObject || "ActiveXObject" in window) {
                                    $(container).css({
                                        'width': scaledViewport.width + 'px',
                                        "height": scaledViewport.height + 'px'
                                    }).attr("data-scale", viewport.width / viewport.height);
                                } else {
                                    var h = $(container).width() / (viewport.viewBox[2] / viewport.viewBox[3]);
                                    if (h > viewport.height) {
                                        h = viewport.height;
                                    }
                                    $(container).css({
                                        'max-width': scaledViewport.width * 2,
                                        "max-height": scaledViewport.height * 2
                                    }).attr("data-scale", viewport.width / viewport.height);
                                }
                            } else {
                                container = div;
                            }
                            self.cache[pageNum + ""].container = container;
                            self.cache[pageNum + ""].scaledViewport = scaledViewport;
                            self.pages = self.viewerContainer.find('.pageContainer');
                            return self.renderCanvas(page, scaledViewport, pageNum, num, container, options);
                        });
                    }.bind(null, i));
                }
            }).catch(function (err) {
                self.loading.hide();
                var time = new Date().getTime();
                self.endTime = time - self.initTime;
                var arr1 = self.eventType["complete"];
                if (arr1 && arr1 instanceof Array) {
                    for (var i = 0; i < arr1.length; i++) {
                        arr1[i] && arr1[i].call(self, "error", err.message, self.endTime);
                    }
                }
                var arr2 = self.eventType["error"];
                if (arr2 && arr2 instanceof Array) {
                    for (var i = 0; i < arr2.length; i++) {
                        arr2[i] && arr2[i].call(self, err.message, self.endTime);
                    }
                }
            });
        }

        /**
         * 渲染单页
         * @param page
         * @param viewport
         * @param pageNum
         * @param num
         * @param container
         * @param options
         */

    }, {
        key: "renderCanvas",
        value: function renderCanvas(page, viewport, pageNum, num, container, options) {
            var self = this;
            var scale = (self.docWidth / viewport.width).toFixed(2);
            var canvas = document.createElement("canvas");
            var fabricCanvas = document.createElement("canvas");
            var obj2 = {
                'Cheight': viewport.height * scale,
                'width': viewport.width,
                'height': viewport.height,
                'canvas': canvas,
                'fabricCanvas': fabricCanvas,
                'index': self.loadedCount
            };
            var context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            fabricCanvas.height = viewport.height;
            fabricCanvas.width = viewport.width;
            if (self.options.loadingBar) {
                self.progress.css({
                    width: num * self.loadedCount + "%"
                });
            }
            var renderObj = {
                canvasContext: context,
                viewport: viewport
            };
            if (options.background) {
                renderObj.background = "rgba(255, 255, 255, 0)";
            }

            return page.render(renderObj).then(function () {
                self.loadedCount++;
                var time = new Date().getTime();
                var time2 = 0;
                if (self.renderTime == 0) {
                    time2 = time - self.startTime;
                } else {
                    time2 = time - self.renderTime;
                }
                obj2.canvas.className = "canvasImg" + pageNum;
                obj2.fabricCanvas.id = "fabricCanvas" + self.dom + pageNum;
                $(obj2.fabricCanvas).attr("data-page", pageNum);
                var canvas0 = self.container.find(".pageContainer" + pageNum).find(".canvasImg" + pageNum)[0];
                if (container && !canvas0) {
                    container.appendChild(obj2.canvas);
                } else if (canvas0) {
                    canvas0 = obj2.canvas;
                }
                //创建fabric
                container.appendChild(obj2.fabricCanvas);
                var _fabricCanvas = new fabric.Canvas("fabricCanvas" + self.dom + pageNum);
                $(".canvas-container").css("position", "absolute");
                $(".canvas-container").css("top", "0px");
                $(".canvas-container").css("left", "0px");
                $(".canvas-container").css("width", "100%");
                $(".canvas-container").css("height", "100%");
                $(".canvas-container > canvas").css("width", "100%");
                $(".canvas-container > canvas").css("height", "100%");
                _fabricCanvas.viewportscale = scale;
                _fabricCanvas.viewportWidth = obj2.width;
                self.fabricCanvasForPage.set(pageNum, _fabricCanvas);
                //创建fabric

                container.children[0].style.display = "none";
                var time = new Date().getTime();
                var arr1 = self.eventType["render"];
                if (arr1 && arr1 instanceof Array) {
                    for (var i = 0; i < arr1.length; i++) {
                        arr1[i] && arr1[i].call(self, pageNum, time - self.initTime, container);
                    }
                }
            }).then(function () {
                return page.getTextContent();
            }).then(function (textContent) {
                //计算差异
                if (self.options.isDifference === true) {
                    //渲染差异数据
                    self.renderDifRect(page.pageIndex, viewport.scale).then(function () {});
                }
                //计算差异结束
                //渲染结束
                if (self.loadedCount === self.totalNum) {
                    self.finalRender(options);
                }

                if (!self.options.textLayer) {
                    return;
                }
                if ($(container).find(".textLayer")[0]) {
                    return;
                }
                var textLayerDiv = document.createElement('div');
                textLayerDiv.setAttribute('class', 'textLayer');
                container.appendChild(textLayerDiv);
                viewport.width = viewport.width * scale;
                viewport.height = viewport.height * scale;
                var textLayer = new TextLayerBuilder({
                    textLayerDiv: textLayerDiv,
                    pageIndex: page.pageIndex,
                    viewport: viewport
                });
                textLayer.setTextContent(textContent);
                textLayer.render();
            });
        }
    }, {
        key: "finalRender",
        value: function finalRender(options) {
            var time = new Date().getTime();
            var self = this;
            if (self.options.loadingBar) {
                self.progress.css({
                    width: "100%"
                });
            }
            window.setTimeout(function () {
                if (self.loadingBar) self.loadingBar.hide();
            }, 300);
            self.endTime = time - self.initTime;
            if (options.renderType === "svg") {
                if (self.totalNum !== 1) {
                    self.cache[self.totalNum - 1 + ""].loaded = true;
                } else {
                    self.cache["1"].loaded = true;
                }
            }

            var arr1 = self.eventType["complete"];
            if (arr1 && arr1 instanceof Array) {
                for (var i = 0; i < arr1.length; i++) {
                    arr1[i] && arr1[i].call(self, "success", "pdf加载完成", self.endTime);
                }
            }
            var arr2 = self.eventType["success"];
            if (arr2 && arr2 instanceof Array) {
                for (var i = 0; i < arr2.length; i++) {
                    arr2[i] && arr2[i].call(self, self.endTime);
                }
            }
            self.resizeEvent = true;
        }

        /**
         * 销毁
         * @param callback
         */

    }, {
        key: "destroy",
        value: function destroy(callback) {
            this.reset();

            if (this.thePDF) {
                this.thePDF.destroy();
                this.thePDF = null;
            }
            if (this.viewerContainer) {
                this.viewerContainer.off();
                this.viewerContainer.remove();
                this.viewerContainer = null;
            }
            if (this.container) {
                this.container.off();
                this.container.html('');
            }
            this.totalNum = null;
            this.pages = null;
            this.initTime = 0;
            this.endTime = 0;
            this.viewer = null;
            this.pageNum = null;
            this.pageNow = null;
            this.pageTotal = null;
            this.loadingBar = null;
            this.progress = null;
            this.loadedCount = 0;
            this.timer = null;
            this.jsonTextData = null;
            this.rectDataByPage = null;
            this.rectForPage = []; //当前页面的矩形坐标集合
            this.fabricCanvasForPage = new Map();
            this.rectForId = new Map();
            callback && callback.call(this);
            var arr = this.eventType["destroy"];
            if (arr && arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] && arr[i].call(this);
                }
            }
        }

        /**
         * 缩放
         */

    }, {
        key: "resize",
        value: function resize() {
            var self = this;
            if (!self.resizeEvent) {
                return;
            }
            if (self.pages) {
                this.destroy(function () {
                    window.setTimeout(function () {
                        self.init(self.options);
                    }, 500);
                });
            }
        }
    }, {
        key: "show",
        value: function show(callback) {
            this.container.show();
            callback && callback.call(this);
            var arr = this.eventType["show"];
            if (arr && arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] && arr[i].call(this);
                }
            }
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            this.container.hide();
            callback && callback.call(this);
            var arr = this.eventType["hide"];
            if (arr && arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] && arr[i].call(this);
                }
            }
        }
    }, {
        key: "on",
        value: function on(type, callback) {
            if (this.eventType[type] && this.eventType[type] instanceof Array) {
                this.eventType[type].push(callback);
            }
            this.eventType[type] = [callback];
        }
    }, {
        key: "off",
        value: function off(type) {
            if (type !== undefined) {
                this.eventType[type] = [null];
            } else {
                for (var i in this.eventType) {
                    this.eventType[i] = [null];
                }
            }
        }
    }, {
        key: "goto",
        value: function goto(num) {
            var self = this;
            if (!isNaN(num)) {
                if (self.viewerContainer) {
                    self.pages = self.viewerContainer.find('.pageContainer');

                    if (self.pages) {
                        var h = 0;
                        var signHeight = 0;
                        if (num - 1 > 0) {
                            signHeight = self.pages[0].getBoundingClientRect().height;
                        }
                        self.viewerContainer.animate({
                            scrollTop: signHeight * (num - 1) + 8 * num
                        }, 300);
                    }
                }
            }
        }
    }, {
        key: "scrollEnable",
        value: function scrollEnable(flag) {
            if (flag === false) {
                this.viewerContainer.css({
                    "overflow": "hidden"
                });
            } else {
                this.viewerContainer.css({
                    "overflow": "auto"
                });
            }
            var arr = this.eventType["scrollEnable"];
            if (arr && arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] && arr[i].call(this, flag);
                }
            }
        }

        /**
         * 设置滚动的距离
         * @param scrollTop
         */

    }, {
        key: "scroll",
        value: function scroll(scrollTop) {
            this.viewerContainer.scrollTop(scrollTop);
        }

        /**
         * 重置
         * @param callback
         */

    }, {
        key: "reset",
        value: function reset(callback) {
            if (this.viewerContainer) {
                this.viewerContainer.scrollTop(0);
            }
            this.docWidth = this.container.width();
            callback && callback.call(this);
            var arr = this.eventType["reset"];
            if (arr && arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] && arr[i].call(this);
                }
            }
        }

        /**
         * 渲染差异数据
         * @param pageIndex 渲染页面
         */

    }, {
        key: "renderDifRect",
        value: function renderDifRect(pageIndex, scale) {
            var _this = this;
            var _fabricCanvas = this.fabricCanvasForPage.get(pageIndex + 1);
            return new Promise(function (resolve, reject) {
                var pageRectArray = _this.rectDataByPage[pageIndex + 1];
                if (pageRectArray && pageRectArray.length > 0) {
                    for (var i = 0; i < pageRectArray.length; i++) {
                        var options = pageRectArray[i];
                        options.scale = scale;
                        var rect = new jerryRect(options);
                        var fabricRect = new fabric.Rect({
                            width: rect.width, height: rect.height,
                            left: rect.x + 6, top: rect.y + 5,
                            stroke: rect.strokeStyle,
                            fill: 'transparent',
                            clipName: options.id,
                            page: pageIndex + 1,
                            strokeWidth: 1,
                            selectable: false,
                            id: options.id,
                            hoverCursor: "pointer"
                        });
                        _fabricCanvas.add(fabricRect);
                        fabricRect.on('mousedown', function (e) {
                            var arr1 = _this.eventType["selected_rect"];
                            if (arr1 && arr1 instanceof Array) {
                                for (var i = 0; i < arr1.length; i++) {
                                    arr1[i] && arr1[i].call(_this, e.target.id);
                                }
                            }
                            _this.setSelected(e.target.id);
                        });
                        if (_this.rectForId.get(options.id)) {
                            _this.rectForId.get(options.id).push(fabricRect);
                        } else {
                            _this.rectForId.set(options.id, [fabricRect]);
                        }
                    }
                }
                resolve();
            });
        }

        /**
         * 设置选中的块
         * @param rectId
         */

    }, {
        key: "setSelected",
        value: function setSelected(rectId) {

            var self = this;
            this.getVisiblePageToUnSelect();
            var _fabricRectArray = this.rectForId.get(rectId);
            for (var i = 0; i < _fabricRectArray.length; i++) {
                var _fabricRect = _fabricRectArray[i];
                if (i == 0) {
                    var scale = _fabricRect.canvas.viewportscale;
                    var top = _fabricRect.top * scale;
                    var num = _fabricRect.page;
                    var topH = this.getRectLastPage(num) + top - 20;
                    self.viewerContainer.animate({
                        scrollTop: topH
                    }, { speed: 300,
                        complete: function complete() {
                            var arr1 = self.eventType["selected_rect_sroll"];
                            if (arr1 && arr1 instanceof Array) {
                                for (var i = 0; i < arr1.length; i++) {
                                    arr1[i] && arr1[i].call(self);
                                }
                            }
                        }
                    });
                }
                this.animateOpacity(_fabricRect);
            }
        }

        /**
         * 获取方块之前页的高度
         * @param pageNum
         * @returns {number}
         * @private
         */

    }, {
        key: "getRectLastPage",
        value: function getRectLastPage(pageNum) {
            var signHeight = 0;
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (pageNum - 1 == i) {
                    break;
                }
                signHeight += page.getBoundingClientRect().height + 8;
            }
            return signHeight;
        }

        /**
         * 获取块
         * @param rectId
         * @returns {any}
         */

    }, {
        key: "getFabricRect",
        value: function getFabricRect(rectId) {
            var rects = this.rectForId.get(rectId);
            var fristRectObject;
            if (rects && rects.length > 0) {
                fristRectObject = {};
                var fristRect = rects[0];
                var viewportWidth = rects[0].canvas.viewportWidth;
                var srcscale = (this.container.width() / viewportWidth).toFixed(2);
                fristRectObject.stroke = fristRect.stroke;
                fristRectObject.left = fristRect.left * srcscale;
                fristRectObject.top = fristRect.top * srcscale;
                fristRectObject.LastPageTop = fristRectObject.top + this.getRectLastPage(fristRect.page);
            }
            return fristRectObject;
        }

        /**
         * 清除选中
         */

    }, {
        key: "getVisiblePageToUnSelect",
        value: function getVisiblePageToUnSelect() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.rectForId.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var value = _step.value;

                    var _fabricRectArry = value;
                    for (var i = 0; i < _fabricRectArry.length; i++) {
                        var _fabricRect = _fabricRectArry[i];
                        var canvas = _fabricRect.canvas;
                        _fabricRect.set({
                            fill: "transparent"
                        });
                        canvas.renderAll();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        /**
         * 闪烁方块
         * @param fabricRect
         */

    }, {
        key: "animateOpacity",
        value: function animateOpacity(fabricRect) {
            var color = hexToRgba(fabricRect.stroke.colorHex(), 0.2).rgba;
            var canvas = fabricRect.canvas;
            fabricRect.set({
                fill: color
            });
            canvas.renderAll();
            window.setTimeout(function () {
                fabricRect.set({
                    fill: "transparent"
                });
                canvas.renderAll();
                fabricRect.animate('fill', "transparent", {
                    onChange: canvas.renderAll.bind(canvas),
                    duration: 300,
                    easing: fabric.util.ease.easeInOutCubic,
                    onComplete: function onComplete() {
                        fabricRect.set({
                            fill: color
                        });
                        canvas.renderAll();
                    }
                });
            }, 100);
        }

        /**
         * 请求后台页面数据，计算出每页真实差异块
         * @returns {Promise<unknown>}
         */

    }, {
        key: "initAjax",
        value: function initAjax() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                for (var i = 0; i < _this.options.pagesNum; i++) {
                    // console.log(_this.getURL(_this.options.pdfurl,i))
                    $.ajax({
                        type: "GET",
                        url: _this.getURL(_this.options.pdfurl, i),
                        dataType: "json",
                        //请求成功后要执行的函数，拼接html
                        success: function success(data) {
                            _this.jsonTextData[data.info.page] = _this.parsingJsonPage(data);
                            if (Object.keys(_this.jsonTextData).length === _this.options.pagesNum) {
                                _this.calculatePageText().then(function () {
                                    _this.allPageRect().then(function () {
                                        resolve();
                                    });
                                });
                            }
                        },
                        error: function error(returnValue) {
                            console.log(returnValue);
                            reject();
                        }
                    });
                }
            });
        }

        /**
         * 计算每页的字数
         */

    }, {
        key: "calculatePageText",
        value: function calculatePageText() {
            var _this2 = this;

            return new Promise(function (resolve) {
                var keysArray = Object.keys(_this2.jsonTextData);
                var pileText = 0;
                for (var i = 0; i < keysArray.length; i++) {
                    var pageData = _this2.jsonTextData[keysArray[i]];
                    var textIndex = pageData.textIndex;
                    pileText += textIndex;
                    pageData.pileText = pileText;
                }
                resolve();
            });
        }

        /**
         * 计算每页真实方块
         */

    }, {
        key: "allPageRect",
        value: function allPageRect() {
            var pageKeyArray = Object.keys(this.jsonTextData);
            var pageNum = pageKeyArray.length;
            for (var i = 1; i <= pageNum; i++) {
                var diffArray = this.differenceByPage(i); //当前页的差异数据
                for (var a = 0; a < diffArray.length; a++) {
                    var diffObject = diffArray[a];
                    var startPos = diffObject.startPos; //差异的开始
                    var endPos = diffObject.endPos; //差异的结束
                    var typeColor = diffObject.fillStyle; //当前差异的颜色
                    var id = diffObject.id; //对比的id
                    var rect;
                    if (startPos == endPos) {
                        //一个字
                        if (startPos - 1 > 0) {
                            rect = this.getPostRect(startPos - 1, id, typeColor);
                        } else {
                            rect = this.getPostRect(startPos, id, typeColor);
                        }
                        rect.width = 12;
                        this.setRectByPage(rect);
                    } else {
                        var _boundArray = [];
                        for (var b = startPos; b < endPos; b++) {
                            rect = this.getPostRect(b, id, typeColor);
                            var _preBound = _boundArray[_boundArray.length - 1];
                            if (_preBound && _preBound.y == rect.y) {
                                _preBound.width = rect.x - _preBound.x + rect.width;
                                _preBound.str += rect.str;
                            } else {
                                _boundArray.push(rect);
                            }
                        }
                        this.setRectsByPage(_boundArray);
                    }
                }
            }
            return Promise.resolve();
        }

        /**
         * 获取真实方块大小位置
         * @param pos 位置
         * @param id 当前差异id
         * @param textColor 块颜色
         * @returns {{}}
         */

    }, {
        key: "getPostRect",
        value: function getPostRect(pos, id, textColor) {
            var pageKeyArray = Object.keys(this.jsonTextData);
            var pageNum = pageKeyArray.length;

            var recordingPage = 1; //记录页
            var previousPagesTextNum = 0; //前面页+当前文字页的字数
            for (var i = 1; i <= pageNum; i++) {
                var textIndex = this.jsonTextData[i].pileText;
                if (textIndex > pos) {
                    //当前页大于 起始页码
                    recordingPage = i;
                    break;
                }
            }
            if (recordingPage != 1) {
                previousPagesTextNum = this.jsonTextData[recordingPage - 1].pileText;
            }
            var _textIndex = pos - previousPagesTextNum;
            var jsonObject = this.jsonTextData[recordingPage].content[_textIndex];
            var bound = {};
            bound.str = jsonObject.str;
            bound.width = jsonObject.width;
            bound.height = jsonObject.height;
            bound.x = jsonObject.x;
            bound.y = jsonObject.y;
            bound.id = id;
            bound.fillStyle = textColor;
            bound.page = recordingPage;
            return bound;
        }

        /**
         * 设置当前页的 rect数据
         * @param page
         * @param bound
         */

    }, {
        key: "setRectByPage",
        value: function setRectByPage(bound) {
            var rectArray = this.rectDataByPage[bound.page];
            if (rectArray) {
                rectArray.push(bound);
                this.rectDataByPage[bound.page] = rectArray;
            } else {
                rectArray = [];
                rectArray.push(bound);
                this.rectDataByPage[bound.page] = rectArray;
            }
        }

        /**
         * 设置一组块 到当前页
         * @param bounds
         */

    }, {
        key: "setRectsByPage",
        value: function setRectsByPage(bounds) {
            for (var i = 0; i < bounds.length; i++) {
                var bound = bounds[i];
                this.setRectByPage(bound);
            }
        }

        /**
         * 解析josn 对象
         * @param jsonPageData
         */

    }, {
        key: "parsingJsonPage",
        value: function parsingJsonPage(jsonPageData) {
            var info = jsonPageData.info;
            var pageScale = info.scale; //缩放比1
            var content = jsonPageData.content;
            var contentLength = Object.keys(content).length;
            var textArray = [];
            var index = 0;
            if (contentLength != 0) {
                content.forEach(function (text) {
                    var str = text.str;
                    var _left = text.x;
                    if (str.length > 1) {
                        //如果有多文本，拆解文字
                        var singleTextSizeWidth = text.width / str.length; //单个文字的宽度
                        for (var i = 0; i < str.length; i++) {
                            var _newStr = str.substr(i, 1);
                            var newObject = {};
                            newObject.str = _newStr;
                            newObject.width = text.width;
                            newObject.height = text.height;
                            newObject.rotation = text.rotation;
                            newObject.scale = text.scale;
                            newObject.x = _left + singleTextSizeWidth * i;
                            newObject.y = text.y;
                            textArray.push(newObject);
                            index++;
                        }
                    } else {
                        index++;
                        textArray.push(text);
                    }
                });
            }
            var newJsonPageData = {};
            newJsonPageData.info = jsonPageData.info;
            newJsonPageData.content = textArray;
            newJsonPageData.textIndex = index; //当前页的文字数量
            return newJsonPageData;
        }

        /**
         * 返回当前页的所有差异
         * @param page 页面
         * @returns {[]} 返回当前页的差异数组
         */

    }, {
        key: "differenceByPage",
        value: function differenceByPage(page) {
            var _len = this.options.diffArray.length;
            var differneceArray = []; //差异数组
            //有差异
            for (var i = 0; i < _len; i++) {
                var _rev = this.options.diffArray[i]; //差异度
                var _page = _rev.page;
                if (page === _page) {
                    differneceArray.push(_rev);
                }
            }
            return differneceArray;
        }
    }, {
        key: "getURL",
        value: function getURL(url, index) {
            if (this.options.PDF_DEBUG) {
                if (this.dom == "#targetContainer") {
                    return "../staict/page" + (index + 1) + ".json";
                } else {
                    return "../staict/srcpage" + (index + 1) + ".json";
                }
            } else {
                return url + "&page=" + (index + 1);
            }
        }
    }]);

    return PDFH5;
}();

/**
 * 绘制矩形
 *
 */


var jerryRect = function () {
    function jerryRect(option) {
        _classCallCheck(this, jerryRect);

        this.Hz = 0;
        this.option = option;
        this.fillStyle = option.fillStyle.colorRgb(0.5) || "red";
        this.strokeStyle = option.fillStyle.colorRgb() || "red";
        this.lineWidth = option.lineWidth || 1; //矩形描边的宽度
        this.scale = option.scale || 1;
        this.rotation = option.rotation || 0; //旋转角度
        this.width = option.width * this.scale || 0; //矩形的宽度
        this.height = (option.height + 12) * this.scale || 0;
        this.x = (option.x - 4) * this.scale || 0; //矩形左上角的 x 坐标
        this.y = (option.y - 6 - (option.height + 8)) * this.scale || 0;
        this.ctx = option.ctx;
    }

    /**
     * 渲染
     * @param ctx
     */


    _createClass(jerryRect, [{
        key: "render",
        value: function render() {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = this.lineWidth;
            // this.ctx.rotate(this.rotation*Math.PI/180);
            this.ctx.rect(this.x, this.y, this.width, this.height);
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fill();
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.stroke();
            this.ctx.restore();
        }

        /**
         * 动画渲染
         */

    }, {
        key: "animateRender",
        value: function animateRender() {
            this.ctx.clearRect(this.x, this.y, this.width, this.height);
            this.ctx.closePath();
            window.setTimeout(function () {
                this.animateRender;
            }.bind(this), 1000 / 60);
            this.Hz++;
            if (this.Hz > 1) {
                this.Hz = 0;
                this.render();
            }
        }

        /**
         * 判断点是否在矩形内
         */

    }, {
        key: "isPointInMatrix",
        value: function isPointInMatrix(p) {
            var p1 = {
                x: this.x,
                y: this.y
            };
            var p3 = {
                x: this.x + this.width,
                y: this.y + this.height
            };
            if (p.x >= p1.x && p.x <= p3.x && p.y >= this.y && p.y <= p3.y) {
                return true;
            }
            return false;

            // var isPointIn = this._getCross(p1, p2, p) * this._getCross(p3, p4, p) >= 0 && this._getCross(p2, p3, p) * this._getCross(p4, p1, p) >= 0;
            // return isPointIn;
        }
    }, {
        key: "_getCross",
        value: function _getCross(p1, p2, p) {
            return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
        }
    }]);

    return jerryRect;
}();

String.prototype.colorRgb = function (ap) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = this.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        if (ap) {
            return "RGB(" + colorChange.join(",") + "," + ap + ")";
        }
        return "RGB(" + colorChange.join(",") + ")";
    } else {
        return color;
    }
};

String.prototype.colorHex = function () {
    // RGB颜色值的正则
    var reg = /^(rgb|RGB)/;
    var color = this;
    if (reg.test(color)) {
        var strHex = "#";
        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
            var hex = Number(colorArr[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        return strHex;
    } else {
        return String(color);
    }
};

function hexToRgba(hex, opacity) {
    var RGBA = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    return {
        red: parseInt("0x" + hex.slice(1, 3)),
        green: parseInt("0x" + hex.slice(3, 5)),
        blue: parseInt("0x" + hex.slice(5, 7)),
        rgba: RGBA
    };
}
