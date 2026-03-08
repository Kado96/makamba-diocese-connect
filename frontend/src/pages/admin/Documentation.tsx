import React, { useRef, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Download, FileText, ChevronRight, LayoutDashboard, Settings, Users, BookOpen, Megaphone, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const Documentation = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const docRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Simulation des informations du site
    const siteName = "Anglicane Makamba";

    const generatePDF = async () => {
        if (!docRef.current) return;

        try {
            setIsGenerating(true);
            toast({
                title: t('admin_doc_generating_title', "Génération en cours..."),
                description: t('admin_doc_generating_desc', "Veuillez patienter pendant la création du manuel PDF."),
            });

            // Configuration pour html2canvas
            const canvas = await html2canvas(docRef.current, {
                scale: 2, // Meilleure qualité
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');

            // Configuration A4 (210x297mm)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const contentWidth = imgWidth * ratio;
            const contentHeight = imgHeight * ratio;

            // On découpe en plusieurs pages si nécessaire
            let heightLeft = imgHeight;
            let position = 0;
            let pageCount = 1;

            // Première page (Couverture)
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
            heightLeft -= (pdfHeight * imgWidth) / pdfWidth;

            // Pages suivantes
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.setPage(++pageCount);
                pdf.addImage(imgData, 'PNG', 0, (position * pdfWidth) / imgWidth, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
                heightLeft -= (pdfHeight * imgWidth) / pdfWidth;
            }

            pdf.save(`${t('admin_doc_filename', "Manuel_Utilisation")}_${siteName.replace(/\s+/g, '_')}.pdf`);

            toast({
                title: t('admin_doc_success_title', "Succès"),
                description: t('admin_doc_success_desc', "Le manuel PDF a été téléchargé avec succès."),
            });
        } catch (error) {
            console.error(error);
            toast({
                title: t('admin_doc_error_title', "Erreur"),
                description: t('admin_doc_error_desc', "Une erreur est survenue lors de la génération du PDF."),
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-indigo-600" />
                        {t('admin_doc_title', "Manuel d'utilisation")}
                    </h1>
                    <p className="text-slate-500 mt-1">{t('admin_doc_subtitle', "Générez et téléchargez le guide complet d'utilisation de la plateforme.")}</p>
                </div>

                <Button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    {isGenerating ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <Download className="h-5 w-5" />
                    )}
                    {isGenerating ? t('admin_doc_generating_btn', "Création du PDF...") : t('admin_doc_download_btn', "Télécharger le PDF")}
                </Button>
            </div>

            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 overflow-x-auto shadow-inner h-[800px] overflow-y-auto custom-scrollbar">
                {/* === DÉBUT DU DOCUMENT À EXPORTER (L'utilisateur voit l'aperçu, et c'est ce qui sera en PDF) === */}
                <div
                    ref={docRef}
                    className="bg-white w-full max-w-[800px] mx-auto shadow-sm"
                    style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}
                >
                    {/* PAGE 1: COUVERTURE */}
                    <div className="h-[297mm] flex flex-col bg-slate-900 relative overflow-hidden">
                        {/* Décoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 z-10">
                            <div className="bg-white p-6 rounded-3xl shadow-2xl mb-12">
                                <BookOpen className="h-24 w-24 text-indigo-600" />
                            </div>

                            <h1 className="text-5xl font-extrabold text-white mb-6 uppercase tracking-wider">{t('admin_doc_manual_h1', "Manuel")}<br />{t('admin_doc_manual_h2', "d'Utilisation")}</h1>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-teal-500 mb-8 rounded-full"></div>

                            <h2 className="text-3xl font-medium text-slate-200 mb-4">{siteName}</h2>
                            <p className="text-xl text-slate-400">{t('admin_doc_tagline', "Guide Administratif complet")}</p>
                        </div>

                        <div className="p-12 text-center text-slate-500 z-10 bg-black/20">
                            {t('admin_doc_update_date', "Mise à jour")} : {new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : (i18n.language === 'en' ? 'en-GB' : 'fr-FR'))} • Version 1.0
                        </div>
                    </div>

                    <div className="w-full h-4 bg-slate-100"></div>

                    {/* PAGE 2: INTRODUCTION & CONNEXION */}
                    <div className="p-12 min-h-[297mm]">
                        <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-indigo-100 pb-4 mb-8 flex items-center gap-3">
                            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">1</span>
                            {t('admin_doc_sec1_title', "Accès & Connexion")}
                        </h2>

                        <div className="prose max-w-none text-slate-600 text-lg mb-8">
                            <p>
                                {t('admin_doc_sec1_desc', "L'interface d'administration de {{siteName}} est un espace sécurisé qui permet aux gestionnaires de modifier le contenu du site public sans aucune compétence technique préalable.", { siteName })}
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 mt-12">
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <LayoutDashboard className="h-6 w-6 text-teal-600" />
                                {t('admin_doc_sec1_h3', "Comment se connecter ?")}
                            </h3>
                            <ol className="space-y-4 list-decimal list-inside text-slate-700">
                                <li className="pl-2">{t('admin_doc_sec1_step1', "Ouvrez votre navigateur (Chrome, Edge, Safari).")}</li>
                                <li className="pl-2">{t('admin_doc_sec1_step2', "Rendez-vous sur l'adresse : ")} <strong className="bg-slate-200 px-2 py-1 rounded">www.votre-site.com/admin/login</strong></li>
                                <li className="pl-2">{t('admin_doc_sec1_step3', "Entrez votre ")} <strong>{t('admin_doc_username', "Nom d'utilisateur")}</strong> {t('and', 'et')} {t('your', 'votre')} <strong>{t('admin_doc_password', "Mot de passe")}</strong>.</li>
                                <li className="pl-2">{t('admin_doc_sec1_step4', "Cliquez sur le bouton \"Connexion\".")}</li>
                            </ol>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-slate-100"></div>

                    {/* PAGE 3: COMPRENDRE LE TABLEAU DE BORD */}
                    <div className="p-12 min-h-[297mm]">
                        <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-indigo-100 pb-4 mb-8 flex items-center gap-3">
                            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">2</span>
                            {t('admin_doc_sec2_title', "Le Tableau de bord")}
                        </h2>

                        <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl relative">
                            {/* Simulation simplifiée du Menu latéral */}
                            <div className="w-64 bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-700 text-white float-right ml-6 mb-6">
                                <div className="opacity-50 text-xs uppercase font-bold mb-4 tracking-wider">{t('admin_doc_main_menu', "Menu Principal")}</div>
                                <div className="space-y-3">
                                    <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded flex items-center gap-2 text-sm"><LayoutDashboard size={16} /> {t('admin_dashboard', 'Tableau de bord')}</div>
                                    <div className="p-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"><Megaphone size={16} /> {t('admin_announcements', 'Actualités')}</div>
                                    <div className="p-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"><BookOpen size={16} /> {t('admin_sermons', 'Enseignements')}</div>
                                    <div className="p-2 hover:bg-white/5 rounded flex items-center gap-2 text-sm"><Users size={16} /> {t('admin_users', 'Utilisateurs')}</div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-4">{t('admin_doc_sec2_h3', "La Barre Latérale (Menu)")}</h3>
                            <p className="text-slate-600 mb-4">
                                {t('admin_doc_sec2_p1', "Sur le côté gauche de votre écran se trouve le menu principal. C'est votre outil de navigation. Chaque rubrique correspond à une section de votre site public.")}
                            </p>
                            <ul className="space-y-2 mt-4 text-slate-700">
                                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" /> <strong>{t('admin_announcements', 'Actualités')} :</strong> {t('admin_doc_sec2_ann_desc', "Pour ajouter, modifier ou supprimer des articles d'information.")}</li>
                                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" /> <strong>{t('admin_sermons', 'Enseignements (Ressources)')} :</strong> {t('admin_doc_sec2_ser_desc', "Pour publier des vidéos YouTube, des PDF ou des fichiers audio.")}</li>
                                <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" /> <strong>{t('admin_users', 'Utilisateurs')} :</strong> {t('admin_doc_sec2_usr_desc', "(Réservé aux Administrateurs) Pour créer des accès à vos collaborateurs.")}</li>
                            </ul>
                            <div className="clear-both"></div>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-slate-100"></div>

                    {/* PAGE 4: GESTION DES CONTENUS */}
                    <div className="p-12 min-h-[297mm]">
                        <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-indigo-100 pb-4 mb-8 flex items-center gap-3">
                            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">3</span>
                            {t('admin_doc_sec3_title', "Ajouter du Contenu")}
                        </h2>

                        <p className="text-slate-600 mb-8 text-lg">
                            {t('admin_doc_sec3_desc', "La procédure pour ajouter du contenu (une Actualité, un Ministère, une Paroisse) est identique partout.")}
                        </p>

                        <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">A</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t('admin_doc_sec3_h4_a', "Le bouton \"Nouveau\"")}</h4>
                                        <p className="text-slate-600">{t('admin_doc_sec3_p_a', "En haut à droite de chaque page se trouve toujours un bouton coloré (ex: \"Nouvelle Actualité\"). Cliquez dessus pour ouvrir le formulaire.")}</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-slate-100"></div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">B</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t('admin_doc_sec3_h4_b', "Remplissage du Formulaire")}</h4>
                                        <p className="text-slate-600">{t('admin_doc_sec3_p_b', "Remplissez les champs. Les champs avec un astérisque (*) sont obligatoires. Vous pouvez généralement choisir la langue (Français, Kirundi, Anglais, Swahili) pour que le contenu s'affiche au bon endroit sur le site.")}</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-slate-100"></div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">C</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t('admin_doc_sec3_h4_c', "Sauvegarde")}</h4>
                                        <p className="text-slate-600">{t('admin_doc_sec3_p_c', "N'oubliez jamais de cliquer sur Enregistrer en bas du formulaire. Une notification vous confirmera le succès de l'opération.")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl">
                            <h4 className="font-bold text-rose-800 text-lg mb-2">{t('admin_doc_images_title', "À propos des Images")}</h4>
                            <p className="text-rose-700">{t('admin_doc_images_desc', "Pour garantir un chargement rapide de votre site, privilégiez des images légères (idéalement moins de 500 Ko). Le système compressera souvent l'image automatiquement, mais une bonne image de départ garantit une belle apparence.")}</p>
                        </div>
                    </div>

                </div>
                {/* === FIN DU DOCUMENT === */}
            </div>
        </AdminLayout>
    );
};

export default Documentation;
