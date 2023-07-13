#!/usr/bin/sh

clear;
sudo docker container rm -f $(sudo docker container ls -a) ;
sudo docker-compose up