import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Heart, BookOpen, Sprout, ArrowRight, Loader2, Quote, ChevronRight,
  Shield, Cross, Target, Star, HandHeart, GraduationCap, Baby, Church
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMinistries, useMinistryPage } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, any> = {
  Users, Heart, BookOpen, Sprout, Shield, Cross, Target, Star,
  HandHeart, GraduationCap, Baby, Church,
};

const Ministeres = () => {
  const { data: apiMinistries, isLoading: loadingM } = useMinistries();
  const { data: pageData, isLoading: loadingP } = useMinistryPage();
  const { t, i18n } = useTranslation();
  
  const safeLang = (i18n.language || 'fr').split('-')[0].toLowerCase();
  const displayMinistries = (Array.isArray(apiMinistries) ? apiMinistries : (apiMinistries?.results || []))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const isLoading = loadingM || loadingP;

  // Fallbacks for Hero
  const heroBadge = pageData?.[`hero_badge_${safeLang}`] || pageData?.hero_badge_fr || "NOS ACTIONS";
  const heroTitle = pageData?.[`hero_title_${safeLang}`] || pageData?.hero_title_fr || "Ministères";
  const heroDesc = pageData?.[`hero_description_${safeLang}`] || pageData?.hero_description_fr || "";
  const heroImgUrl = pageData?.hero_image_display || "/placeholder-hero.png";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ═══════════ HERO PLEIN ÉCRAN ═══════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImgUrl} alt="Ministères" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
              <Church className="h-4 w-4 text-violet-300" />
              <span className="text-white/80 font-body text-sm tracking-wider uppercase">{heroBadge}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              {heroTitle}
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {heroDesc}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <main>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-slate-500 font-medium">{t('ministries_loading', 'Chargement des ministères...')}</p>
          </div>
        ) : displayMinistries.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <p className="text-slate-500 font-body text-lg">{t('ministries_not_found', "Aucun ministère n'est encore enregistré.")}</p>
          </div>
        ) : (
          <div className="pb-24">
            {/* Grille de navigation rapide */}
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {displayMinistries.map((ministry, index) => {
                    const MinistryIcon = ICON_MAP[ministry.icon] || Users;
                    const mTitle = ministry[`title_${safeLang}`] || ministry.title_fr;
                    return (
                      <motion.a
                        key={ministry.id}
                        href={`#ministry-${ministry.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer"
                      >
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 mb-4 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                          <MinistryIcon className="h-7 w-7" />
                        </div>
                        <h3 className="font-heading text-sm md:text-base font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                          {mTitle}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-slate-300 mx-auto mt-2 group-hover:text-violet-500 transition-colors" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Sections détaillées */}
            {displayMinistries.map((ministry, index) => {
              const MinistryIcon = ICON_MAP[ministry.icon] || Users;
              const isEven = index % 2 === 0;
              const mTitle = ministry[`title_${safeLang}`] || ministry.title_fr;
              const mMission = ministry[`mission_${safeLang}`] || ministry.mission_fr;
              const mQuote = ministry[`testimony_quote_${safeLang}`] || ministry.testimony_quote_fr;

              return (
                <section
                  key={ministry.id}
                  id={`ministry-${ministry.id}`}
                  className={`py-20 md:py-28 ${isEven ? "bg-white" : "bg-slate-50"}`}
                >
                  <div className="container mx-auto px-4 max-w-7xl">
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${!isEven ? "direction-rtl" : ""}`}>
                      
                      {/* Photo */}
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className={`lg:col-span-5 ${!isEven ? "lg:order-2" : ""}`}
                      >
                        {ministry.image_display ? (
                          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 aspect-[4/5] group">
                            <img src={ministry.image_display} alt={mTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                              <div className="flex items-center gap-3">
                                <MinistryIcon className="h-8 w-8 text-white opacity-80" />
                                <h3 className="text-2xl font-heading font-bold text-white">{mTitle}</h3>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-violet-100/50 aspect-[4/5] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                            <MinistryIcon className="h-32 w-32 text-white/20" />
                          </div>
                        )}
                      </motion.div>

                      {/* Contenu */}
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className={`lg:col-span-7 ${!isEven ? "lg:order-1" : ""}`}
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-12 w-1.5 bg-violet-600 rounded-full"></div>
                          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">{mTitle}</h2>
                        </div>

                        <p className="font-body text-slate-600 text-lg leading-relaxed mb-8">{mMission}</p>

                        {/* Activités */}
                        {ministry.activities?.length > 0 && (
                          <div className="mb-8">
                            <h4 className="font-heading text-lg font-bold text-slate-900 mb-4">{t('ministries_activities_title', 'Nos activités principales')}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {ministry.activities.map((act: any) => (
                                <div key={act.id} className="flex items-center gap-3 p-3 rounded-xl bg-violet-50/50 border border-violet-100/50">
                                  <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0"></div>
                                  <span className="font-body text-slate-700 text-sm font-medium">{act[`title_${safeLang}`] || act.title_fr}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Témoignage */}
                        {mQuote && (
                          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl overflow-hidden">
                            <Quote className="h-8 w-8 text-violet-400 mb-4 opacity-60 relative z-10" />
                            <p className="font-heading text-lg text-slate-200 italic leading-relaxed mb-4 relative z-10">« {mQuote} »</p>
                            <p className="font-body text-violet-300 text-sm font-medium relative z-10">— {ministry.testimony_author || "Diocèse de Makamba"}</p>
                          </div>
                        )}

                        <div className="mt-8">
                          <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-violet-600 text-white font-body font-semibold text-sm hover:bg-violet-700 transition-all duration-300">
                            {t('ministries_join', 'Rejoindre ce ministère')} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Ministeres;
