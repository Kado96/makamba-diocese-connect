import React from "react";
import { Info, Mail, Phone, MapPin, Globe, Facebook, Youtube, Instagram, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface ContactTabContentProps {
    settings: any;
}

const ContactTabContent = React.memo(({ settings }: ContactTabContentProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Information de Contact */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-emerald-600 flex items-center gap-2">
                    <Info className="h-5 w-5" /> {t('admin_contact_info_title', "Coordonnées Directes")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="settings-contact-email" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Mail className="h-3 w-3" /> {t('email', 'Email')}</label>
                        <Input id="settings-contact-email" name="contact_email" defaultValue={settings?.contact_email} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="settings-contact-phone" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Phone className="h-3 w-3" /> {t('phone', 'Téléphone')}</label>
                        <Input id="settings-contact-phone" name="contact_phone" defaultValue={settings?.contact_phone} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="settings-contact-address" className="text-xs font-bold text-slate-400 flex items-center gap-2"><MapPin className="h-3 w-3" /> {t('address', 'Adresse')}</label>
                        <Textarea id="settings-contact-address" name="contact_address" defaultValue={settings?.contact_address} className="rounded-xl border-slate-200 min-h-[100px]" />
                    </div>
                </div>
            </div>

            {/* Réseaux Sociaux */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-heading font-bold text-purple-600 flex items-center gap-2">
                    <Globe className="h-5 w-5" /> {t('admin_social_presence_title', "Présence Sociale")}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="settings-facebook" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Facebook className="h-3 w-3" /> Facebook</label>
                        <Input id="settings-facebook" name="facebook_url" defaultValue={settings?.facebook_url} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="settings-youtube" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Youtube className="h-3 w-3" /> Youtube</label>
                        <Input id="settings-youtube" name="youtube_url" defaultValue={settings?.youtube_url} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="settings-instagram" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Instagram className="h-3 w-3" /> Instagram</label>
                        <Input id="settings-instagram" name="instagram_url" defaultValue={settings?.instagram_url} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="settings-twitter" className="text-xs font-bold text-slate-400 flex items-center gap-2"><Twitter className="h-3 w-3" /> Twitter</label>
                        <Input id="settings-twitter" name="twitter_url" defaultValue={settings?.twitter_url} className="rounded-xl border-slate-200 h-11" />
                    </div>
                </div>
            </div>
        </div>
    );
});

ContactTabContent.displayName = "ContactTabContent";

export default ContactTabContent;
