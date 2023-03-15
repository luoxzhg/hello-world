from concurrent.futures import Future, ProcessPoolExecutor
from os import cpu_count, path
from time import sleep
from traceback import print_exc
import pythoncom
from win32com.client import Dispatch, constants

from flask import abort

WORD_ID = 'Word.Application'
EXCEL_ID = 'Excel.Application'
POWERPOINT_ID = 'PowerPoint.Application'

def _startupWord():
    app = Dispatch(WORD_ID)
    print(f'word app.Visible: {app.Visible}')
    app.Visible= False        #
    app.DisplayAlerts = 0  # wdAlertsNone
    return app

def _startupExcel():
    app = Dispatch(EXCEL_ID)
    print(f'excel Visible {app.Visible}')
    if app.Visible:
        app.Visible = False
    app.DisplayAlerts = False
    return app

def _startupPowerPoint():
    app = Dispatch(POWERPOINT_ID)
    print(f'powerpoint Visible {app.Visible}')
    # if app.Visible:
    #     app.visible = 0    # msoFalse
    app.DisplayAlerts = 1  # ppAlertsNone
    return app

STARTUP_APP = {
    WORD_ID: _startupWord,
    EXCEL_ID: _startupExcel,
    POWERPOINT_ID: _startupPowerPoint
}

def _convertWord(app, inpath, outpath):
    # 命名参数为什么不生效？
    doc = app.Documents.Open(inpath, False, True, False, 'nopassword' )
    doc.ExportAsFixedFormat(outpath, 17)
    doc.Close(0)

def _convertExcel(app, inpath, outpath):
    workbook = app.Workbooks.Open(inpath, 0, 1, 2, 'nopassword')
    workbook.ExportAsFixedFormat(0, outpath)
    workbook.Close()

def _convertPowerPoint(app, inpath, outpath):
    ppt = app.Presentations.Open(f'{inpath}::nopassword::', 1, 0, WithWindow=0)
    ppt.ExportAsFixedFormat(outpath, 2, PrintRange=None)
    ppt.Close()

convertFuncs = {
    WORD_ID: _convertWord,
    EXCEL_ID: _convertExcel,
    POWERPOINT_ID: _convertPowerPoint
}

appIds = {
    '.doc': WORD_ID,
    '.docx': WORD_ID,
    '.ppt': POWERPOINT_ID,
    '.pptx': POWERPOINT_ID,
    '.xls': EXCEL_ID,
    '.xlsx': EXCEL_ID,
}

def poolInitializer():
    print('process worker initialize')
    pythoncom.CoInitialize()
    global apps
    apps = {}

pool = ProcessPoolExecutor(cpu_count(), initializer=poolInitializer)


def submitTask(inpath, outpath):
    ft: Future = pool.submit(convert2Pdf, inpath, outpath)
    return ft.result(60)


def convert2Pdf(inpath, outpath):
    print('convert start ...')
    print(f'inpath: {inpath}')
    extName = path.splitext(inpath)[1].lower()
    appId = appIds.get(extName)
    if not appId:
        print(f'不支持的文件格式：{inpath}')
        abort(400)
    # TODO 检查 wapp 是否正常
    global apps
    n = 5
    while n > 0:
        n -= 1
        try:
            app = apps.get(appId)
            f = convertFuncs.get(appId)
            f(app, inpath, outpath)
            break
        except Exception as e:
            if getattr(e, 'hresult', 0) == -2147352567:
                raise InterruptedError('不支持加密文档')
            try:
                if app:
                    print_exc()
                    sleep(2)
                    app.Quit()
            except:
                print_exc()
            finally:
                apps[appId] =  STARTUP_APP.get(appId)()
    if n > 0:
        print(f'outpath: {outpath}')
        return outpath
    else:
        raise InterruptedError('转换失败')


def isProtected(file):
    prefix = file.readline()

    # 未加密 docx, xlsx, pptx
    if prefix.startswith(b'PK'):
        return False

    file.seek(0)
    # 加密的 docx, xlsx, pptx
    buf = file.read(1024 * 1024)
    if -1 != buf.find(b'E\x00n\x00c\x00r\x00y\x00p\x00t'):
        return True

    # # 加密的 doc xls ppt
    # flag = buf[0x208]
    # if flag in [0xfe, 0x13]:
    #     return True
    # print(f'0x208 => {flag}')

    # flag = buf[0x214]
    # if flag in [0x2f]:
    #     return True
    # print(f'0x214 => {flag}')

    return False
