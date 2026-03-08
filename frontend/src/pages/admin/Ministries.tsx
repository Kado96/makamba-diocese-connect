import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Users,
    Plus,
    Trash2,
    Edit,
    Check,
    Loader2,
    Sprout,
    Search,
    ChevronRight,
    Activity
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const AdminMinistries = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const langs = [
        { code: "fr", label: "🇫🇷 FR" },
        { code: "rn", label: "🇧🇮 RN" },
        { code: "en", label: "🇬🇧 EN" },
        { code: "sw", label: "🇹🇿 SW" },
    ];

    // Queries
    const { data: ministries, isLoading } = useQuery({
        queryKey: ["admin-ministries", activeLang],
        queryFn: async () => {
            const res = await api.get(`/api/ministries/?language=${activeLang}`);
            return res.data.results || res.data;
        }
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/ministries/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
            queryClient.invalidateQueries({ queryKey: ["ministries"] });
            toast.success(t('admin_delete_success', "Ministère supprimé avec succès"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (id) {
                await api.patch(`/api/ministries/${id}/`, data, config);
            } else {
                await api.post("/api/ministries/", data, config);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
            queryClient.invalidateQueries({ queryKey: ["ministries"] });
            toast.success(variables.id ? t('admin_save_success', "Ministère mis à jour") : t('admin_save_success', "Ministère ajouté"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
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
        saveMutation.mutate({ data: cleanedFormData, id: editingItem?.id });
    };

    const filteredMinistries = ministries?.filter((m: any) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.mission.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des ministères...")}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_ministries_title', "Gestion des Ministères")} <Users className="h-8 w-8 text-blue-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_ministries_subtitle', "Gérez les différents départements et services du diocèse.")}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group hidden sm:block">
                            <label htmlFor="ministry-search" className="sr-only">{t('admin_search_ministry', 'Rechercher un ministère')}</label>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                id="ministry-search"
                                name="search"
                                placeholder={t('admin_search_placeholder', "Rechercher un ministère...")}
                                className="pl-10 h-12 w-[300px] rounded-xl border-slate-200 focus:ring-blue-500/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setActiveLang(l.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>

                        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                            if (!open) {
                                setIsAddDialogOpen(false);
                                setEditingItem(null);
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                                    <Plus className="h-5 w-5" /> Nouveau Ministère
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold">
                                        {editingItem ? t('admin_edit_ministry', "Modifier le Ministère") : t('admin_new_ministry', "Nouveau Ministère")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_ministries_desc', "Gérez les ministères et leurs missions.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="ministry-title" className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre du Ministère')}</label>
                                        <Input id="ministry-title" name="title" defaultValue={editingItem?.title} required placeholder={t('admin_title_placeholder', "Ex: Jeunesse")} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="ministry-mission" className="text-sm font-bold text-slate-700">{t('admin_desc_label', 'Mission & Description')}</label>
                                        <Textarea id="ministry-mission" name="mission" defaultValue={editingItem?.mission} required placeholder={t('admin_desc_placeholder', "Description détaillée...")} className="rounded-xl min-h-[120px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="ministry-icon" className="text-sm font-bold text-slate-700">{t('admin_icon_label', 'Icône (Lucide)')}</label>
                                            <Input id="ministry-icon" name="icon" defaultValue={editingItem?.icon || "Users"} required placeholder="Users, Heart, Book..." className="rounded-xl h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="ministry-language" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                            <select id="ministry-language" name="language" defaultValue={editingItem?.language || "fr"} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                                                <option value="fr">{t('lang_fr', 'Français')}</option>
                                                <option value="rn">{t('lang_rn', 'Kirundi')}</option>
                                                <option value="sw">{t('lang_sw', 'Kiswahili')}</option>
                                                <option value="en">{t('lang_en', 'English')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="ministry-testimony-quote" className="text-sm font-bold text-slate-700">{t('admin_testimony_quote_label', 'Citation Témoignage')}</label>
                                        <Textarea id="ministry-testimony-quote" name="testimony_quote" defaultValue={editingItem?.testimony_quote} placeholder={t('admin_testimony_quote_placeholder', "Un témoignage marquant...")} className="rounded-xl min-h-[80px]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="ministry-testimony-author" className="text-sm font-bold text-slate-700">{t('admin_testimony_author_label', 'Auteur du Témoignage')}</label>
                                        <Input id="ministry-testimony-author" name="testimony_author" defaultValue={editingItem?.testimony_author} placeholder={t('admin_name_placeholder', "Nom de la personne")} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="ministry-image" className="text-sm font-bold text-slate-700">{t('admin_photo_label', 'Photo / Image')}</label>
                                        <div className="flex flex-col gap-3">
                                            {editingItem?.image_display && (
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                                                    <img src={editingItem.image_display} alt={t('admin_current_photo', "Photo actuelle")} className="object-cover w-full h-full bg-slate-50" />
                                                </div>
                                            )}
                                            <Input id="ministry-image" name="image" type="file" accept="image/*" className="rounded-xl h-11" />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-white font-bold text-lg">
                                            {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                                            {editingItem ? t('admin_save_changes', "Enregistrer les modifications") : t('admin_confirm_add', "Créer le ministère")}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <CardTitle className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-500" /> {t('admin_ministries_list', "Liste des Ministères")}
                        </CardTitle>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t('admin_search_placeholder', "Rechercher un ministère...")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredMinistries?.map((ministry: any) => (
                            <motion.div
                                key={ministry.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Card className="group h-full rounded-[2rem] border-slate-200/60 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-blue-200/20 transition-all duration-300 overflow-hidden bg-white flex flex-col">
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                {ministry.image_display ? (
                                                    <img src={ministry.image_display} alt="thumbnail" className="h-14 w-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0 bg-blue-50" />
                                                ) : (
                                                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 flex-shrink-0">
                                                        <Sprout className="h-6 w-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-xl font-heading font-bold text-slate-900">{ministry.title}</CardTitle>
                                                        <Badge variant="outline" className="text-[10px] transform scale-90 origin-left">
                                                            {ministry.language === 'fr' && t('lang_fr', 'Français')}
                                                            {ministry.language === 'rn' && t('lang_rn', 'Kirundi')}
                                                            {ministry.language === 'sw' && t('lang_sw', 'Kiswahili')}
                                                            {ministry.language === 'en' && t('lang_en', 'English')}
                                                        </Badge>
                                                    </div>
                                                    <CardDescription className="flex items-center gap-1 mt-1 text-slate-400 font-medium">
                                                        <Activity className="h-3 w-3" /> {ministry.activities?.length || 0} {t('admin_activities_label', "activités")}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingItem(ministry)} className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(ministry.id)} className="h-8 w-8 text-slate-400 hover:text-rose-600 rounded-full">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 flex-grow space-y-6">
                                        <p className="text-slate-500 font-medium font-body leading-relaxed line-clamp-4">
                                            {ministry.mission}
                                        </p>

                                        {ministry.testimony_quote && (
                                            <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500 italic relative mt-auto">
                                                <p className="text-sm text-slate-600 font-body">"{ministry.testimony_quote}"</p>
                                                <p className="text-xs font-bold text-slate-400 mt-2 not-italic">— {ministry.testimony_author || t('admin_unknown', "Inconnu")}</p>
                                            </div>
                                        )}

                                        {/* Activities Management */}
                                        <div className="pt-4 border-t border-slate-100">
                                            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                                                {t('admin_activities_title', 'Activités')}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => {
                                                        const title = prompt("Titre de l'activité :");
                                                        if (title) {
                                                            api.post(`/api/ministries/${ministry.id}/activities/`, { title }).then(() => {
                                                                queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
                                                                toast.success(t('admin_activity_added', "Activité ajoutée"));
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> {t('admin_add', 'Ajouter')}
                                                </Button>
                                            </h4>
                                            <ul className="space-y-2">
                                                {ministry.activities?.map((activity: any) => (
                                                    <li key={activity.id} className="flex items-center justify-between text-sm bg-white border border-slate-100 p-3 rounded-xl group/item hover:border-blue-200 hover:shadow-sm transition-all">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                            <span className="text-slate-700 font-medium">{activity.title}</span>
                                                        </div>
                                                        <button
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                if (confirm(t('admin_confirm_delete_activity', "Supprimer cette activité ?"))) {
                                                                    await api.delete(`/api/ministries/activities/${activity.id}/`);
                                                                    queryClient.invalidateQueries({ queryKey: ["admin-ministries"] });
                                                                    toast.success(t('admin_activity_deleted', "Activité supprimée"));
                                                                }
                                                            }}
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                            title={t('admin_delete', 'Supprimer')}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                                {(!ministry.activities || ministry.activities.length === 0) && (
                                                    <p className="text-xs text-slate-400 italic">{t('admin_no_activity', "Aucune activité enregistrée.")}</p>
                                                )}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredMinistries?.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-heading font-bold text-slate-400">{t('admin_no_ministry', "Aucun ministère trouvé")}</h3>
                        <p className="text-slate-400 text-sm">{t('admin_no_ministry_desc', "Essayez de modifier votre recherche ou ajoutez-en un nouveau.")}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminMinistries;
