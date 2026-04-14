Talk’n’Takeout
Voice Recognition Food Ordering System

Overview
Talk’n’Takeout is a voice-enabled food ordering system that allows users to place orders using natural speech. It reduces manual input, shortens waiting time, and minimizes human error in restaurants and cafés.
The system provides a fast, contactless, and user-friendly ordering experience using modern web technologies.

Features
Voice recognition ordering (speech-to-text)
Dynamic menu display
Order confirmation system
Real-time order processing
Reporting and analytics
User authentication and security
Admin dashboard for menu and order management

Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	PHP
Database	MySQL
Voice API	Web Speech API
Server	XAMPP
System Architecture

This project follows a three-tier architecture:
Presentation Layer – User interface and voice input
Application Layer – Business logic (PHP)
Data Layer – Database (MySQL)

Project Structure
TalknTakeout/
│
├── index.php
├── order.php
├── payment.php
│
├── includes/
│   ├── config.php
│   ├── functions.php
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
└── database/
    ├── coffee_master.sql
    
Installation Guide
1. Clone the Repository
git clone https://github.com/your-username/talkntakeout.git
2. Move to XAMPP Directory

Place the folder inside:
htdocs/
3. Start Server
Open XAMPP
Start Apache and MySQL
4. Setup Database
Open phpMyAdmin
Create a database
Import:
coffee_master.sql
5. Run the Project

Open your browser and go to:
http://localhost/TalknTakeout

Performance Highlights
Ordering time reduced by approximately 40%
Voice recognition accuracy improved to 87%
User satisfaction reached 82%
Human error reduced by 65%

Limitations
Requires stable internet connection
Background noise may affect voice recognition
Limited to English language

Developers
Group: BINARY BISON
Jezrel John B. Tolentino
Patrick D. Lopez

License
This project is for academic purposes only.
