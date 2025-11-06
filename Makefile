install:
	npm ci

build:
	rm -rf frontend/dist
	npm run build

start:
	npm start

dev:
	npm run develop

preview:
	npm run preview

test-server:
	cd frontend && npx serve -s ./dist -p 5000