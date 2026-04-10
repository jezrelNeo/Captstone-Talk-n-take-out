# CoffeeMaster - Coffee & Pastry Ordering System

## Overview
CoffeeMaster is a modern, responsive web application for ordering coffee, beverages, pastries, and breads with voice command functionality. The system provides a seamless ordering experience with real-time cart management and receipt generation.

## Features
- **Voice Command Ordering**: Use speech recognition to add items by saying codes (e.g., "R1", "P2")
- **Multi-Category Menu**: Coffee, Non-Coffee Beverages, Pastries, and Breads
- **Real-time Cart Management**: Add, update, and remove items with live count updates
- **Search & Filter**: Find items by name or code with category filtering
- **Receipt Generation**: Professional receipts with print functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Item Codes
- **Coffee (R codes)**: R1-Americano, R2-Cappuccino, R3-Latte, R4-Mocha
- **Beverages (N codes)**: N1-Hot Chocolate, N2-Iced Tea, N3-Orange Juice, N4-Smoothie
- **Pastries (P codes)**: P1-Croissant, P2-Blueberry Muffin, P3-Chocolate Chip Cookie, P4-Danish Pastry
- **Breads (B codes)**: B1-Sourdough, B2-Whole Wheat, B3-Bagel, B4-Focaccia

## Pages Structure
- `index.html` - Homepage with menu and ordering
- `cart.html` - Cart management and checkout
- `receipt.html` - Order confirmation and receipt
- `login.html` - User authentication
- `signup.html` - User registration with form validation

## Technical Stack
- Frontend: React 18, TailwindCSS, Lucide Icons
- Voice Recognition: Web Speech API (webkitSpeechRecognition)
- Storage: LocalStorage for cart and order data
- Design: Modern coffee shop theme with warm brown color palette

## How to Use
1. Start at the login page (any credentials work for demo)
2. Browse menu items or use voice commands
3. Add items to cart by clicking or saying item codes
4. Review cart and proceed to checkout
5. View and print receipt

## Voice Commands
- Activate voice command button
- Say item codes clearly (e.g., "R1", "P2", "B3")
- Multiple codes can be spoken in sequence
- Confirmation toasts show successful additions

Created: September 2025