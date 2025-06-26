-- Migration number: 0001 	 2025-06-03T19:24:56.643Z
-- Cloudflare D1 (SQLite) Schema Migration
-- Run this with: wrangler d1 migrations create your-database-name initial-schema

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'END_USER' CHECK (role IN ('GLOBAL_ADMIN', 'GLOBAL_SUPPORT', 'PROVIDER_ADMIN', 'PROVIDER_SUPPORT', 'SUPPLIER_ADMIN', 'SUPPLIER_SUPPORT', 'CLIENT_ADMIN', 'CLINET_SUPPORT', 'END_USER')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    title TEXT NOT NULL,
    content TEXT,
    published INTEGER DEFAULT 0 CHECK (published IN (0, 1)),
    author_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Events table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT,
    imageUrl TEXT NOT NULL,
    price REAL NOT NULL,
    sku TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_items_sku ON items(sku);

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_events_updated_at 
    AFTER UPDATE ON events
    FOR EACH ROW
    BEGIN
        UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_items_updated_at 
    AFTER UPDATE ON items
    FOR EACH ROW
    BEGIN
        UPDATE items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;