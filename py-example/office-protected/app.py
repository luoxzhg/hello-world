
import base64
import fitz
from hashlib import sha1
from os import mkdir, path
from traceback import print_exc
from uuid import uuid4

from flask import Flask, abort, request, send_file

from converter import submitTask, appIds, isProtected
app = Flask(__name__)

if not path.exists('./files'):
   mkdir('./files')

@app.route('/', methods=['GET', 'HEAD'])
def hello():
   return 'ok'

@app.route('/to-pdf', methods=['POST'])
def ConvertToPDF():
   file = request.files['file']
   print(f'file name {file.filename}')
   extName = path.splitext(file.filename)[1]
   if extName not in  appIds:
        msg = f'不支持的文件格式：{file.filename}'
        print(msg)
        abort(400, description=msg)

   if isProtected(file):
      print('不支持加密文档')
      abort(400, description='不支持加密文档')
   savePath = path.abspath('./files/' + str(uuid4()) + extName)
   file.seek(0)
   file.save(savePath)

   file.seek(0)
   hash = sha1(file.read()).digest().hex()
   pdfPath = path.abspath('./files/' + hash + '.pdf')

   try:
      outpath = submitTask(savePath, pdfPath)
      return send_file(outpath)
   except InterruptedError as e:
      if str(e) == '不支持加密文档':
         abort(400, description='不支持加密文档')
      print_exc()
      raise
      
@app.route('/to-images', methods=['POST'])
def ConvertToImages():
   file = request.files['file']
   zoom = int(request.form['zoom'])
   images = []
   pdf = fitz.Document(stream=file.stream.read(), filetype='pdf')
   for page in pdf:
      trans = fitz.Matrix(zoom, zoom)
      pix = page.get_pixmap(matrix=trans, alpha=False)
      images.append(base64.b64encode(pix.tobytes()).decode())

   return images

@app.route('/health-check', methods=['GET'])
def HealthCheck():
   return "Hello World!"


if __name__ == '__main__':
   app.run(host='0.0.0.0', port='38080', threaded=True)
