-- Passkeys (ADR-0045): one row per WebAuthn credential a person registered. Platform-wide, like users:
-- a passkey signs a person in, before any Team is chosen. Column set is Spring Security's CredentialRecord.
-- attestation_object is what authentication re-reads for the public key, so it is NOT NULL.
CREATE TABLE passkeys (
    credential_id                BYTEA PRIMARY KEY,
    user_id                      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_type              VARCHAR(32) NOT NULL,
    public_key                   BYTEA NOT NULL,
    signature_count              BIGINT NOT NULL,
    uv_initialized               BOOLEAN NOT NULL,
    backup_eligible              BOOLEAN NOT NULL,
    backup_state                 BOOLEAN NOT NULL,
    transports                   TEXT[] NOT NULL DEFAULT '{}',
    attestation_object           BYTEA NOT NULL,
    attestation_client_data_json BYTEA,
    label                        VARCHAR(100) NOT NULL,
    created_at                   TIMESTAMPTZ NOT NULL,
    last_used_at                 TIMESTAMPTZ
);
CREATE INDEX passkeys_user_id_idx ON passkeys (user_id);
