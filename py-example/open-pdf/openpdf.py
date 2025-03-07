import time
from pymupdf import Document
from executor import executor

def count_pdf_pages(data):
    task = executor.submit(_count_pdf_pages, data, time.perf_counter())
    pageCount = task.result()
    return pageCount


def _count_pdf_pages(data, startTime):
    startTime2 = time.perf_counter()
    print('submit time: ', 1000*(startTime2 - startTime))
    with Document(stream=data, filetype='pdf') as doc:
        pageCount = doc.page_count
    print('open time: ', 1000 * (time.perf_counter() - startTime2))
    return pageCount
