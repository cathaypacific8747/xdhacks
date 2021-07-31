#!/bin/bash
gunicorn -c wsgi_config_production.py wsgi:app
