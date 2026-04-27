-- Drop tables if they exist to make the script idempotent
DROP TABLE IF EXISTS "UserActions";
DROP TABLE IF EXISTS "UserActivity";
DROP TABLE IF EXISTS "User";

-- Drop types if they exist
DROP TYPE IF EXISTS "ActionType";
DROP TYPE IF EXISTS "ActivityType";
DROP TYPE IF EXISTS "UserRole";
DROP TYPE IF EXISTS "Gender";

-- Create Enums
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE "UserRole" AS ENUM ('ROLE_USER', 'ROLE_ADMIN');
CREATE TYPE "ActivityType" AS ENUM ('Running', 'Cycling', 'Swimming', 'Yoga', 'Strength Training');
CREATE TYPE "ActionType" AS ENUM ('Like', 'Comment');

-- Create User table
CREATE TABLE "User" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "height" NUMERIC NOT NULL,
    "weight" NUMERIC NOT NULL,
    "image" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ROLE_USER',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "isDefaultUser" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create UserActivity table
CREATE TABLE "UserActivity" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type" "ActivityType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "caloriesBurned" INTEGER NOT NULL,
    "date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create UserActions table
CREATE TABLE "UserActions" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "activityId" INTEGER NOT NULL REFERENCES "UserActivity"("id") ON DELETE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" "ActionType" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Index for preventing multiple likes from same user on same activity
CREATE UNIQUE INDEX "unique_like_per_user_activity"
ON "UserActions" ("activityId", "userId")
WHERE "type" = 'Like';