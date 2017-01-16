#!/bin/sh

imgName='sample-with-tests'
echo 'Deploying to dev environment'
if docker service inspect $imgName ; then
  echo 'Service already exists, updating'
  docker service update --image my-registry:8082/$imgName:0.1.1 --container-label-add last_deployed=$(date -u +%Y-%m-%dT%H:%M:%S) $imgName-prod
else
  echo 'Service does not already exist, creating'
  docker service create --with-registry-auth --replicas 1 --constraint 'node.labels.deploy-env == prod' --publish 9001:80 --name $imgName-prod my-registry:8082/$imgName:0.1.1
fi
