.PHONY: *

# The first command will be invoked with `make` only and should be `build`
build: ## Build everything
	./gradlew build
	cd app && npm i && npm run build

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

# --- Infrastructure ---

db: ## Start PostgreSQL only
	docker-compose up -d postgres

infra: ## Start all local infrastructure (PostgreSQL + Redis)
	docker-compose up -d

infra-down: ## Stop local infrastructure
	docker-compose down

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

www: ## Open the landing page
	open www/index.html

# --- Test & Lint ---

test: test-api test-app ## Run all tests

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
	cd app && npm i && npm run yolo

clean: ## Clean build artifacts
	./gradlew clean
	cd app && rm -rf dist node_modules

update: ## Check for dependency updates
	./gradlew dependencyUpdates
	cd app && npx npm-check-updates
