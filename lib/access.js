// lib/access.js
export const allowedRoles = {
  premium: [
    "PREMIUM_USER",    // Legacy role
    "CLIENT_ADMIN",    // New premium role mapping
    "SUPPLIER_ADMIN",  // In case you want suppliers to have premium
    "PROVIDER_ADMIN",  // In case you want providers to have premium
  ],
  admin: [
    "CLIENT_ADMIN", 
    "SUPPLIER_ADMIN", 
    "PROVIDER_ADMIN", 
    "GLOBAL_ADMIN"
  ],
  standard: [
    "END_USER",
    "CLIENT_SUPPORT",
    "SUPPLIER_SUPPORT", 
    "PROVIDER_SUPPORT"
  ]
};

export function hasAccess(role, group = "premium") {
  return allowedRoles[group]?.includes(role) || false;
}