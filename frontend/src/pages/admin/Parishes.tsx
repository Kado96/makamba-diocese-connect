import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    MapPin,
    Loader2,
    Map,
    Check
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { api } from "@/lib/api";

const AdminParishes = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [activeLang, setActiveLang] = useState("fr");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const langs = [
        { code: "fr", label: "🇫🇷 FR" },
        { code: "en", label: "🇬🇧 EN" },
    ];

    const { data: parishes, isLoading } = useQuery({
        queryKey: ["admin-parishes", activeLang],
        queryFn: async () => {
            const response = await api.get(`/api/parishes/?language=${activeLang}`);
            return response.data;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: FormData, id?: number }) => {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (id) {
                await api.patch(`/api/parishes/${id}/`, data, config);
            } else {
                await api.post("/api/parishes/", data, config);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-parishes"] });
            queryClient.invalidateQueries({ queryKey: ["parishes"] });
            toast.success(variables.id ? t('admin_save_success', "Paroisse mise à jour") : t('admin_save_success', "Paroisse ajoutée"));
            setIsAddDialogOpen(false);
            setEditingItem(null);
        },
        onError: () => toast.error(t('admin_save_error', "Erreur lors de l'enregistrement"))
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/parishes/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-parishes"] });
            queryClient.invalidateQueries({ queryKey: ["parishes"] });
            toast.success(t('admin_delete_success', "Paroisse supprimée avec succès"));
        },
        onError: () => toast.error(t('admin_delete_error', "Erreur lors de la suppression"))
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

    const filteredItems = (Array.isArray(parishes) ? parishes : (parishes?.results || [])).filter((item: any) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.zone?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
                            {t('admin_parishes_title', "Gestion des Paroisses")} <MapPin className="h-8 w-8 text-emerald-500" />
                        </h1>
                        <p className="text-slate-500 font-medium font-body mt-1">{t('admin_parishes_subtitle', "Gérez la liste et les informations des paroisses du diocèse.")}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setActiveLang(l.code)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLang === l.code ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
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
                                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 border-none">
                                    <Plus className="h-5 w-5" /> {t('admin_new_parish', "Nouvelle Paroisse")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-heading font-bold">
                                        {editingItem ? t('admin_edit_item', "Modifier la Paroisse") : t('admin_new_item', "Nouvelle Paroisse")}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        {t('admin_fill_info', "Remplissez les informations ci-dessous pour gérer cette paroisse.")}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="parish-name" className="text-sm font-bold text-slate-700">{t('admin_parish_name_label', 'Nom de la Paroisse')}</label>
                                        <Input id="parish-name" name="name" defaultValue={editingItem?.name} required placeholder={t('admin_parish_name_placeholder', "Ex: Cathédrale Saint-Jean")} className="rounded-xl h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="parish-zone" className="text-sm font-bold text-slate-700">{t('admin_zone_label', 'Zone / Commune')}</label>
                                        <Input id="parish-zone" name="zone" defaultValue={editingItem?.zone} required placeholder={t('admin_zone_placeholder', "Ex: Makamba Centre")} className="rounded-xl h-12" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="parish-faithful" className="text-sm font-bold text-slate-700">{t('admin_faithful_label', 'Fidèles (Env.)')}</label>
                                            <Input id="parish-faithful" name="faithful" defaultValue={editingItem?.faithful} placeholder={t('admin_faithful_placeholder', "Ex: 12000")} className="rounded-xl h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="parish-phone" className="text-sm font-bold text-slate-700">{t('admin_phone_label', 'Téléphone de Contact')}</label>
                                            <Input id="parish-phone" name="phone" defaultValue={editingItem?.phone} placeholder="+257 ..." className="rounded-xl h-12" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="parish-pastor" className="text-sm font-bold text-slate-700">{t('parishes_pastor_label', 'Nom du Pasteur')}</label>
                                            <Input id="parish-pastor" name="pastor" defaultValue={editingItem?.pastor} required placeholder={t('admin_pastor_name_placeholder', "Ex: Rév. Jean Dupont")} className="rounded-xl h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="parish-language" className="text-sm font-bold text-slate-700">{t('admin_lang_label', 'Langue')}</label>
                                            <select id="parish-language" name="language" defaultValue={editingItem?.language || "fr"} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                                                <option value="fr">{t('lang_fr', 'Français')}</option>
                                                <option value="en">{t('lang_en', 'English')}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="parish-image" className="text-sm font-bold text-slate-700">{t('admin_photo_label', 'Photo / Image')}</label>
                                        <div className="flex flex-col gap-3">
                                            {editingItem?.image_display && (
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                                                    <img src={editingItem.image_display} alt={t('admin_current_photo', "Photo actuelle")} className="object-cover w-full h-full bg-slate-50" />
                                                </div>
                                            )}
                                            <Input id="parish-image" name="image" type="file" accept="image/*" className="rounded-xl h-11" />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={saveMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl text-white font-bold text-lg">
                                            {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                                            {editingItem ? t('admin_save_changes', "Mettre à jour") : t('admin_confirm_add', "Ajouter la paroisse")}
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
                                <MapPin className="h-5 w-5 text-emerald-500" /> {t('admin_parishes_list', "Liste des Paroisses")}
                            </CardTitle>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search-parishes"
                                    name="search_parishes"
                                    placeholder={t('admin_search_placeholder', "Rechercher une paroisse...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-16 h-14 font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_photo_label', "Photo")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_name_label', "Nom")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_deanery_label', "Doyenné")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('admin_zone_label', "Zone")}</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('parishes_pastor_label', "Pasteur")}</TableHead>
                                        <TableHead className="w-20 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                                    <p className="text-slate-500 font-medium font-body">{t('admin_loading_content', "Chargement des paroisses...")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="bg-slate-100 p-4 rounded-full">
                                                        <Map className="h-8 w-8 text-slate-300" />
                                                    </div>
                                                    <p className="text-slate-500 font-bold text-lg">{t('admin_no_parish', "Aucune paroisse")}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item: any) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        {item.image_display ? (
                                                            <img src={item.image_display} alt="thumbnail" className="h-10 w-10 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                                <Map className="h-5 w-5 text-emerald-500 opacity-50" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-slate-900">{item.name}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{item.pastor}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <p className="text-sm font-semibold text-slate-600">{item.zone}</p>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <Badge variant="outline" className="capitalize">
                                                        {item.language === 'fr' && t('lang_fr', 'Français')}
                                                        {item.language === 'en' && t('lang_en', 'English')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-5 text-center text-sm text-slate-500">
                                                    {item.phone || "N/A"}
                                                </TableCell>
                                                <TableCell className="py-5 text-right px-8">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-lg">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl">
                                                            <DropdownMenuItem
                                                                className="gap-2 py-2.5 rounded-lg font-medium"
                                                                onClick={() => setEditingItem(item)}
                                                            >
                                                                <Edit className="h-4 w-4" /> {t('admin_edit', 'Modifier')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 py-2.5 rounded-lg font-medium text-red-600"
                                                                onClick={() => {
                                                                    if (window.confirm(t('admin_confirm_delete', "Supprimer ?"))) deleteMutation.mutate(item.id);
                                                                }}
                                                            >
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

export default AdminParishes;
