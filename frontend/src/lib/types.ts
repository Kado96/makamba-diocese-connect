export interface Announcement {
    id: number;
    title: string;
    content: string;
    image_url: string;
    category: string;
    created_at: string;
    event_date?: string;
    is_active: boolean;
    priority: string;
    image?: string;
    image_display?: string;
    video_url: string | null;
    audio_url: string | null;
}

export interface Testimonial {
    id: number;
    author: string;
    role: string;
    content: string;
    image_url: string;
}

export interface Sermon {
    id: number;
    title: string;
    description: string;
    preacher_name: string;
    sermon_date: string;
    content_type: 'video' | 'audio' | 'youtube' | 'document';
    category?: number;
    category_name?: string;
    language: string;
    duration_minutes?: number;
    video_url?: string;
    video_file?: string;
    video_display_url?: string;
    audio_url?: string;
    audio_file?: string;
    audio_display_url?: string;
    document_file?: string;
    document_display_url?: string;
    image?: string;
    image_url?: string;
    featured: boolean;
    is_active: boolean;
    views_count: number;
}

export interface SermonCategory {
    id: number;
    name: string;
    slug: string;
}

export interface SiteSettings {
    id: number;
    site_name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    default_language: 'fr' | 'rn' | 'en' | 'sw';
    facebook_url: string;
    youtube_url: string;
    instagram_url: string;
    twitter_url: string;
    whatsapp_url: string;

    // Stats - Valeurs (universelles)
    stat_years_value: string;
    stat_emissions_value: string;
    stat_audience_value: string;
    stat_languages_value: string;

    // Diocese & Pages
    diocese_subtitle_fr: string;
    history_subtitle_fr: string;
    history_intro_title_fr: string;
    history_intro_text_fr: string;
    vision_subtitle_fr: string;
    vision_text_fr: string;
    mission_intro_fr: string;

    // Leadership
    bishop_bio_p1_fr: string;
    bishop_bio_p2_fr: string;

    // Multilingual content
    quote_text_fr: string;
    quote_author_name_fr: string;
    quote_author_subtitle_fr: string;
    team_title_fr: string;
    team_description_fr: string;

    // Footer & Call to action
    footer_text_fr: string;
    cta_title_fr: string;
    cta_description_fr: string;
    btn_donate_fr: string;
    btn_sermons_fr: string;
    btn_actualites_fr: string;
    btn_paroisses_fr: string;
    btn_ministeres_fr: string;
    btn_ressources_fr: string;
    btn_contact_fr: string;
    btn_leader_fr: string;
    btn_teachings_fr: string;
    btn_meditation_fr: string;

    // Nouveaux champs multilingues
    [key: string]: any;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    is_active: boolean;
    created_at: string;
}

export interface Parish {
    id: number;
    name: string;
    zone: string;
    faithful: string;
    pastor: string;
    phone: string;
    image?: string;
    image_display?: string;
}

export interface DiocesePresentation {
    id: number;
    hero_image: string | null;
    hero_image_display?: string | null;
    history_text: string | null;
    history_image: string | null;
    history_image_display?: string | null;
    bishop_name: string | null;
    bishop_message: string | null;
    bishop_photo: string | null;
    bishop_photo_display?: string | null;
    organization_text: string | null;
}

export interface Ministry {
    id: number;
    title: string;
    mission: string;
    icon: string;
    testimony_quote: string;
    testimony_author: string;
    image?: string;
    image_display?: string;
    activities: { id: number; title: string }[];
}

export interface TimelineEvent {
    id: number;
    year: string;
    title: string;
    description: string;
    image?: string;
    image_display?: string;
    order: number;
}

export interface MissionAxe {
    id: number;
    text: string;
    image?: string;
    image_display?: string;
    order: number;
}

export interface VisionValue {
    id: number;
    icon: string;
    title: string;
    image?: string;
    image_display?: string;
    description: string;
    order: number;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    description: string;
    image?: string;
    image_display?: string;
    order: number;
}

/** Réponse paginée de l'API DRF */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
