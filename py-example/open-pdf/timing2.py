import time
from pymupdf import Document

if __name__ == '__main__':
    file = open('/Users/luoxinzheng/Desktop/adobe.pdf', 'rb')
    data = file.read()
    for i in range(100):
        print(i, '====>')
        start = time.perf_counter()
        with Document(stream=data, filetype='pdf') as doc:
            pageCount = doc.page_count
        delta = 1000*(time.perf_counter() - start)
        print('page count: ', pageCount)
        print('total time: ', delta)
        print('<====')
