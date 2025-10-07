# 🚛 ELD Trip Planner

A professional Hours of Service (HOS) compliance application for commercial truck drivers, built with Django and React.

---

## ✨ Features

- ✅ **HOS Compliance**: 70-hour/8-day cycle tracking with automatic rest period calculation
- 🗺️ **Route Planning**: Global city coverage with interactive maps
- 📋 **Daily Log Sheets**: DOT-compliant logs with 24-hour timeline visualization
- 📊 **Export Options**: JSON, CSV, and print-ready formats
- 🌍 **Global Coverage**: Uganda, USA, and expanding city database

---

## 🚀 Quick Start

### Backend (Django)
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 🏗️ Tech Stack

**Backend**: Django 4.2.7 | Django REST Framework | SQLite  
**Frontend**: React 19.2.0 | Styled Components | Leaflet Maps  
**Deployment**: Vercel (Frontend) | Railway (Backend)

---

## 📖 Usage

1. Enter trip details (current location, pickup, dropoff)
2. View calculated route with HOS-compliant stops
3. Review daily log sheets
4. Export logs in multiple formats

---

## 🌐 API Endpoint

```
POST /api/calculate-trip/
```

**Request**:
```json
{
  "current_location": "Entebbe",
  "pickup_location": "Kampala",
  "dropoff_location": "Jinja",
  "current_cycle_used": 0
}
```

---

Built with ❤️ for the trucking industry

