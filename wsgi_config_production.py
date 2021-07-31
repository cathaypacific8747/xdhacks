bind = '127.0.0.1:8000'
backlog = 2048

workers = 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30 # 30s
keepalive = 2
spew = False # spews all python lines

errorlog = '-'
loglevel = 'warning'

certfile = 'keys/cert.pem'
keyfile = 'keys/key.pem'