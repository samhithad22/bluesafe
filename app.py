from flask import Flask, jsonify
from flask_cors import CORS
import random
import json
from simulator import generate_sensor_data, generate_drone_detection, ai_waste_classification, check_alerts
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

@app.route('/api/sensors')
def api_sensors():
    """Real-time sensor data"""
    data = generate_sensor_data()
    data['alerts'] = check_alerts(data)
    return jsonify(data)

@app.route('/api/drones')
def api_drones():
    """Drone detection results"""
    return jsonify(generate_drone_detection())

@app.route('/api/alerts')
def api_alerts():
    """Current alerts"""
    sensor_data = generate_sensor_data()
    return jsonify({'alerts': check_alerts(sensor_data)})

@app.route('/api/waste/classify', methods=['POST'])
def api_classify_waste():
    """AI waste classification (sim)"""
    # In real: receive image analysis
    desc = 'plastic bottle'  # sim
    category = ai_waste_classification(desc)
    return jsonify({'classification': category, 'confidence': 0.95})

@app.route('/api/stats')
def api_stats():
    """Awareness stats"""
    return jsonify({
        'lives_saved': 1247,
        'waste_collected_kg': 5680,
        'volunteers': 892,
        'zones_clean': 92
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("BlueSafe Backend API starting on http://localhost:5000")
    print("Endpoints: /api/sensors, /api/drones, /api/alerts")
    app.run(debug=True, port=5000)

