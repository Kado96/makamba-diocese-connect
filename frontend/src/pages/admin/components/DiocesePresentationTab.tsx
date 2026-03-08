import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

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
        { code: "rn", label: `🇧🇮 ${t('lang_rn', 'Kirundi')}` },
        { code: "en", label: `🇬🇧 ${t('lang_en', 'English')}` },
        { code: "sw", label: `🇹🇿 ${t('lang_sw', 'Kiswahili')}` },
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

            {/* HERO IMAGE */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 border-b pb-2">{t('admin_photo_label', "Image Principale (Bandeau Hero)")}</h3>
                    <p className="text-sm text-slate-500 mt-2">{t('admin_hero_image_tip', "L'immense photo qui s'affiche tout en haut de la page Diocese.")}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-6 items-start flex-col sm:flex-row">
                        {presentation?.hero_image_display && (
                            <div className="w-full sm:w-64 h-36 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex-shrink-0">
                                <img src={presentation.hero_image_display} alt="Bandeau Hero" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 w-full mt-2 space-y-2">
                            <label htmlFor="hero_image" className="sr-only">{t('admin_hero_image_label', 'Image de fond du Héro')}</label>
                            <Input id="hero_image" type="file" name="hero_image" accept="image/*" className="rounded-xl h-12 cursor-pointer" />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> {t('admin_image_tip_high', 'JPG, PNG (Très haute résolution, format paysage)')}
                            </p>
                        </div>
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

                <div className="space-y-4">
                    <label htmlFor="history_image" className="block text-sm font-bold text-slate-700 cursor-pointer">{t('admin_history_image_label', 'Image Historique')}</label>
                    <div className="flex gap-6 items-start">
                        {presentation?.history_image_display && (
                            <div className="w-40 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex-shrink-0">
                                <img src={presentation.history_image_display} alt={t('admin_tab_history', "Historique")} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <Input id="history_image" type="file" name="history_image" accept="image/*" className="rounded-xl h-12 cursor-pointer" />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> {t('admin_image_tip_landscape', 'JPG, PNG (Ratio Paysage recommandé)')}
                            </p>
                        </div>
                    </div>
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

                <div className="space-y-4">
                    <label htmlFor="bishop_photo" className="block text-sm font-bold text-slate-700 cursor-pointer">{t('admin_photo_official_label', 'Photo Officielle')}</label>
                    <div className="flex gap-6 items-start">
                        {presentation?.bishop_photo_display && (
                            <div className="w-32 h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex-shrink-0">
                                <img src={presentation.bishop_photo_display} alt="Évêque" className="w-full h-full object-cover object-top" />
                            </div>
                        )}
                        <div className="flex-1">
                            <Input id="bishop_photo" type="file" name="bishop_photo" accept="image/*" className="rounded-xl h-12 cursor-pointer" />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> {t('admin_image_tip_portrait', 'JPG, PNG (Ratio Portrait recommandé)')}
                            </p>
                        </div>
                    </div>
                </div>
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
