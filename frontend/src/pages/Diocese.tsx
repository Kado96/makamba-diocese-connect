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
  const { data: presentation, isLoading: loadingPresentation } = useDiocesePresentation();
  const { data: apiTimeline, isLoading: loadingTimeline } = useTimeline();
  const { data: apiTeam, isLoading: loadingTeam } = useTeamMembers();
  const { data: apiVision, isLoading: loadingVision } = useVisionValues();
  const { data: apiAxes, isLoading: loadingAxes } = useMissionAxes();

  const isLoading = loadingSettings || loadingPresentation || loadingTimeline || loadingTeam || loadingVision || loadingAxes;

  // Ordering Data
  // Ordering & Filtering Data by Language
  const timeline = apiTimeline 
    ? apiTimeline.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
    : [];
    
  const team = apiTeam 
    ? apiTeam.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
    : [];
    
  const visionValues = apiVision 
    ? apiVision.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
    : [];
    
  const missionAxes = apiAxes 
    ? apiAxes.filter(item => item.language === safeLang).sort((a, b) => a.order - b.order) 
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
              {t('the_diocese_title_1', 'Le')} <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-100 italic">{t('the_diocese_title_2', 'Diocèse')}</span>
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
      </div>

      {/* STICKY NAV BAR (Optional Sub-Menu style) */}
      <div className="w-full bg-white border-b border-slate-100 shadow-sm sticky top-[72px] z-30 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center gap-12 font-heading font-semibold text-slate-500 uppercase tracking-widest text-sm">
            <li><a href="#historique" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{t('diocese_history', 'Historique')}</a></li>
            <li><a href="#bishop" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{t('diocese_bishop_message', "L'Évêque")}</a></li>
            <li><a href="#vision" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{t('vision_title', 'Vision & Mission')}</a></li>
            <li><a href="#team" className="inline-block py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">{t('diocese_team', "L'Équipe")}</a></li>
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
                  <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight leading-tight">{t('origin_org_title', 'Notre Origine &')}<br />{t('organization_title', 'Organisation')}</h2>
                </div>

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
                <h3 className="text-2xl font-heading font-bold mb-8 text-slate-800 border-b pb-4">{t('major_chronology', 'Chronologie Majeure')}</h3>
                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {timeline.length > 0 ? timeline.map((event, index) => (
                    <div key={index} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group md:mx-auto">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border-4 border-emerald-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>

                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 hover:shadow-xl transition-all">
                        <span className="font-heading font-bold text-primary tracking-wider uppercase text-sm mb-2 block">{event.year}</span>
                        <h4 className="font-bold text-slate-800 text-lg mb-3">{event.title}</h4>

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
                      {t('bishop_of_diocese', 'Évêque du Diocèse')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}


        {/* SECTION: VISION & VALEURS */}
        <section id="vision" className="py-24 bg-[#FDFDFD]">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">{presentation?.[`vision_title_${safeLang}`] || t('vision_title')}</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{presentation?.[`vision_description_${safeLang}`] || t('vision_subtitle_default')}</p>

            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Values Grid */}
              <div>
                <h3 className="text-3xl font-heading font-bold mb-10 text-slate-800 flex items-center gap-3">
                  <Target className="text-primary h-8 w-8" /> {t('our_values', 'Nos Valeurs')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {visionValues.length > 0 ? visionValues.map((val, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                    >
                      {val.image_display && (
                        <div className="w-full h-32 -mt-6 -mx-6 mb-6 overflow-hidden">
                          <img src={val.image_display} alt={val.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        {!val.image_display && (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            {renderIcon(val.icon, { className: "h-6 w-6" })}
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-slate-900">{val.title}</h4>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{val.description}</p>
                    </motion.div>
                  )) : (
                    <p className="text-slate-400 italic">{t('no_values_configured', 'Aucune valeur configurée.')}</p>
                  )}
                </div>
              </div>

              {/* Mission Axes list */}
              <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
                <h3 className="text-3xl font-heading font-bold mb-10 text-slate-800 flex items-center gap-3">
                  <Target className="text-violet-500 h-8 w-8" /> {t('mission_axes', 'Nos Axes Stratégiques')}
                </h3>
                <div className="space-y-4">
                  {missionAxes.length > 0 ? missionAxes.map((axe, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-sm"
                    >
                      {axe.image_display && (
                        <div className="w-full h-40 rounded-xl overflow-hidden">
                          <img src={axe.image_display} alt={axe.text} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold font-heading shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed pt-1">{axe.text}</p>
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-slate-400 italic">{t('no_axes_configured', 'Aucun axe configuré.')}</p>
                  )}
                </div>
              </div>
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
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">{t('leadership', 'Leadership')}</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">{t('diocese_team_title', "L'Équipe Diocésaine")}</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{t('team_description_default', 'Les responsables dévoués qui accompagnent chaque jour la vie, les ministères et les projets du diocèse.')}</p>
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
