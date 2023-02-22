from concurrent.futures import Future, ProcessPoolExecutor
from os import cpu_count
import pythoncom
from win32com.client import Dispatch, constants


def poolInitializer():
    print('process worker initialize')
    pythoncom.CoInitialize()
    global wApp
    wApp = Dispatch('Word.Application')
    wApp.Visible= False
    wApp.DisplayAlerts = False


pool = ProcessPoolExecutor(cpu_count(), initializer=poolInitializer)


def submitTask(inpath, outpath):
    ft: Future = pool.submit(convert2Pdf, inpath, outpath)
    return ft.result(60)


def convert2Pdf(inpath, outpath):
    print('convert start ...')
    print(f'inpath: {inpath}')
    print(f'outpath: {outpath}')
    # TODO 检查 wapp 是否正常
    global wApp
    while True:
        try:
            doc = wApp.Documents.Open(inpath, ReadOnly=1)
            doc.ExportAsFixedFormat(outpath, 17)
            doc.Close(0)
            break
        except:
            try:
                wApp.Quit(0)
            except:
                wApp = Dispatch('Word.Application')
                wApp.Visible= False
                wApp.DisplayAlerts = False
    return outpath
