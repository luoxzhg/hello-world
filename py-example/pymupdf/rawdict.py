import pymupdf

document = pymupdf.Document('/Users/luoxinzheng/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/5AA3C9CC2EEE1A436C4C8ED744626982/Caches/Files/2024-12/0a14e03a4e3b8ffae44f29a17e79fa74/万翼签.pdf')

with document:
    page = document.load_page(0)
    rawdict = page.get_text('rawjson') # type: ignore
    file = open('rawjson.json', 'x')
    file.write(rawdict)
