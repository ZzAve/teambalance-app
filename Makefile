.PHONY: *

# The first command will be invoked with `make` only and should be `build`
build: ## Build everything (autoformat)
	./gradlew :api:detekt --auto-correct || ./gradlew :api:detekt --auto-correct
	./gradlew build -x test
	cd app && npm i && npm run lint -- --fix && npm run build

#	 This outputs any command in the Makefile. With a short description taken from a ## prefixed command after the command (preferred) or the line above
#	 ## build the project
#	 build:
#    	<build command>
#
#    yolo: ## quick build of the project - with as little validation as possible
#    	<yolo command>
#
help: ## Show this help

	@echo "Usage: make <command>"; \
	echo ""; \
	desc=""; \
	while IFS= read -r line; do \
		case "$$line" in \
			'## '*)              desc="$${line#\#\# }" ;; \
			[a-zA-Z_-]*:*'## '*) printf '\033[36m%-20s\033[0m %s\n' "$${line%%:*}" "$${line#*\#\# }"; desc="" ;; \
			[a-zA-Z_-]*:*)       printf '\033[36m%-20s\033[0m %s\n' "$${line%%:*}" "$$desc"; desc="" ;; \
			*)                   desc="" ;; \
		esac; \
	done < $(MAKEFILE_LIST) | sort

ci:  ## Run a build in CI
	./gradlew build -x test
	cd app && npm ci && npm run build

# --- Infrastructure ---

db: ## Start PostgreSQL only
	docker compose up -d postgres

infra: ## Start all local infrastructure (PostgreSQL)
	docker compose up -d

infra-down: ## Stop local infrastructure
	docker compose down -v

# --- Run ---

api: ## Run the backend API
	./gradlew :api:bootRun --args='--spring.profiles.active=dev'

app: ## Run the frontend dev server
	cd app && npm run dev

run-local: infra ## Start infra + backend + frontend (backend in background)
	trap 'kill 0' EXIT; \
	$(MAKE) api & \
	$(MAKE) app & \
	wait

# --- Test & Lint ---

test: test-api test-app ## Run all tests

test-api: ## Run backend tests only
	./gradlew :api:test

test-app: ## Run frontend tests only
	./gradlew :api:wirespec-typescript
	cd app && npm test

e2e: ## Run real full-stack e2e (infra + backend e2e profile + Playwright)
	./scripts/e2e.sh

lint: ## Lint everything
	./gradlew :api:detekt
	cd app && npm run lint

format: ## Auto-format code
	./gradlew :api:detekt --auto-correct || ./gradlew :api:detekt --auto-correct
	cd app && ./node_modules/.bin/eslint . --fix

hooks: ## Install git hooks (pre-commit: lint, pre-push: test)
	git config core.hooksPath .githooks

# --- Code generation ---

www: ## Build the landing page (Dutch at /, English at /en/) into www/dist
	node www/build.mjs

wirespec: ## Generate code from Wirespec definitions
	./gradlew :api:wirespec-kotlin
	./gradlew :api:wirespec-typescript

# --- Demo image (ADR-0043) ---

demo-image: ## Build the demo image: the SPA in demo mode, then the `demo` Docker target
	./gradlew :api:wirespec-typescript
	cd app && npx @tanstack/router-cli generate && npx tsc -b \
		&& VITE_API_URL= VITE_XSRF_COOKIE=DEMO-XSRF-TOKEN VITE_DEMO=true VITE_NO_PASSKEYS=true npx vite build --outDir dist-demo
	docker build -f api/Dockerfile --target demo -t teambalance-demo .

demo-run: ## Run the demo image on http://localhost:8080/demo (plain http, so the session cookie is not Secure)
	docker run --rm -p 8080:8080 \
		-e SERVER_SERVLET_SESSION_COOKIE_SECURE=false \
		-e INVITATION_TOKEN_SALT=local-demo-salt \
		-e INVITATION_TOKEN_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
		-e TEAMBALANCE_CALENDAR_LINK_SALT=local-demo-salt \
		-e TEAMBALANCE_CALENDAR_LINK_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
		-e TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
		teambalance-demo

# --- Shortcuts ---
yolo: ## Fast build, skip tests and linting
	./gradlew build -x test -x detekt
	cd app && npm i && npm run yolo

clean: infra-down ## Clean build artifacts
	./gradlew clean
	cd app && rm -rf dist node_modules
