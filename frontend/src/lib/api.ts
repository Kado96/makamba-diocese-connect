// ==============================================
// Client API centralisé pour Makamba Diocese Connect
// Gère les appels vers le backend Django avec fallback
// ==============================================

import type {
    Announcement,
    Testimonial,
    Sermon,
    SermonCategory,
    SiteSettings,
    Course,
    Parish,
    Ministry,
    MissionAxe,
    VisionValue,
    TimelineEvent,
    TeamMember,
    DiocesePresentation,
    PaginatedResponse,
} from './types';

import axios from 'axios';

// URL de base configurable via .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Instance Axios configurée pour l'API
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

/**
 * Intercepteur pour ajouter le token JWT à chaque requête
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Intercepteur pour gérer les réponses et les erreurs globales
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si l'erreur est 401 (Non autorisé), le token est probablement expirée ou invalide
        if (error.response && error.response.status === 401) {
            console.warn('[API] Erreur 401 détectée - Redirection vers login');

            // Ne pas rediriger si on est déjà sur la page de login ou si c'est une requête de refresh qui a échoué
            const isLoginRequest = error.config.url.includes('/login');
            const isRefreshRequest = error.config.url.includes('/refresh');
            const isLoginPage = window.location.pathname.includes('/admin/login');

            if (!isLoginRequest && !isRefreshRequest && !isLoginPage) {
                // Clear tokens and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Fonction fetch générique avec gestion d'erreurs (compatibilité descendante)
 * Retourne null en cas d'erreur (permet le fallback vers données statiques)
 */
async function apiFetch<T>(endpoint: string, options?: any): Promise<T | null> {
    try {
        const response = await api({
            url: endpoint,
            method: options?.method || 'GET',
            data: options?.body ? JSON.parse(options.body) : undefined,
            ...options
        });
        return response.data;
    } catch (error) {
        console.warn(`[API] Backend indisponible pour ${endpoint}:`, error);
        return null;
    }
}

export { api, API_BASE_URL };

// ==============================================
// Annonces / Actualités
// ==============================================

/**
 * Normalise le code de langue pour le backend (ex: 'fr-FR' -> 'fr')
 * Le backend attend un code de 2 caractères selon Announcement.LANGUAGE_CHOICES
 */
function normalizeLang(lang?: string): string {
    if (!lang) return 'fr';
    return lang.split('-')[0].toLowerCase();
}

/** Récupérer toutes les annonces actives */
export async function fetchAnnouncements(lang?: string): Promise<Announcement[] | null> {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Announcement>>(`/api/announcements/?language=${language}`);
    return data?.results ?? null;
}

/** Récupérer une annonce par ID */
export async function fetchAnnouncement(id: number): Promise<Announcement | null> {
    return apiFetch<Announcement>(`/api/announcements/${id}/`);
}

// ==============================================
// Témoignages
// ==============================================

/** Récupérer tous les témoignages */
export async function fetchTestimonials(lang?: string): Promise<Testimonial[] | null> {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Testimonial>>(`/api/testimonials/?language=${language}&status=published`);
    return data?.results ?? null;
}

// ==============================================
// Sermons / Ressources
// ==============================================

/** Récupérer tous les sermons */
export async function fetchSermons(lang?: string): Promise<Sermon[] | null> {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Sermon>>(`/api/sermons/?language=${language}`);
    return data?.results ?? null;
}

/** Récupérer les sermons en vedette */
export async function fetchFeaturedSermons(lang?: string): Promise<Sermon[] | null> {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Sermon>>(`/api/sermons/?featured=true&language=${language}`);
    return data?.results ?? null;
}

/** Récupérer les catégories de sermons */
export async function fetchSermonCategories(): Promise<SermonCategory[] | null> {
    const data = await apiFetch<PaginatedResponse<SermonCategory>>('/api/sermons/categories/');
    return data?.results ?? null;
}

// ==============================================
// Paramètres du site
// ==============================================

/** Récupérer les paramètres actuels du site */
export async function fetchSiteSettings(lang?: string): Promise<SiteSettings | null> {
    const language = normalizeLang(lang);
    return apiFetch<SiteSettings>(`/api/settings/current/?language=${language}`);
}

/**
 * Récupère les émissions / cours (Ministères)
 */
export const fetchCourses = async (lang?: string): Promise<Course[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Course>>(`/api/courses/?language=${language}`);
    return data?.results ?? null;
};

/** Récupère les paroisses */
export const fetchParishes = async (): Promise<Parish[] | null> => {
    const data = await apiFetch<PaginatedResponse<Parish>>(`/api/parishes/`);
    return data?.results ?? null;
};

/** Récupère les ministères */
export const fetchMinistries = async (lang?: string): Promise<Ministry[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<Ministry>>(`/api/ministries/?language=${language}`);
    return data?.results ?? null;
};

// ==============================================
// Pages Statiques (Contenu Dynamique)
// ==============================================

/** Récupère la chronologie historique */
export const fetchTimeline = async (lang?: string): Promise<TimelineEvent[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<TimelineEvent>>(`/api/pages/timeline/?language=${language}`);
    return data?.results ?? null;
};

/** Récupère les axes de mission */
export const fetchMissionAxes = async (lang?: string): Promise<MissionAxe[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<MissionAxe>>(`/api/pages/axes/?language=${language}`);
    return data?.results ?? null;
};

/** Récupère les valeurs de la vision */
export const fetchVisionValues = async (lang?: string): Promise<VisionValue[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<VisionValue>>(`/api/pages/values/?language=${language}`);
    return data?.results ?? null;
};

/** Récupère les membres de l'équipe */
export const fetchTeamMembers = async (lang?: string): Promise<TeamMember[] | null> => {
    const language = normalizeLang(lang);
    const data = await apiFetch<PaginatedResponse<TeamMember>>(`/api/pages/team/?language=${language}`);
    return data?.results ?? null;
};

/** Récupère la présentation complète du diocèse (Singleton) */
export const fetchDiocesePresentation = async (lang?: string): Promise<DiocesePresentation | null> => {
    const language = normalizeLang(lang);
    return await apiFetch<DiocesePresentation>(`/api/pages/diocese-presentation/current/?language=${language}`);
};

// ==============================================
// Contact (envoi de message)
// ==============================================

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

/** Envoyer un message via le formulaire de contact */
export async function sendContactMessage(data: ContactFormData): Promise<boolean> {
    // Note: L'endpoint /api/announcements/ n'est probablement pas le bon pour le contact.
    // Mais nous gardons la structure en attendant de confirmer l'existence d'un endpoint de contact dédié.
    const result = await apiFetch('/api/announcements/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result !== null;
}

