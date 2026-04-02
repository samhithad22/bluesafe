// Global script for BlueSafe Marine - simulation, maps, charts, alerts, auth

// Simulated data generators
let pollutionData = {
  ph: 7.5,
  chemicals: 25,
  turbidity: 15,
  safety: 'Safe',
  zones: [
    {lat: 12.930, lng: 77.686, pollution: 85, type: 'High Plastic', hotspotIndex: 0},
    {lat: 12.938, lng: 77.695, pollution: 65, type: 'Chemical Leak', hotspotIndex: 1},
    {lat: 12.950, lng: 77.620, pollution: 45, type: 'Turbidity', hotspotIndex: 2},
    {lat: 13.032, lng: 77.599, pollution: 75, type: 'High Turbidity', hotspotIndex: 3},
    {lat: 12.975, lng: 77.605, pollution: 90, type: 'Plastic Cluster', hotspotIndex: 4},
    {lat: 12.990, lng: 77.570, pollution: 55, type: 'Mixed Waste', hotspotIndex: 5}
  ]
};

window.droneUtils = {
  // Haversine formula for distance between two lat/lng points (in km)
  haversineDistance: function(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Drone config
  config: {
    speed: 15, // km/h
    waypoints: [
      [12.930, 77.686], // 0: Bellandur Lake (START)
      [12.938, 77.695], // 1: Varthur Lake
      [12.950, 77.620], // 2: Agara Lake
      [13.032, 77.599], // 3: Hebbal Lake
      [13.025, 77.620], // 4: Nagavara Lake
      [12.975, 77.605], // 5: Ulsoor Lake
      [12.990, 77.570], // 6: Sankey Tank
      [12.975, 77.590], // 7: Millers Tank
      [12.965, 77.630], // 8: Kubbon Park
      [12.950, 77.650], // 9: Indiranagar
      [12.935, 77.670], // 10: Domlur
      [12.930, 77.686]  // 11: Bellandur Return
    ],
    hotspotIndices: [0,1,3,5,6], // Waypoint indices matching hotspots
    totalDistance: 0,
    currentSpeed: 15,
    currentAltitude: 100
  },

  // Calculate total mission distance
  calcTotalDistance: function() {
    let dist = 0;
    for (let i = 0; i < this.config.waypoints.length - 1; i++) {
      dist += this.haversineDistance(
        this.config.waypoints[i][0], this.config.waypoints[i][1],
        this.config.waypoints[i+1][0], this.config.waypoints[i+1][1]
      );
    }
    this.config.totalDistance = dist.toFixed(1);
    return dist;
  }
};

droneUtils.calcTotalDistance();

let chart;
let volunteerData = {
  name: 'Ocean Guardian',
  level: 5,
  points: 420,
  badges: ['🌊 First Wave', '🐟 Fish Saver', '🛸 Plastic Hunter'],
  tasks: [
    { id: 1, title: 'Clean Beach Cleanup', reward: 50, completed: true },
    { id: 2, title: 'Report 5 Pollutions', reward: 100, completed: false },
    { id: 3, title: 'Join Community Dive', reward: 200, completed: false },
    { id: 4, title: 'Educate 10 People', reward: 75, completed: true }
  ],
  leaderboard: [
    { name: 'SeaWarrior', points: 1250, rank: 1 },
    { name: 'WaveRider', points: 980, rank: 2 },
    { name: 'CoralKeeper', points: 750, rank: 3 },
    { name: localStorage.getItem('volunteerName') || volunteerData.name, points: volunteerData.points, rank: 4 }
  ]
};

let volunteerChart = null;

// Init map
function initMap(id = 'map') {
  const map = L.map(id).setView([12.97, 77.59], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  pollutionData.zones.forEach(zone => {
    L.circleMarker([zone.lat, zone.lng], {
      radius: zone.pollution / 5,
      fillColor: zone.pollution > 50 ? '#dc3545' : '#28a745',
      color: '#000',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.6
    }).addTo(map).bindPopup(`<b>${zone.type}</b><br>Pollution: ${zone.pollution}%`);
  });
  return map;
}

// Update metrics
function updateMetrics() {
  pollutionData.ph = (parseFloat(pollutionData.ph) + (Math.random() - 0.5) * 0.4).toFixed(2);
  pollutionData.ph = Math.max(6, Math.min(9, parseFloat(pollutionData.ph)));
  pollutionData.chemicals = Math.max(0, pollutionData.chemicals + (Math.random() - 0.5) * 5);
  pollutionData.turbidity = Math.max(0, pollutionData.turbidity + (Math.random() - 0.5) * 3);

  document.querySelectorAll('.ph-value').forEach(el => el.textContent = pollutionData.ph);
  document.querySelectorAll('.chemicals-value').forEach(el => el.textContent = pollutionData.chemicals.toFixed(0));
  document.querySelectorAll('.turbidity-value').forEach(el => el.textContent = pollutionData.turbidity.toFixed(0));

  // Safety status
  pollutionData.safety = (pollutionData.ph > 7 && pollutionData.chemicals < 50 && pollutionData.turbidity < 30) ? 'Safe' : 'Warning';
  document.querySelectorAll('.safety-status').forEach(el => {
    el.textContent = pollutionData.safety;
    el.className = `safety-status ${pollutionData.safety.toLowerCase()}`;
  });

  // Check alerts
  if (pollutionData.ph < 6.5 || pollutionData.chemicals > 70) {
    triggerAlert(`High Pollution Alert! pH: ${pollutionData.ph}, Chemicals: ${pollutionData.chemicals}`);
  }

  // Update charts if exist
  if (chart) {
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(pollutionData.ph);
    chart.update('none');
  }

  // Update progress bars
  document.querySelectorAll('.bin-fill').forEach((fill, i) => {
    const level = 70 + Math.sin(Date.now() / 10000 + i) * 20;
    fill.style.width = level + '%';
  });
}

// Trigger alert
function triggerAlert(message) {
  const modal = document.getElementById('alertModal');
  if (modal) {
    modal.querySelector('.alert-message').textContent = message;
    modal.style.display = 'block';
    // Siren simulation
    const siren = document.getElementById('siren');
    if (siren) siren.play();
  }
}

// Close alert
function closeAlert() {
  const modal = document.getElementById('alertModal');
  if (modal) modal.style.display = 'none';
}

// Init chart
function initChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (ctx) {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(10).fill(''),
        datasets: [{
          label: 'pH Level',
          data: Array(10).fill(7.5),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          tension: 0.4
        }]
      },
      options: { responsive: true, scales: { y: { min: 6, max: 9 } } }
    });
  }
}

// Login sim - FIXED for dashboard access
function login(email, password, role) {
  console.log('Logging in as:', role);
  localStorage.setItem('role', role);
  localStorage.setItem('userEmail', email);
  
  if (role === 'authority') {
    window.location.href = 'authority-dashboard.html';
  } else if (role === 'volunteer') {
    window.location.href = 'volunteer-dashboard.html';
  } else {
    window.location.href = 'dashboard.html';
  }
}

// Check auth role
function getRole() {
  return localStorage.getItem('role') || 'public';
}

// Simulate backend API fetch
async function fetchSensorData() {
  try {
    const res = await fetch('http://localhost:5000/api/sensors');
    if (res.ok) {
      const data = await res.json();
      Object.assign(pollutionData, data);
    }
  } catch (e) {
    console.log('Backend offline, using local sim');
  }
}

// Volunteer Gamification System
function updateVolunteerMetrics() {
  const pointsEl = document.getElementById('vol-points');
  if (pointsEl) pointsEl.textContent = volunteerData.points;
  
  const levelEl = document.getElementById('vol-level');
  if (levelEl) levelEl.textContent = volunteerData.level;
  
  const progressEl = document.getElementById('level-progress');
  if (progressEl) progressEl.style.width = (volunteerData.points % 1000 / 1000 * 100) + '%';
  
  document.querySelectorAll('.impact-stat').forEach((el, i) => {
    el.textContent = Math.floor(volunteerData.points / 50 + i * 2) || 0;
  });

  // Badges
  const badgesEl = document.getElementById('badges-list');
  if (badgesEl) {
    badgesEl.innerHTML = volunteerData.badges.map(badge => `<div class="badge">${badge}</div>`).join('');
  }
}

function completeTask(taskId) {
  const task = volunteerData.tasks.find(t => t.id === taskId);
  if (task && !task.completed) {
    task.completed = true;
    volunteerData.points += task.reward;
    if (volunteerData.points > 1000) {
      volunteerData.level++;
      volunteerData.points = 0;
    }
    updateVolunteerMetrics();
    confetti();
    updateLeaderboard();
    alert(`Task complete! +${task.reward} points. New total: ${volunteerData.points}`);
  }
}

function updateLeaderboard() {
  volunteerData.leaderboard.sort((a, b) => b.points - a.points);
  volunteerData.leaderboard.forEach((player, i) => player.rank = i + 1);
  const lbEl = document.querySelector('.leaderboard');
  if (lbEl) {
    lbEl.innerHTML = volunteerData.leaderboard.slice(0, 5).map(p => 
      `<div class="leader-item">#${p.rank} ${p.name}: ${p.points}pts</div>`
    ).join('');
  }
}

function confetti() {
  let particlesContainer = document.getElementById('particles');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles';
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
  }
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    particle.style.animationDuration = (Math.random() * 1 + 2) + 's';
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }
}

function initVolunteerChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (ctx) {
    volunteerChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Reports', 'Cleanups', 'Education'],
        datasets: [{
          data: [8, 5, 12],
          backgroundColor: ['#00b4d8', '#48cae4', '#ffd23f']
        }]
      },
      options: { responsive: true }
    });
  }
}

function renderTasks() {
  const tasksList = document.getElementById('tasks-list');
  if (tasksList) {
    tasksList.innerHTML = volunteerData.tasks.map(task => 
      `<div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" onclick="completeTask(${task.id})">
        <span>${task.title} (+${task.reward}pts)</span>
        <i class="fas ${task.completed ? 'fa-check' : 'fa-play'}"></i>
      </div>`
    ).join('');
  }
}

function submitReport(formData) {
  volunteerData.points += 25;
  volunteerData.tasks[1].completed = true;
  updateVolunteerMetrics();
  updateLeaderboard();
  confetti();
  renderTasks();
  return `Report "${formData.location} - ${formData.type}" submitted! +25 points.`;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  setInterval(() => {
    fetchSensorData().then(updateMetrics);
  }, 3000);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAlert();
  });

  // Role-based dashboard loading
  const role = getRole();
  if (role === 'authority') {
    if (window.location.pathname.includes('authority-dashboard.html')) initAuthorityDashboard();
  } else if (role === 'volunteer') {
    if (window.location.pathname.includes('volunteer-dashboard.html')) initVolunteerDashboard();
  }
});

// Role-specific inits
function initAuthorityDashboard() {
  console.log('Authority dashboard loaded');
}

function initVolunteerDashboard() {
  updateVolunteerMetrics();
  renderTasks();
  updateLeaderboard();
  initVolunteerChart('volunteerChart');
}

// Demo data submit (index.html)
async function addData() {
  const location = document.getElementById("location").value;
  const waste = document.getElementById("waste").value;
  const level = document.getElementById("level").value;
  
  if (location && waste && level) {
    console.log('Demo data submitted:', { location, waste, level });
    alert("Data submitted successfully (demo mode)!");
    document.getElementById("location").value = '';
    document.getElementById("waste").value = '';
    document.getElementById("level").value = '';
  }
}

// Gauge update
function updateGauge(id, value, max = 100) {
  const circle = document.getElementById(id);
  if (circle) {
    const offset = (value / max) * 440;
    circle.style.strokeDasharray = `${offset} 440`;
  }
}
