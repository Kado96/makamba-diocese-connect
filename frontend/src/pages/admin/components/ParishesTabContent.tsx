import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { MapPin, Activity, BadgeCheck, Globe } from "lucide-react";

interface ParishesTabContentProps {
    settings: any;
}

const ParishesTabContent = React.memo(({ settings }: ParishesTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Header & Text Content */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" /> {t('admin_parishes_text_header', "Textes de la section Paroisses")}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Français Section */}
                    <div className="space-y-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🇫🇷</span>
                            <h4 className="font-bold text-sm uppercase text-slate-500">{t('lang_fr', 'Français')}</h4>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_badge_fr" className="text-xs font-bold text-slate-700">{t('admin_parishes_badge', "Badge (Petit texte vert)")}</label>
                            <Input
                                id="parishes_badge_fr"
                                name="parishes_badge_fr"
                                defaultValue={settings?.parishes_badge_fr}
                                placeholder="DÉCOUVRIR LE DIOCÈSE"
                                className="rounded-xl border-slate-200 h-10 font-bold text-emerald-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_title_fr" className="text-xs font-bold text-slate-700">{t('admin_title_section', "Titre Section")}</label>
                            <Input
                                id="parishes_title_fr"
                                name="parishes_title_fr"
                                defaultValue={settings?.parishes_title_fr}
                                className="rounded-xl border-slate-200 h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_description_fr" className="text-xs font-bold text-slate-700">{t('admin_desc_label', "Description")}</label>
                            <Textarea
                                id="parishes_description_fr"
                                name="parishes_description_fr"
                                defaultValue={settings?.parishes_description_fr}
                                className="rounded-xl border-slate-200 min-h-[100px]"
                            />
                        </div>
                    </div>

                    {/* English Section */}
                    <div className="space-y-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🇬🇧</span>
                            <h4 className="font-bold text-sm uppercase text-slate-500">{t('lang_en', 'English')}</h4>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_badge_en" className="text-xs font-bold text-slate-700">Badge</label>
                            <Input
                                id="parishes_badge_en"
                                name="parishes_badge_en"
                                defaultValue={settings?.parishes_badge_en}
                                placeholder="DISCOVER THE DIOCESE"
                                className="rounded-xl border-slate-200 h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_title_en" className="text-xs font-bold text-slate-700">Section Title</label>
                            <Input
                                id="parishes_title_en"
                                name="parishes_title_en"
                                defaultValue={settings?.parishes_title_en}
                                className="rounded-xl border-slate-200 h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishes_description_en" className="text-xs font-bold text-slate-700">Description</label>
                            <Textarea
                                id="parishes_description_en"
                                name="parishes_description_en"
                                defaultValue={settings?.parishes_description_en}
                                className="rounded-xl border-slate-200 min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Stats (The 20 and 8) */}
            <div className="p-6 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" /> {t('admin_parishes_stats_header', "Statistiques chiffrées")}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Paroisses Stats */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-emerald-500" />
                            <h4 className="font-bold text-slate-700">{t('admin_stat_parishes_title', "Chiffre : Paroisses")}</h4>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="stat_audience_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 20)")}</label>
                            <Input id="stat_audience_value" name="stat_audience_value" defaultValue={settings?.stat_audience_value} className="rounded-xl h-11 border-emerald-200 focus:ring-emerald-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="stat_audience_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                                <Input id="stat_audience_fr" name="stat_audience_fr" defaultValue={settings?.stat_audience_fr} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="stat_audience_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                                <Input id="stat_audience_en" name="stat_audience_en" defaultValue={settings?.stat_audience_en} className="h-9 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Communes Stats */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-emerald-500" />
                            <h4 className="font-bold text-slate-700">{t('admin_stat_communes_title', "Chiffre : Communes")}</h4>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="stat_languages_value" className="text-xs font-bold text-slate-500 uppercase">{t('admin_value_hint', "Valeur (ex: 8)")}</label>
                            <Input id="stat_languages_value" name="stat_languages_value" defaultValue={settings?.stat_languages_value} className="rounded-xl h-11 border-emerald-200 focus:ring-emerald-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="stat_languages_fr" className="text-[10px] font-bold text-slate-400">Label (FR)</label>
                                <Input id="stat_languages_fr" name="stat_languages_fr" defaultValue={settings?.stat_languages_fr} className="h-9 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="stat_languages_en" className="text-[10px] font-bold text-slate-400">Label (EN)</label>
                                <Input id="stat_languages_en" name="stat_languages_en" defaultValue={settings?.stat_languages_en} className="h-9 text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 3. Map Content */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-500" /> {t('admin_parishes_map_header', "Informations de la Carte")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="parishes_map_title_fr" className="text-sm font-bold text-slate-700">{t('admin_map_title', "Titre Carte")}</label>
                        <Input
                            id="parishes_map_title_fr"
                            name="parishes_map_title_fr"
                            defaultValue={settings?.parishes_map_title_fr}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="parishes_map_subtitle_fr" className="text-sm font-bold text-slate-700">{t('admin_map_subtitle', "Sous-titre Carte")}</label>
                        <Input
                            id="parishes_map_subtitle_fr"
                            name="parishes_map_subtitle_fr"
                            defaultValue={settings?.parishes_map_subtitle_fr}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

ParishesTabContent.displayName = "ParishesTabContent";

export default ParishesTabContent;
