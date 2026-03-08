import React from "react";
import { Fingerprint, Image as ImageIcon, Link as LinkIcon, FileText, Globe, Cross } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface IdentityTabContentProps {
    settings: any;
}

const IdentityTabContent = React.memo(({ settings }: IdentityTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Infos Générales */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-indigo-600 flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" /> {t('admin_site_identity_title', "Identité du Site")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="site_name" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> {t('admin_site_name_label', "Nom du Site")}
                        </label>
                        <Input
                            id="site_name"
                            name="site_name"
                            defaultValue={settings?.site_name}
                            placeholder="Diocèse Anglicane de Makamba"
                            className="rounded-xl border-slate-200 h-11 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <FileText className="h-3 w-3" /> {t('admin_description_seo_label', "Description (SEO)")}
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={settings?.description}
                            placeholder="Site officiel du Diocèse..."
                            className="rounded-xl border-slate-200 min-h-[100px] focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <label htmlFor="default_language" className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                            <Globe className="h-3 w-3" /> {t('admin_default_lang_label', "Langue par Défaut du Site")}
                        </label>
                        <select
                            id="default_language"
                            name="default_language"
                            defaultValue={settings?.default_language || 'fr'}
                            className="w-full rounded-xl border-slate-200 h-11 bg-white px-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                        >
                            <option value="fr">🇫🇷 {t('lang_fr_full', 'Français (Par défaut)')}</option>
                            <option value="rn">🇧🇮 {t('lang_rn_full', 'Kirundi')}</option>
                            <option value="en">🇬🇧 {t('lang_en_full', 'English')}</option>
                            <option value="sw">🇹🇿 {t('lang_sw_full', 'Swahili')}</option>
                        </select>
                        <p className="text-[10px] text-slate-400 font-medium italic mt-1">
                            {t('admin_default_lang_tip', "Cette langue sera utilisée pour les nouveaux visiteurs si leur navigateur ne permet pas la détection automatique.")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Logo Management */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-blue-600 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" /> {t('admin_logo_branding_title', "Logo & Branding")}
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4">
                        <label htmlFor="logo" className="text-xs font-bold text-slate-500 uppercase">{t('admin_official_logo_label', "Logo Officiel")}</label>
                        <div className="flex items-center gap-6">
                            {settings?.logo_url_display ? (
                                <div className="p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <img
                                        src={settings.logo_url_display}
                                        alt={t('logo', 'Logo')}
                                        className="h-12 w-auto object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="p-2 bg-emerald-50 rounded-xl border border-dashed border-emerald-200 flex flex-col items-center gap-1">
                                    <Cross className="h-8 w-8 text-emerald-600" />
                                    <span className="text-[8px] font-bold text-emerald-600 uppercase">{t('admin_default', 'Défaut')}</span>
                                </div>
                            )}
                            <div className="flex-1 space-y-2">
                                <Input
                                    id="logo"
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    className="rounded-lg border-slate-200 h-10 text-xs"
                                />
                                <p className="text-[10px] text-slate-400 font-medium italic">
                                    {t('admin_upload_recommended', "Upload direct (recommandé).")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="logo_url" className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" /> {t('admin_or_logo_url_label', "OU URL du Logo")}
                        </label>
                        <Input
                            id="logo_url"
                            name="logo_url"
                            defaultValue={settings?.logo_url}
                            placeholder="https://..."
                            className="rounded-xl border-slate-200 h-11 focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

IdentityTabContent.displayName = "IdentityTabContent";

export default IdentityTabContent;
