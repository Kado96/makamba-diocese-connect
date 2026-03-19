import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Quote,
  History,
  Target,
  Users,
  Network,
  Loader2,
  ChevronDown,
  Globe
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useSiteSettings,
  useDiocesePresentation,
  useTimeline,
  useMissionAxes,
  useVisionValues,
  useTeamMembers
} from "@/hooks/useApi";
// Only using these static ones if no image is present in the database 
import * as LucideIcons from "lucide-react";

// Helper to render icon dynamically
const renderIcon = (iconName: string, props: any) => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return <Target {...props} />;
  return <IconComponent {...props} />;
};

const Diocese = () => {
  const { t, i18n } = useTranslation();
  const safeLang = i18n.language?.split("-")[0] || "fr";

  const { data: settings, isLoading: loadingSettings } = useSiteSettings();
  const { data: presentationList, isLoading: loadingPresentation } = useDiocesePresentation();
  const presentation = presentationList?.[0];
  const { data: apiTimeline, isLoading: loadingTimeline } = useTimeline();
  const { data: apiTeam, isLoading: loadingTeam } = useTeamMembers();
  const { data: apiAxes, isLoading: loadingAxes } = useMissionAxes();

  const isLoading = loadingSettings || loadingPresentation || loadingTimeline || loadingTeam || loadingAxes;

  // Ordering Data
  // Ordering & Filtering Data by Language
  const timeline = apiTimeline 
    ? apiTimeline.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
    : [];
    
  const team = apiTeam 
    ? apiTeam.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
    : [];
    


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col justify-center items-center py-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50 mb-4" />
          <p className="text-slate-500 font-medium">{t('loading_diocese', 'Chargement des informations du diocèse...')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-body scroll-smooth">
      <Header />

      {/* 
        HERO SECTION PREMIUM 
      */}
      <div className="relative w-full h-[60vh] min-h-[500px] flex shrink-0 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={presentation?.hero_image_display || "/src/assets/hero-diocese.jpg"}
            alt="Diocèse de Makamba"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-semibold tracking-widest uppercase mb-6 border border-white/20 shadow-lg">
              {t('about_badge', 'À Propos de Nous')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-heading mb-6 tracking-tight drop-shadow-xl leading-tight">
              {presentation?.[`hero_title_${safeLang}`] || t('diocese_hero_title', 'Le Diocèse')}
            </h1>
            <p className="text-lg md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
              {presentation?.[`hero_subtitle_${safeLang}`] || t('diocese_hero_desc')}
            </p>

            <motion.a
              href="#historique"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 inline-flex flex-col items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <span className="text-xs uppercase tracking-widest mb-2 font-semibold">{t('hero_discover', 'Découvrir')}</span>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </motion.a>
          </motion.div>
        </div>
        {/* Background Hero Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-tighter whitespace-nowrap uppercase">
          {presentation?.[`hero_title_${safeLang}`] || t('diocese_hero_title', 'Le Diocèse')}
        </h1>
      </div>

      {/* STICKY NAV BAR (Optional Sub-Menu style) */}
      <div className="w-full bg-white border-b border-slate-100 shadow-sm sticky top-[72px] z-30 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-12 font-heading font-semibold text-slate-500 uppercase tracking-widest text-sm">
            <li><a href="#historique" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{presentation?.[`nav_history_${safeLang}`] || t('diocese_history', 'Historique')}</a></li>
            <li><a href="#bishop" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{presentation?.[`nav_bishop_${safeLang}`] || t('diocese_bishop_message', "L'Évêque")}</a></li>
            <li><a href="#vision" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{presentation?.[`nav_vision_${safeLang}`] || t('vision_title', 'Vision & Mission')}</a></li>
            <li><a href="#team" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{presentation?.[`nav_team_${safeLang}`] || t('diocese_team', "L'Équipe")}</a></li>
          </ul>
        </div>
      </div>

      <main className="flex-grow">

        {/* SECTION: ORGANISATION & HISTOIRE GLOBALE */}
        <section id="historique" className="py-20 md:py-32 bg-white relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-8 sticky top-32"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1.5 bg-primary rounded-full"></div>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight leading-tight">
                    {presentation?.[`organization_title_${safeLang}`] || t('origin_org_title', 'Notre Origine & Organisation')}
                  </h2>
                </div>
                {presentation?.[`organization_subtitle_${safeLang}`] && (
                  <p className="text-lg text-slate-500 font-medium border-l-4 border-primary pl-6 py-2">
                     {presentation?.[`organization_subtitle_${safeLang}`]}
                  </p>
                )}

                {(presentation?.[`history_text_${safeLang}`]) && (
                  <div className="space-y-6">
                    {presentation.history_image_display && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white mb-8"
                      >
                        <img 
                          src={presentation.history_image_display} 
                          alt={t('diocese_history', 'Historique')} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                    <p className="text-lg text-slate-600 font-body leading-relaxed text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                      {presentation?.[`history_text_${safeLang}`]}
                    </p>
                  </div>
                )}

                {(presentation?.[`organization_text_${safeLang}`]) && (
                  <div className="mt-8 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-6 items-start">
                    <Network className="h-10 w-10 text-primary flex-shrink-0" />
                    <p className="text-slate-600 leading-relaxed font-body">
                      {presentation?.[`organization_text_${safeLang}`]}
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                {/* Historique Chronologique (Timeline) */}
                <h3 className="text-2xl font-heading font-bold mb-8 text-slate-800 border-b pb-4">{presentation?.[`history_title_${safeLang}`] || t('major_chronology', 'Chronologie Majeure')}</h3>
                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {timeline.length > 0 ? timeline.map((event, index) => (
                    <div key={index} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group md:mx-auto">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border-4 border-emerald-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>

                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 hover:shadow-xl transition-all">
                        {event.year && <span className="font-heading font-bold text-primary tracking-wider uppercase text-sm mb-2 block">{event.year}</span>}
                        {event.title && <h4 className="font-bold text-slate-800 text-lg mb-3">{event.title}</h4>}

                        {event.image_display && (
                          <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-100">
                            <img src={event.image_display} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-400 italic text-center w-full">{t('no_history_found', "Aucun évènement historique trouvé. Ajoutez-en via l'administration.")}</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: MOT DE L'EVEQUE */}
        {(presentation?.[`bishop_message_${safeLang}`] || presentation?.bishop_message_fr || presentation?.bishop_photo_display) && (
          <section id="bishop" className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden text-slate-100">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-center"
              >
                {/* Bishop Photo */}
                <div className="w-64 h-64 md:w-80 md:h-80 shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-violet-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  {presentation.bishop_photo_display ? (
                    <img
                      src={presentation.bishop_photo_display}
                      alt={presentation.bishop_name || "L'Évêque"}
                      className="relative w-full h-full object-cover object-top rounded-full border-4 border-slate-800 shadow-2xl"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700">
                      <Users className="w-20 h-20 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Bishop Message */}
                <div className="flex-1 text-center md:text-left space-y-8">
                  <Quote className="h-16 w-16 text-primary/30 mx-auto md:mx-0" />
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium text-white leading-relaxed">
                    « {presentation?.[`bishop_message_${safeLang}`] || t('bishop_message_default')} »
                  </blockquote>
                  <div>
                    <h3 className="text-2xl font-bold font-heading text-primary">
                      {presentation.bishop_name || "Rt. Rev. Samuel Nduwayo"}
                    </h3>
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-sm mt-2">
                      {presentation?.[`bishop_title_${safeLang}`] || t('bishop_of_diocese', 'Évêque du Diocèse')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}


        {/* SECTION: BLOCS ÉDITORIAUX (Vision, Mission, Valeurs) */}
        <section id="vision" className="py-24 bg-[#FDFDFD]">
          <div className="container mx-auto px-6 max-w-6xl space-y-32">
            
            {/* BLOC 1: VISION (Image à Droite) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
            >
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-red-600"></div>
                  <h6 className="text-red-600 font-bold uppercase tracking-widest text-xs">
                    {presentation?.[`vision_badge_${safeLang}`] || t('vision_badge_default', 'NOTRE VISION')}
                  </h6>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                    {presentation?.[`vision_title_${safeLang}`] || t('vision_title')}
                  </h2>
                </div>
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                  {presentation?.[`vision_description_${safeLang}`]}
                </div>
              </div>
              {presentation?.vision_image_display && (
                <div className="w-full lg:w-[450px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl skew-y-1">
                  <img src={presentation.vision_image_display} alt="Vision" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              )}
            </motion.div>

            {/* BLOC 2: MISSION (Image à Gauche) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center"
            >
              {presentation?.mission_image_display && (
                <div className="w-full lg:w-[450px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl -skew-y-1">
                  <img src={presentation.mission_image_display} alt="Mission" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              )}
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-violet-600"></div>
                  <h6 className="text-violet-600 font-bold uppercase tracking-widest text-xs">
                    {presentation?.[`mission_badge_${safeLang}`] || t('mission_badge_default', 'NOTRE MISSION')}
                  </h6>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                    {presentation?.[`mission_title_${safeLang}`] || t('mission_title')}
                  </h2>
                </div>
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                  {presentation?.[`mission_description_${safeLang}`]}
                </div>
              </div>
            </motion.div>

            {/* BLOC 3: VALEURS (Image à Droite) */}
            <div className="space-y-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center"
              >
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <div className="w-16 h-1 bg-emerald-600"></div>
                    <h6 className="text-emerald-600 font-bold uppercase tracking-widest text-xs">
                      {presentation?.[`values_badge_${safeLang}`] || t('values_badge_default', 'NOS VALEURS')}
                    </h6>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                      {presentation?.[`values_title_${safeLang}`] || t('our_values')}
                    </h2>
                  </div>
                  <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                    {presentation?.[`values_description_${safeLang}`]}
                  </div>
                </div>
                {presentation?.values_image_display && (
                  <div className="w-full lg:w-[450px] aspect-video lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl skew-y-1">
                    <img src={presentation.values_image_display} alt="Valeurs" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: L'EQUIPE */}
        <section id="team" className="py-24 bg-white border-t border-slate-100 relative">
          <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
                {presentation?.[`team_badge_${safeLang}`] || t('leadership')}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
                {presentation?.[`team_title_${safeLang}`] || t('diocese_team_title')}
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                {presentation?.[`team_description_${safeLang}`] || t('team_description_default')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.length > 0 ? team.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative">
                    {member.image_display ? (
                      <img src={member.image_display} alt={member.name} className="w-full h-full object-cover object-top filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                        <Users className="w-20 h-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">{member.role}</p>
                      <h3 className="text-xl font-heading font-bold mb-3">{member.name}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 italic text-lg">{t('no_team_configured', "L'équipe n'a pas encore été renseignée dans l'administration.")}</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Diocese;
