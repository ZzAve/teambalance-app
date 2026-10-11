# ADR-0040: Money pool — a team Admin connects Bunq through OAuth; payments are held in memory only

- Status: Accepted
- Date: 2026-10-11
- Amends: [ADR-0007](0007-money-pool-v1-scope.md) (optional per team now means an Admin switch, and
  how a team gets its Bunq account connected)
- Relates to: [ADR-0005](0005-clean-start-no-data-migration.md) (Bunq is the source of truth),
  [ADR-0019](0019-self-service-team-onboarding.md) (self-service teams),
  [ADR-0024](0024-platform-admin-act-as.md) (a Platform Admin acting as a team is an Admin there)

## Context

The original PRD (#10) assumed the owner would configure each team's Bunq credentials by hand. Since
then teams are created self-service, so a back-office step per team would be the one manual step left
in onboarding. The old TeamBalance app used a personal Bunq API key. As far as we can establish, such a
key gives full access to the owner's Bunq account, including making payments, so asking a team's
treasurer to hand one over is a large trust request.

## Decision

- **A team Admin connects the team's Bunq account through Bunq's OAuth flow**, from the team's
  settings. The Admin signs in to Bunq and approves access; the app never sees a password or a
  personal API key. A Platform Admin acting as the team can do the same, because act-as grants Admin.
- **The platform has one Bunq OAuth client**, registered by the platform owner, with its id and secret
  as environment secrets. A separate client is registered against Bunq's sandbox for development and
  e2e.
- **After approving, the Admin picks one Bunq account**, and the Money Pool shows only that account. A
  grant can cover the Admin's personal accounts too; Members must never see those.
- **The connection belongs to the team, not to the Admin who made it.** It survives that Admin leaving
  or being demoted. Any Admin can disconnect, which deletes the stored secrets. When Bunq rejects the
  connection, Members see that the pool is unavailable and Admins are offered a reconnect.
- **The connection's secrets are stored in the tenant schema, encrypted with `TokenCipher`**: the
  OAuth access token, the key pair and installation token of Bunq's device registration, and the
  current session token. They have to be stored: Bunq allows one new session per 30 seconds, and the
  app runs on a container that scales to zero, so a session held only in memory would be lost on
  every cold start.
- **Bunq API calls go through the Wirespec-generated Bunq SDK** (`flock-community/bunq-sdk`) behind
  an outbound port, faked in tests. Gaps found in that SDK are raised as issues on that repository,
  not patched in this one. At the time of writing the SDK is on Wirespec 0.16 and Jackson 2, is not
  published, and always registers a new installation and device; upgrading, publishing, and restoring
  a saved session are prerequisites for the real adapter. Work behind the port does not wait on them.
- **Payments read from Bunq are held in memory only**, as in the old app. Balance and transactions
  are never written to the database. Bunq stays the record (ADR-0005).
- **The Money Pool is an Admin switch per team, on by default.** Off: no Money tab. On without a
  Bunq Connection: Members see a preview of the feature, Admins see how to connect.

## Considered options

- **Personal API key, configured by the Platform Admin.** Worked in the old app. Rejected: a full-access
  key held by a third party, and a manual step per team.
- **Hide the Money tab until a team connects** (the PRD). Rejected: Admins would have no way to find
  the feature.
- **Our own Bunq client in this repository.** Faster to start, since the SDK needs an upgrade first.
  Rejected: the SDK is the shared place for Bunq-over-Wirespec work, and a second client here would
  drift from it.
