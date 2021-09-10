import csv
import json
import pathlib
import multiprocessing

# import sys
# import traceback


def main(filePaths):
    with multiprocessing.Pool(len(filePaths)) as pool:
        pool.map(process, filePaths)
        pool.close()
        pool.join()

def process(filePath):
    filePath = pathlib.Path(filePath)
    basename = filePath.name

    with open(pathlib.Path(filePath), encoding='utf8', newline='') as readerFile:
        csv.field_size_limit(1 << 30)
        csvReader = csv.DictReader(readerFile, dialect='excel-tab', restval='')
        fieldnames = csvReader.fieldnames[:]
        qwContent = 'qwContent'
        fieldnames[2] = qwContent

        with open(pathlib.Path('processed/' + str(basename)), 'w', encoding='utf8',newline='') as writerFile:            
            csvWriter = csv.DictWriter(writerFile, fieldnames, restval='', extrasaction='ignore', delimiter='\t', lineterminator='\n', quoting=csv.QUOTE_ALL)
            csvWriter.writeheader()
            count = 0
            errorline = 0
            for o in csvReader:
                try:
                    count += 1
                    courtInfo = json.loads(o.get('CourtInfo', '{}'))
                    o[qwContent] = json.dumps(courtInfo.get(qwContent, ''), ensure_ascii=False)
                    csvWriter.writerow(o)
                except Exception as e:
                    errorline += 1
                    continue
                    # print(f'error => {basename}')
                    # print(o['CourtInfo'])
                    # print(traceback.print_exc())
                    # print(f'{basename} : count => {count} : errorline => {errorline}')
                    # raise e
    print(f'{basename} : count => {count} : errorline => {errorline}')
    with open('result.log', 'w+', encoding='utf8', buffering=1) as logFile:
        logFile.write(f'{basename} : count => {count} : errorline => {errorline}')

    return basename


if __name__ == '__main__':
    files = [
        '2019/wenshu_new.txt',
        '2019/wenshu_new_1000000.txt',
        '2019/wenshu_new_2000000.txt',
        '2019/wenshu_new_3000000.txt',
        '2019/wenshu_new_4000000.txt',
        '2019/wenshu_new_5000000.txt',
        '2019/wenshu_new_6000000.txt',
        '2019/wenshu_new_7000000.txt',
        '2019/wenshu_new_8000000.txt',
        '2019/wenshu_new_9000000.txt',
        '2019/wenshu_new_10000000.txt',
        '2019/wenshu_new_10492207.txt',
        '2019/wenshu_new_11136681.txt',
        '2019/wenshu_new_12136681.txt',
        '2019/wenshu_new_13136681.txt',
        '2020/2020_100.txt',
        '2020/2020_200.txt',
        '2020/courtinfo2020_1.txt',
        '2020/wemshu2020_700.txt',
        '2020/wenshu2020_50.txt',
        '2020/wenshu2020_300.txt',
        '2020/wenshu2020_400.txt',
        '2020/wenshu2020_500.txt',
        '2020/wenshu2020_600.txt',
        '2020/wenshu2020_800.txt',
        '2020/wenshu2020_920.txt'
    ]

    main(filePaths=files)
    # process('2019/wenshu_new_10492207.txt')