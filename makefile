
node_path := $(shell npm root -g)

es := $(wildcard js/*.es js/**/*.es)
js := $(es:%.es=%.js)

index.js: vendor/vitaminp.js $(wildcard vendor/*.js) $(js)
	python3 bundle.py $^ > $@

vendor/vitaminp.js: src/*.js
	python3 bundle.py -e index $^ > $@

%.js: %.es
	NODE_PATH=$(node_path) babel --presets env $< -o $@

clean:
	rm -f $(js) index.js

.PHONY: clean
