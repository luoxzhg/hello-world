import time
from openpdf import count_pdf_pages

if __name__ == '__main__':
    file = open('/Users/luoxinzheng/Desktop/adobe.pdf', 'rb')
    data = file.read()
    for i in range(100):
        print(i, '====>')
        start = time.perf_counter()
        pageCount = count_pdf_pages(data)
        delta = 1000*(time.perf_counter() - start)
        print('page count: ', pageCount)
        print('total time: ', delta)
        print('<====')
