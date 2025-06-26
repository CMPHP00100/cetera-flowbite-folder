-- Create the new table with the updated schema
CREATE TABLE new_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert data from the original table into the new table
-- Only include columns that exist in the original table
INSERT INTO new_events (id, title)
SELECT id, title FROM events;

-- Drop the old table
DROP TABLE events;

-- Rename the new table to replace the old one
ALTER TABLE new_events RENAME TO events;
