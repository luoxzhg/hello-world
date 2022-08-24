var SinglePDF={
    createNew:function(valueObject) {
        var singlePDF = {
            renderCallBack:null
        };
        /**
         * 初始化
         */
        singlePDF.init=function(){
            this.initEvent();
            this.renderCallBack=valueObject.renderCallBack || null;
            var srcObject={
                viewerContainerId:valueObject.viewerContainerId || "srcContainer",
                pdf:valueObject.srcPdf,
                disableTextLayer:valueObject.disableTextLayer,
                isAjax:false
            }
            this.srcPdf=singlePDF.initView(srcObject);
        }
        /**
         * 初始化pdfview
         * @param viewObject
         */
        singlePDF.initView=function(viewObject){
            return PDFViewerApplication.createNew(viewObject);
        }

        /**
         * 初始化监听事件
         */
        singlePDF.initEvent=function(){
            var _this=this;
            EventBus.removeEventListener(valueObject.viewerContainerId+'pagesloaded',function(){},this);
            EventBus.addEventListener(valueObject.viewerContainerId+'pagesloaded', function(e, param1){
                if(_this.renderCallBack){
                    _this.renderCallBack()
                }
            })
        }

        singlePDF.find=function(text){
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('find' , true, true, {
                query: text,
                caseSensitive: false,
                highlightAll: false,
                findPrevious: null
            });
            return window.dispatchEvent(event);
        }

        singlePDF.init();
        return singlePDF;
    }
}