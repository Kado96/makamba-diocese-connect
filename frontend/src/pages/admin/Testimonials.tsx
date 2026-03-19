import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Quote,
    CheckCircle,
    XCircle,
    Loader2,
    MessageSquare,
    UserCircle
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

const AdminTestimonials = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const langs = [
        { code: "fr", label: t('lang_fr_short', 'FR') },
        { code: "rn", label: t('lang_rn_short', 'RN') },
        { code: "en", label: t('lang_en_short', 'EN') },
        { code: "sw", label: t('lang_sw_short', 'SW') },
    ];

    const { data: testimonials, isLoading } = useQuery({
        queryKey: ["admin-testimonials", activeLang],
        queryFn: async () => {
            const response = await api.get(`/api/testimonials/?language=${activeLang}`);
            return response.data.results || response.data;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: any, id?: number }) => {
            if (id) {
                await api.patch(`/api/testimonials/${id}/`, data);
            } else {
                await api.post("/api/testimonials/", data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast.success(t('admin_save_success', "Opération réussie"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/testimonials/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast.success(t('admin_delete_success', "Témoignage supprimé"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        saveMutation.mutate({ data, id: editingItem?.id });
    };

    const filteredItems = (Array.isArray(testimonials) ? testimonials : (testimonials?.results || [])).filter((item: any) =>
        item.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des témoignages...")}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_testimonials_title', "Témoignages")} <Quote className="h-8 w-8 text-amber-500" />
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">{t('admin_testimonials_subtitle', "Gérez les témoignages de la communauté.")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setActiveLang(l.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
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
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 border-none">
                                    <Plus className="h-5 w-5" /> {t('admin_add_item', "Ajouter")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold text-slate-900">
                                        {editingItem ? t('admin_edit_item', "Modifier le Témoignage") : t('admin_new_item', "Nouveau Témoignage")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info', "Remplissez les détails ci-dessous pour publier ce retour.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="auth-name" className="text-sm font-bold text-slate-700">{t('admin_author_label', 'Auteur')}</label>
                                        <Input id="auth-name" name="author_name" defaultValue={editingItem?.author_name} required placeholder={t('admin_name_placeholder', "Nom de l'auteur...")} className="rounded-xl h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="auth-title" className="text-sm font-bold text-slate-700">{t('admin_role_label', 'Titre / Rôle (Optionnel)')}</label>
                                        <Input id="auth-title" name="author_title" defaultValue={editingItem?.author_title} placeholder={t('admin_role_placeholder', "Ex: Fidèle à Makamba")} className="rounded-xl h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="test-content" className="text-sm font-bold text-slate-700">{t('admin_content_label', 'Contenu du témoignage')}</label>
                                        <Textarea id="test-content" name="content" defaultValue={editingItem?.content} required placeholder={t('admin_content_placeholder', "Le message...")} className="rounded-xl min-h-[120px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="test-lang" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                            <select id="test-lang" name="language" defaultValue={editingItem?.language || "fr"} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                                <option value="fr">{t('lang_fr', 'Français')}</option>
                                                <option value="en">{t('lang_en', 'Anglais')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="test-status" className="text-sm font-bold text-slate-700">{t('admin_status_label', 'Statut')}</label>
                                            <select id="test-status" name="status" defaultValue={editingItem?.status || "published"} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                                                <option value="published">{t('admin_status_visible', 'Publié')}</option>
                                                <option value="pending">{t('admin_status_pending', 'En attente')}</option>
                                                <option value="archived">{t('admin_status_archived', 'Archivé')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-amber-500 hover:bg-amber-600 h-12 rounded-xl text-white font-bold text-lg">
                                            {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                                            {editingItem ? t('admin_save_changes', "Mettre à jour") : t('admin_confirm_add', "Publier le témoignage")}
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
                                <MessageSquare className="h-5 w-5 text-amber-500" /> {t('admin_testimonials_list', "Liste des Témoignages")}
                            </CardTitle>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search-testimonials"
                                    name="search_testimonials"
                                    placeholder={t('admin_search_placeholder', "Rechercher un témoignage...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_author_label', "Auteur")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_content_label', "Message")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_status_label', "Statut")}</TableHead>
                                        <TableHead className="w-20 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-500">{t('admin_no_testimonials', 'Aucun témoignage trouvé')}</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item: any) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <UserCircle className="h-8 w-8 text-slate-300" />
                                                        <div>
                                                            <p className="font-bold text-slate-900">{item.author_name}</p>
                                                            <p className="text-xs text-slate-400">{item.author_title}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{item.content}</p>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge variant="outline" className="uppercase font-bold text-[10px]">{item.language}</Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-right px-8">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-lg">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl">
                                                            <DropdownMenuItem className="gap-2 py-2.5 rounded-lg" onClick={() => setEditingItem(item)}>
                                                                <Edit className="h-4 w-4" /> {t('admin_edit', 'Modifier')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 py-2.5 rounded-lg text-red-600" onClick={() => { if (window.confirm(t('admin_confirm_delete', "Supprimer ?"))) deleteMutation.mutate(item.id); }}>
                                                                <Trash2 className="h-4 w-4" /> {t('admin_delete', 'Supprimer')}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminTestimonials;
