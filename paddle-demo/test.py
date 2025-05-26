import asyncio

async def coroutine1():
    await asyncio.sleep(2)
    print('coroutine1')
    return 'coroutine1 complete'

async def coroutine2():
    await asyncio.sleep(1)
    print('coroutine2')
    return 'coroutine2 complete'

async def main():
    task1 = asyncio.create_task(coroutine1())
    task2 = asyncio.create_task(coroutine2())

    print(await task1)
    print(await task2)

asyncio.run(main())
task = asyncio.create_task(coroutine1())
