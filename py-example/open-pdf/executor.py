import os
from concurrent.futures import ProcessPoolExecutor

executorWorkerNumber = max((os.cpu_count() or 1) - 1, 1)  # type: ignore
executor = ProcessPoolExecutor(executorWorkerNumber)
