import time
import fitz

# pdf = fitz.Document('pdf/12.ZY-+PUC-WI-021+B0+社会与环境责任宣告书+2017.pdf')
# pdf = fitz.Document('/Users/luoxinzheng/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/5AA3C9CC2EEE1A436C4C8ED744626982/Caches/Files/2024-04/2eb362fe9beabc9d667b95bbe25bad45/文档对比1.pdf')
# pdf = fitz.Document('/Users/luoxinzheng/Library/Containers/com.tencent.WeWorkMac/Data/Documents/Profiles/5AA3C9CC2EEE1A436C4C8ED744626982/Caches/Files/2024-04/0b0b0ab4580d816bbf4065ec12307754/文档对比2.pdf')
pdf = fitz.Document('/Users/luoxinzheng/Desktop/文档对比1-2.pdf')

startTime = time.perf_counter()
for page in pdf:
    # text_page = page.get_textpage()  # type: ignore
    print('page start =======')
    result = page.get_text('rawdict') # type: ignore    print(result)

    # tableFinder = page.find_tables()  # type: ignore
    # for table in tableFinder.tables:
    #     print(table.cells)
    #     cells = [cell for row in table.extract() for cell in row if cell is not None]
    #     print(cells)
    #     print('cells count', len(table.cells))
    #     print('cells text count', len(cells))
    #     print('row count:', len(table.rows))
    #     print('col_count:', table.col_count)
    # # for word in page.get_text('blocks', sort=True):  # type: ignore
    # for word in text_page.extractBLOCKS():
    #     pass
    # # for word in page.get_text('blocks'):  # type: ignore
    # # for word in page.get_text('words'):  # type: ignore
    # for word in text_page.extractWORDS():
    #     pass
    #     # print(word)
    #     # for line in word[4].split('\n'):
    #     #     print(line)
    print('page end =========')
print(f"elapsed time: {time.perf_counter() - startTime}")
