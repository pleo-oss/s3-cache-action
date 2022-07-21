# Attempt to run in parallel
MAKEFLAGS += -j3

all: test build lint

build: README.md dist/restore/index.js dist/save/index.js
	./node_modules/.bin/prettier -w .

dist/%/index.js: %.ts utils.ts node_modules
	./node_modules/.bin/ncc build $< --out $(dir $@)

README.md: action.yml node_modules
	./node_modules/.bin/action-docs --update-readme --no-banner

test: node_modules
	./node_modules/.bin/jest

lint: node_modules
	./node_modules/.bin/prettier --check .

node_modules: package.json
	if ! test -d node_modules; then yarn install --frozen-lockfile; fi

.PHONY: all build test lint
