from concurrent.futures import Future, ProcessPoolExecutor
import os
from time import sleep

def doSomething():
   print('Do Something Start')
   sleep(10)
   print('Do Something End')


pool = ProcessPoolExecutor(os.cpu_count())

def callback(ft: Future):
   ft.result()
   print('Do Something Callback')


if __name__ == '__main__':
   fts = []
   n = 10
   while n > 0 :
      future = pool.submit(doSomething)
      future.add_done_callback(callback)
      fts.append(future)
      n -= 1
