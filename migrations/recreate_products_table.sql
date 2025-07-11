-- Drop existing triggers and indexes
DROP TRIGGER IF EXISTS update_products_updated_at;
DROP INDEX IF EXISTS idx_products_sku;
DROP INDEX IF EXISTS idx_products_prodEid;

-- Create new products table with updated schema
CREATE TABLE products_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prodEid INTEGER NOT NULL,
    prName TEXT NOT NULL,
    description TEXT,
    colors TEXT,
    pics TEXT NOT NULL,
    prc REAL NOT NULL,
    spc TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert data from existing products table
-- Note: Adjust the SELECT columns to match what actually exists in your current products table
INSERT INTO products_new (
    prodEid, prName, description, colors, pics, prc, spc, created_at, updated_at
)
SELECT 
    prodEid, prName, description, colors, pics, prc, 
    'default_spc_value' as spc,  -- Replace with appropriate default value
    created_at, updated_at
FROM products;

-- Drop old table
DROP TABLE products;

-- Rename new table
ALTER TABLE products_new RENAME TO products;

-- Create indexes (only for columns that exist)
CREATE INDEX idx_products_prodEid ON products(prodEid);

-- Recreate trigger
CREATE TRIGGER update_products_updated_at 
    AFTER UPDATE ON products 
    FOR EACH ROW 
BEGIN 
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id; 
END;