import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { DatabaseState, AppItem, Slide, ReviewRating, User, UserNotification, AppConfig } from './src/types';
import { INITIAL_APPS, INITIAL_SLIDES, INITIAL_CONFIG } from './src/data';

// ES Module / CommonJS compatible path helpers
let currentDirname = "";
try {
  if (typeof __dirname !== "undefined") {
    currentDirname = __dirname;
  } else {
    // @ts-ignore
    const filename = fileURLToPath(import.meta.url);
    currentDirname = path.dirname(filename);
  }
} catch (e) {
  currentDirname = process.cwd();
}

const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize local database if not present
function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, using fallback initial data', err);
  }

  // Create initial structured database
  const defaultDb: DatabaseState = {
    apps: INITIAL_APPS,
    slides: INITIAL_SLIDES,
    reviews: [
      {
        id: 'review-1',
        appId: 'totoro-forest-run',
        userId: 'cozy-camper',
        username: 'CozyCamper',
        rating: 5,
        comment: 'So cute! The catbus jump animation is bouncy and fluffy!',
        createdAt: '2026-05-27T10:00:00Z'
      }
    ],
    users: [
      {
        id: 'user-admin-db',
        username: 'adminlogin@login',
        email: 'admin@chiblihaven.com',
        isAdmin: true,
        downloadHistory: [],
        ratedApps: {},
        createdAt: '2026-05-28T06:00:00Z'
      },
      {
        id: 'user-2',
        username: 'SootSpriteFan',
        email: 'soot@sprite.net',
        isAdmin: false,
        downloadHistory: ['totoro-forest-run'],
        ratedApps: { 'totoro-forest-run': 5 },
        createdAt: '2026-05-25T15:00:00Z'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        title: '🌱 Welcome to the Grand Opening!',
        message: 'Welcome all spirits and gamers to our snug little corner of the internet. Read, explore and download customized cute utilities today!',
        sentAt: '2026-05-28T06:15:00Z',
        sentBy: 'System Admin'
      }
    ],
    config: INITIAL_CONFIG
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(state: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing database save', err);
  }
}

// Host and Port configuration
const PORT = 3000;
const app = express();

app.use(express.json());

// Load working database state
let db = loadDatabase();

// Keep database synchronized before any response
const syncDb = () => {
  // Keeping dynamic database updates in-memory after initial load.
  // This avoids disk read overhead and works flawlessly on stateless hosts like Vercel.
};

/* ==========================================================================
   USER ENDPOINTS: AUTHENTICATION
   ========================================================================== */

app.post('/api/auth/register', (req, res) => {
  syncDb();
  const { username, email, password } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required!' });
  }

  // Check unique username
  const exists = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'User with that username or email already stands registered!' });
  }

  const newUser: User = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    username,
    email,
    isAdmin: username === 'adminlogin@login',
    downloadHistory: [],
    ratedApps: {},
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  res.status(201).json({ message: 'Success! Wrapped in clouds.', user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  syncDb();
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Please submit a cute username to continue!' });
  }

  const found = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!found) {
    // If not found, let's auto-register to make it extra cozy and smooth for sandbox testing!
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      username,
      email: `${username.replace(/\s+/g, '')}@example-cozy.com`,
      isAdmin: username === 'adminlogin@login',
      downloadHistory: [],
      ratedApps: {},
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDatabase(db);
    return res.json({ message: 'Auto-registered under beautiful sky vaults!', user: newUser });
  }

  res.json({ message: 'Cozy login complete!', user: found });
});

/* ==========================================================================
   APK / GAME GENERAL OPERATIONS
   ========================================================================== */

app.get('/api/apps', (req, res) => {
  syncDb();
  res.json(db.apps);
});

app.get('/api/apps/:id', (req, res) => {
  syncDb();
  const found = db.apps.find(a => a.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Application or game cannot be found in the enchanted garden.' });
  res.json(found);
});

// Post review ratings
app.post('/api/apps/:id/rate', (req, res) => {
  syncDb();
  const { userId, username, rating, comment } = req.body;
  const appId = req.params.id;

  if (!userId || !rating) {
    return res.status(400).json({ error: 'User identification and rating values required!' });
  }

  const appIndex = db.apps.findIndex(a => a.id === appId);
  if (appIndex === -1) return res.status(404).json({ error: 'App not found in forest' });

  // Update or insert review
  const existingReviewIndex = db.reviews.findIndex(r => r.appId === appId && r.userId === userId);
  
  if (existingReviewIndex > -1) {
    db.reviews[existingReviewIndex] = {
      ...db.reviews[existingReviewIndex],
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString()
    };
  } else {
    const newReview: ReviewRating = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      appId,
      userId,
      username: username || 'Mysterious Spirit',
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString()
    };
    db.reviews.push(newReview);
  }

  // Update user profile record too
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    if (!db.users[userIndex].ratedApps) db.users[userIndex].ratedApps = {};
    db.users[userIndex].ratedApps[appId] = rating;
  }

  // Re-calculate the app's overall rating average
  const appReviews = db.reviews.filter(r => r.appId === appId);
  const totalRating = appReviews.reduce((sum, r) => sum + r.rating, 0);
  const average = totalRating / appReviews.length;

  db.apps[appIndex].rating = Math.round(average * 10) / 10;
  db.apps[appIndex].ratingsCount = appReviews.length;

  saveDatabase(db);
  res.json({ message: 'Rating cast beautifully!', app: db.apps[appIndex], reviews: appReviews });
});

app.get('/api/apps/:id/reviews', (req, res) => {
  syncDb();
  const appReviews = db.reviews.filter(r => r.appId === req.params.id);
  res.json(appReviews);
});

app.post('/api/apps/:id/download', (req, res) => {
  syncDb();
  const appId = req.params.id;
  const { userId } = req.body;

  const appIndex = db.apps.findIndex(a => a.id === appId);
  if (appIndex === -1) return res.status(404).json({ error: 'App not found' });

  db.apps[appIndex].downloadCount += 1;

  if (userId) {
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      if (!db.users[userIndex].downloadHistory) db.users[userIndex].downloadHistory = [];
      if (!db.users[userIndex].downloadHistory.includes(appId)) {
        db.users[userIndex].downloadHistory.push(appId);
      }
    }
  }

  saveDatabase(db);
  res.json({ message: 'Counting trigger recorded!', app: db.apps[appIndex] });
});

// STREAMING APK FILE DOWNLOAD PROXY ROUTE to bypass mobile popup blockers and safe-context iframe policies
app.get('/api/download', (req, res) => {
  const fileUrl = req.query.url as string;
  if (!fileUrl) {
    return res.status(400).send('No download URL specified.');
  }

  try {
    const parsedUrl = new URL(fileUrl);
    const filename = path.basename(parsedUrl.pathname) || 'file.apk';

    const followRedirectsAndPipe = (currentUrl: string, depth: number) => {
      if (depth > 5) {
        console.error('[Download Proxy] Max redirects reached (depth 5). Falling back to direct redirect.');
        if (!res.headersSent) {
          res.redirect(fileUrl);
        }
        return;
      }

      try {
        const u = new URL(currentUrl);
        const requester = u.protocol === 'https:' ? https : http;

        const requestOptions = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Accept': '*/*'
          }
        };

        const request = requester.get(currentUrl, requestOptions, (streamResponse) => {
          const statusCode = streamResponse.statusCode || 200;

          // If redirect found, follow recursively
          if (statusCode >= 300 && statusCode < 400 && streamResponse.headers.location) {
            const redirectUrl = streamResponse.headers.location;
            const redirectedParsed = new URL(redirectUrl, currentUrl); // handles relative location headers correctly
            followRedirectsAndPipe(redirectedParsed.href, depth + 1);
            return;
          }

          // If client/server error on retrieving file directly, fallback to a clean redirect in client-device browser
          if (statusCode >= 400) {
            console.error(`[Download Proxy] Received status code ${statusCode} on direct stream query. Falling back to direct URL.`);
            if (!res.headersSent) {
              res.redirect(fileUrl);
            }
            return;
          }

          // Pipe the working direct stream to browser with appropriate headers
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            streamResponse.pipe(res);
          }
        });

        request.on('error', (err) => {
          console.error(`[Download Proxy] Streaming connection error at depth ${depth}:`, err);
          if (!res.headersSent) {
            res.redirect(fileUrl);
          }
        });
      } catch (err) {
        console.error('[Download Proxy] Malformed redirected URL or structure parse error:', err);
        if (!res.headersSent) {
          res.redirect(fileUrl);
        }
      }
    };

    followRedirectsAndPipe(fileUrl, 0);

  } catch (error) {
    console.error('[Download Proxy] General initialization download error:', error);
    if (!res.headersSent) {
      res.redirect(fileUrl);
    }
  }
});

/* ==========================================================================
   SLIDER & ANNOUNCEMENT GENERAL GUESTS
   ========================================================================== */

app.get('/api/slides', (req, res) => {
  syncDb();
  res.json(db.slides);
});

app.get('/api/config', (req, res) => {
  syncDb();
  res.json(db.config);
});

/* ==========================================================================
   🔒 ADMIN 4-STEP SECURE VERIFICATION PROCESS
   ========================================================================== */

// STEP 1: Credential Verification
// Username = adminlogin@login | Password = login?
app.post('/api/admin/verify/step1', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'adminlogin@login' && password === 'login?') {
    return res.json({ success: true, message: 'Step 1 complete! Credentials matched. Cozy winds blowing.' });
  }
  return res.status(401).json({ success: false, error: 'Incorrect credential logs! The soot sprites are shaking their heads.' });
});

// STEP 2: Administrative Security Code
// Admin Code = welcomeadmin
app.post('/api/admin/verify/step2', (req, res) => {
  const { adminCode } = req.body;
  
  if (adminCode === 'welcomeadmin') {
    return res.json({ success: true, message: 'Step 2 complete! Celestial Security key approved.' });
  }
  return res.status(401).json({ success: false, error: 'That security passkey is rejected by the castle gates.' });
});

// STEP 3: Database Verification
// Verify if the admin is registered in the database file (we seeded adminlogin@login in mock)
app.post('/api/admin/verify/step3', (req, res) => {
  syncDb();
  const { username } = req.body;
  
  const adminUser = db.users.find(u => u.username === 'adminlogin@login');
  if (adminUser) {
    return res.json({ success: true, message: 'Step 3 complete! Verified user presence in local database records.', adminUser });
  }
  return res.status(404).json({ success: false, error: 'Database mismatch! The registry index does not verify your admin session.' });
});

// STEP 4: Secondary Master Passphrase
// Second Password = welcome back
app.post('/api/admin/verify/step4', (req, res) => {
  const { secondaryPassword } = req.body;
  
  if (secondaryPassword === 'welcome back') {
    return res.json({ success: true, message: 'Step 4 complete! All defense shields deactivated. Welcome home, Master Creator!' });
  }
  return res.status(401).json({ success: false, error: 'Failure! The secondary password does not unlock this interface.' });
});

/* ==========================================================================
   🛠️ ADMIN CORE CRUD/MANAGEMENT OPERATIONS (Required fully working states)
   ========================================================================== */

// APK CRUD - Create App
app.post('/api/admin/apps', (req, res) => {
  syncDb();
  const appData = req.body;

  if (!appData.name || !appData.category) {
    return res.status(400).json({ error: 'App name and category category criteria required.' });
  }

  const newApp: AppItem = {
    id: appData.id || 'app_' + Math.random().toString(36).substr(2, 9),
    name: appData.name,
    packageName: appData.packageName || `com.chibli.${appData.name.toLowerCase().replace(/\s+/g, '')}`,
    category: appData.category,
    genre: appData.genre || 'Magical Assistant',
    logoUrl: appData.logoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: appData.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
    screenshots: appData.screenshots && appData.screenshots.length > 0 ? appData.screenshots : [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: appData.description || 'No description supplied yet under sunny skies.',
    version: appData.version || '1.0.0',
    size: appData.size || '10.0 MB',
    developer: appData.developer || 'Celestial Admin',
    downloadUrl: appData.downloadUrl || 'https://archive.org/download/super-mario-run-apk/SuperCustomRunner.apk',
    downloadCount: 0,
    rating: 5.0,
    ratingsCount: 0,
    isTrending: !!appData.isTrending,
    isRecent: true,
    createdAt: new Date().toISOString()
  };

  db.apps.unshift(newApp);
  saveDatabase(db);
  res.status(201).json({ message: 'New magic APK planted successfully!', app: newApp });
});

// APK CRUD - Update App
app.put('/api/admin/apps/:id', (req, res) => {
  syncDb();
  const appId = req.params.id;
  const appIndex = db.apps.findIndex(a => a.id === appId);

  if (appIndex === -1) {
    return res.status(404).json({ error: 'That app is nowhere to be found in the magic field.' });
  }

  db.apps[appIndex] = {
    ...db.apps[appIndex],
    ...req.body,
    id: appId // prevent altering original id
  };

  saveDatabase(db);
  res.json({ message: 'APK coordinates and details revised beautifully!', app: db.apps[appIndex] });
});

// APK CRUD - Delete App
app.delete('/api/admin/apps/:id', (req, res) => {
  syncDb();
  const appId = req.params.id;
  const appIndex = db.apps.findIndex(a => a.id === appId);

  if (appIndex === -1) {
    return res.status(404).json({ error: 'App does not exist.' });
  }

  const removed = db.apps.splice(appIndex, 1);
  // also clear connected reviews
  db.reviews = db.reviews.filter(r => r.appId !== appId);

  saveDatabase(db);
  res.json({ message: 'App uprooted safely!', app: removed[0] });
});

// SLIDE MANAGEMENT CRUD
app.post('/api/admin/slides', (req, res) => {
  syncDb();
  const slideData = req.body;

  const newSlide: Slide = {
    id: slideData.id || 'slide_' + Math.random().toString(36).substr(2, 9),
    title: slideData.title || 'Magical Update',
    description: slideData.description || 'Breathe in, breath out.',
    badge: slideData.badge || '★ ANNOUNCEMENT',
    imageUrl: slideData.imageUrl || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200&h=500',
    appId: slideData.appId || '',
    buttonText: slideData.buttonText || 'Discover Now'
  };

  const existingIndex = db.slides.findIndex(s => s.id === newSlide.id);
  if (existingIndex > -1) {
    db.slides[existingIndex] = newSlide;
    res.json({ message: 'Slide customized elegantly!', slide: newSlide });
  } else {
    db.slides.push(newSlide);
    res.status(201).json({ message: 'New slide hung in high heavens!', slide: newSlide });
  }

  saveDatabase(db);
});

app.delete('/api/admin/slides/:id', (req, res) => {
  syncDb();
  const slideId = req.params.id;
  const slideIndex = db.slides.findIndex(s => s.id === slideId);

  if (slideIndex === -1) {
    return res.status(404).json({ error: 'Slide not found.' });
  }

  const removed = db.slides.splice(slideIndex, 1);
  saveDatabase(db);
  res.json({ message: 'Slide swept away by soft breeze.', slide: removed[0] });
});

// CONFIG FRONTEND CUSTOMIZATION
app.post('/api/admin/config', (req, res) => {
  syncDb();
  db.config = {
    ...db.config,
    ...req.body
  };
  saveDatabase(db);
  res.json({ message: 'Site details adjusted harmoniously!', config: db.config });
});

// USER MAIL / NOTIFICATION LIST CRITICAL
// Simulated Mail log storage + User notifications dispatch
app.post('/api/admin/notifications', (req, res) => {
  syncDb();
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Need both notification title and body details!' });
  }

  const newNotif: UserNotification = {
    id: 'notif_' + Math.random().toString(36).substr(2, 9),
    title,
    message,
    sentAt: new Date().toISOString(),
    sentBy: 'Grand Arch-Admin'
  };

  db.notifications.unshift(newNotif);
  saveDatabase(db);
  res.status(201).json({ message: 'Newsletter and direct inbox notification dispatched to registered cloud users!', notification: newNotif });
});

app.get('/api/admin/notifications', (req, res) => {
  syncDb();
  res.json(db.notifications);
});

app.get('/api/admin/users', (req, res) => {
  syncDb();
  res.json(db.users);
});


/* ==========================================================================
   VITE DEV MIDDLEWARE & STATIC ASSET HANDLERS
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind strictly as instructed
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cozy Ghibli App Store Server floating on http://localhost:${PORT}`);
  });
}

startServer();
