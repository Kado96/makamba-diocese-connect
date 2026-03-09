import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { UserCog, Plus, Search, Trash2, Edit2, ShieldAlert } from "lucide-react";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    is_superuser: boolean;
}

const UsersManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Auth info
    const currentUser = JSON.parse(localStorage.getItem("user") || '{"role": "admin", "is_superuser": false}');
    const isSuperuser = currentUser.is_superuser;

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form states
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "user",
        is_active: true
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/accounts/manage-users/");
            setUsers(response.data);
        } catch (error) {
            toast({
                title: t('error', "Erreur"),
                description: t('admin_loading_users_error', "Impossible de charger les utilisateurs."),
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Redirection sécurité si non admin
        if (currentUser.role !== 'admin' && !currentUser.is_superuser) {
            window.location.href = '/admin';
            return;
        }
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            role: "user",
            is_active: true
        });
        setSelectedUser(null);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: "",
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = async () => {
        try {
            await api.post("/api/accounts/manage-users/", formData);
            toast({ title: t('success', "Succès"), description: t('user_created', "Utilisateur créé.") });
            setIsAddModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            toast({
                title: t('error', "Erreur"),
                description: error.response?.data?.error || t('error_creating_user', "Erreur lors de la création."),
                variant: "destructive"
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        try {
            // Remove empty password from update payload
            const submitData = { ...formData };
            if (!submitData.password) {
                delete (submitData as any).password;
            }

            await api.patch(`/api/accounts/manage-users/${selectedUser.id}/`, submitData);
            toast({ title: t('success', "Succès"), description: t('user_updated', "Utilisateur mis à jour.") });
            setIsEditModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            toast({
                title: t('error', "Erreur"),
                description: error.response?.data?.error || t('error_updating_user', "Erreur de mise à jour."),
                variant: "destructive"
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await api.delete(`/api/accounts/manage-users/${selectedUser.id}/`);
            toast({ title: t('success', "Succès"), description: t('user_deleted', "Utilisateur supprimé.") });
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error: any) {
            toast({
                title: t('error', "Erreur"),
                description: error.response?.data?.error || t('error_deleting_user', "Erreur de suppression."),
                variant: "destructive"
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Security check wrapper
    if (currentUser.role !== 'admin' && !currentUser.is_superuser) {
        return <AdminLayout>{t('access_denied', "Accès refusé")}</AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
                        <UserCog className="h-8 w-8 text-teal-600" />
                        {t('admin_users_title', "Gestion des Utilisateurs")}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {t('admin_users_desc', "Gérez les accès administrateurs et modérateurs de votre plateforme.")}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="search-users"
                            name="search_users"
                            placeholder={t('admin_search_users_placeholder', "Rechercher par nom, email...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => navigate("/admin/users/add")}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin_new_user', "Nouvel Utilisateur")}
                    </Button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow>
                                <TableHead>{t('admin_user_column', "Utilisateur")}</TableHead>
                                <TableHead>{t('admin_id_column', "Identifiant")}</TableHead>
                                <TableHead>{t('admin_role_column', "Rôle")}</TableHead>
                                <TableHead>{t('admin_status_column', "Statut")}</TableHead>
                                <TableHead className="text-right">{t('admin_actions_column', "Actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        {t('admin_loading_users', "Chargement en cours...")}
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        {t('admin_no_users_found', "Aucun utilisateur trouvé.")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900">
                                                    {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : "-"}
                                                </span>
                                                <span className="text-sm text-slate-500">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                                {user.username}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.is_superuser ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    {t('admin_super_admin', "Super Admin")}
                                                </span>
                                            ) : user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                                                    {t('admin_role_admin', "Administrateur")}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                    {t('admin_standard_user', "Utilisateur standard")}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.is_active ? (
                                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                            ) : (
                                                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                                            )}
                                            <span className="text-sm">
                                                {user.is_active ? t('admin_status_active', "Actif") : t('admin_status_inactive', "Inactif")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                                                    onClick={() => openEditModal(user)}
                                                    disabled={user.is_superuser && !isSuperuser}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => openDeleteModal(user)}
                                                    disabled={user.is_superuser || user.username === currentUser.username}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                    setIsEditModalOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('admin_edit_profile', "Modifier le profil")}</DialogTitle>
                            <DialogDescription>
                                {selectedUser?.username}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_first_name">{t('admin_first_name', "Prénom")}</Label>
                                    <Input
                                        id="edit_first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        autoComplete="given-name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_last_name">{t('admin_last_name', "Nom")}</Label>
                                    <Input
                                        id="edit_last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_email">Email</Label>
                                <Input
                                    id="edit_email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_password">{t('admin_new_password_optional', "Nouveau mot de passe (optionnel)")}</Label>
                                <Input
                                    id="edit_password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={t('admin_password_hint', "Laisser vide pour ne pas modifier")}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_role">{t('admin_role_privileges', "Rôle (Privilèges)")}</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={handleRoleChange}
                                    disabled={selectedUser?.is_superuser}
                                >
                                    <SelectTrigger id="edit_role">
                                        <SelectValue placeholder={t('admin_select_placeholder', "Sélectionnez un rôle")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">{t('admin_role_admin_desc', "Administrateur (Tous les droits)")}</SelectItem>
                                        <SelectItem value="user">{t('admin_role_user_desc', "Utilisateur (Actualités & Ressources uniquement)")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 mt-2">
                                <div className="space-y-0.5">
                                    <Label htmlFor="edit_is_active" className="text-sm font-bold cursor-pointer">{t('admin_user_active_label', "Compte actif")}</Label>
                                    <p className="text-[10px] text-slate-400">
                                        {t('admin_user_active_desc', "L'utilisateur pourra se connecter au système.")}
                                    </p>
                                </div>
                                <Switch
                                    id="edit_is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                    disabled={selectedUser?.is_superuser}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>{t('admin_cancel', "Annuler")}</Button>
                            <Button onClick={handleUpdate}>{t('admin_save', "Sauvegarder")}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Warning Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-rose-600 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" />
                                {t('admin_delete_permanent', "Suppression définitive")}
                            </DialogTitle>
                            <DialogDescription className="pt-3">
                                {t('admin_confirm_delete_user', "Êtes-vous sûr de vouloir révoquer les accès et supprimer le compte de l'utilisateur")} <strong className="text-slate-900">{selectedUser?.username}</strong> ?
                                {t('admin_action_irreversible', "Cette action est irréversible.")}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>{t('admin_cancel', "Annuler")}</Button>
                            <Button variant="destructive" onClick={handleDelete}>{t('admin_confirm_delete_btn', "Confirmer la suppression")}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </AdminLayout>
    );
};

export default UsersManagement;

