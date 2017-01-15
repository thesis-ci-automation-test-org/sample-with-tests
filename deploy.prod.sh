#!/bin/sh

echo 'Deploying to production environment!'
docker service create --replicas 1 --constraint 'node.labels.deploy-env == prod' --publish 9000:80 --name sample-with-tests my-registry:8082/sample-with-tests
