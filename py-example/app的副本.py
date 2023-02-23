
import base64
import fitz
from hashlib import sha1
from os import mkdir, path
from traceback import print_exc
from uuid import uuid4

from flask import Flask, abort, request, send_file

from converter import submitTask, appIds
app = Flask(__name__)

if not path.exists('./files'):
   mkdir('./files')

@app.route('/to-pdf', methods=['POST'])
def ConvertToPDF():
   file = request.files['file']
   print(f'file name {file.filename}')
   extName = path.splitext(file.filename)[1]
   if extName not in  appIds:
        print(f'不支持的文件格式：{file.filename}')
        abort(400)
   savePath = path.abspath('./files/' + str(uuid4()) + extName)
   file.save(savePath)

   file.seek(0)
   hash = sha1(file.read()).digest().hex()
   pdfPath = path.abspath('./files/' + hash + '.pdf')

   try:
      outpath = submitTask(savePath, pdfPath)
      return send_file(outpath)
   except:
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


if __name__ == '__main__':
   app.run(host='0.0.0.0', debug=True)
