// Import the Firebase SDK functions we need directly via web CDNs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 👇 SELECT THE THREE LINES BELOW AND PASTE YOUR COPIED CONFIG RIGHT OVER THEM:
const firebaseConfig = {
  apiKey: "AIzaSyD5OV3mjThIGus697yT1Pno98HB0WiX3D0",
  authDomain: "communilink-0000.firebaseapp.com",
  projectId: "communilink-0000",
  storageBucket: "communilink-0000.firebasestorage.app",
  messagingSenderId: "953443691923",
  appId: "1:953443691923:web:30d583a5c12479cedb0c66",
  measurementId: "G-ECDMLDBDHR"
};
  // Your copied keys will live right here!


// Initialize Firebase & Firestore Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Grab UI Elements from our HTML layout
const noticeForm = document.getElementById('notice-form');
const noticesContainer = document.getElementById('notices-container');

// 1. REAL-TIME LISTENER: Pull notices from Firebase automatically as they are added
const noticesQuery = query(collection(db, "notices"), orderBy("timestamp", "desc"));
onSnapshot(noticesQuery, (snapshot) => {
    noticesContainer.innerHTML = ''; // Clear out the container before reloading
    snapshot.forEach((doc) => {
        const data = doc.data();
        const noticeElement = document.createElement('div');
        
        noticeElement.style.borderBottom = "1px solid #eee";
        noticeElement.style.padding = "1rem 0";
        
        noticeElement.innerHTML = `
            <h3>📍 ${data.title}</h3>
            <p style="color: #1e3a8a; background: #eff6ff; padding: 0.6rem; border-left: 4px solid #2563eb; font-size: 0.9rem; border-radius: 4px;">
                <strong>🤖 Low-Data AI Summary:</strong> ${data.aiSummary || 'Generating optimization summary...'}
            </p>
            <p style="color: #4b5563; margin-top: 0.5rem;">${data.text}</p>
        `;
        noticesContainer.appendChild(noticeElement);
    });
});

// 2. SUBMIT EVENT: Send user typed notices straight into the Firestore cloud database
noticeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('notice-title').value;
    const text = document.getElementById('notice-text').value;

    try {
        await addDoc(collection(db, "notices"), {
            title: title,
            text: text,
            aiSummary: "Notice parsed successfully. Low-bandwidth rendering active.", 
            timestamp: new Date()
        });
        noticeForm.reset(); // Clear the form input boxes
    } catch (error) {
        console.error("Error writing document to database: ", error);
    }
});