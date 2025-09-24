
-- Replace 'youremail@gmail.com' with your actual email address
UPDATE "User" 
SET 
  "isAdmin" = true,
  "planType" = 'ADMIN',
  "apiCallsLimit" = 999999,
  "planExpires" = NULL
WHERE "email" = 'youremail@gmail.com';

-- Check the result
SELECT "id", "email", "firstName", "lastName", "isAdmin", "planType", "apiCallsLimit" 
FROM "User" 
WHERE "email" = 'youremail@gmail.com';
