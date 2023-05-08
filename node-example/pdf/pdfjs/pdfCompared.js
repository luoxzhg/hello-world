"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PDFCompared = function () {
    function PDFCompared(pdfObject) {
        _classCallCheck(this, PDFCompared);

        this.PDF_DEBUG = false;
        if (this.PDF_DEBUG) {
            pdfObject.Rev.srcPdf = "../staict/srcPdf.pdf";
            pdfObject.Rev.targetPdf = "../staict/targetPdf.pdf";
        }
        this.typeColour = ["#4083f7", "#fe2027", "#eca226"]; //type 1是新增，2是删除，3是修改
        this.VIEWCONTAINER_CLASS = ".viewerContainer";
        this.srcDom = "#srcContainer";
        this.targetDom = "#targetContainer";
        this.revisions = pdfObject.Rev.revisions;
        this.pageMap = new Map();
        this.pageIdMap = new Map();
        this.ctrPage = 1;
        this._selectedId = null; //被选中的id
        this.synchro = true; //同步
        this.reactList = {}; //正常bar 数据
        this.srcPdfSrollOver = false;
        this.targetPdfSrollOver = false;
        this.isClassic = true;
        this.targetPdfScroll = false; //能不能跟随滚动
        this.srcPdfScroll = false; //能不能跟随滚动
        this.isRenderSvg = false;
        this.init(pdfObject);
    }

    /**
     * 设置选中的id
     * @param id
     */


    _createClass(PDFCompared, [{
        key: "init",
        value: function init(pdfObject) {
            this.svgLine = new svgLine();
            this.svgLine.initSvgContainer("svg-container");
            var revObject = this.createPDFOptions(pdfObject);
            this.srcPdf = this.createPDF(this.srcDom, revObject.srcRev);
            this.targetPdf = this.createPDF(this.targetDom, revObject.targetRev);
            this.createPageOptions(pdfObject.Rev.revisions);

            this.initUI(pdfObject);
            this.initEvent();
        }

        /**
         * 创建监听
         */

    }, {
        key: "initEvent",
        value: function initEvent() {
            var self = this;
            this.pdfEvent();
            this.scrollEvent();
        }

        /**
         * pdf 监听
         */

    }, {
        key: "pdfEvent",
        value: function pdfEvent() {
            var self = this;
            //选中消息
            this.srcPdf.off("selected_rect");
            this.srcPdf.on("selected_rect", function (selectedId) {
                self.selectedId = selectedId;
                self.targetPdf.setSelected(self.selectedId);
            });
            this.targetPdf.off("selected_rect");
            this.targetPdf.on("selected_rect", function (selectedId) {
                self.selectedId = selectedId;
                self.srcPdf.setSelected(self.selectedId);
            });

            //放大缩小销毁
            this.srcPdf.off("destroy");
            this.srcPdf.on("destroy", function (pdf) {
                self.scrollEvent();
            });
            this.srcPdf.off("success");
            this.srcPdf.on("success", function (pdf) {
                self.createPageBar(self.ctrPage);
            });

            //选中滚动结束
            this.srcPdf.off("selected_rect_sroll");
            this.srcPdf.on("selected_rect_sroll", function (pdf) {
                self.srcPdfSrollOver = true;
                self.renderSVG();
            });

            this.targetPdf.off("selected_rect_sroll");
            this.targetPdf.on("selected_rect_sroll", function (selectedId) {
                self.targetPdfSrollOver = true;
                self.renderSVG();
            });

            //
            this.srcPdf.off("pageChange");
            this.srcPdf.on("pageChange", function (pageNum) {
                self.ctrPage = Number(pageNum[0]);
                self.createPageBar(Number(pageNum[0]));
            });

            //监听渲染完成
            this.srcPdf.off("complete");
            this.srcPdf.on("complete", function () {
                var $dom = $(self.srcDom);
                var dom = $dom[0];
                console.log(dom.offsetWidth);
                console.log(dom.scrollWidth);
                dom.scrollTo((dom.scrollWidth - dom.offsetWidth) / 2, 0);
                //$dom.scrollLeft((dom.scrollWidth-dom.offsetWidth)/2);
            });

            this.targetPdf.off("complete");
            this.targetPdf.on("complete", function () {
                var $dom = $(self.targetDom);
                var dom = $dom[0];
                console.log(dom.offsetWidth);
                console.log(dom.scrollWidth);
                dom.scrollTo((dom.scrollWidth - dom.offsetWidth) / 2, 0);
                //$dom.scrollLeft((dom.scrollWidth-dom.offsetWidth)/2);
            });
        }

        /**
         * 滚动监听
         */

    }, {
        key: "scrollEvent",
        value: function scrollEvent() {
            var self = this;

            self.srcPdf.off("scroll");
            self.srcPdf.on("scroll", function (scrollTop, pageNow) {
                // console.log(" srcPdf self.svgLine.removeActiveLink()")
                if (!self.isRenderSvg) {
                    self.svgLine.removeActiveLink();
                }
                if (self.targetPdfScroll && self.synchro && !self.isRenderSvg) {
                    self.targetPdf.scroll(scrollTop);
                }
            });

            self.targetPdf.off("scroll");
            self.targetPdf.on("scroll", function (scrollTop) {
                // console.log(" targetPdf self.svgLine.removeActiveLink()");
                if (!self.isRenderSvg) {
                    self.svgLine.removeActiveLink();
                }
                if (self.srcPdfScroll && self.synchro && !self.isRenderSvg) {
                    self.srcPdf.scroll(scrollTop);
                }
            });

            //监听同步滚动
            $(this.srcDom).off("mouseover mouseout").on("mouseover mouseout", function (e) {
                var eventType = e.type;
                if (eventType == 'mouseover') {
                    self.targetPdfScroll = true;
                } else {
                    self.targetPdfScroll = false;
                }
            });

            $(this.targetDom).off("mouseover mouseout").on("mouseover mouseout", function (e) {
                var eventType = e.type;
                if (eventType == 'mouseover') {
                    self.srcPdfScroll = true;
                } else {
                    self.srcPdfScroll = false;
                }
            });
        }

        /**
         * 绘制svg
         */

    }, {
        key: "renderSVG",
        value: function renderSVG() {
            var self = this;
            this.pdfSelectedRect(this.selectedId);
            if (this.isClassic) {
                if (this.srcPdfSrollOver && this.targetPdfSrollOver) {
                    var $differentnr = $(".differentnr");
                    var $differentnrList = $("#differentnrList");
                    var element = $("#differentnrList .on").eq(0);
                    var h = 0;
                    for (var i = 0; i < $differentnrList.children().length; i++) {
                        if (i == element.index()) {
                            break;
                        } else {
                            h += $differentnrList.children(i).outerHeight(true);
                        }
                    }

                    var _scrolltop = h;
                    $differentnr.animate({
                        scrollTop: _scrolltop
                    });
                    this.srcPdfSrollOver = false;
                    this.targetPdfSrollOver = false;
                    self.isRenderSvg = false;
                    self.scrollEvent();
                }
                return;
            };
            if (this.srcPdfSrollOver && this.targetPdfSrollOver) {
                if (this.selectedId) {

                    var srcRect = this.srcPdf.getFabricRect(this.selectedId);
                    var targetRect = this.targetPdf.getFabricRect(this.selectedId);
                    var scrContainer = $(this.srcDom + " .viewerContainer");
                    var targetContainer = $(this.targetDom + " .viewerContainer");
                    var element = $("#normalDiffList .on").eq(0);
                    var elementTop = element.offset().top - 20; //顶部
                    var elementLeft = element.offset().left;
                    var srcLastPageH = this.srcPdf.getRectLastPage(srcRect.page);
                    var targetLastPageH = this.srcPdf.getRectLastPage(targetRect.page);
                    var $middle = $("#normalDiffList");

                    // console.log(elementTop)
                    var srcPostObject = {
                        btnType: srcRect.stroke.colorHex(),
                        startLeft: srcRect.left,
                        startTop: srcRect.LastPageTop - scrContainer.scrollTop(),
                        midLeft: $(".srcContainer").outerWidth(true),
                        midTop: srcRect.LastPageTop - scrContainer.scrollTop(),
                        endLeft: elementLeft,
                        endTop: elementTop - 50,
                        linkDirection: 0,
                        linkStatus: 0
                    };
                    this.svgLine.drawPolyLine(srcPostObject);
                    var targetPostObject = {
                        btnType: targetRect.stroke.colorHex(),
                        startLeft: $(".srcContainer").outerWidth(true) + $middle.outerWidth(true) + targetRect.left,
                        startTop: targetRect.LastPageTop - targetContainer.scrollTop(),
                        midLeft: $(".srcContainer").outerWidth(true) + $middle.outerWidth(true),
                        midTop: targetRect.LastPageTop - targetContainer.scrollTop(),
                        endLeft: elementLeft + $middle.outerWidth(true),
                        endTop: elementTop - 50,
                        linkDirection: 1,
                        linkStatus: 0
                    };
                    this.svgLine.drawPolyLine(targetPostObject);
                }
                this.srcPdfSrollOver = false;
                this.targetPdfSrollOver = false;
                setTimeout(function () {
                    self.isRenderSvg = false;
                }, 300);
                self.scrollEvent();
            }
        }

        /**
         * ui 绑定事件
         */

    }, {
        key: "initUI",
        value: function initUI(pdfObject) {
            var self = this;
            //名称
            $("#srcContainerPDFName").text(pdfObject.Rev.srcName);
            $("#targetContainerPDFName").text(pdfObject.Rev.targetName);
            //差异
            $("#diffTotal").text(pdfObject.Rev.revisions.length);
            $("#classicDiffTotal").text(pdfObject.Rev.revisions.length);
            //显示宽
            $(".o_zk").bind("click", function () {
                $(".classicWrapper_showmain").show();
                $(".simple-content").hide();
                $(".simpleWrapper").css("width", "200px");
                self.isClassic = true;
                self.svgLine.removeActiveLink();
            });
            //显示窄
            $(".o_sq").bind("click", function () {
                $(".classicWrapper_showmain").hide();
                $(".simple-content").show(function () {
                    self.createPageBar(self.ctrPage);
                });
                $(".simpleWrapper").css("width", "100px");
                self.isClassic = false;
                self.svgLine.removeActiveLink();
            });
            //自动滚动
            $(".autoScroll").bind("click", function () {
                $(this).toggleClass("on");
                self.synchro = !self.synchro;
            });
        }

        /**
         * 创建pdf
         */

    }, {
        key: "createPDF",
        value: function createPDF(dom, options) {
            return new PDFH5(dom, options);
        }

        /**
         * 创建pdf 数据
         * @param pdfObject
         * @returns {{targetRev: {pagesNum: (number|*), PDF_DEBUG: boolean, isDifference: boolean, pdfurl: (string|*), diffArray: *[]}, srcRev: {pagesNum: (number|*), PDF_DEBUG: boolean, isDifference: boolean, pdfurl: (string|*), diffArray: *[]}}}
         */

    }, {
        key: "createPDFOptions",
        value: function createPDFOptions(pdfObject) {
            var _rev = pdfObject.Rev;
            var revisions = _rev.revisions;
            var _lenght = revisions.length;
            var _index = 0;
            var _srcRev = [];
            var _targetRev = [];
            for (var i = 0; i < _lenght; i++) {
                var revision = revisions[i];
                var id = revision.id;
                var type = revision.type;
                var targetRev = revision.targetRev;
                var typeColor = this.typeColour[revision.type - 1]; //type 1是新增，2是删除，3是修改
                targetRev.id = id;
                targetRev.type = type;
                targetRev.fillStyle = typeColor;
                var srcRev = revision.srcRev;
                srcRev.id = id;
                srcRev.type = type;
                srcRev.fillStyle = typeColor;
                _srcRev.push(srcRev);
                _targetRev.push(targetRev);
            }
            return {
                srcRev: {
                    pdfurl: _rev.srcPdf,
                    isDifference: true,
                    pagesNum: _rev.srcPages,
                    PDF_DEBUG: this.PDF_DEBUG,
                    diffArray: _srcRev
                },
                targetRev: {
                    pdfurl: _rev.targetPdf,
                    isDifference: true,
                    pagesNum: _rev.targetPages,
                    PDF_DEBUG: this.PDF_DEBUG,
                    diffArray: _targetRev
                }
            };
        }

        /**
         * 创建 页面中间导航数据栏数据
         * @param srcRev
         */

    }, {
        key: "createPageOptions",
        value: function createPageOptions(revs) {
            var self = this;
            var _classHtml = "";
            for (var i = 0; i < revs.length; i++) {
                var rec = revs[i];
                var pageArray = this.pageMap.get(rec.srcRev.page);
                if (pageArray) {
                    pageArray.push(rec);
                } else {
                    pageArray = [rec];
                }
                this.pageMap.set(rec.srcRev.page, pageArray);
                _classHtml += this.createClassicBar(rec);
            }
            $("#differentnrList").html(_classHtml);
            //绑定点击事件
            $(".differentnr_child").off("click").on("click", function (evt) {
                var currentTarget = evt.currentTarget;
                $(currentTarget).addClass("on").siblings().removeClass("on");
                self.selectedId = Number($(currentTarget).attr("data-id"));
                self.srcPdf.setSelected(self.selectedId);
                self.targetPdf.setSelected(self.selectedId);
            });
        }

        /**
         * 创建导航页
         */

    }, {
        key: "createPageBar",
        value: function createPageBar(page) {
            var self = this;
            this.reactList = {};
            var canvas0 = $(this.srcDom).find(".pageContainer" + page).find(".canvasImg" + page)[0];
            var $normalDiffList = $("#normalDiffList");
            var zoomRatio = ($normalDiffList.height() - 20) / $(canvas0).height(); //高度缩放比

            var pageRectArray = this.pageMap.get(page);

            var _normalHtml = "";
            if (!pageRectArray || pageRectArray.length <= 0) {
                $("#normalDiffList").html(_normalHtml);
                return;
            };
            for (var i = 0; i < pageRectArray.length; i++) {
                var rect = pageRectArray[i];
                this.createNormalBarData(rect, zoomRatio);
            }
            _normalHtml = this.createNormalBar();
            $("#normalDiffList").html(_normalHtml);

            $(".dffBtn").off("click").on("click", function () {
                $(".diff-row").removeClass("on");
                $(this).addClass("on");
                if (!$(this).hasClass("dffGroupBtn")) {
                    $(".ant-groups").hide();
                } else {
                    //$(this).parent().prev().addClass("on");
                }
                var id = Number($(this).attr("data-id"));
                self.selectedId = id;
                self.srcPdf.setSelected(id);
                self.targetPdf.setSelected(id);
            });

            $(".btn-all").off("click").on("click", function () {
                $(this).next().show();
            });
        }

        /**
         * 创建经典导航
         * @param rectArray
         */

    }, {
        key: "createClassicBar",
        value: function createClassicBar(_rev) {
            var _html = "";
            var _id = _rev.id;
            var _type = _rev.type;
            var _iconClass;
            var _iconName;
            if (_type == 2) {
                _iconClass = "sc";
                _iconName = "删除";
            } else if (_type == 3) {
                _iconClass = "xg";
                _iconName = "修改";
            } else if (_type == 1) {
                _iconClass = "xz";
                _iconName = "新增";
            }
            if (this.selectedId == _id) {
                _iconClass += " on";
            }
            var _srcText = _rev.srcRev.content;
            var _targetText = _rev.targetRev.content;
            _html += "<div data-id=\"" + _id + "\"  class=\"differentnr_child " + _iconClass + " \">";
            _html += "<h4>" + _iconName + "</h4>";
            _html += "<div class=\"diff_main\">";
            _html += "<p><label>左：</label><span>" + _srcText + "</span></p>";
            _html += "<p><label>右：</label><span>" + _targetText + "</span></p>";
            _html += "</div></div>";
            return _html;
        }

        /**
         * 创建正常bar 数据
         * @param rect
         */

    }, {
        key: "createNormalBarData",
        value: function createNormalBarData(rect, zoomRatio) {
            var _id = rect.id;
            var fabricRect = this.srcPdf.getFabricRect(_id);
            var top = fabricRect.top;
            rect.y = top * zoomRatio;
            if (this.reactList[top]) {
                this.reactList[top].push(rect);
            } else {
                this.reactList[top] = [rect];
            }
        }

        /**
         * 创建正常导航
         * @param rectArray
         */

    }, {
        key: "createNormalBar",
        value: function createNormalBar() {
            var listHtml = "";
            for (var i in this.reactList) {
                var rectArray = this.reactList[i];
                listHtml += this.buildListOne(rectArray);
            }
            return listHtml;
        }

        /**
         * 创建一条数据
         * @param rects
         * @returns {string}
         */

    }, {
        key: "buildListOne",
        value: function buildListOne(rects) {
            var listHtml;
            var className = "";
            if (rects.length == 1) {
                var textColor = rects[0].textColor;
                var type = rects[0].type; //type 1是新增，2是删除，3是修改
                var id = rects[0].id;
                var page = rects[0].page;
                var y = rects[0].y;
                if (id == this.selectedId) {
                    className = "on";
                } else {
                    className = "";
                }
                if (type == 1) {
                    listHtml = '<div style="top:' + y + 'px" class="diff-row dffBtn ' + className + '" data-id="' + id + '" data-src-page="' + page + '"><div class="btn-show btn-add"><i></i></div></div>';
                } else if (type == 2) {
                    listHtml = '<div style="top:' + y + 'px" class="diff-row dffBtn ' + className + '" data-id="' + id + '" data-src-page="' + page + '"><div class="btn-show btn-sc"><i></i></div></div>';
                } else if (type = 3) {
                    listHtml = '<div style="top:' + y + 'px" class="diff-row dffBtn ' + className + '" data-id="' + id + '" data-src-page="' + page + '"><div class="btn-show btn-xg"><i></i></div></div>';
                }
            } else {
                var listHtml2 = '';
                var rowClass = "";
                var rowStyle = "";
                var rectsY = 0;
                for (var i = 0; i < rects.length; i++) {
                    var rectObject = rects[i];
                    var _type = rectObject.type; //type 1是新增，2是删除，3是修改
                    var _id = rectObject.id;
                    var _page = rectObject.page;
                    rectsY = rects[0].y;
                    if (_id == this.clickTagetId) {
                        className = "on";
                        rowClass = "on";
                        rowStyle = "style=\"display: block;\"";
                    } else {
                        className = "";
                    }
                    if (_type == 1) {
                        listHtml2 += '<div class="diff-row dffBtn dffGroupBtn ' + className + '" data-id="' + _id + '" data-src-page="' + _page + '"><div class="btn-show btn-add"><i></i></div></div>';
                    } else if (_type == 2) {
                        listHtml2 += '<div class="diff-row dffBtn dffGroupBtn ' + className + '" data-id="' + _id + '" data-src-page="' + _page + '"><div class="btn-show btn-sc"><i></i></div></div>';
                    } else if (_type = 3) {
                        listHtml2 += '<div class="diff-row dffBtn dffGroupBtn ' + className + '" data-id="' + _id + '" data-src-page="' + _page + '"><div class="btn-show btn-xg"><i></i></div></div>';
                    }
                }
                listHtml2 += '</div></div>';
                var isSelectOn = '<div class="diff-row ' + rowClass + '" style="top:' + rectsY + 'px"><div class="btn-show btn-all"><i></i>(' + rects.length + ')</div><div class="ant-groups" ' + rowStyle + '>';
                listHtml = isSelectOn + listHtml2;
            }
            return listHtml;
        }

        /**
         * pdf 选中的差异块
         * @param id
         */

    }, {
        key: "pdfSelectedRect",
        value: function pdfSelectedRect(id) {
            var $diffListChild;
            if (this.isClassic) {
                $diffListChild = $("#differentnrList").children();
                for (var i = 0; i < $diffListChild.length; i++) {
                    var _el = $diffListChild[i];
                    var _id = $(_el).attr("data-id");
                    if (_id) {
                        if (_id == id) {
                            $(_el).addClass("on");
                        } else {
                            $(_el).removeClass("on");
                        }
                    } else {
                        $(_el).removeClass("on");
                    }
                }
            } else {
                var element;
                $(".dffBtn").removeClass("on");
                $diffListChild = $("#normalDiffList").children();
                for (var i = 0; i < $diffListChild.length; i++) {
                    var _el = $diffListChild[i];
                    var _id = $(_el).attr("data-id");
                    if (_id) {
                        if (_id == id) {
                            element = _el;
                            $(element).addClass("on");
                            break;
                        }
                    } else {
                        var groups = $(_el).children('.ant-groups').children();
                        for (var a = 0; a < groups.length; a++) {
                            var _el2 = groups[a];
                            var _id2 = $(_el2).attr("data-id");
                            if (_id2 == id) {
                                element = _el2;
                                $(element).addClass("on");
                                $(element).parent().css("display", "block");
                                break;
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: "selectedId",
        set: function set(id) {
            this._selectedId = id;
            this.targetPdfScroll = false; //能不能跟随滚动
            this.srcPdfScroll = false; //能不能跟随滚动
            this.isRenderSvg = true;
            this.srcPdf.off("scroll");
            this.targetPdf.off("scroll");
            $(this.srcDom).off("mouseover mouseout");
            $(this.targetDom).off("mouseover mouseout");
            $("#diffNumber").text(id);
        },
        get: function get() {
            return this._selectedId;
        }
    }]);

    return PDFCompared;
}();
