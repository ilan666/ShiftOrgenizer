from models import db, CalendarEntry, Shift

class CalendarService:
    def create_or_get_entry(self, date):
        entry = CalendarEntry.query.filter_by(date=date).first()
        if not entry:
            entry = CalendarEntry(date=date)
            db.session.add(entry)
            db.session.commit()
        return entry

    def assign_shift(self, user_id, date, shift_details):
        entry = self.create_or_get_entry(date)
        shift = Shift(user_id=user_id, calendar_entry_id=entry.id, shift_details=shift_details)
        db.session.add(shift)
        db.session.commit()