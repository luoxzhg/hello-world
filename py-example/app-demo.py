import base64
from concurrent.futures import ProcessPoolExecutor
from hashlib import sha1
from os import cpu_count, mkdir, path
from time import sleep
from traceback import print_exc
from uuid import uuid4

import fitz
from flask import Flask, request

app = Flask(__name__)

if not path.exists('./files'):
   mkdir('./files')

def poolInitializer():
   print('process worker initialize')
   global app
   app = 'Word.Application'

pool = ProcessPoolExecutor(cpu_count(), initializer=poolInitializer)

def convert2Pdf(inpath, outpath):
   print('Do Something Start')
   print(f'use worker global app: {app}')
   print(f'inpath: {inpath}')
   print(f'outpath: {outpath}')
   sleep(10)
   print('Do Something End')
   return outpath


@app.route('/to-pdf', methods=['POST'])
def ConvertToPDF():
   file = request.files['file']
   savePath = './files/' + str(uuid4()) + path.splitext(file.filename)[1]
   file.save(savePath)

   file.seek(0)
   hash = sha1(file.read()).digest().hex()
   ft = pool.submit(convert2Pdf, savePath, './files/' + hash + '.pdf')

   try:
      outpath = ft.result(60)
      outpath
   except:
      print_exc()
      outpath = ''

   return outpath


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
   app.run(host='0.0.0.0')
