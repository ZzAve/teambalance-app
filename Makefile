.PHONY: *

# The first command will be invoked with `make` only and should be `build`
build: ## Build everything
	./gradlew build
	cd app && npm run build

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- Infrastructure ---

db: ## Start PostgreSQL only
	docker compose up -d postgres

infra: ## Start all local infrastructure (PostgreSQL + Redis)
	docker compose up -d

infra-down: ## Stop local infrastructure
	docker compose down

# --- Run ---

api: ## Run the backend API
	./gradlew :api:bootRun --args='--spring.profiles.active=dev'

app: ## Run the frontend dev server
	cd app && npm run dev

run-local: infra ## Start infra + backend + frontend (backend in background)
	$(MAKE) api &
	$(MAKE) app

www: ## Open the landing page
	open www/index.html

# --- Test & Lint ---

test: ## Run all tests
	./gradlew :api:test
	cd app && npm test

test-api: ## Run backend tests only
	./gradlew :api:test

test-app: ## Run frontend tests only
	cd app && npm test

lint: ## Lint everything
	./gradlew :api:detekt
	cd app && npm run lint

format: ## Auto-format code
	./gradlew :api:detekt --auto-correct
	cd app && npm run lint -- --fix

# --- Code generation ---

wirespec: ## Generate code from Wirespec definitions
	./gradlew :api:wirespec-kotlin
	./gradlew :api:wirespec-typescript

# --- Shortcuts ---

yolo: ## Fast build, skip tests and linting
	./gradlew build -x test -x detekt
	cd app && npm run build

clean: ## Clean build artifacts
	./gradlew clean
	cd app && rm -rf dist node_modules/.vite

update: ## Check for dependency updates
	./gradlew dependencyUpdates
	cd app && npx npm-check-updates
