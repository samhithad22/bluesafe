import json
import random
import time
from datetime import datetime

def generate_sensor_data():
    """Simulate IoT sensor readings"""
    return {
        'timestamp': datetime.now().isoformat(),
        'ph': round(random.uniform(6.0, 9.0), 2),
        'chemicals_ppm': random.randint(10, 80),
        'turbidity_ntu': random.randint(5, 40),
        'temperature_c': round(random.uniform(20, 30), 1)
    }

def generate_drone_detection():
    """Simulate drone plastic detection"""
    return {
        'plastic_clusters': random.randint(5, 20),
        'estimated_weight_kg': round(random.uniform(100, 500), 1),
        'confidence': round(random.uniform(0.85, 0.99), 2)
    }

def ai_waste_classification(image_desc):
    """Simple AI workflow for waste classification"""
    rules = {
        'plastic': 'recyclable',
        'bottle': 'recyclable', 
        'chemical': 'hazardous',
        'organic': 'compost'
    }
    for key, category in rules.items():
        if key in image_desc.lower():
            return category
    return 'non-recyclable'

def check_alerts(data):
    """Alert logic based on thresholds"""
    alerts = []
    if data['ph'] < 6.5:
        alerts.append('Low pH Alert')
    if data['chemicals_ppm'] > 60:
        alerts.append('High Chemical Alert')
    if data['turbidity_ntu'] > 30:
        alerts.append('High Turbidity')
    return alerts

if __name__ == '__main__':
    # Demo simulation loop
    print("Marine Pollution Simulator Running...")
    while True:
        data = generate_sensor_data()
        drone = generate_drone_detection()
        alerts = check_alerts(data)
        sim_data = {'sensors': data, 'drone': drone, 'alerts': alerts}
        print(json.dumps(sim_data, indent=2))
        time.sleep(5)

