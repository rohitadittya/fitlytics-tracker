-- Insert Users
INSERT INTO "User" ("name", "email", "password", "age", "gender", "height", "weight", "image", "role", "createdAt", "updatedAt", "isDefaultUser")
VALUES
('John Doe', 'johndoe@fitlytics.com', '$2b$10$i/s7GZsqaam6VzapxF72meV8.2yE/GRCu48yMGaXjQAvZM8DMLJ3K', 30, 'Male', 180, 155, 'https://cdn.pixabay.com/photo/2025/06/20/10/47/dog-9670619_1280.jpg', 'ROLE_USER', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', true),
('Jane Smith', 'janesmith@fitlytics.com', '$2b$10$i/s7GZsqaam6VzapxF72meV8.2yE/GRCu48yMGaXjQAvZM8DMLJ3K', 25, 'Female', 165, 130, 'https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2JlYWdsZS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQwMH19fQ==', 'ROLE_USER', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', true),
('Rohit Adittya', 'rohitadittya@fitlytics.com', '$2b$10$i/s7GZsqaam6VzapxF72meV8.2yE/GRCu48yMGaXjQAvZM8DMLJ3K', 28, 'Male', 180, 145, 'https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/bernese-mountain-dog.jpg?crop=1.00xw:0.668xh;0,0.252xh&resize=640:*', 'ROLE_ADMIN', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', true),
('Emily Davis', 'emilydavis@fitlytics.com', '$2b$10$i/s7GZsqaam6VzapxF72meV8.2yE/GRCu48yMGaXjQAvZM8DMLJ3K', 26, 'Female', 168, 135, 'https://images.unsplash.com/photo-1611003228941-98852ba62227?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D', 'ROLE_USER', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z', true);

-- Insert User Activities
INSERT INTO "UserActivity" ("type", "duration", "caloriesBurned", "date", "description", "userId")
VALUES
('Running', 30, 300, '2024-01-01T00:00:00Z', 'Felt great during the run!', 1),
('Cycling', 45, 400, '2024-01-02T00:00:00Z', 'Enjoyed the ride in the park.', 2),
('Swimming', 60, 500, '2024-01-03T00:00:00Z', 'Great workout at the pool.', 3);

-- Insert User Actions (Comments & Likes)
INSERT INTO "UserActions" ("activityId", "userId", "type", "comment", "createdAt", "updatedAt")
VALUES
(1, 2, 'Like', NULL, '2024-01-01T01:00:00Z', '2024-01-01T01:00:00Z'),
(1, 3, 'Comment', 'Great pace!', '2024-01-01T02:00:00Z', '2024-01-01T02:00:00Z'),
(2, 1, 'Like', NULL, '2024-01-02T01:00:00Z', '2024-01-02T01:00:00Z'),
(3, 4, 'Comment', 'Awesome workout!', '2024-01-03T01:00:00Z', '2024-01-03T01:00:00Z');
