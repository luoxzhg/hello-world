import asyncio
import contextvars
import time
varA = contextvars.ContextVar('a')
varA.set(0)

async def say_after(delay, what):
    await asyncio.sleep(delay)
    print(what)

async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(
            say_after(1, 'hello'))

        tg.create_task(
            say_after(2, 'world'))

        print(f"started at {time.strftime('%X')}")

    # The await is implicit when the context manager exits.

    print(f"finished at {time.strftime('%X')}")
    loop = asyncio.get_event_loop()
    print(loop.get_task_factory())
    async with asyncio.timeout(1):
        while True:
            await asyncio.sleep(0.1)

print('varA get in module', varA.get())
asyncio.run(main())
print('varA get after main runed', varA.get())
