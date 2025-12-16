from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to knapsack problems
    knapsack_problems = db.relationship('KnapsackProblem', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary (exclude password)"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'


class KnapsackProblem(db.Model):
    """Knapsack problem model"""
    __tablename__ = 'knapsack_problems'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Problem definition stored as JSON
    items = db.Column(db.Text, nullable=False)  # JSON array of {id, weight, value}
    capacity = db.Column(db.Float, nullable=False)
    algorithm_type = db.Column(db.String(50), nullable=False)  # 'dp_01', 'greedy', 'fractional'
    
    # Solution stored as JSON
    solution = db.Column(db.Text, nullable=True)  # JSON with selected_items, total_weight, total_value, steps
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def set_items(self, items_list):
        """Store items as JSON string"""
        self.items = json.dumps(items_list)
    
    def get_items(self):
        """Retrieve items as Python list"""
        return json.loads(self.items) if self.items else []
    
    def set_solution(self, solution_dict):
        """Store solution as JSON string"""
        self.solution = json.dumps(solution_dict)
    
    def get_solution(self):
        """Retrieve solution as Python dict"""
        return json.loads(self.solution) if self.solution else None
    
    def to_dict(self):
        """Convert problem to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'items': self.get_items(),
            'capacity': self.capacity,
            'algorithm_type': self.algorithm_type,
            'solution': self.get_solution(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<KnapsackProblem {self.id} - {self.algorithm_type}>'

