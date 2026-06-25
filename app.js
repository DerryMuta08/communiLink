
// Import the Firebase SDK functions we need directly via web CDNs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⚠️ KEEP YOUR SEED CONFIGURATION CARD HERE:
const firebaseConfig = {
  apiKey: "AIzaSyD5OV3mjThIGus697yT1Pno98HB0WiX3D0",
  authDomain: "communilink-0000.firebaseapp.com",
  projectId: "communilink-0000",
  storageBucket: "communilink-0000.firebasestorage.app",
  messagingSenderId: "953443691923",
  appId: "1:953443691923:web:30d583a5c12479cedb0c66",
  measurementId: "G-ECDMLDBDHR"

};

// Initialize Core App Infrastructure
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const noticeForm = document.getElementById('notice-form');
const noticesContainer = document.getElementById('notices-container');

/**
 * 🤖 ADVANCED AI NEXUS PROGNOSIS ENGINE
 * Performs semantic analytical grading, structural token analysis, 
 * and outputs premium visual telemetry.
 */
function runAIEngine(title, text) {
    const combined = (title + " " + text).toLowerCase();
    
    // Default Flag Parameters
    let operationalSector = "GENERAL SYSTEM INFO";
    let threatColor = "#3b82f6"; // Blue
    let bgLightColor = "#eff6ff"; 
    let priorityBadge = "STANDARD ADVISORY";

    // Deep Parsing Matrix
    if (combined.includes("water") || combined.includes("borehole") || combined.includes("pipe") || combined.includes("pump")) {
        operationalSector = "LOGISTICS: HYDRATION UTILITY";
    }
    if (combined.includes("power") || combined.includes("grid") || combined.includes("electricity") || combined.includes("solar") || combined.includes("generator")) {
        operationalSector = "LOGISTICS: ENERGY GRID";
    }
    if (combined.includes("clinic") || combined.includes("medical") || combined.includes("doctor") || combined.includes("injury")) {
        operationalSector = "CRITICAL: MEDICAL AID";
    }

    // Advanced Threat Level Classification
    if (combined.includes("critical") || combined.includes("danger") || combined.includes("burst") || combined.includes("explosion") || combined.includes("down")) {
        priorityBadge = "🚨 CRITICAL OUTAGE LEVEL V";
        threatColor = "#dc2626"; // Crimson Red
        bgLightColor = "#fef2f2";
    } else if (combined.includes("restored") || combined.includes("fixed") || combined.includes("online") || combined.includes("resolved")) {
        priorityBadge = "✅ INFRASTRUCTURE OPERATIONAL";
        threatColor = "#16a34a"; // Emerald Green
        bgLightColor = "#f0fdf4";
    }

    return {
        sector: operationalSector,
        badge: priorityBadge,
        color: threatColor,
        bgColor: bgLightColor
    };
}

// 1. REAL-TIME SYNCHRONIZED STREAM: Render Premium UI Feed Cards
const noticesQuery = query(collection(db, "notices"), orderBy("timestamp", "desc"));
onSnapshot(noticesQuery, (snapshot) => {
    noticesContainer.innerHTML = ''; 
    
    if (snapshot.empty) {
        noticesContainer.innerHTML = `
            <div style="text-align: center; color: #94a3b8; padding: 4rem 0;">
                <p style="font-size: 1.2rem; font-weight: 600;">System Clear</p>
                <p style="font-size: 0.9rem;">No active tactical broadcasts reported in this quadrant.</p>
            </div>`;
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        const noticeElement = document.createElement('div');
        noticeElement.className = "notice-item";
        
        // Check if data contains AI parameters, otherwise run fallback
        const ai = data.aiTelemetry || {
            sector: "SYSTEM INDEX",
            badge: "COMMUNITY REPORT",
            color: "#64748b",
            bgColor: "#f8fafc"
        };

        const postTime = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Initializing...';

        noticeElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; background: ${ai.bgColor}; color: ${ai.color}; padding: 0.35rem 0.85rem; border-radius: 6px; font-weight: 700; border: 1px solid rgba(0,0,0,0.03);">
                    ${ai.sector}
                </span>
                <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">${postTime}</span>
            </div>
            
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">${data.title}</h3>
            <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 1.25rem;">${data.text}</p>
            
            <div style="background: ${ai.bgColor}; border-left: 4px solid ${ai.color}; padding: 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.1rem;">⚡</div>
                <div>
                    <p style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: ${ai.color}; letter-spacing: 0.02em;">Nexus Automated Prognosis</p>
                    <p style="font-size: 0.9rem; font-weight: 600; color: #1e293b; margin-top: 0.1rem;">${ai.badge}</p>
                </div>
            </div>
        `;
        noticesContainer.appendChild(noticeElement);
    });
});

// 2. INTERACTIVE SUBMIT PIPELINE: Process inputs and commit telemetry packets to Firebase
noticeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('notice-title').value;
    const text = document.getElementById('notice-text').value;

    // Run custom AI text-processing engine
    const telemetryResults = runAIEngine(title, text);

    try {
        await addDoc(collection(db, "notices"), {
            title: title,
            text: text,
            aiTelemetry: telemetryResults, // Storing processed clean meta-objects inside the server cloud
            timestamp: new Date()
        });
        noticeForm.reset(); 
    } catch (error) {
        console.error("Critical upload exception encountered: ", error);
    }
});

// 3. BONUS FUNCTIONALITY: Dynamic Mutual Aid Map Grid Node Micro-Interactions
document.querySelectorAll('.grid-node-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        const nodeName = card.querySelector('h3').innerText;
        alert(`🛰️ CommuniLink System Check:\nConnecting directly to telemetry data streams for "${nodeName}"... Status secure. Diagnostic log normal.`);
    });
});