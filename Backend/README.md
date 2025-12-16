# Flask Backend - Authentication System

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. MySQL Database Setup

1. Install MySQL if not already installed
2. Run the SQL setup script:
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   
   Or manually create the database:
   ```sql
   CREATE DATABASE knapsack;
   ```
   
   Then run the SQL file in MySQL:
   ```sql
   SOURCE database_setup.sql;
   ```

### 3. Environment Configuration

Create a `.env` file in the `Backend` directory with the following:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-in-production
FLASK_ENV=development

# MySQL Database Configuration
# Format: mysql+pymysql://username:password@host:port/database_name
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/knapsack

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server Configuration
HOST=127.0.0.1
PORT=5000
```

**Important:** Replace `your_password` with your MySQL root password (or create a dedicated MySQL user).

### 4. Initialize Database

The database tables will be created automatically when you run the Flask app. Alternatively, you can run:

```bash
python init_db.py
```

### 5. Run the Application

```bash
python run.py
```

The Flask backend will start on `http://127.0.0.1:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "full_name": "John Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "john@example.com", "password": "password123" }`

### Other Endpoints

- `GET /api/health` - Health check
- `GET /api/data` - Example data endpoint

## Database Schema

### Users Table

- `id` (Integer, Primary Key)
- `full_name` (String, Required)
- `email` (String, Unique, Required)
- `password_hash` (String, Required)
- `created_at` (DateTime)

