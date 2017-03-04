#!/usr/bin/env bash

echo "stopping running application"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker stop anOrcInTheRoad'
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker rm anOrcInTheRoad'

echo "pulling latest version of the code"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull perichor/anorcintheroad:latest'

echo "starting the new version"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker run -it --rm -d --restart=always -e dbPassword="orcs" --name anOrcInTheRoad -p 80:3000 perichor/anorcintheroad:latest'

echo "success!"

exit 0