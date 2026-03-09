import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { UserPlus, ArrowLeft, Shield, Save, User as UserIcon, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

const AddUser = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "user",
        is_active: true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast({
                title: t('error', "Erreur"),
                description: t('admin_fill_required', "Veuillez remplir les champs obligatoires (*)"),
                variant: "destructive"
            });
            return;
        }

        try {
            setIsLoading(true);
            await api.post("/api/accounts/manage-users/", formData);
            toast({
                title: t('success', "Succès"),
                description: t('user_created', "L'utilisateur a été créé avec succès.")
            });
            navigate("/admin/users");
        } catch (error: any) {
            toast({
                title: t('error', "Erreur"),
                description: error.response?.data?.error || t('error_creating_user', "Une erreur est survenue lors de la création."),
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-2">
                                <UserPlus className="h-8 w-8 text-teal-600" />
                                {t('admin_new_user', "Nouvel Utilisateur")}
                            </h1>
                            <p className="text-slate-500">
                                {t('admin_add_user_desc', "Créez un nouvel accès pour un pasteur ou un administrateur.")}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-teal-600" />
                                {t('admin_details', "Détails de l'utilisateur")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">{t('admin_first_name', "Prénom")}</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Jean"
                                        autoComplete="given-name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">{t('admin_last_name', "Nom")}</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Ndayizeye"
                                        autoComplete="family-name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">{t('admin_username_label', "Nom d'utilisateur")} *</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        className="pl-9"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Utilisé pour la connexion"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t('contact_label_email', "Email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="pl-9"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="pastor@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secondary Info (Security & Role) */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-teal-600" />
                                    {t('admin_security', "Sécurité")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">{t('admin_password_label', "Mot de passe")} *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className="pl-9"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role-select">{t('admin_role_privileges', "Rôle (Privilèges)")}</Label>
                                    <Select value={formData.role} onValueChange={handleRoleChange}>
                                        <SelectTrigger id="role-select">
                                            <SelectValue placeholder={t('admin_select_placeholder', "Sélectionnez un rôle")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">{t('admin_role_admin', "Administrateur")}</SelectItem>
                                            <SelectItem value="user">{t('admin_role_user', "Utilisateur standard")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-slate-400 italic mt-1">
                                        {formData.role === 'admin'
                                            ? t('admin_role_admin_desc', "Donne accès à tous les menus.")
                                            : t('admin_role_user_desc', "Donne accès aux Actualités et Ressources uniquement.")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg font-bold"
                                disabled={isLoading}
                            >
                                <Save className="h-5 w-5 mr-2" />
                                {t('admin_save', "Enregistrer")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12"
                                onClick={() => navigate("/admin/users")}
                                disabled={isLoading}
                            >
                                {t('admin_cancel', "Annuler")}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddUser;
