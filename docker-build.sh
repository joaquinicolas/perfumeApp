#!/bin/bash
ID=$(docker build . | grep 'Successfully built' | cut -f 3 -d ' ')
docker run -v "$(pwd)"/out:/app/out $ID
