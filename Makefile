
NODE 	?= node
UNAME ?= $(shell uname)

ifneq ($(USER),root)
	SUDO = "sudo"
endif

.PHONY: dev install install_dfmt

dev:
	$(NODE) --inspect=0.0.0.0:9221 main_fmt.js

install_dfmt: install
	@if [ $(UNAME) == "Linux" ]; then \
		cp dfmt.service /lib/systemd/system; \
		$(SUDO) systemctl enable dfmt; \
		$(SUDO) systemctl daemon-reload; \
	fi

lc_link = if [ -d $1 ]; then \
	if [ -L $1 ]; then \
		rm node_modules/$(shell basename $1); \
	else \
		rm -rf node_modules/$(shell basename $1);\
	fi; \
	ln -s $1 node_modules/$(shell basename $1); \
fi

install:
	npm install --unsafe-perm
	$(SUDO) npm i -g --unsafe-perm
	@$(call lc_link,$(NGUI)/libs/nxkit)
