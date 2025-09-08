-- premium accounts / organizations
CREATE TABLE premium_accounts (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  stripe_customer_id TEXT -- if you add payments later
);

-- memberships
CREATE TABLE memberships (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  user_id TEXT,
  membership_role TEXT, -- 'owner' | 'admin' | 'member'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES premium_accounts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- invites
CREATE TABLE invites (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  email TEXT,
  token TEXT,
  expires_at DATETIME,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES premium_accounts(id)
);
