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
check-tooling: ## Check the toolchain is present and the generated API client is current
	@./scripts/check-tooling.sh

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

infra: ## Start all local infrastructure (PostgreSQL + Redis)
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

www: ## Open the landing page
	open www/index.html

# --- Prototype (throwaway, delete with the branch) ---

prototype: infra ## Run the events-list lineup prototype (throwaway, `?variant=`)
	@echo ""
	@echo "  Lineup-panel prototype — a row per position, members as pips/pills."
	@echo "  Open any team's events page and add ?variant= :"
	@echo ""
	@echo "    http://localhost:5173/t/<your-slug>/?variant=A&demo=1   A · Pips"
	@echo "    http://localhost:5173/t/<your-slug>/?variant=B&demo=1   B · Pills"
	@echo "    http://localhost:5173/t/<your-slug>/?variant=C&demo=1   C · Lineup sheet"
	@echo "    http://localhost:5173/t/<your-slug>/                    today's panel"
	@echo ""
	@echo "  Or use the floating bar at the bottom / the arrow keys."
	@echo "  demo=1 swaps in an 18-person squad; its edits stay in memory."
	@echo "  Panels start collapsed — tap a card's readiness badge, or turn on"
	@echo "  'Keep panels open' in the view menu beside Filters."
	@echo ""
	trap 'kill 0' EXIT; \
	$(MAKE) api & \
	$(MAKE) app & \
	wait

prototype-panels: ## The three lineup variants side by side in Storybook (no backend)
	@echo "  Storybook → Prototype/Lineup panel (A · Pips, B · Pills, C · Lineup sheet)"
	cd app && npm run storybook

# --- Test & Lint ---

test: test-api test-app ## Run all tests

test-api: ## Run backend tests only
	./gradlew :api:test

test-app: ## Run frontend tests only
	cd app && npm test

e2e: ## Run real full-stack e2e (infra + backend e2e profile + Playwright)
	./scripts/e2e.sh

lint: ## Lint everything
	./gradlew :api:detekt
	cd app && npm run lint

format: ## Auto-format code
	./gradlew :api:detekt --auto-correct || ./gradlew :api:detekt --auto-correct
	cd app && ./node_modules/.bin/eslint . --fix

# --- Code generation ---

wirespec: ## Generate code from Wirespec definitions
	./gradlew :api:wirespec-kotlin
	./gradlew :api:wirespec-typescript
	@./scripts/wirespec-stamp.sh write

# --- Shortcuts ---
yolo: ## Fast build, skip tests and linting
	./gradlew build -x test -x detekt
	cd app && npm i && npm run yolo

clean: infra-down ## Clean build artifacts
	./gradlew clean
	cd app && rm -rf dist node_modules

update: ## Check for dependency updates
	./gradlew dependencyUpdates
	cd app && npx npm-check-updates
