export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: string;
  genre: string;
  logoUrl: string;
  videoUrl: string;
  screenshots: string[];
  description: string;
  version: string;
  size: string;
  developer: string;
  downloadUrl: string;
  downloadCount: number;
  rating: number; // calculated from ratings list
  ratingsCount: number;
  isTrending: boolean;
  isRecent: boolean;
  createdAt: string;
}

export interface ReviewRating {
  id: string;
  appId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
  appId?: string; // option to link to a game
  buttonText: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  downloadHistory: string[]; // array of appIds
  ratedApps: Record<string, number>; // map of appId -> rating val
  createdAt: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  sentBy: string;
}

export interface AppConfig {
  announcement: string;
  isAnnounceEnabled: boolean;
  siteName: string;
  bannerTitle: string;
  welcomeSubtitle: string;
  categories?: string[];
}

export interface DatabaseState {
  apps: AppItem[];
  slides: Slide[];
  reviews: ReviewRating[];
  users: User[];
  notifications: UserNotification[];
  config: AppConfig;
}
