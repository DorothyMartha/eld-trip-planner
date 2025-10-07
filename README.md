# 🚛 ELD Trip Planner

A professional Hours of Service (HOS) compliance application for commercial truck drivers, built with Django and React.

![DOT Compliant](https://img.shields.io/badge/DOT-Compliant-green)
![Django](https://img.shields.io/badge/Django-4.2.7-blue)
![React](https://img.shields.io/badge/React-19.2.0-blue)

---

## ✨ Features

### 📋 **HOS Compliance**
- ✅ 70-hour/8-day cycle tracking
- ✅ 11-hour driving limit
- ✅ 14-hour duty window
- ✅ 10-hour minimum rest periods
- ✅ 30-minute break requirements
- ✅ Automatic rest period calculation

### 🗺️ **Route Planning**
- 🌍 Global city coverage (Uganda, USA, and more)
- 📍 Interactive map with custom markers
- 🛣️ Detailed route instructions
- ⛽ Automatic fuel stop calculation (every 1,000 miles)
- 📏 Accurate distance calculations

### 📊 **Daily Log Sheets**
- 📝 DOT-compliant log format
- ⏰ 24-hour timeline visualization
- 📈 Connected duty status lines
- 💾 Export as JSON/CSV
- 🖨️ Print-ready format
- 🔄 Multi-day trip support

### 🎨 **Modern UI/UX**
- 🌟 World-class design
- 🎯 Truck-branded icons
- ✨ Smooth animations
- 📱 Responsive layout
- 🎨 Glass morphism effects

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- Git

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/eld-trip-planner.git
cd eld-trip-planner
```

#### 2. Start Backend (Django)
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```
Backend will run at: `http://localhost:8000`

#### 3. Start Frontend (React)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will run at: `http://localhost:3000`

---

## 🌐 Live Demo

**Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)  
**Backend API**: [https://your-backend.up.railway.app/api](https://your-backend.up.railway.app/api)

---

## 📖 Usage

### Calculate a Trip

1. **Enter Trip Details**:
   - Current Location: `Entebbe`
   - Pickup Location: `Kampala`
   - Dropoff Location: `Jinja`
   - Current Cycle Used: `0` hours

2. **Click "Calculate Trip"**

3. **View Results**:
   - Interactive route map
   - Step-by-step instructions
   - HOS compliance status
   - Daily log sheets

### Example Routes

#### Uganda Routes:
- **Entebbe → Kampala → Jinja**: 125 miles (2.3 hours driving)
- **Kampala → Mbarara → Kasese**: 410 miles (7.5 hours driving)
- **Entebbe → Gulu → Arua**: 760 miles (13.8 hours driving)

#### US Routes:
- **New York → Chicago → Los Angeles**: 2,800 miles (50.9 hours driving)
- **Miami → Atlanta → Chicago**: 2,035 miles (37 hours driving)

---

## 🏗️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (upgradeable to PostgreSQL)
- **Gunicorn** - WSGI server

### Frontend
- **React 19.2.0** - UI library
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animations
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **Lucide React** - Icons

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **GitHub** - Version control & CI/CD

---

## 📁 Project Structure

```
eld-trip-planner/
├── eld_backend/          # Django project settings
├── eld_app/              # Main Django app
│   ├── models.py         # Database models
│   ├── views.py          # API endpoints
│   ├── hos_calculator.py # HOS logic
│   └── serializers.py    # API serializers
├── frontend/             # React application
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── services/     # API services
│       └── styles/       # Global styles
├── requirements.txt      # Python dependencies
├── Procfile              # Railway deployment config
├── DEPLOYMENT.md         # Deployment guide
└── README.md             # This file
```

---

## 🔐 Environment Variables

### Backend (Railway)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app,*.vercel.app
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:
1. Push to GitHub
2. Import to Vercel (frontend)
3. Import to Railway (backend)
4. Configure environment variables
5. Done! 🎉

---

## 🧪 Testing

### Run Backend Tests
```bash
python manage.py test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Calculate Trip
```
POST /api/calculate-trip/
```

**Request Body**:
```json
{
  "current_location": "Entebbe",
  "pickup_location": "Kampala",
  "dropoff_location": "Jinja",
  "current_cycle_used": 0
}
```

**Response**:
```json
{
  "trip_id": 1,
  "distance_miles": 125,
  "total_time_hours": 4.27,
  "route_segments": [...],
  "daily_logs": [...],
  "compliance": {...},
  "map_data": {...}
}
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**  
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- FMCSA for HOS regulations documentation
- OpenStreetMap for mapping data
- React and Django communities
- All contributors

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Built with ❤️ for the trucking industry**

🚛 Safe travels! 🛣️
