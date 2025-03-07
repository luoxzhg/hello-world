from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0', backend="redis://localhost",)

@app.task(queue='add')
def add(x, y):
    print(x, y)
    return x + y

@app.task(queue='minus')
def minus(x, y):
    return x - y
