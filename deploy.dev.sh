#!/bin/sh

imgName='sample-with-tests'
echo 'Deploying to dev environment'
if docker service inspect $imgName ; then
  echo 'Service already exists, updating'
  docker service update --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) $imgName
else
  echo 'Service does not already exist, creating'
  docker service create --with-registry-auth --replicas 1 --constraint 'node.labels.deploy-env == dev' --publish 9000:80 --name $imgName my-registry:8082/$imgName
fi
