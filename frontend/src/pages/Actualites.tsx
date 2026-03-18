import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useAnnouncements, FALLBACK_IMAGES } from "@/hooks/useApi";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

const Actualites = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(t('cat_all', "Toutes"));
  const { data: announcements, isLoading } = useAnnouncements();

  const categories = [
    t('cat_all', "Toutes"),
    t('cat_testimonials', "Témoignages"),
    t('cat_events', "Événements"),
    t('cat_news', "Nouvelles")
  ];

  const announcementList = (Array.isArray(announcements) ? announcements : (announcements?.results || []));

  const filtered = activeCategory === t('cat_all', "Toutes")
    ? announcementList
    : announcementList?.filter((a: any) => {
      // Filtrage en fonction des nouvelles catégories backend (category_display ou category)
      const matchesDisplay = a.category_display === activeCategory;
      const normalizedCat = activeCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matchesCategory = a.category === normalizedCat;
      return matchesDisplay || matchesCategory;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        title={t('nav_news', "Actualités")}
        subtitle={t('stories_title_default', "Toute l'actualité de nos actions, témoignages et événements du diocèse.")}
      />
      <main>
        <section className="section-padding bg-background">
          <div className="container mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              /* Articles grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered?.map((article: any, index: number) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-2xl border border-white/10"
                  >
                    <Link to={`/actualites/${article.id}`} className="absolute inset-0">
                      {/* Image de fond avec transition */}
                      <img
                        src={article.image_display || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Overlay dégradé immersif */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                      {/* Badge de catégorie (Style spécifié) */}
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-[#108558] hover:bg-[#0d6e4a] text-white border-none px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-xl">
                          {article.category_display || article.category}
                        </Badge>
                      </div>

                      {/* Contenu textuel sur l'image */}
                      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-6">
                        <div className="space-y-4">
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white leading-[1.1] drop-shadow-lg group-hover:text-primary-foreground/90 transition-colors">
                            {article.title}
                          </h3>
                          <p className="font-body text-white/70 text-sm leading-relaxed line-clamp-2 italic drop-shadow">
                            {article.content}
                          </p>
                        </div>

                        {/* Séparateur discret */}
                        <div className="h-px w-full bg-white/20" />

                        {/* Footer de la carte */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/60 text-[11px] font-bold uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(article.event_date || article.created_at).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>

                          </div>

                          <div className="bg-[#3F3B39] text-white px-6 py-2.5 rounded-full flex items-center gap-3 text-xs font-bold shadow-lg transition-all group-hover:bg-black group-hover:scale-105 active:scale-95">
                            {t('read_more', 'Lire la suite')}
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
