
NODE 	?= node
UNAME ?= $(shell uname)
CWD   ?= $(shell pwd)

ifneq ($(USER),root)
	SUDO = "sudo"
endif

.PHONY: dev install install_dfmt

dev:
	$(NODE) --inspect=0.0.0.0:9226 main_fmt.js

install_dfmt: install
	@if [ $(UNAME) == "Linux" ]; then \
		cp dfmt.service /lib/systemd/system; \
		$(SUDO) systemctl enable dfmt; \
		$(SUDO) systemctl daemon-reload; \
	fi

install:
	npm install --unsafe-perm
	$(SUDO) npm i -g --unsafe-perm