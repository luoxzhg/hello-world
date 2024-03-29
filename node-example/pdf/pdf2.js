(function() {

    const PDFJS = pdfjsLib,
          pdfMime = 'application/pdf',
          ad = ABOUtils.DOM,
          [$, $$] = ad.selectors();

    const state = {
        mime: pdfMime,
        docs: [],
    };

    //https://stackoverflow.com/a/39855420/1869660
    //https://www.sitepoint.com/custom-pdf-rendering/#renderingusingsvg
    function parsePage(page, pageInfo) {

        page.getOperatorList().then(function(ops) {
            console.log('ops', ops);
            const fns = ops.fnArray,
                  args = ops.argsArray;

            let imgsFound = 0;
            args.forEach((arg, i) => {
                //Not a JPEG resource:
                if (fns[i] !== PDFJS.OPS.paintJpegXObject) { return; }

                console.log('loading', arg);
                imgsFound++;

                const imgKey = arg[0],
                      imgInfo = {
                          name: pageInfo.name + '-' + imgsFound + '.jpg',
                          url: '',
                      };
                pageInfo.images.push(imgInfo);

                page.objs.get(imgKey, img => {
                    imgInfo.url = img.src;
                });
            });
        });


        //Full SVG:

        // Get viewport (dimensions)
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        pageInfo.svg = {
            w: viewport.width,
            h: viewport.height,
            doc: '',
        };

        // SVG rendering by PDF.js
        page.getOperatorList().then(opList => {
            var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
            return svgGfx.getSVG(opList, viewport);
        }).then(svg => {
            //console.log(svg);
            pageInfo.svg.doc = svg;
        });

    }

    function handleFiles(data) {
        //console.log('files', data);
        const docs = [];

        data.forEach(d => {
            const docName = d.file.name,
                  pages = [];
            docs.push({
                name: docName,
                pages,
            });

            PDFJS.getDocument({
                    url: d.url,
                    //password: "test",
                })
                .promise.then(function(doc) {
                    for(let p = 1; p <= doc.numPages; p++) {
                        const pageInfo = {
                            number: p,
                            name: docName + '-' + p,
                            images: [],
                            svg: {},
                        };
                        pages.push(pageInfo);

                        doc.getPage(p).then(page => parsePage(page, pageInfo));
                    }
                })
                .catch(function(error) {
                    alert('Failed to open ' + docName);
                    console.log(error);
                });
        });

        state.docs = docs;
        console.log(state);
    }


    Vue.component('page', {
        template: '#templ-page',
        props: ['p'],
        data() {
            return {
                checked: false,
                title: 'Check me'
            }
        },
        methods: {
            handleSVG(e) {
                const imgUrl = e.target.href?.baseVal;
                if(imgUrl) {
                    console.log(imgUrl);
                    window.open(imgUrl, '_blank');
                }
                else {
                    this.$refs.svgContainer.appendChild(this.p.svg.doc);
                }
            }
        }
    });
    new Vue({
        el: '#app',
        data: state,
    });

    ad.dropFiles($('#pdfs input'), handleFiles, { acceptedTypes: [pdfMime] });
    ad.dropFiles(document,         handleFiles, { acceptedTypes: [pdfMime] });

})();
