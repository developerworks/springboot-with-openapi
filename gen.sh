#!/bin/bash

# Format java code after code generated
# export JAVA_POST_PROCESS_FILE="/Users/zhouyou/wasi-sdk-16.0/bin/clang-format -i --style=file"

# Generate code by OpenAPI spec
# openapi-generator generate --enable-post-process-file -i openapi.yaml -g spring -o spring-server -c ./config.yaml

# openapi-generator generate -g protobuf-schema -i openapi.yaml -o protobuf-schema

openapi-generator generate -c ./openapi-config.yaml --global-property debugModels=true


# Fix the issue temporarily: https://github.com/OpenAPITools/openapi-generator/issues/14077
# References: 
# - https://stackoverflow.com/a/7573438
sed -i '' \
    's/org\.springdoc\.api\.annotations\.ParameterObject/org\.springdoc\.core\.annotations\.ParameterObject/g' \
    ./spring-server/src/main/java/com/demo/**/*.java
