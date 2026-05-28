import { AppItem, Slide, AppConfig } from './types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'totoro-forest-run',
    name: 'Totoro Forest Run',
    packageName: 'com.ghibli.forestrun',
    category: 'Games',
    genre: 'Infinite Runner',
    logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    screenshots: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: 'Bouncing through majestic ancient trunks, collecting glowing acorns, and riding the miraculous Catbus! Help Totoro navigate the magical forests of golden twilight, summon rain to grow giant camphor trees, and dodge mischievous soot sprites. Features cozy physics, responsive swipe mechanics, and enchanting woodwind music.',
    version: '2.4.1',
    size: '48.2 MB',
    developer: 'Acorn Forest Studio',
    downloadUrl: 'https://archive.org/download/super-mario-run-apk/SuperCustomRunner.apk',
    downloadCount: 15200,
    rating: 4.9,
    ratingsCount: 380,
    isTrending: true,
    isRecent: false,
    createdAt: '2026-05-10T08:00:00Z'
  },
  {
    id: 'kiki-delivery',
    name: 'Kikis Delivery Tracker',
    packageName: 'com.ghibli.kikideliver',
    category: 'Tools',
    genre: 'Productivity & Planning',
    logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    screenshots: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: 'The premier magical inventory and package tracking tool. Organize your local delivery items, track current wind currents for safer broom flights, set custom notifications for fresh-baked hot pies, and manage requests from coastal town dwellers. Perfect for local shopkeepers and free spirits alike!',
    version: '1.2.0',
    size: '22.4 MB',
    developer: 'Osono Bakery Corp',
    downloadUrl: 'https://archive.org/download/kiki-delivery-tracker/KikiApp.apk',
    downloadCount: 8400,
    rating: 4.8,
    ratingsCount: 120,
    isTrending: true,
    isRecent: true,
    createdAt: '2026-05-20T12:30:00Z'
  },
  {
    id: 'spirited-garden',
    name: 'Spirited Bathhouse Garden',
    packageName: 'com.ghibli.bathgarden',
    category: 'Games',
    genre: 'Simulation & Farming',
    logoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    screenshots: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: 'Grow sacred botanical herbs, brew colorful liquid herbal remedies, and design calming stone layouts to satisfy tired river deities. Tend to magical cherry orchards and feed starving soot sprites with multi-colored sugar candy. Features peaceful offline pacing and stunning canvas artwork.',
    version: '3.0.5',
    size: '89.7 MB',
    developer: 'Kamaji Steamworks',
    downloadUrl: 'https://archive.org/download/spirited-bathhouse/BathhouseGarden.apk',
    downloadCount: 22100,
    rating: 5.0,
    ratingsCount: 940,
    isTrending: true,
    isRecent: false,
    createdAt: '2026-04-15T09:00:00Z'
  },
  {
    id: 'laputa-compass',
    name: 'Laputa Altitude Compass',
    packageName: 'com.ghibli.laputacompass',
    category: 'Apps',
    genre: 'Navigation & Outdoors',
    logoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    screenshots: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: 'Harness the gravity-defying powers of your local blue crystal! Calculates atmospheric barometric pressure, real-time elevation coordinates, and hints at nearby heavy clouds hiding ancient levitating castles. Beautiful vintage copper interface with brass keys and fluid clock ticks.',
    version: '5.9.0',
    size: '15.6 MB',
    developer: 'Aether Pirate Fleet',
    downloadUrl: 'https://archive.org/download/laputa-altitude-compass/LaputaCompass.apk',
    downloadCount: 3400,
    rating: 4.6,
    ratingsCount: 95,
    isTrending: false,
    isRecent: true,
    createdAt: '2026-05-24T14:20:00Z'
  },
  {
    id: 'star-painter',
    name: 'Howls Star Painter App',
    packageName: 'com.ghibli.starpainter',
    category: 'Editors Choice',
    genre: 'Art & Design',
    logoUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200&h=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    screenshots: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600&h=350',
      'https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&q=80&w=600&h=350'
    ],
    description: 'Paint starry cosmic rings inside a beautiful moving room. Features cozy pastel brush styles, magic watercolor flow simulation, sound effects mimicking gentle log fire burning, and real-time canvas exporting. Bring your imaginative watercolor creations to life with magical neon highlights!',
    version: '1.2.9',
    size: '34.0 MB',
    developer: 'Calcifer Hearth Labs',
    downloadUrl: 'https://archive.org/download/howls-star-painter/StarPainter.apk',
    downloadCount: 42000,
    rating: 4.9,
    ratingsCount: 1850,
    isTrending: true,
    isRecent: false,
    createdAt: '2026-03-12T11:00:00Z'
  }
];

export const INITIAL_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'Adventures Await in Totoro Run!',
    description: 'Enter the mystical camouflage forests where cuddly soot sprites dance and absolute cuteness awaits in every single jump.',
    badge: '★ EDITORS CHOICE',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200&h=500',
    appId: 'totoro-forest-run',
    buttonText: 'Join the Forest Magic'
  },
  {
    id: 'slide-2',
    title: 'New Celestial Painting Utilities!',
    description: 'Unleash Calcifer’s roaring fireplace cozy creativity with modern fluid watercolor mechanics and glow tools designed by Howl.',
    badge: '🔥 POPULAR HOT',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200&h=500',
    appId: 'star-painter',
    buttonText: 'Cozy Up and Paint'
  },
  {
    id: 'slide-3',
    title: 'Announcing Summer Sky Festivals',
    description: 'We have updated all navigation databases for celestial flight. Always verify your crystal altitude levels before leaving coastlines!',
    badge: '📢 ANNOUNCEMENT',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200&h=500',
    buttonText: 'Explore Celestial Charts'
  }
];

export const INITIAL_CONFIG: AppConfig = {
  announcement: '🌻 Welcome to Chibli App Haven! Enjoy safe, direct, and virus-free APK installs under our cozy sunny skies. Special announcements: New Magic Tools are live! 🌻',
  isAnnounceEnabled: true,
  siteName: 'Chibli Haven',
  bannerTitle: 'Magical APKs and Retro Games',
  welcomeSubtitle: 'Discover cozy handcrafted utilities, cute games, and Ghibli-themed tools under our protective skies.',
  categories: ['Games', 'Apps', 'Tools', 'Editors Choice']
};
