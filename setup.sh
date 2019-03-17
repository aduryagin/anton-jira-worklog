#!/bin/bash

docker build --no-cache -t anton-jira-worklog .
docker rmi $(docker images -qa -f 'dangling=true')
docker-compose up -d