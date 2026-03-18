import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import storyEducation from '@/assets/story-education.jpg';
import storyWomen from '@/assets/story-women.jpg';
import storyYouth from '@/assets/story-youth.jpg';
import {
    fetchAnnouncements,
    fetchTestimonials,
    fetchSiteSettings,
    fetchSermons,
    fetchSermonCategories,
    fetchParishes,
    fetchMinistries,
    fetchTimeline,
    fetchMissionAxes,
    fetchVisionValues,
    fetchTeamMembers,
    fetchDiocesePresentation,
} from '@/lib/api';
import type {
    Announcement,
    Testimonial,
    Sermon,
    SermonCategory,
    SiteSettings,
    Parish,
    Ministry,
    TimelineEvent,
    MissionAxe,
    VisionValue,
    TeamMember,
    DiocesePresentation,
} from '@/lib/types';

/** Images par défaut pour les actualités/témoignages */
export const FALLBACK_IMAGES = [
    storyEducation,
    storyWomen,
    storyYouth,
];

/**
 * Hook pour les actualités
 */
export function useAnnouncements() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<Announcement[]>({
        queryKey: ['announcements', lang],
        queryFn: async () => {
            const data = await fetchAnnouncements(lang);
            // Tri par priorité et date si nécessaire
            return data ?? [];
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook pour les témoignages
 */
export function useTestimonials() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<Testimonial[]>({
        queryKey: ['testimonials', lang],
        queryFn: async () => {
            const data = await fetchTestimonials(lang);
            return data ?? [];
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook pour les sermons
 */
export function useSermons() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<Sermon[]>({
        queryKey: ['sermons', lang],
        queryFn: async () => {
            const data = await fetchSermons(lang);
            return data ?? [];
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook pour les catégories de sermons
 */
export function useSermonCategories() {
    return useQuery<SermonCategory[]>({
        queryKey: ['sermon-categories'],
        queryFn: async () => {
            const data = await fetchSermonCategories();
            return data ?? [];
        },
        staleTime: 60 * 60 * 1000,
    });
}

/**
 * Hook pour les réglages du site
 */
export function useSiteSettings() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<SiteSettings>({
        queryKey: ['site-settings', lang],
        queryFn: async () => {
            const data = await fetchSiteSettings(lang);
            if (!data) throw new Error('Could not fetch site settings');
            return data;
        },
        staleTime: 30 * 1000, // 30 seconds
    });
}



/**
 * Hook pour les paroisses
 */
export function useParishes() {
    return useQuery<Parish[]>({
        queryKey: ['parishes'],
        queryFn: async () => {
            const data = await fetchParishes();
            return data ?? [];
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook pour les ministères
 */
export function useMinistries() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<Ministry[]>({
        queryKey: ['ministries', lang],
        queryFn: async () => {
            const data = await fetchMinistries(lang);
            return data ?? [];
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook pour la chronologie (Historique)
 */
export function useTimeline() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<TimelineEvent[]>({
        queryKey: ['timeline', lang],
        queryFn: async () => {
            const data = await fetchTimeline(lang);
            return data ?? [];
        },
        staleTime: 60 * 60 * 1000,
    });
}

/**
 * Hook pour les axes de mission
 */
export function useMissionAxes() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<MissionAxe[]>({
        queryKey: ['mission-axes', lang],
        queryFn: async () => {
            const data = await fetchMissionAxes(lang);
            return data ?? [];
        },
        staleTime: 60 * 60 * 1000,
    });
}

/**
 * Hook pour les valeurs
 */
export function useVisionValues() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<VisionValue[]>({
        queryKey: ['vision-values', lang],
        queryFn: async () => {
            const data = await fetchVisionValues(lang);
            return data ?? [];
        },
        staleTime: 60 * 60 * 1000,
    });
}

/**
 * Hook pour les membres de l'équipe
 */
export function useTeamMembers() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<TeamMember[]>({
        queryKey: ['team-members', lang],
        queryFn: async () => {
            const data = await fetchTeamMembers(lang);
            return data ?? [];
        },
        staleTime: 60 * 60 * 1000,
    });
}

/**
 * Hook pour la présentation du diocèse
 */
export function useDiocesePresentation() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    return useQuery<DiocesePresentation | null>({
        queryKey: ['diocese-presentation', lang],
        queryFn: async () => {
            return await fetchDiocesePresentation(lang);
        },
        staleTime: 60 * 60 * 1000,
    });
}

