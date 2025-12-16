# Knapsack Problem Solver

A full-stack web application for solving knapsack problems with user authentication and solution history tracking.

## Project Structure

```
Knapsack/
├── Backend/          # Flask backend API
│   ├── app/         # Application modules
│   ├── config.py    # Configuration
│   ├── run.py       # Application entry point
│   └── requirements.txt
│
└── Frontend/         # React frontend
    ├── src/         # Source files
    ├── public/      # Static assets
    └── package.json
```

## Features

- **Knapsack Problem Solving**: Multiple algorithms (Dynamic Programming, Greedy, Branch and Bound)
- **User Authentication**: Secure registration and login system
- **Solution History**: Track and view past solutions
- **User Profile**: Manage user information

## Quick Start

### Backend Setup

See [Backend/README.md](Backend/README.md) for detailed backend setup instructions.

1. Navigate to Backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up MySQL database
4. Configure `.env` file
5. Run: `python run.py`

### Frontend Setup

See [Frontend/README.md](Frontend/README.md) for detailed frontend setup instructions.

1. Navigate to Frontend directory
2. Install dependencies: `npm install`
3. Run: `npm run dev`

## Technology Stack

- **Backend**: Flask, SQLAlchemy, MySQL, JWT Authentication
- **Frontend**: React, Vite, Tailwind CSS, Axios

## License

MIT

