# Smart Marine Pollution Detection and Management System

## Features Implemented
✅ **Dashboard**: Real-time pollution metrics, graphs, interactive map  
✅ **Sensor Module**: pH, chemicals, turbidity gauges & table  
✅ **Drone Monitoring**: Simulated detection, live feed, dispatch  
✅ **Alert System**: Auto-triggers, siren, notifications  
✅ **Map Integration**: Leaflet maps with pollution zones/markers  
✅ **Waste Management**: Smart bins, AI classification, GPS  
✅ **Volunteer/Authority Portals**: Role-based logins, reports/routes  
✅ **Awareness Section**: Stats counters, educational content  
✅ **Responsive Design**: Mobile/desktop, marine theme  
✅ **Backend API**: Python/Flask with simulated data & AI workflows  

## Quick Start (Frontend + Backend)

### 1. Frontend (via XAMPP)
- Open `http://localhost/bluesafe/index.html` in browser
- All features work standalone (data simulated in JS)

### 2. Backend API (Recommended for full experience)
```
cd c:/xampp/htdocs/bluesafe/backend
pip install -r requirements.txt
python app.py
```
- API runs on `http://localhost:5000`
- Frontend auto-connects (CORS enabled)
- Endpoints: `/api/sensors`, `/api/drones`, `/api/alerts`

### 3. Demo Flow
1. Visit index.html → Login as Volunteer/Authority
2. View Dashboard → See live updates/maps/charts
3. Test Alerts → Siren triggers on high pollution
4. Check Sensors/Drone/Waste modules
5. Backend provides real sim data

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JS, Leaflet Maps, Chart.js
- **Backend**: Python Flask, Simulated IoT/AI logic
- **Theme**: Clean white/blue-green marine design
- **Responsive**: Mobile-first CSS Grid/Flexbox

## Screenshots
(Add screenshots after testing)

## Future Enhancements
- Real IoT integration (MQTT)
- ML models (TensorFlow.js backend)
- Push notifications (Web Push API)
- Database (SQLite/PostgreSQL)
- User auth (JWT)

**Hackathon Ready! 🚀 Clean Oceans with AI + IoT**

