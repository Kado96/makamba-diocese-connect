import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Library,
    History,
    Target,
    Users,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Loader2,
    Check,
    Calendar,
    Award
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { motion } from "framer-motion";
import DiocesePresentationTab from "./components/DiocesePresentationTab";
import ImageFieldWithPreview from "./components/ImageFieldWithPreview";
import VisionIntroManager from "./components/VisionIntroManager";

const AdminDiocese = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [activeLang, setActiveLang] = useState("fr");
    const [currentTab, setCurrentTab] = useState("presentation");

    const langs = [
        { code: "fr", label: "🇫🇷 FR" },
        { code: "en", label: "🇬🇧 EN" },
    ];

    // Queries

    const { data: axes, isLoading: loadingAxes } = useQuery({
        queryKey: ["admin-axes", activeLang],
        queryFn: async () => {
            const res = await api.get(`/api/pages/axes/?lang=${activeLang}`);
            return res.data.results || res.data;
        }
    });

    const { data: team, isLoading: loadingTeam } = useQuery({
        queryKey: ["admin-team", activeLang],
        queryFn: async () => {
            const res = await api.get(`/api/pages/team/?lang=${activeLang}`);
            return res.data.results || res.data;
        }
    });

    // CRUD Mutations
    const deleteMutation = useMutation({
        mutationFn: async ({ endpoint, id }: { endpoint: string, id: number }) => {
            await api.delete(`/api/pages/${endpoint}/${id}/`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`admin-${variables.endpoint}`] });
            const publicEndpoint = variables.endpoint === 'team' ? 'teamMembers' : variables.endpoint;
            queryClient.invalidateQueries({ queryKey: [publicEndpoint] });
            toast.success(t('admin_delete_success', "Élément supprimé avec succès"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const saveMutation = useMutation({
        mutationFn: async ({ endpoint, data, id }: { endpoint: string, data: FormData, id?: number }) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (id) {
                await api.patch(`/api/pages/${endpoint}/${id}/`, data, config);
            } else {
                await api.post(`/api/pages/${endpoint}/`, data, config);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`admin-${variables.endpoint}`] });
            const publicEndpoint = variables.endpoint === 'team' ? 'teamMembers' : variables.endpoint;
            queryClient.invalidateQueries({ queryKey: [publicEndpoint] });
            toast.success(t('admin_save_success', "Enregistré avec succès"));
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
            if (key.startsWith('clear_')) return;
            if (value instanceof File) {
                if (value.size > 0) {
                    cleanedFormData.append(key, value);
                } else if (formData.get(`clear_${key}`) === 'true') {
                    cleanedFormData.append(key, '');
                }
            } else {
                if (value === "null" || value === "undefined") return;
                cleanedFormData.append(key, value);
            }
        });

        let endpoint = "";
        switch (currentTab) {
            case "vision": endpoint = "axes"; break;
            case "values": endpoint = "values"; break;
            case "team": endpoint = "team"; break;
        }

        saveMutation.mutate({
            endpoint,
            data: cleanedFormData,
            id: editingItem?.id
        });
    };

    const isLoading = loadingAxes || loadingTeam;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement du contenu diocésain...")}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_diocese_title', "Gestion du Diocèse")} <Library className="h-8 w-8 text-violet-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_diocese_subtitle', "Gérez l'histoire, la vision et l'équipe dirigeante.")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentTab !== "presentation" && (
                            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                                {langs.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => setActiveLang(l.code)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-violet-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Dialog open={isAddDialogOpen || !!editingItem} onOpenChange={(open) => {
                            if (!open) {
                                setIsAddDialogOpen(false);
                                setEditingItem(null);
                            }
                        }}>
                            <DialogTrigger asChild>
                                {currentTab !== "presentation" && (
                                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-95">
                                        <Plus className="h-5 w-5" /> {t('admin_add_item', "Ajouter")}
                                    </Button>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl border-white/20 bg-white/90 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                        {editingItem ? t('admin_edit_item', "Modifier l'élément") : t('admin_new_item', "Ajouter un nouvel élément")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info', "Remplissez les informations ci-dessous pour gérer ce contenu.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="item-lang" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                        <select id="item-lang" name="language" defaultValue={editingItem?.language || activeLang} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                            <option value="fr">{t('lang_fr', 'Français')}</option>
                                                <option value="en">{t('lang_en', 'Anglais')}</option>
                                        </select>
                                    </div>


                                    {currentTab === "vision" && (
                                        <>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-axe-text" className="text-sm font-bold text-slate-700">{t('admin_axe_label', 'Axe de Mission')}</label>
                                                <Input id="diocese-axe-text" name="text" defaultValue={editingItem?.text} required placeholder={t('admin_axe_placeholder', "Ex: Évangélisation")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-axe-order" className="text-sm font-bold text-slate-700">{t('admin_order_label', 'Ordre')}</label>
                                                <Input id="diocese-axe-order" name="order" type="number" defaultValue={editingItem?.order || 0} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <ImageFieldWithPreview
                                                fieldName="image"
                                                label={t('admin_photo_label', 'Photo / Image')}
                                                currentImageUrl={editingItem?.image_display}
                                                aspectRatio="video"
                                            />
                                        </>
                                    )}

                                    {currentTab === "values" && (
                                        <>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-value-icon" className="text-sm font-bold text-slate-700">{t('admin_icon_label', 'Icône (Lucide)')}</label>
                                                <Input id="diocese-value-icon" name="icon" defaultValue={editingItem?.icon} required placeholder={t('admin_icon_placeholder', "Ex: Cross, Heart, Users")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-value-title" className="text-sm font-bold text-slate-700">{t('admin_title_label', 'Titre')}</label>
                                                <Input id="diocese-value-title" name="title" defaultValue={editingItem?.title} required placeholder={t('admin_title_placeholder', "Titre de la valeur")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-value-desc" className="text-sm font-bold text-slate-700">{t('admin_desc_label', 'Description')}</label>
                                                <Textarea id="diocese-value-desc" name="description" defaultValue={editingItem?.description} required placeholder={t('admin_desc_placeholder', "Description détaillée...")} className="rounded-xl min-h-[100px] shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-value-order" className="text-sm font-bold text-slate-700">{t('admin_order_label', 'Ordre')}</label>
                                                <Input id="diocese-value-order" name="order" type="number" defaultValue={editingItem?.order || 0} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <ImageFieldWithPreview
                                                fieldName="image"
                                                label={t('admin_photo_label', 'Photo / Image (Optionnel)')}
                                                currentImageUrl={editingItem?.image_display}
                                                aspectRatio="square"
                                            />
                                        </>
                                    )}

                                    {currentTab === "team" && (
                                        <>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-team-name" className="text-sm font-bold text-slate-700">{t('admin_name_label', 'Nom Complet')}</label>
                                                <Input id="diocese-team-name" name="name" defaultValue={editingItem?.name} required placeholder={t('admin_name_placeholder', "Prénom Nom")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-team-role" className="text-sm font-bold text-slate-700">{t('admin_role_label', 'Rôle / Titre')}</label>
                                                <Input id="diocese-team-role" name="role" defaultValue={editingItem?.role} required placeholder={t('admin_role_placeholder', "Ex: Évêque de Makamba")} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-team-bio" className="text-sm font-bold text-slate-700">{t('admin_bio_label', 'Bio / Description')}</label>
                                                <Textarea id="diocese-team-bio" name="description" defaultValue={editingItem?.description} required placeholder={t('admin_bio_placeholder', "Courte biographie...")} className="rounded-xl min-h-[100px] shadow-sm border-slate-200" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="diocese-team-order" className="text-sm font-bold text-slate-700">{t('admin_order_label', 'Ordre')}</label>
                                                <Input id="diocese-team-order" name="order" type="number" defaultValue={editingItem?.order || 0} className="rounded-xl h-11 shadow-sm border-slate-200" />
                                            </div>
                                            <ImageFieldWithPreview
                                                fieldName="image"
                                                label={t('admin_photo_label', 'Photo de Profil')}
                                                currentImageUrl={editingItem?.image_display}
                                                aspectRatio="portrait"
                                            />
                                        </>
                                    )}

                                    <DialogFooter>
                                        <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-violet-600 hover:bg-violet-700 h-12 rounded-xl text-white font-bold text-lg">
                                            {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                                            {editingItem ? t('admin_save_changes', "Enregistrer les modifications") : t('admin_confirm_add', "Confirmer l'ajout")}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl mb-10 w-full md:w-auto h-auto flex flex-wrap gap-2">
                        <TabsTrigger value="presentation" className="rounded-xl font-bold py-3 px-6 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm">
                            <Library className="h-4 w-4 mr-2" /> {t('admin_tab_presentation', "Présentation Générale")}
                        </TabsTrigger>

                        <TabsTrigger value="vision" className="rounded-xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm">
                            <Target className="h-4 w-4 mr-2" /> {t('admin_tab_mission', "Mission")}
                        </TabsTrigger>
                        <TabsTrigger value="team" className="rounded-xl font-bold py-3 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm">
                            <Users className="h-4 w-4 mr-2" /> {t('admin_tab_team', "Équipe")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Onglet Présentation Générale */}
                    <TabsContent value="presentation" className="mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <DiocesePresentationTab />
                        </motion.div>
                    </TabsContent>

                    {/* Onglet Mission / Vision */}
                    <TabsContent value="vision" className="mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <VisionIntroManager activeLang={activeLang} />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(Array.isArray(axes) ? axes : (axes?.results || [])).map((item: any) => (
                                    <ItemCard key={item.id} title={`${t('admin_axe_label', 'Axe')} #${item.order}`} content={item.text} image={item.image_display} onEdit={() => { setEditingItem(item); setIsAddDialogOpen(true); }} onDelete={() => deleteMutation.mutate({ endpoint: "axes", id: item.id })} />
                                ))}
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Onglet Équipe */}
                    <TabsContent value="team" className="mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(Array.isArray(team) ? team : (team?.results || [])).map((item: any) => (
                                    <ItemCard key={item.id} title={item.name} subtitle={item.role} content={item.description} image={item.image_display} onEdit={() => { setEditingItem(item); setIsAddDialogOpen(true); }} onDelete={() => deleteMutation.mutate({ endpoint: "team", id: item.id })} />
                                ))}
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

const ItemCard = ({ title, subtitle, content, icon, image, onEdit, onDelete }: any) => (
    <Card className="group rounded-3xl border-slate-200/60 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-violet-200/20 transition-all duration-300 overflow-hidden bg-white">
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
            {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 opacity-20">
                    <Library className="h-10 w-10" />
                </div>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={onEdit} className="h-9 w-9 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-violet-600 rounded-full shadow-lg border border-white/50">
                    <Edit className="h-4.5 w-4.5" />
                </Button>
                <Button variant="secondary" size="icon" onClick={onDelete} className="h-9 w-9 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 rounded-full shadow-lg border border-white/50">
                    <Trash2 className="h-4.5 w-4.5" />
                </Button>
            </div>
        </div>
        <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
                {icon && <div className="text-violet-500 font-bold">{icon}</div>}
                <h3 className="font-heading font-bold text-slate-900 leading-tight line-clamp-1">{title}</h3>
            </div>
            {subtitle && <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-2 px-2 py-0.5 bg-violet-50 rounded-full inline-block">{subtitle}</p>}
            <p className="text-xs font-medium text-slate-500 line-clamp-2 font-body leading-relaxed">{content}</p>
        </CardContent>
    </Card>
);

export default AdminDiocese;
