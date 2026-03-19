import React from "react";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface ImageFieldWithPreviewProps {
    /** Nom du champ (ex: "hero_image", "about_image") */
    fieldName: string;
    /** Label affiché au-dessus du champ */
    label: string;
    /** URL de l'image déjà enregistrée côté serveur */
    currentImageUrl?: string | null;
    /** Conseil affiché sous le champ (ex: "Format suggéré : 1920x1080px") */
    hint?: string;
    /** Ratio d'aspect pour l'aperçu (ex: "21/9", "1/1", "16/9") */
    aspectRatio?: string;
    /** Hauteur max de l'aperçu en px */
    maxPreviewHeight?: string;
}

const ImageFieldWithPreview: React.FC<ImageFieldWithPreviewProps> = ({
    fieldName,
    label,
    currentImageUrl,
    hint,
    aspectRatio = "21/9",
    maxPreviewHeight = "180px",
}) => {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [removed, setRemoved] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRemoved(false);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemove = () => {
        setRemoved(true);
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    // Cleanup blob URL on unmount
    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // URL à afficher : preview local > serveur > rien
    const displayUrl = previewUrl || (!removed ? currentImageUrl : null);

    return (
        <div className="space-y-3">
            <label htmlFor={fieldName} className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> {label}
            </label>

            {/* Hidden input pour signaler la suppression au backend */}
            <input type="hidden" name={`clear_${fieldName}`} value={removed ? "true" : "false"} />

            {/* Aperçu de l'image */}
            {displayUrl ? (
                <div className="group relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                     style={{ aspectRatio, maxHeight: maxPreviewHeight }}>
                    <img
                        src={displayUrl}
                        className="w-full h-full object-cover"
                        alt={`${label} preview`}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                    {/* Overlay suppression */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                        title={t('admin_remove_image', "Supprimer l'image")}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('admin_remove', "Supprimer")}
                    </button>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                    <Upload className="h-8 w-8" />
                    <span className="text-xs font-medium">{t("admin_no_image", "Aucune image sélectionnée")}</span>
                </div>
            )}

            {/* Input fichier */}
            <Input
                id={fieldName}
                type="file"
                name={fieldName}
                ref={inputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="rounded-lg border-slate-200 h-10 text-xs"
            />

            {hint && (
                <p className="text-[10px] text-slate-400 font-medium italic">
                    {hint}
                </p>
            )}
        </div>
    );
};

ImageFieldWithPreview.displayName = "ImageFieldWithPreview";

export default ImageFieldWithPreview;
