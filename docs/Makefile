MARKDOWN=../node_modules/marked/bin/marked

all: generate

generate:
	node $(MARKDOWN) docs.md -o content.html
	cat header.html > public/index.html
	cat content.html >> public/index.html
	cat footer.html >> public/index.html
	rm content.html

.PHONY: generate
