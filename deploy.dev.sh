#!/bin/sh

echo 'Deploying to dev environment'
docker service create --replicas 1 --constraint 'node.labels.deploy-env == dev' --publish 9000:80 --name sample-with-tests my-registry:8082/sample-with-tests
