CREATE TABLE IF NOT EXISTS app_credential (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    platform VARCHAR(64) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    redirect_uri VARCHAR(255) NOT NULL,
    CONSTRAINT unique_user_platform UNIQUE (username, platform)
);
