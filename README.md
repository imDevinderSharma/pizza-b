# Pizza Host Backend

This is the backend server for the Pizza Host application, providing API endpoints for pizza ordering and menu management.

## Deployment

The API is deployed and accessible at: https://pizzahost-backend.vercel.app/

## Features

- RESTful API for pizza menu management
- Order processing and tracking
- Email notifications for order confirmation
- MongoDB database integration

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/imDevinderSharma/pizzahost-backend.git
```

2. Install dependencies
```
cd pizzahost-backend
npm install
```

3. Set up environment variables by creating a `.env` file
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizzahost
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

4. Start the server
```
npm run dev
```

## API Endpoints

All endpoints are available at the base URL: https://pizzahost-backend.vercel.app/api

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order

## Technologies Used

- Express.js
- MongoDB/Mongoose
- Nodemailer
- Cors 