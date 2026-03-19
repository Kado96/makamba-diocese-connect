import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import ImageFieldWithPreview from "./ImageFieldWithPreview";

const DiocesePresentationTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: presentation, isLoading } = useQuery({
        queryKey: ["admin-diocese-presentation"],
        queryFn: async () => {
            const response = await api.get("/api/pages/diocese-presentation/current/");
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.patch("/api/pages/diocese-presentation/current/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-diocese-presentation"] });
            toast.success(t('admin_save_success', "Présentation du diocèse mise à jour avec succès"));
        },
        onError: (error: any) => {
            console.error("Update Error:", error);
            const detail = error.response?.data?.detail || t('admin_save_error', "Erreur lors de l'enregistrement");
            toast.error(detail);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const cleanedFormData = new FormData();

        formData.forEach((value, key) => {
            if (value instanceof File && value.size === 0) return;
            if (value === "" || value === "null" || value === "undefined") return;
            cleanedFormData.append(key, value);
        });

        updateMutation.mutate(cleanedFormData);
    };

    const [activeLang, setActiveLang] = React.useState("fr");

    const langs = [
        { code: "fr", label: `🇫🇷 ${t('lang_fr', 'Français')}` },
        { code: "en", label: `🇬🇧 ${t('lang_en', 'English')}` },
    ];

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement de la présentation...")}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/30">
            {/* ── Language Selector ── */}
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-flex gap-1">
                {langs.map((l) => (
                    <button
                        key={l.code}
                        type="button"
                        onClick={() => setActiveLang(l.code)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeLang === l.code
                            ? "bg-violet-600 text-white shadow-md"
                            : "text-slate-500 hover:bg-white hover:text-slate-700"
                            }`}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* HERO SETTINGS */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_section_hero', "Entête de la page (Hero)")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_hero_image_tip', "L'immense photo et le texte qui s'affichent tout en haut de la page Diocese.")}</p>
                </div>

                <div className="space-y-4">
                    <ImageFieldWithPreview
                        fieldName="hero_image"
                        label={t('admin_hero_image_label', "Image de fond du Héro")}
                        currentImageUrl={presentation?.hero_image_display}
                        hint={t('admin_image_tip_high', 'JPG, PNG (Très haute résolution, format paysage)')}
                        aspectRatio="21/9"
                        maxPreviewHeight="200px"
                    />
                    
                    <div className="space-y-2">
                        <label htmlFor={`hero_subtitle_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_hero_subtitle_label', "Sous-titre Héro")} ({activeLang})</label>
                        <Textarea
                            id={`hero_subtitle_${activeLang}`}
                            name={`hero_subtitle_${activeLang}`}
                            key={`hero_subtitle_${activeLang}`}
                            defaultValue={presentation?.[`hero_subtitle_${activeLang}`] || ""}
                            rows={3}
                            className="w-full rounded-2xl min-h-[80px] bg-slate-50/50"
                            placeholder={t('admin_hero_subtitle_placeholder', "Texte d'accroche sous le titre principal...")}
                        />
                    </div>
                </div>
            </div>

            {/* H I S T O I R E */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_tab_history', "Notre Histoire / Origines")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_history_text_tip', "Le texte principal racontant l'histoire du diocèse.")}</p>
                </div>

                <div className="space-y-4">
                    <label htmlFor={`history_text_${activeLang}`} className="sr-only">Texte de l'histoire ({activeLang})</label>
                    <Textarea
                        id={`history_text_${activeLang}`}
                        name={`history_text_${activeLang}`}
                        key={`history_text_${activeLang}`}
                        defaultValue={presentation?.[`history_text_${activeLang}`] || ""}
                        rows={8}
                        className="w-full rounded-2xl min-h-[150px] bg-slate-50/50"
                        placeholder={t('admin_history_text_placeholder', "Rédigez l'histoire du diocèse de Makamba ici...")}
                    />
                </div>

                <ImageFieldWithPreview
                    fieldName="history_image"
                    label={t('admin_history_image_label', 'Image Historique')}
                    currentImageUrl={presentation?.history_image_display}
                    hint={t('admin_image_tip_landscape', 'JPG, PNG (Ratio Paysage recommandé)')}
                    aspectRatio="16/9"
                    maxPreviewHeight="160px"
                />
            </div>

            {/* C H R O N O L O G I E  (TIMELINE) */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_tab_history_timeline', "Chronologie Majeure (Dates Clés)")}</h3>
                        <p className="text-sm text-slate-500 mt-2">{t('admin_timeline_tip', "Gérez les dates importantes (1934, 1960, 2009...) affichées sur le site.")}</p>
                    </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center h-24">
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                        <Info className="h-5 w-5 text-violet-500" />
                        {t('admin_timeline_managed_below', "Utilisez l'onglet 'Historique' en haut de la page pour ajouter ou modifier ces dates spécifiques.")}
                    </p>
                </div>
            </div>

            {/* E V Ê Q U E */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_bishop_word', "Le mot de l'Évêque")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_bishop_tip', "Informations sur l'évêque et son message pastoral.")}</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="bishop_name" className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_bishop_name_label', "Nom de l'Évêque")}</label>
                    <Input
                        id="bishop_name"
                        type="text"
                        name="bishop_name"
                        defaultValue={presentation?.bishop_name || ""}
                        className="rounded-xl h-12 bg-slate-50/50"
                        placeholder={t('admin_bishop_name_placeholder', "Ex: Rt. Rev. Martin Blaise Nyaboho")}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor={`bishop_message_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_bishop_message_label', "Message / Mot de l'Evêque")}</label>
                    <Textarea
                        id={`bishop_message_${activeLang}`}
                        name={`bishop_message_${activeLang}`}
                        key={`bishop_message_${activeLang}`}
                        defaultValue={presentation?.[`bishop_message_${activeLang}`] || ""}
                        rows={6}
                        className="w-full rounded-2xl min-h-[120px] bg-slate-50/50"
                        placeholder={t('admin_bishop_message_placeholder', "Message de bienvenue ou de la vision pastorale...")}
                    />
                </div>

                <ImageFieldWithPreview
                    fieldName="bishop_photo"
                    label={t('admin_photo_official_label', 'Photo Officielle')}
                    currentImageUrl={presentation?.bishop_photo_display}
                    hint={t('admin_image_tip_portrait', 'JPG, PNG (Ratio Portrait recommandé)')}
                    aspectRatio="3/4"
                    maxPreviewHeight="200px"
                />
            </div>

            {/* O R G A N I S A T I O N */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_organization_title', "Organisation")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_organization_tip', "Texte expliquant la structure du diocèse.")}</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor={`organization_text_${activeLang}`} className="sr-only">{t('admin_organization_label', 'Texte de l\'organisation')} ({activeLang})</label>
                    <Textarea
                        id={`organization_text_${activeLang}`}
                        name={`organization_text_${activeLang}`}
                        key={`organization_text_${activeLang}`}
                        defaultValue={presentation?.[`organization_text_${activeLang}`] || ""}
                        rows={6}
                        className="w-full rounded-2xl min-h-[120px] bg-slate-50/50"
                        placeholder={t('admin_organization_placeholder', "Comment est structuré le diocèse, ses entités clés...")}
                    />
                </div>
            </div>

            {/* V I S I O N  &  M I S S I O N */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('vision_title', "Vision & Mission")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_vision_tip', "Gérez le titre et la description de la section Vision.")}</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor={`vision_title_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_vision_title', "Titre de la Vision")} ({activeLang})</label>
                    <Input
                        id={`vision_title_${activeLang}`}
                        name={`vision_title_${activeLang}`}
                        key={`vision_title_${activeLang}`}
                        defaultValue={presentation?.[`vision_title_${activeLang}`] || ""}
                        className="rounded-xl h-12 bg-slate-50/50"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor={`vision_description_${activeLang}`} className="text-sm font-bold text-slate-700 cursor-pointer">{t('admin_vision_desc', "Description de la Vision")} ({activeLang})</label>
                    <Textarea
                        id={`vision_description_${activeLang}`}
                        name={`vision_description_${activeLang}`}
                        key={`vision_description_${activeLang}`}
                        defaultValue={presentation?.[`vision_description_${activeLang}`] || ""}
                        rows={4}
                        className="w-full rounded-2xl min-h-[100px] bg-slate-50/50"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-12 px-8 rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-95 text-lg font-bold"
                >
                    {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {t('admin_save_presentation', "Enregistrer la présentation")}
                </Button>
            </div>
        </form>
    );
};

export default DiocesePresentationTab;
