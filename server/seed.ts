import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

const dbClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
);

const activities = [
    { type: "Running", duration: 30, caloriesBurned: 300, description: "Morning run", date: new Date().toISOString(), userId: 1 },
    { type: "Cycling", duration: 45, caloriesBurned: 400, description: "Evening cycling", date: new Date().toISOString(), userId: 1 },
    { type: "Swimming", duration: 60, caloriesBurned: 500, description: "Pool laps", date: new Date().toISOString(), userId: 1 },
    { type: "Yoga", duration: 45, caloriesBurned: 200, description: "Hatha yoga", date: new Date().toISOString(), userId: 1 },
    { type: "Strength Training", duration: 45, caloriesBurned: 250, description: "Upper body", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 60, caloriesBurned: 150, description: "Evening walk", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 20, caloriesBurned: 200, description: "Quick run", date: new Date().toISOString(), userId: 1 },
    { type: "Cycling", duration: 30, caloriesBurned: 250, description: "Quick ride", date: new Date().toISOString(), userId: 1 },
    { type: "Yoga", duration: 30, caloriesBurned: 150, description: "Morning stretch", date: new Date().toISOString(), userId: 1 },
    { type: "Swimming", duration: 30, caloriesBurned: 300, description: "Quick swim", date: new Date().toISOString(), userId: 1 },
    { type: "Strength Training", duration: 60, caloriesBurned: 350, description: "Lower body", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 30, caloriesBurned: 100, description: "Morning walk", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 45, caloriesBurned: 450, description: "Long run", date: new Date().toISOString(), userId: 1 },
    { type: "Cycling", duration: 60, caloriesBurned: 550, description: "Long ride", date: new Date().toISOString(), userId: 1 },
    { type: "Yoga", duration: 60, caloriesBurned: 250, description: "Vinyasa flow", date: new Date().toISOString(), userId: 1 },
    { type: "Swimming", duration: 45, caloriesBurned: 400, description: "Endurance swim", date: new Date().toISOString(), userId: 1 },
    { type: "Strength Training", duration: 30, caloriesBurned: 150, description: "Core workout", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 45, caloriesBurned: 120, description: "Brisk walk", date: new Date().toISOString(), userId: 1 },
    { type: "Running", duration: 15, caloriesBurned: 150, description: "Sprint session", date: new Date().toISOString(), userId: 1 },
    { type: "Cycling", duration: 20, caloriesBurned: 180, description: "Sprint ride", date: new Date().toISOString(), userId: 1 },
];

async function seed() {
    console.log("Seeding data...");
    const { data, error } = await dbClient.from("UserActivity").insert(activities);
    if (error) {
        console.error("Error seeding data:", error);
    } else {
        console.log("Data seeded successfully!", data);
    }
}

seed();
