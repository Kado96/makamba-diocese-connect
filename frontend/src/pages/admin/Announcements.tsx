import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Megaphone,
    CheckCircle,
    XCircle,
    Loader2,
    Calendar,
    Bell,
    Image as ImageIcon,
    PlusCircle
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminAnnouncements = () => {
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const langs = [
        { code: "fr", label: "🇫🇷 FR" },
        { code: "rn", label: "🇧🇮 RN" },
        { code: "en", label: "🇬🇧 EN" },
        { code: "sw", label: "🇹🇿 SW" },
    ];

    const { data: announcements, isLoading } = useQuery({
        queryKey: ["admin-announcements", activeLang],
        queryFn: async () => {
            const response = await api.get(`/api/announcements/admin/?language=${activeLang}`);
            return response.data.results || response.data;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            if (id) {
                await api.patch(`/api/announcements/admin/${id}/`, data, config);
            } else {
                await api.post("/api/announcements/admin/", data, config);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_save_success', "Opération réussie"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/announcements/admin/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_delete_success', "Annonce supprimée"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
            await api.patch(`/api/announcements/admin/${id}/`, { is_active });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            toast.success(t('admin_save_success', "Statut mis à jour"));
        },
        onError: () => {
            toast.error(t('admin_save_error', "Erreur de mise à jour"));
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Cleanup empty files and strings
        const cleanedFormData = new FormData();
        formData.forEach((value, key) => {
            if (value instanceof File && value.size === 0) return;
            if (value === "" || value === "null" || value === "undefined") return;
            cleanedFormData.append(key, value);
        });

        saveMutation.mutate({ data: cleanedFormData, id: editingItem?.id });
    };

    const filteredItems = announcements?.results?.filter((item: any) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_news_title', "Actualités & Annonces")} <Megaphone className="h-8 w-8 text-orange-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_news_subtitle', "Gérez les communications officielles et les témoignages du diocèse.")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setActiveLang(l.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
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
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-none">
                                    <Plus className="h-5 w-5" /> {t('admin_add_item', "Ajouter")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                        {editingItem ? t('admin_edit_item', "Modifier l'annonce") : t('admin_new_item', "Ajouter une annonce")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info', "Remplissez les détails ci-dessous pour publier ce contenu.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="announcement-title" className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre de l\'article')}</label>
                                        <Input id="announcement-title" name="title" defaultValue={editingItem?.title} required placeholder={t('admin_title_placeholder', "Ex: Célébration des 40 ans...")} className="rounded-xl h-12 border-slate-200 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <label htmlFor="announcement-content" className="text-sm font-bold text-slate-700">{t('admin_content_label', 'Contenu de l\'article (Long)')}</label>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('admin_multiline_support', 'Supporte le texte multi-lignes')}</span>
                                        </div>
                                        <Textarea id="announcement-content" name="content" defaultValue={editingItem?.content} required placeholder={t('admin_content_placeholder', "Rédigez votre article ici...")} className="rounded-xl min-h-[300px] border-slate-200 focus:ring-orange-500 p-4 leading-relaxed font-body" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="announcement-category" className="text-sm font-bold text-slate-700">{t('admin_category_label', 'Catégorie')}</label>
                                            <select id="announcement-category" name="category" defaultValue={editingItem?.category || "nouvelles"} className="flex h-12 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-orange-500">
                                                <option value="temoignages">{t('cat_temoignages', 'Témoignages')}</option>
                                                <option value="evenements">{t('cat_evenements', 'Événements')}</option>
                                                <option value="nouvelles">{t('cat_nouvelles', 'Nouvelles')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="announcement-language" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                            <select id="announcement-language" name="language" defaultValue={editingItem?.language || "fr"} className="flex h-12 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus:ring-orange-500">
                                                <option value="fr">{t('lang_fr', 'Français')}</option>
                                                <option value="rn">{t('lang_rn', 'Kirundi')}</option>
                                                <option value="sw">{t('lang_sw', 'Kiswahili')}</option>
                                                <option value="en">{t('lang_en', 'English')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-orange-500" /> {t('admin_cover_image_label', 'Image à la Une (Couverture)')}
                                        </h4>
                                        <div className="flex flex-col gap-4">
                                            {editingItem?.image_display && (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                                    <img src={editingItem.image_display} alt={t('admin_current_cover', "Couverture actuelle")} className="object-cover w-full h-full" />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full">{t('admin_edit_image_label', "Modifier l'image")}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Input id="announcement-image" name="image" type="file" accept="image/*" className="rounded-xl h-11 border-dashed border-2 hover:border-orange-300 transition-colors" />
                                        </div>
                                    </div>

                                    {/* 🖼️ Gestion de la Galerie (Lecture seule dans ce formulaire simple, modification via Admin Django pour l'instant ou multi-upload futur) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <PlusCircle className="h-4 w-4 text-indigo-500" /> {t('admin_gallery_label', 'Galerie d\'images')}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{editingItem?.gallery?.length || 0} {t('admin_photos_count', 'photos')}</span>
                                        </div>

                                        {editingItem?.gallery && editingItem.gallery.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {editingItem.gallery.map((img: any) => (
                                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                            <Trash2 className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
                                                    <Plus className="h-6 w-6 text-slate-300" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                                <ImageIcon className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                                <p className="text-xs text-slate-400 font-medium">{t('admin_gallery_empty', "Aucune photo dans la galerie.")}<br />{t('admin_gallery_advanced_tip', "Utilisez l'interface avancée pour ajouter des photos.")}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-orange-900">{t('admin_visibility_label', 'Visibilité')}</p>
                                            <p className="text-xs text-orange-700/70">{t('admin_visibility_tip', "L'article sera visible dès la publication.")}</p>
                                        </div>
                                        <label htmlFor="announcement-is-active" className="relative inline-flex items-center cursor-pointer ml-auto">
                                            <input id="announcement-is-active" type="checkbox" name="is_active" defaultChecked={editingItem?.is_active ?? true} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>

                                    <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t border-slate-100 -mx-6 px-6 pb-2">
                                        <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-2xl text-white font-bold text-lg shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98]">
                                            {saveMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle className="h-6 w-6 mr-3" />}
                                            {editingItem ? t('admin_update_article', "Mettre à jour l'article") : t('admin_publish_article', "Publier l'article maintenant")}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card className="rounded-[2rem] border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <CardTitle className="text-xl font-heading font-bold text-slate-900 flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-orange-500" /> {t('admin_news_list', "Liste des Annonces")}
                            </CardTitle>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={t('admin_search_placeholder', "Rechercher une annonce...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                            {isLoading ? (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                                    <p className="text-slate-400 font-medium">{t('admin_loading_content', "Chargement des annonces...")}</p>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <Bell className="h-8 w-8 text-slate-300" />
                                    <p className="text-slate-500 font-bold text-lg">{t('admin_no_announcement', "Aucune annonce trouvée")}</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.map((item: any) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-lg hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col"
                                        >
                                            {/* Action Buttons Overlay */}
                                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    onClick={() => setEditingItem(item)}
                                                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-600 hover:text-orange-600 hover:bg-white"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => { if (window.confirm(t('admin_confirm_delete_article', "Supprimer cet article ?"))) deleteMutation.mutate(item.id); }}
                                                    className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-400 hover:text-red-600 hover:bg-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Image Section */}
                                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                                {item.image_display ? (
                                                    <img src={item.image_display} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-orange-200">
                                                        <Megaphone className="h-12 w-12" />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    <Badge className="bg-orange-500/90 backdrop-blur-md text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                                        {item.category_display || item.category}
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-white/90 backdrop-blur-md text-slate-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                                        {item.language === 'fr' ? t('lang_fr_short', 'FR') : item.language === 'rn' ? t('lang_rn_short', 'RN') : item.language === 'en' ? t('lang_en_short', 'EN') : t('lang_sw_short', 'SW')}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-8 flex-grow flex flex-col">
                                                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(item.created_at).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    <div className="ml-auto flex items-center gap-1.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                        <span className={item.is_active ? 'text-emerald-600' : 'text-slate-400'}>
                                                            {item.is_active ? t('admin_status_visible', 'Visible') : t('admin_status_hidden', 'Masqué')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-heading font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed font-body line-clamp-3 mb-6">
                                                    {item.content}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        {item.gallery?.map((img: any, i: number) => i < 3 && (
                                                            <div key={img.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                                                <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ))}
                                                        {item.gallery?.length > 3 && (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                                                +{item.gallery.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleStatusMutation.mutate({ id: item.id, is_active: !item.is_active })}
                                                        className={`text-xs font-bold uppercase tracking-widest ${item.is_active ? 'text-slate-400 hover:text-orange-600' : 'text-orange-500 hover:text-orange-600'}`}
                                                    >
                                                        {item.is_active ? t('admin_deactivate', 'Désactiver') : t('admin_activate', 'Activer')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminAnnouncements;
