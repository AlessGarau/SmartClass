#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <nom_du_dossier>"
  exit 1
fi

DIR_NAME="$1"

mkdir -p "$DIR_NAME/interface"

touch "$DIR_NAME/interface/IMapper.ts"
touch "$DIR_NAME/interface/IInteractor.ts"
touch "$DIR_NAME/interface/IRepository.ts"

touch "$DIR_NAME/Controller.ts"
touch "$DIR_NAME/Mapper.ts"
touch "$DIR_NAME/Interactor.ts"
touch "$DIR_NAME/Repository.ts"
touch "$DIR_NAME/message.ts"
touch "$DIR_NAME/Routes.ts"
touch "$DIR_NAME/validate.ts"

echo "Structure créée dans le dossier '$DIR_NAME'"
