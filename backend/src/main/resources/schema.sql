CREATE TABLE users (
                       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email           VARCHAR(255) NOT NULL UNIQUE,
                       password_hash   VARCHAR(255) NOT NULL,
                       full_name       VARCHAR(255) NOT NULL,
                       phone           VARCHAR(50),
                       role            VARCHAR(20) NOT NULL
                           CHECK (role IN ('AGENCY', 'CREATOR', 'ADMIN')),
                       created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users (role);

CREATE TABLE wallets (
                         id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         user_id         UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
                         currency_code   CHAR(3) NOT NULL,
                         balance         NUMERIC(19, 4) NOT NULL DEFAULT 0
                             CHECK (balance >= 0),
                         created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                         updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                         CONSTRAINT uq_wallet_user_currency UNIQUE (user_id, currency_code)
);

CREATE INDEX idx_wallets_user ON wallets (user_id);

CREATE TABLE payment_events (
                                id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                invoice_id              UUID NOT NULL REFERENCES invoices (id) ON DELETE RESTRICT,
                                event_type              VARCHAR(40) NOT NULL
                                    CHECK (event_type IN (
                                                          'CHECKOUT_INIT',
                                                          'WEBHOOK_RECEIVED',
                                                          'VERIFIED',
                                                          'DUPLICATE',
                                                          'FAILED'
                                        )),
                                transaction_reference   VARCHAR(100),
                                payaza_reference        VARCHAR(100),
                                amount_received         NUMERIC(19, 4),
                                currency_code           CHAR(3),
                                detail                  TEXT,          -- short summary, not full secrets
                                created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_events_invoice ON payment_events (invoice_id);
CREATE INDEX idx_payment_events_ref ON payment_events (transaction_reference);

CREATE TABLE accounts (
                          id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          code            VARCHAR(64) NOT NULL UNIQUE,  -- CASH_CLEARING, AGENCY_{id}, ...
                          name            VARCHAR(255) NOT NULL,
                          account_type    VARCHAR(20) NOT NULL
                              CHECK (account_type IN ('ASSET', 'LIABILITY', 'REVENUE')),
                          owner_user_id   UUID REFERENCES users (id),
                          currency_code   CHAR(3) NOT NULL,
                          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_entries (
                                id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                invoice_id              UUID NOT NULL REFERENCES invoices (id),
                                account_id              UUID NOT NULL REFERENCES accounts (id),
                                entry_type              VARCHAR(6) NOT NULL
                                    CHECK (entry_type IN ('DEBIT', 'CREDIT')),
                                amount                  NUMERIC(19, 4) NOT NULL CHECK (amount > 0),
                                currency_code           CHAR(3) NOT NULL,
                                description             VARCHAR(255) NOT NULL,
                                transaction_reference   VARCHAR(100),
                                created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_invoice ON ledger_entries (invoice_id);

CREATE TABLE IF NOT EXISTS invoices (
                                        id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        agency_id               UUID NULL,
                                        creator_id              UUID NULL,
                                        client_name             VARCHAR(255) NOT NULL,
                                        client_email            VARCHAR(255) NOT NULL,
                                        client_phone            VARCHAR(50),
                                        amount                  NUMERIC(19, 4) NOT NULL CHECK (amount > 0),
                                        currency_code           CHAR(3) NOT NULL,
                                        creator_share_percent   NUMERIC(5, 2) NOT NULL,
                                        agency_share_percent    NUMERIC(5, 2) NOT NULL,
                                        platform_share_percent  NUMERIC(5, 2) NOT NULL,
                                        status                  VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                                            CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
                                        transaction_reference   VARCHAR(100) UNIQUE,
                                        payaza_reference        VARCHAR(100),
                                        created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                        paid_at                 TIMESTAMPTZ,
                                        CONSTRAINT chk_shares_sum_100 CHECK (
                                            creator_share_percent + agency_share_percent + platform_share_percent = 100
                                            )
);

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);