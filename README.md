# Restaurant Management System

## Introduction
The **Restaurant Management System** is a robust web application designed to streamline restaurant operations. From managing orders, reservations, and menus to handling staff and seating arrangements, this system provides a comprehensive solution for restaurant owners and managers.

Built with the latest technologies, this application ensures performance, scalability, and a seamless user experience. The project leverages modern tools like Next.js, Redux Toolkit, and MongoDB/MySQL for efficient state management, dynamic routing, and robust data handling.

---

## Project Preview
![Application Screenshot](https://via.placeholder.com/800x400.png?text=Restaurant+Management+System)
> Replace the placeholder image URL with a screenshot of your application.

---

## Features
- **User Authentication**: Secure login and registration with JWT and bcrypt.js.
- **Table Management**:  Real-time reservation for table .
- **Order Management**: Real-time order tracking using Socket.io.
- **Menu Management**: Add, update, or remove menu items seamlessly.
- **Reservation System**: Handle table reservations efficiently.
- **Staff Management**: Manage staff roles, shifts, and permissions.
- **Analytics Dashboard**: Visualize key metrics using Recharts.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

---

## Dependencies
Below are the primary dependencies used in this project:

### Frontend
- **[@reduxjs/toolkit](https://redux-toolkit.js.org/)**: Efficient state management.
- **[axios](https://axios-http.com/)**: For API calls.
- **[lucide-react](https://lucide.dev/)**: Icons for the UI.
- **[next.js](https://nextjs.org/)**: Framework for server-side rendering and routing.
- **[react](https://reactjs.org/)**: Library for building user interfaces.
- **[react-redux](https://react-redux.js.org/)**: Binding React with Redux.
- **[react-select](https://react-select.com/)**: Dropdown component for dynamic selection.
- **[recharts](https://recharts.org/)**: For data visualization.
- **[redux-persist](https://github.com/rt2zz/redux-persist)**: Persistent state storage.
- **[socket.io-client](https://socket.io/)**: Real-time communication with the backend.

### Backend
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)**: Password hashing.
- **[cors](https://github.com/expressjs/cors)**: Cross-origin resource sharing.
- **[dotenv](https://github.com/motdotla/dotenv)**: Environment variable management.
- **[express](https://expressjs.com/)**: Backend server framework.
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**: Token-based authentication.
- **[mongoose](https://mongoosejs.com/)**: MongoDB object modeling.
- **[mysql2](https://github.com/sidorares/node-mysql2)**: MySQL database support.
- **[socket.io](https://socket.io/)**: Real-time event-based communication.

---

## Getting Started

### Installation
1. Clone the repository:
   ```bash
   https://github.com/rockeyrai/RestaurantV3
   ```

### Setup

1. Install  dependencies:
   ```bash
   cd server
   npm install express
   npm run dev
   ```
2. Configure environment variables in `.env` file for server:
   ```env
    MY_PORT=8000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD='*#$(req)405R@i'
    DB_NAME=restaurant3
    JWT_SECRET=9803520300dfadgfsa
    FRONTEND_URL=http://localhost:3000
    NODE_ENV=development
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

#### Frontend
1. Install frontend dependencies:
   ```bash
   cd client
   npm install next
   ```
2. Configure environment variables in `.env` file for client:
   ```bash
    NEXT_PUBLIC_FRONTEND_API=http://localhost:8000/
   ```
2. Run the frontend application:
   ```bash
   npm run dev
   ```

---

## Contribution
Feel free to fork the repository and submit pull requests for any enhancements or bug fixes.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact
For any inquiries or support, please contact:
- **Name**: Rockey Chamling Rai
- **Email**: [your-email@example.com](mailto:rockeyrai234@gamil.com)
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/rockey-rai-669310305/)
