#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <nom_du_dossier>"
  exit 1
fi

DIR_NAME="$1"

mkdir -p "packages/server/src/feature/$DIR_NAME/interface"

touch "packages/server/src/feature/$DIR_NAME/interface/IMapper.ts"
touch "packages/server/src/feature/$DIR_NAME/interface/IInteractor.ts"
touch "packages/server/src/feature/$DIR_NAME/interface/IRepository.ts"

touch "packages/server/src/feature/$DIR_NAME/Controller.ts"
touch "packages/server/src/feature/$DIR_NAME/Mapper.ts"
touch "packages/server/src/feature/$DIR_NAME/Interactor.ts"
touch "packages/server/src/feature/$DIR_NAME/Repository.ts"
touch "packages/server/src/feature/$DIR_NAME/message.ts"
touch "packages/server/src/feature/$DIR_NAME/Routes.ts"
touch "packages/server/src/feature/$DIR_NAME/validate.ts"

echo "Structure créée dans le dossier 'packages/server/src/feature/$DIR_NAME'"
