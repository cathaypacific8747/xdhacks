bind = '0.0.0.0:5000'
backlog = 2048

workers = 1
worker_class = 'sync'
worker_connections = 1000
timeout = 600 # 5 mins
keepalive = 2
spew = False # spews all python lines

errorlog = '-'
loglevel = 'debug'
accesslog = '-'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

certfile = 'keys/cert.pem'
keyfile = 'keys/key.pem'