install:
	npm ci

build:
	rm -rf dist
	npm run build

start:
	npm start

dev:
	npm run dev

preview:
	npm run preview

test-server:
	npx serve -s ./dist -p 5000