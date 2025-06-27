start:
	npm start

install:
	npm ci

build:
	npm run build

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish --dry-run
