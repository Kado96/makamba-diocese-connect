import React from "react";
import { Globe, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface LanguageTabContentProps {
    lang: string;
    settings: any;
}

const LanguageTabContent = React.memo(({ lang, settings }: LanguageTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" /> {t('admin_section_hero', "Section Héro")}
                </h3>

                {/* Hero Image - Only on French tab for simplicity since it's a singleton */}
                {lang === "fr" && (
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6 space-y-4">
                        <label htmlFor="hero_image" className="text-sm font-bold text-blue-900 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> {t('admin_hero_image_label', "Image de fond (Héro)")}
                        </label>

                        {settings?.hero_image_display && (
                            <div className="relative aspect-[21/9] w-full max-h-[150px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                <img
                                    src={settings.hero_image_display}
                                    className="w-full h-full object-cover"
                                    alt="Hero Preview"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <ImageIcon className="text-white h-8 w-8" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                id="hero_image"
                                type="file"
                                name="hero_image"
                                className="rounded-xl border-slate-200"
                            />
                            <p className="text-xs text-slate-400 italic">
                                {t('admin_hero_image_tip_global', "Format suggéré : 1920x1080px. Cette image sera affichée pour toutes les langues.")}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                        <label htmlFor={`hero_badge_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_badge_label', "Badge (Sur-titre)")}</label>
                        <Input
                            id={`hero_badge_${lang}`}
                            name={`hero_badge_${lang}`}
                            defaultValue={settings?.[`hero_badge_${lang}`]}
                            placeholder="KANISA LA ANGLIKANA BURUNDI"
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_title_label', "Titre Héro")}</label>
                        <Input
                            id={`hero_title_${lang}`}
                            name={`hero_title_${lang}`}
                            defaultValue={settings?.[`hero_title_${lang}`]}
                            placeholder="Diocèse de Makamba"
                            className="rounded-xl h-12 border-slate-200 focus:bg-white font-heading font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_subtitle_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_subtitle_label', "Sous-titre Héro")}</label>
                        <Textarea
                            id={`hero_subtitle_${lang}`}
                            name={`hero_subtitle_${lang}`}
                            defaultValue={settings?.[`hero_subtitle_${lang}`]}
                            placeholder="Servir Dieu et notre prochain au cœur de Makamba..."
                            className="rounded-xl min-h-[100px] border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_btn1_text_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_btn1_text', "Texte Bouton 1 (Principal)")}</label>
                        <Input
                            id={`hero_btn1_text_${lang}`}
                            name={`hero_btn1_text_${lang}`}
                            defaultValue={settings?.[`hero_btn1_text_${lang}`]}
                            placeholder="Découvrir le diocèse"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_btn1_link_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_btn1_link', "Lien Bouton 1")}</label>
                        <Input
                            id={`hero_btn1_link_${lang}`}
                            name={`hero_btn1_link_${lang}`}
                            defaultValue={settings?.[`hero_btn1_link_${lang}`]}
                            placeholder="/diocese"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_btn2_text_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_btn2_text', "Texte Bouton 2 (Secondaire)")}</label>
                        <Input
                            id={`hero_btn2_text_${lang}`}
                            name={`hero_btn2_text_${lang}`}
                            defaultValue={settings?.[`hero_btn2_text_${lang}`]}
                            placeholder="Vie du diocèse"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`hero_btn2_link_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_hero_btn2_link', "Lien Bouton 2")}</label>
                        <Input
                            id={`hero_btn2_link_${lang}`}
                            name={`hero_btn2_link_${lang}`}
                            defaultValue={settings?.[`hero_btn2_link_${lang}`]}
                            placeholder="/actualites"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{t('admin_section_vision', "Vision & Missions")}</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor={`vision_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_vision_title', "Titre Vision")}</label>
                        <Input
                            id={`vision_title_${lang}`}
                            name={`vision_title_${lang}`}
                            defaultValue={settings?.[`vision_title_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`vision_description_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_vision_desc', "Description Vision")}</label>
                        <Textarea
                            id={`vision_description_${lang}`}
                            name={`vision_description_${lang}`}
                            defaultValue={settings?.[`vision_description_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    {/* Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                                <label htmlFor={`vision_pillar${num}_title_${lang}`} className="text-xs font-bold text-slate-500 uppercase">{t('admin_pillar_label', "Pilier")} {num}</label>
                                <Input
                                    id={`vision_pillar${num}_title_${lang}`}
                                    name={`vision_pillar${num}_title_${lang}`}
                                    placeholder={t('admin_title_label', "Titre")}
                                    defaultValue={settings?.[`vision_pillar${num}_title_${lang}`]}
                                    className="rounded-lg h-9"
                                />
                                <label htmlFor={`vision_pillar${num}_desc_${lang}`} className="sr-only">Description Pilier {num}</label>
                                <Textarea
                                    id={`vision_pillar${num}_desc_${lang}`}
                                    name={`vision_pillar${num}_desc_${lang}`}
                                    placeholder={t('admin_desc_label', "Description")}
                                    defaultValue={settings?.[`vision_pillar${num}_desc_${lang}`]}
                                    className="rounded-lg text-xs"
                                />
                                {lang === "fr" && (
                                    <div className="space-y-1">
                                        <label htmlFor={`vision_pillar${num}_icon_${lang}`} className="text-[10px] font-bold text-slate-400">{t('admin_icon_label', "Icône")}</label>
                                        <Input
                                            id={`vision_pillar${num}_icon_${lang}`}
                                            name={`vision_pillar${num}_icon`}
                                            placeholder={t('admin_icon_placeholder', "Nom de l'icône")}
                                            defaultValue={settings?.[`vision_pillar${num}_icon`]}
                                            className="rounded-lg h-8 text-xs font-mono"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{t('admin_section_engage', "Engagement")}</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor={`engage_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_engage_title', "Titre Engagement")}</label>
                        <Input
                            id={`engage_title_${lang}`}
                            name={`engage_title_${lang}`}
                            defaultValue={settings?.[`engage_title_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`engage_description_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_engage_desc', "Description Engagement")}</label>
                        <Textarea
                            id={`engage_description_${lang}`}
                            name={`engage_description_${lang}`}
                            defaultValue={settings?.[`engage_description_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                    {/* Items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50 space-y-3">
                                <label htmlFor={`engage_item${num}_title_${lang}`} className="text-xs font-bold text-emerald-600 uppercase">{t('admin_point_label', "Point")} {num}</label>
                                <Input
                                    id={`engage_item${num}_title_${lang}`}
                                    name={`engage_item${num}_title_${lang}`}
                                    placeholder={t('admin_title_label', "Titre")}
                                    defaultValue={settings?.[`engage_item${num}_title_${lang}`]}
                                    className="rounded-lg h-9"
                                />
                                <label htmlFor={`engage_item${num}_desc_${lang}`} className="sr-only">Description Point {num}</label>
                                <Textarea
                                    id={`engage_item${num}_desc_${lang}`}
                                    name={`engage_item${num}_desc_${lang}`}
                                    placeholder={t('admin_desc_label', "Description")}
                                    defaultValue={settings?.[`engage_item${num}_desc_${lang}`]}
                                    className="rounded-lg text-xs"
                                />
                                <label htmlFor={`engage_item${num}_cta_${lang}`} className="sr-only">Bouton Point {num}</label>
                                <Input
                                    id={`engage_item${num}_cta_${lang}`}
                                    name={`engage_item${num}_cta_${lang}`}
                                    placeholder={t('admin_btn_text_placeholder', "Texte Bouton")}
                                    defaultValue={settings?.[`engage_item${num}_cta_${lang}`]}
                                    className="rounded-lg h-9"
                                />
                                {lang === "fr" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label htmlFor={`engage_item${num}_href_${lang}`} className="text-[10px] font-bold text-slate-400">{t('admin_link_label', "Lien")}</label>
                                            <Input
                                                id={`engage_item${num}_href_${lang}`}
                                                name={`engage_item${num}_href`}
                                                placeholder="/..."
                                                defaultValue={settings?.[`engage_item${num}_href`]}
                                                className="h-8 text-[10px]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor={`engage_item${num}_icon_${lang}`} className="text-[10px] font-bold text-slate-400">{t('admin_icon_label', "Icône")}</label>
                                            <Input
                                                id={`engage_item${num}_icon_${lang}`}
                                                name={`engage_item${num}_icon`}
                                                placeholder="Users..."
                                                defaultValue={settings?.[`engage_item${num}_icon`]}
                                                className="h-8 text-[10px]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{t('admin_parishes', "Paroisses")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`parishes_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_title_section', "Titre Section")}</label>
                        <Input
                            id={`parishes_title_${lang}`}
                            name={`parishes_title_${lang}`}
                            defaultValue={settings?.[`parishes_title_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`parishes_description_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_desc_label', "Description")}</label>
                        <Textarea
                            id={`parishes_description_${lang}`}
                            name={`parishes_description_${lang}`}
                            defaultValue={settings?.[`parishes_description_${lang}`]}
                            className="rounded-xl border-slate-200 min-h-[80px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`parishes_map_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_map_title', "Titre Carte")}</label>
                        <Input
                            id={`parishes_map_title_${lang}`}
                            name={`parishes_map_title_${lang}`}
                            defaultValue={settings?.[`parishes_map_title_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`parishes_map_subtitle_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_map_subtitle', "Sous-titre Carte")}</label>
                        <Input
                            id={`parishes_map_subtitle_${lang}`}
                            name={`parishes_map_subtitle_${lang}`}
                            defaultValue={settings?.[`parishes_map_subtitle_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                    <div className="space-y-2 col-span-full">
                        <label htmlFor={`parishes_map_stats_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_map_stats', "Stats Carte")}</label>
                        <Input
                            id={`parishes_map_stats_${lang}`}
                            name={`parishes_map_stats_${lang}`}
                            defaultValue={settings?.[`parishes_map_stats_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    {t('admin_misc', "Divers")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`about_content_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_about_label', "À Propos")}</label>
                        <Textarea
                            id={`about_content_${lang}`}
                            name={`about_content_${lang}`}
                            defaultValue={settings?.[`about_content_${lang}`]}
                            className="rounded-xl min-h-[150px] border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`bible_verse_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_bible_verse_label', "Verset Biblique")}</label>
                        <Textarea
                            id={`bible_verse_${lang}`}
                            name={`bible_verse_${lang}`}
                            defaultValue={settings?.[`bible_verse_${lang}`]}
                            className="rounded-xl border-slate-200 focus:bg-white italic"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`bible_verse_ref_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_bible_verse_ref_label', "Référence du Verset")}</label>
                        <Input
                            id={`bible_verse_ref_${lang}`}
                            name={`bible_verse_ref_${lang}`}
                            defaultValue={settings?.[`bible_verse_ref_${lang}`]}
                            placeholder="Romains 15:13"
                            className="rounded-xl border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{t('admin_section_stories', "Actualités / Stories")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`stories_badge_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_badge_label', "Badge")}</label>
                        <Input
                            id={`stories_badge_${lang}`}
                            name={`stories_badge_${lang}`}
                            defaultValue={settings?.[`stories_badge_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`stories_title_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_title_label', "Titre")}</label>
                        <Input
                            id={`stories_title_${lang}`}
                            name={`stories_title_${lang}`}
                            defaultValue={settings?.[`stories_title_${lang}`]}
                            className="rounded-xl border-slate-200 h-10"
                        />
                    </div>
                </div>
            </div>
            {/* Section Header & Navigation */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-500" /> {t('admin_section_header', "Navigation & En-tête")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor={`header_slogan_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_header_slogan_label', "Slogan du Logo")}</label>
                        <Input
                            id={`header_slogan_${lang}`}
                            name={`header_slogan_${lang}`}
                            defaultValue={settings?.[`header_slogan_${lang}`]}
                            placeholder="KANISA LA ANGLIKANA BURUNDI"
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`header_admin_btn_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_header_admin_btn_label', "Bouton Admin (Texte)")}</label>
                        <Input
                            id={`header_admin_btn_${lang}`}
                            name={`header_admin_btn_${lang}`}
                            defaultValue={settings?.[`header_admin_btn_${lang}`]}
                            placeholder="Connexion Admin"
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Section Footer */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-slate-500" /> {t('admin_section_footer', "Pied de page")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor={`footer_description_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_footer_desc_label', "Description du Footer")}</label>
                        <Textarea
                            id={`footer_description_${lang}`}
                            name={`footer_description_${lang}`}
                            defaultValue={settings?.[`footer_description_${lang}`]}
                            placeholder="Église Anglicane du Burundi. Servir Dieu..."
                            className="rounded-xl min-h-[100px] border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`footer_copyright_${lang}`} className="text-sm font-bold text-slate-700">{t('admin_footer_copyright_label', "Texte Copyright")}</label>
                        <Input
                            id={`footer_copyright_${lang}`}
                            name={`footer_copyright_${lang}`}
                            defaultValue={settings?.[`footer_copyright_${lang}`]}
                            placeholder="© 2024 Diocese Makamba. Tous droits réservés."
                            className="rounded-xl h-10 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

LanguageTabContent.displayName = "LanguageTabContent";

export default LanguageTabContent;
