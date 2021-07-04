import logging
import discord
import asyncio

from discord.gateway import ReconnectWebSocket

logging.basicConfig(level=logging.DEBUG)
client = discord.Client()

async def main():
    x = await client.login('ODYxMTcxNjkwMTM4ODk0MzY3.YOF6og.kaiNv9cdw6cgKbGVbh0ub5XU7qE')
    print('>>>>>>>>>>>>>>>>>>>>>>>>>>')
    print(x)
    y = await client.connect(reconnect=True)
    print(y)

    await client.close()
    return True

# loop = asyncio.get_event_loop()
# loop.run_until_complete()
asyncio.run(main())
# print('LOGGED IN')
# loop.run_until_complete(client.close())
# print('DONE')