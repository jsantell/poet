REPORTER = nyan
.PHONY : test
test:
	@mocha --reporter $(REPORTER)
