
CONTAINER_NAME="dev_docker_container"

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Container $CONTAINER_NAME exists. Removing..."
    # Stop and remove the container
    docker rm -f $CONTAINER_NAME
    echo "Container $CONTAINER_NAME removed."
else
    echo "Container $CONTAINER_NAME does not exist. No need to remove."
fi

docker run \
    -v $(pwd):/backend \
    -v ${HOME}/.config/gcloud:/root/.config/gcloud \
    --entrypoint=/bin/bash \
    --name $CONTAINER_NAME \
    -d --network host \
    -it backend \