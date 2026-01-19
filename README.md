# EcoLearn – Gamified Environmental Learning Platform

## Overview

EcoLearn is a full-stack, gamified environmental education web platform designed to move students beyond textbook learning into real-world sustainable action. The system combines interactive learning modules, quizzes, real-life eco-challenges, a reward system, and lightweight AR-based learning to promote behavioral change among school and college students.

The platform follows the core philosophy:
**Learn → Act → Earn**

Students first learn environmental concepts, then apply them through real-life eco-tasks, and finally earn points, badges, and recognition for their actions.

---

## Problem Statement

Environmental education in many Indian schools and colleges is mostly theoretical. Students learn concepts from textbooks but rarely connect them with real-world actions. As a result:

* Students lack motivation to practice eco-friendly habits.
* Learning does not translate into behavior change.
* Youth participation in local environmental efforts is low.

EcoLearn addresses this by providing an experiential, gamified learning platform aligned with SDGs and NEP 2020, focusing on practical actions, habit formation, and community impact.

---

## Core Objective

To build a gamified environmental education platform that:

* Teaches sustainability through interactive lessons.
* Encourages real-world eco-actions.
* Tracks learning and behavior.
* Rewards positive environmental habits.

---

## Key Features

### 1. User Authentication

* Student and Teacher/Eco-club coordinator roles.
* Secure login and signup system.
* User profile includes:

  * Name
  * Institution
  * Eco-points
  * Badges earned

---

### 2. Interactive Learning Modules

Students learn through short, visual, and easy-to-understand modules such as:

* Climate Change Basics
* Waste Management
* Water Conservation
* Renewable Energy

Each module includes:

* Content cards/slides
* Images and icons
* 2–5 quiz questions

Outcome:

* Knowledge gain
* Quiz scores stored in database

---

### 3. Gamified Quizzes

* Multiple choice questions
* Instant feedback
* Points awarded
* Progress indicators

---

### 4. Real-World Eco Challenges (Core Feature)

Students must complete real-life environmental tasks such as:

* Planting a tree and uploading a photo
* Waste segregation for 7 days
* Using reusable bottles
* Participating in cleanliness drives

Features:

* Challenge description and instructions
* Proof upload (image/text)
* Teacher approval system
* Eco-points awarded after verification

---

### 5. Eco-Points and Badges

* Points awarded for:

  * Lessons
  * Quizzes
  * Eco-challenges

Badges include:

* Green Beginner
* Eco Warrior
* Sustainability Champion

---

### 6. Leaderboard

* Ranks students by eco-points
* School-level and class-level views
* Encourages healthy competition

---

### 7. Teacher/Admin Dashboard

* View student progress
* Approve/reject challenge submissions
* Generate reports
* Organize eco-events

---

### 8. Awareness and Resources

* Government initiatives
* NGO collaborations
* SDG explanations
* Eco-tips for families

---

## Innovation and Uniqueness

Unlike most gamified learning platforms that reward only screen activity, EcoLearn focuses on real-world behavior.

### Unique Elements:

* Proof-based learning through photo/text uploads
* Habit-building through eco-streaks
* Local and school-level challenges
* Eco-currency concept instead of simple points
* AR-based learning using real-life objects

Differentiation Statement:
“Unlike existing platforms that gamify screen interactions, EcoLearn gamifies real-world environmental behavior using consequence-based learning, proof validation, and contextual AR learning.”

---

## AR Feature: “Scan & Learn”

EcoLearn includes a lightweight web-based AR module.

Students can:

* Open AR page
* Point camera at:

  * Tree
  * Dustbin
  * Water tap
* Get instant eco-information such as:

  * CO₂ absorption facts
  * Waste segregation tips
  * Water-saving reminders

Technology used:

* A-Frame
* AR.js
* HTML + JavaScript

This adds innovation without heavy 3D or VR complexity.

---

## System Architecture

Frontend (Web): React + Tailwind CSS

Backend: Python Flask (REST APIs)

Database: PostgreSQL / MySQL / SQLite

Mobile App: React Native (Expo)

AR: A-Frame + AR.js

Architecture Flow:
React Web App
|
| REST APIs
|
Flask Backend
|
Database
|
React Native App

One backend serves both web and mobile apps.

---

## Tech Stack Summary

### Website

* React
* Tailwind CSS
* Flask (Python)
* PostgreSQL
* JWT Authentication

### Mobile App

* React Native (Expo)
* Axios
* Expo Camera
* WebView (for AR.js)

### AR Module

* A-Frame
* AR.js

---

## Development Steps

1. Plan features and database structure
2. Build Flask backend with REST APIs
3. Implement authentication using JWT
4. Create learning modules and quiz APIs
5. Implement eco-challenges and proof upload
6. Add eco-points and badge logic
7. Build React frontend with Tailwind
8. Connect frontend to backend using Axios
9. Create admin dashboard
10. Add AR module
11. Build React Native app for camera and AR features
12. Testing with demo data

---

## Sample Demo Data

* 5 users
* 3 learning modules
* 5 quizzes
* 4 eco-challenges
* 3 badges

Used for presentation and testing.

---

## Expected Impact

* Improves student engagement
* Builds eco-friendly habits
* Encourages local action
* Supports NEP 2020 experiential learning
* Aligns with SDGs

---

## Viva/Presentation Description

EcoLearn is a gamified environmental education platform that combines interactive learning, real-world eco-actions, proof-based validation, and AR learning. Built using React, Flask, PostgreSQL, and React Native, the system promotes sustainable behavior through experiential learning aligned with NEP 2020 and SDG goals.

---

## Future Scope

* Mobile notifications for streaks
* Community challenges
* NGO collaboration
* Advanced analytics
* Multilingual support

---

## Conclusion

EcoLearn bridges the gap between knowledge and action. It transforms environmental education from theory into practice using gamification, real-world tasks, and contextual AR learning, empowering students to become responsible and active environmental citizens.

