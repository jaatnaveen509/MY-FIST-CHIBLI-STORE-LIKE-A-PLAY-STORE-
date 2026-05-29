import { INITIAL_APPS, INITIAL_SLIDES, INITIAL_CONFIG } from './data';
import { AppItem, Slide, AppConfig, User, UserNotification } from './types';

// Check or seed localStorage keys
const getMockApps = (): AppItem[] => {
  const val = localStorage.getItem('chibli_apps');
  if (val) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('chibli_apps', JSON.stringify(INITIAL_APPS));
  return INITIAL_APPS;
};

const saveMockApps = (apps: AppItem[]) => {
  localStorage.setItem('chibli_apps', JSON.stringify(apps));
};

const getMockSlides = (): Slide[] => {
  const val = localStorage.getItem('chibli_slides');
  if (val) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('chibli_slides', JSON.stringify(INITIAL_SLIDES));
  return INITIAL_SLIDES;
};

const saveMockSlides = (slides: Slide[]) => {
  localStorage.setItem('chibli_slides', JSON.stringify(slides));
};

const getMockConfig = (): AppConfig => {
  const val = localStorage.getItem('chibli_config');
  if (val) {
    try {
      return JSON.parse(val);
    } catch (e) {}
  }
  localStorage.setItem('chibli_config', JSON.stringify(INITIAL_CONFIG));
  return INITIAL_CONFIG;
};

const saveMockConfig = (config: AppConfig) => {
  localStorage.setItem('chibli_config', JSON.stringify(config));
};

const getMockNotifications = (): UserNotification[] => {
  const val = localStorage.getItem('chibli_notifications');
  if (val) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  const initialNotices: UserNotification[] = [
    { id: '1', title: 'Welcome to Ghibli Haven!', message: 'Explore cozy applications and vintage retro utilities handcrafted under starry skies.', sentAt: new Date().toISOString(), sentBy: 'Celestial Admin' }
  ];
  localStorage.setItem('chibli_notifications', JSON.stringify(initialNotices));
  return initialNotices;
};

const saveMockNotifications = (notices: UserNotification[]) => {
  localStorage.setItem('chibli_notifications', JSON.stringify(notices));
};

const getMockUsers = (): User[] => {
  const val = localStorage.getItem('chibli_users');
  if (val) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  const initialUsers: User[] = [
    {
      id: 'admin-db-seed',
      username: 'adminlogin@login',
      email: 'admin@chiblihaven.com',
      isAdmin: true,
      downloadHistory: [],
      ratedApps: {},
      createdAt: new Date().toISOString()
    }
  ];
  localStorage.setItem('chibli_users', JSON.stringify(initialUsers));
  return initialUsers;
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('chibli_users', JSON.stringify(users));
};

async function handleMockRequest(urlStr: string, init?: RequestInit): Promise<Response> {
  // Parse relative pathname reliably
  let pathname = '';
  try {
    const url = new URL(urlStr, window.location.origin);
    pathname = url.pathname;
  } catch (e) {
    // Fallback if URL constructor fails for relative path endpoints
    pathname = urlStr.split('?')[0];
  }

  const method = init?.method?.toUpperCase() || 'GET';
  let body: any = {};
  if (init?.body) {
    try {
      body = JSON.parse(init.body as string);
    } catch (e) {}
  }

  // Build JSON response helper
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // 1. GET /api/apps
  if (pathname === '/api/apps' && method === 'GET') {
    return jsonResponse(getMockApps());
  }

  // 2. GET /api/slides
  if (pathname === '/api/slides' && method === 'GET') {
    return jsonResponse(getMockSlides());
  }

  // 3. GET /api/config
  if (pathname === '/api/config' && method === 'GET') {
    return jsonResponse(getMockConfig());
  }

  // 4. GET /api/admin/notifications
  if (pathname === '/api/admin/notifications' && method === 'GET') {
    return jsonResponse(getMockNotifications());
  }

  // 5. GET /api/admin/users
  if (pathname === '/api/admin/users' && method === 'GET') {
    return jsonResponse(getMockUsers());
  }

  // 6. POST /api/admin/verify/step1
  if (pathname === '/api/admin/verify/step1' && method === 'POST') {
    const { username, password } = body;
    if (username === 'adminlogin@login' && password === 'login?') {
      return jsonResponse({ success: true, message: 'Step 1 complete!' });
    }
    return jsonResponse({ success: false, error: 'Incorrect credentials! Try: adminlogin@login & login?' }, 401);
  }

  // 7. POST /api/admin/verify/step2
  if (pathname === '/api/admin/verify/step2' && method === 'POST') {
    const { adminCode } = body;
    if (adminCode === 'welcomeadmin') {
      return jsonResponse({ success: true, message: 'Step 2 complete!' });
    }
    return jsonResponse({ success: false, error: 'Incorrect code! Try: welcomeadmin' }, 401);
  }

  // 8. POST /api/admin/verify/step3
  if (pathname === '/api/admin/verify/step3' && method === 'POST') {
    const usersList = getMockUsers();
    const adminUser = usersList.find(u => u.username === 'adminlogin@login') || {
      id: 'admin-db-seed',
      username: 'adminlogin@login',
      email: 'admin@chiblihaven.com',
      isAdmin: true,
      downloadHistory: [],
      ratedApps: {},
      createdAt: new Date().toISOString()
    };
    return jsonResponse({ success: true, message: 'Step 3 complete!', adminUser });
  }

  // 9. POST /api/admin/verify/step4
  if (pathname === '/api/admin/verify/step4' && method === 'POST') {
    const { secondaryPassword } = body;
    if (secondaryPassword === 'welcome back') {
      return jsonResponse({ success: true, message: 'Step 4 complete!' });
    }
    return jsonResponse({ success: false, error: 'Incorrect passphrase! Try: welcome back' }, 401);
  }

  // 10. POST /api/apps/:id/rate
  const rateMatch = pathname.match(/^\/api\/apps\/([^\/]+)\/rate$/);
  if (rateMatch && method === 'POST') {
    const appId = rateMatch[1];
    const { rating, comment, username } = body;
    const appsList = getMockApps();
    const appIndex = appsList.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      const app = appsList[appIndex];
      const currentCount = app.ratingsCount || 0;
      const currentRating = app.rating || 5.0;
      const totalScore = currentRating * currentCount;
      const newCount = currentCount + 1;
      const newRating = parseFloat(((totalScore + rating) / newCount).toFixed(1));

      appsList[appIndex] = {
        ...app,
        rating: newRating,
        ratingsCount: newCount
      };
      saveMockApps(appsList);
      
      const revKey = `chibli_reviews_${appId}`;
      const existingReviewsStr = localStorage.getItem(revKey);
      const reviews = existingReviewsStr ? JSON.parse(existingReviewsStr) : [];
      reviews.unshift({
        id: 'rev_' + Math.random().toString(36).substr(2, 9),
        username: username || 'Cozy Traveler',
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(revKey, JSON.stringify(reviews));

      return jsonResponse({ message: 'Rating added!' });
    }
    return jsonResponse({ error: 'App not found' }, 404);
  }

  // 11. GET /api/apps/:id/reviews
  const reviewsMatch = pathname.match(/^\/api\/apps\/([^\/]+)\/reviews$/);
  if (reviewsMatch && method === 'GET') {
    const appId = reviewsMatch[1];
    const revKey = `chibli_reviews_${appId}`;
    const existingReviewsStr = localStorage.getItem(revKey);
    const reviews = existingReviewsStr ? JSON.parse(existingReviewsStr) : [
      { id: '1', username: 'Kiki Fan', rating: 5, comment: 'Simply lovely design & background atmosphere.', createdAt: new Date().toISOString() }
    ];
    return jsonResponse(reviews);
  }

  // 12. POST /api/apps/:id/download
  const downloadMatch = pathname.match(/^\/api\/apps\/([^\/]+)\/download$/);
  if (downloadMatch && method === 'POST') {
    const appId = downloadMatch[1];
    const appsList = getMockApps();
    const appIndex = appsList.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      appsList[appIndex].downloadCount = (appsList[appIndex].downloadCount || 0) + 1;
      saveMockApps(appsList);
      return jsonResponse({ success: true });
    }
    return jsonResponse({ error: 'App not found' }, 404);
  }

  // 13. POST /api/admin/apps (Create App)
  if (pathname === '/api/admin/apps' && method === 'POST') {
    const appsList = getMockApps();
    const newApp: AppItem = {
      ...body,
      id: body.id || 'app_' + Math.random().toString(36).substr(2, 9),
      packageName: body.packageName || `com.chibli.${body.name?.toLowerCase().replace(/\s+/g, '')}`,
      logoUrl: body.logoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
      screenshots: body.screenshots || ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600&h=350'],
      downloadCount: 0,
      rating: 5.0,
      ratingsCount: 0,
      isTrending: !!body.isTrending,
      isRecent: true,
      createdAt: new Date().toISOString()
    };
    appsList.unshift(newApp);
    saveMockApps(appsList);
    return jsonResponse({ message: 'App created!', app: newApp });
  }

  // 14. PUT /api/admin/apps/:id (Update App)
  const appUpdateMatch = pathname.match(/^\/api\/admin\/apps\/([^\/]+)$/);
  if (appUpdateMatch && (method === 'PUT' || method === 'POST')) {
    const id = appUpdateMatch[1];
    const appsList = getMockApps();
    const index = appsList.findIndex(a => a.id === id);
    if (index !== -1) {
      appsList[index] = { ...appsList[index], ...body, id };
      saveMockApps(appsList);
      return jsonResponse({ message: 'App updated!', app: appsList[index] });
    }
    return jsonResponse({ error: 'Not found' }, 404);
  }

  // 15. DELETE /api/admin/apps/:id (Delete App)
  if (appUpdateMatch && method === 'DELETE') {
    const id = appUpdateMatch[1];
    const appsList = getMockApps();
    const updated = appsList.filter(a => a.id !== id);
    saveMockApps(updated);
    return jsonResponse({ message: 'Deleted' });
  }

  // 16. POST /api/admin/slides
  if (pathname === '/api/admin/slides' && method === 'POST') {
    const slidesList = getMockSlides();
    const isUpdate = body.id;
    if (isUpdate) {
      const idx = slidesList.findIndex(s => s.id === body.id);
      if (idx !== -1) {
        slidesList[idx] = { ...slidesList[idx], ...body };
      }
    } else {
      slidesList.push({
        ...body,
        id: 'slide_' + Math.random().toString(36).substr(2, 9)
      });
    }
    saveMockSlides(slidesList);
    return jsonResponse({ message: 'Slide saved!' });
  }

  // 17. DELETE /api/admin/slides/:id
  const slideDeleteMatch = pathname.match(/^\/api\/admin\/slides\/([^\/]+)$/);
  if (slideDeleteMatch && method === 'DELETE') {
    const id = slideDeleteMatch[1];
    const slidesList = getMockSlides();
    const updated = slidesList.filter(s => s.id !== id);
    saveMockSlides(updated);
    return jsonResponse({ message: 'Slide deleted!' });
  }

  // 18. POST /api/admin/notifications
  if (pathname === '/api/admin/notifications' && method === 'POST') {
    const notices = getMockNotifications();
    const newNotice: UserNotification = {
      id: 'notice_' + Math.random().toString(36).substr(2, 9),
      title: body.title,
      message: body.message,
      sentAt: new Date().toISOString(),
      sentBy: 'Celestial Admin'
    };
    notices.unshift(newNotice);
    saveMockNotifications(notices);
    return jsonResponse({ message: 'Notice sent!' });
  }

  // 19. POST /api/admin/config
  if (pathname === '/api/admin/config' && method === 'POST') {
    const currentConf = getMockConfig();
    const nextConf = { ...currentConf, ...body };
    saveMockConfig(nextConf);
    return jsonResponse({ message: 'Config saved' });
  }

  // Fallback default
  return jsonResponse({ message: 'Simulated OK' });
}

// Intercept window.fetch to support zero-config Vercel/similar hosting environments
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;

  const customFetch = async function (this: any, input: RequestInfo | URL, init?: RequestInit) {
    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof URL) {
      urlStr = input.href;
    } else if (input && typeof (input as any).url === 'string') {
      urlStr = (input as any).url;
    }

    if (!urlStr || !urlStr.includes('/api/')) {
      return originalFetch.apply(this || window, [input, init] as any);
    }

    try {
      const response = await originalFetch.apply(this || window, [input, init] as any);
      
      // Let's check if Vercel returned a 404 HTML fallback page for the API route
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && !contentType.includes('text/html')) {
        return response;
      }
      
      if (!response.ok || contentType.includes('text/html')) {
        return handleMockRequest(urlStr, init);
      }
      
      return response;
    } catch (error) {
      console.warn(`[Ghibli Mock Interceptor] Network or route unresolved for ${urlStr}. Processing in-browser localStorage fallback mechanism.`, error);
      return handleMockRequest(urlStr, init);
    }
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (err) {
    console.warn('[Ghibli Mock Interceptor] Could not override window.fetch using Object.defineProperty:', err);
    try {
      (window as any).fetch = customFetch;
    } catch (err2) {
      console.error('[Ghibli Mock Interceptor] Assignment fallback to window.fetch failed:', err2);
    }
  }
}
