import pymupdf

rawPdf = pymupdf.Document('/Users/luoxinzheng/Desktop/文档对比1.pdf')
savedPdf = pymupdf.Document()

savedPdf.insert_pdf(rawPdf, from_page=2, to_page=2)
savedPdf.save('/Users/luoxinzheng/Desktop/文档对比1-2.pdf')
