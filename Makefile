CI_BUILD_TAG ?= lagoon-ui
CORE_REPO=https://github.com/uselagoon/lagoon.git
# CORE_REPO = ../lagoon
CORE_TREEISH=api-defined-routes

# for the `stable` targets, images with these tags will be used
LAGOON_CORE_IMAGE_REPO=testlagoon
LAGOON_CORE_IMAGE_TAG=main

# callback url is the hostname for the ui when it starts up and is used in next auth for callbacks
CALLBACK_URL=http://172.17.0.1:3003

# these are passed through to the development api docker-compose stack to ensure they know to serve on the `172.17.0.1` address
GRAPHQL_API=http://172.17.0.1:3000/graphql
KEYCLOAK_FRONTEND_URL=http://172.17.0.1:8088/auth
AUTH_KEYCLOAK_SECRET=20580a56-6fbc-11ef-9a5b-3b4da292aa54
AUTH_KEYCLOAK_ISSUER=$(KEYCLOAK_FRONTEND_URL)/realms/lagoon

.PHONY: start-ui-dev-api
start-ui-dev-api: development-api
start-ui-dev-api: start-ui

.PHONY: start-ui-stable-api
start-ui-stable-api: development-stable-api
start-ui-stable-api: start-ui

.PHONY: start-ui
start-ui:
	export GRAPHQL_API=$(GRAPHQL_API) \
	&& export CALLBACK_URL=$(CALLBACK_URL) \
	&& export AUTH_KEYCLOAK_ISSUER=$(AUTH_KEYCLOAK_ISSUER) \
	&& export AUTH_KEYCLOAK_SECRET=$(AUTH_KEYCLOAK_SECRET) \
	&& docker compose -p $(CI_BUILD_TAG) --compatibility up -d ui

.PHONY: checkout-core
checkout-core:
	export COREDIR=$$(mktemp -d ./lagoon-core.XXX) \
		&& ln -sfn "$$COREDIR" lagoon-core.test.lagoon \
		&& git clone $(CORE_REPO) "$$COREDIR" \
		&& cd "$$COREDIR" \
		&& git checkout $(CORE_TREEISH)

.PHONY: development-api
development-api: checkout-core
	export GRAPHQL_API=$(GRAPHQL_API) \
	&& export AUTH_KEYCLOAK_ISSUER=$(AUTH_KEYCLOAK_ISSUER) \
	&& export KEYCLOAK_FRONTEND_URL=$(KEYCLOAK_FRONTEND_URL) \
	&& export AUTH_KEYCLOAK_SECRET=$(AUTH_KEYCLOAK_SECRET) \
	&& cd lagoon-core.test.lagoon \
	&& $(MAKE) build \
	&& COMPOSE_STACK_NAME=core-$(CI_BUILD_TAG) $(MAKE) compose-api-logs-development

.PHONY: development-stable-api
development-stable-api: checkout-core
	export GRAPHQL_API=$(GRAPHQL_API) \
	&& export AUTH_KEYCLOAK_ISSUER=$(AUTH_KEYCLOAK_ISSUER) \
	&& export KEYCLOAK_FRONTEND_URL=$(KEYCLOAK_FRONTEND_URL) \
	&& export AUTH_KEYCLOAK_SECRET=$(AUTH_KEYCLOAK_SECRET) \
	&& cd lagoon-core.test.lagoon \
	&& IMAGE_REPO=$(LAGOON_CORE_IMAGE_REPO) IMAGE_REPO_TAG=$(LAGOON_CORE_IMAGE_TAG) COMPOSE_STACK_NAME=core-$(CI_BUILD_TAG) docker compose -p core-$(CI_BUILD_TAG) pull \
	&& IMAGE_REPO=$(LAGOON_CORE_IMAGE_REPO) IMAGE_REPO_TAG=$(LAGOON_CORE_IMAGE_TAG) COMPOSE_STACK_NAME=core-$(CI_BUILD_TAG) $(MAKE) compose-api-logs-development

.PHONY: development-api-down
development-api-down:
	docker compose -p core-$(CI_BUILD_TAG) --compatibility down -v --remove-orphans

.PHONY: down
down: development-api-down
	docker compose -p $(CI_BUILD_TAG) --compatibility down -v --remove-orphans

.PHONY: clean
clean: down
	@for core in $$(ls -1 | grep lagoon-core | egrep -v "lagoon-core.test|$$(ls -l | grep -o "lagoon-core.test.lagoon.*" | awk '{print $$3}' | cut -c 3-)") ; do \
		echo removing core directory $$core ; \
		rm -rf $$core ; \
	done