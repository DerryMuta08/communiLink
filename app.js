
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

// Initialize Firebase & Firestore Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Grab UI Elements from our HTML layout
const noticeForm = document.getElementById('notice-form');
const noticesContainer = document.getElementById('notices-container');

/**
 * 🤖 CLIENT-SIDE EDGE AI ENGINE
 * Analyzes text locally to save user bandwidth, stripping filler words 
 * and building a compressed, actionable intelligence brief.
 */
function generateLowDataAISummary(title, text) {
    const fullText = (title + " " + text).toLowerCase();
    let status = "ℹ️ INFO";
    let keywords = [];

    // 1. Local Semantic Keyword Parsing
    if (fullText.includes("water") || fullText.includes("borehole") || fullText.includes("pipe")) {
        keywords.push("UTILITY:WATER");
    }
    if (fullText.includes("power") || fullText.includes("electricity") || fullText.includes("grid") || fullText.includes("generator")) {
        keywords.push("UTILITY:POWER");
    }
    if (fullText.includes("blocked") || fullText.includes("road") || fullText.includes("traffic") || fullText.includes("closure")) {
        keywords.push("INFRASTRUCTURE");
    }

    // 2. Urgent Threat Level Assessment
    if (fullText.includes("critical") || fullText.includes("danger") || fullText.includes("urgent") || fullText.includes("burst")) {
        status = "🚨 CRITICAL OUTAGE";
    } else if (fullText.includes("fixed") || fullText.includes("restored") || fullText.includes("resolved") || fullText.includes("working")) {
        status = "✅ RESOLVED";
    }

    // 3. Smart Telegram-Style Text Compression (Strips conversational bloat)
    const stopWords = ["a", "about", "above", "after", "again", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "theirs", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves", "thanks", "patience", "everyone", "lot"];
    
    let words = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/);
    let filteredWords = words.filter(word => !stopWords.includes(word));
    
    // Grab top 5 core action words for low-bandwidth rendering
    let ultraCompressedConcept = filteredWords.slice(0, 5).join(" ");

    // Combine into a premium machine brief
    const finalBrief = `[${status}] [${keywords.join(",") || "GENERAL"}] -> Summary: ${ultraCompressedConcept}...`;
    return finalBrief;
}

// 1. REAL-TIME LISTENER: Pull notices from Firebase automatically as they are added
const noticesQuery = query(collection(db, "notices"), orderBy("timestamp", "desc"));
onSnapshot(noticesQuery, (snapshot) => {
    noticesContainer.innerHTML = ''; 
    snapshot.forEach((doc) => {
        const data = doc.data();
        const noticeElement = document.createElement('div');
        noticeElement.className = "notice-item";
        
        noticeElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #1e293b;">📍 ${data.title}</h3>
                <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 500;">
                    ${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                </span>
            </div>
            <p style="color: #1e3a8a; background: #eff6ff; padding: 0.75rem; border-left: 4px solid #2563eb; font-size: 0.85rem; border-radius: 8px; font-weight: 500; margin-bottom: 0.75rem; font-family: monospace;">
                <strong>🤖 Low-Bandwidth AI Summary:</strong><br>${data.aiSummary}
            </p>
            <p style="color: #475569; font-size: 0.95rem;">${data.text}</p>
        `;
        noticesContainer.appendChild(noticeElement);
    });
});

// 2. SUBMIT EVENT: Run AI locally, then save data package to Firestore cloud database
noticeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('notice-title').value;
    const text = document.getElementById('notice-text').value;

    // Execute Local Edge AI Processing before hitting the network pipeline
    const computedSummary = generateLowDataAISummary(title, text);

    try {
        await addDoc(collection(db, "notices"), {
            title: title,
            text: text,
            aiSummary: computedSummary, 
            timestamp: new Date()
        });
        noticeForm.reset(); 
    } catch (error) {
        console.error("Error writing to database: ", error);
    }
});