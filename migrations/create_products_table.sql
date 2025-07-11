-- Drop existing items table and related objects
DROP TRIGGER IF EXISTS update_items_updated_at;
DROP INDEX IF EXISTS idx_items_sku;
DROP TABLE IF EXISTS items;

-- Create new products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prodEid INTEGER NOT NULL,
    prName TEXT NOT NULL,
    description TEXT,
    colors TEXT,
    pics TEXT NOT NULL,
    prc REAL NOT NULL,
    sku TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for the products table
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_prodEid ON products(prodEid);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_products_updated_at 
    AFTER UPDATE ON products
    FOR EACH ROW
    BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;