#!/bin/bash
sudo pkill node
sudo forever start -o out.log -e err.log ./bin/www
