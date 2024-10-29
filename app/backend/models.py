from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50))
    lastname = db.Column(db.String(50))
    username = db.Column(db.String(50), unique=True)
    phone = db.Column(db.Integer)
    password = db.Column(db.String(60))
    selectedShifts = db.Column(db.String(200))
    currentShifts = db.Column(db.String(200))
    color = db.Column(db.String(20))
    isAdmin = db.Column(db.Boolean, default=False, nullable=False)
    totalShifts = db.Column(db.Integer)
    totalSwitchRequests = db.Column(db.Integer)
    totalAcceptedSwitchRequests = db.Column(db.Integer)
    
class CalendarEntry(db.Model):
    __tablename__ = 'calendar_entries'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    shifts = db.relationship('Shift', backref='calendar_entry', lazy=True)
    
class Shift(db.Model):
    __tablename__ = 'shifts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    calendar_entry_id = db.Column(db.Integer, db.ForeignKey('calendar_entries.id'), nullable=False)
    shift_details = db.Column(db.String(200))