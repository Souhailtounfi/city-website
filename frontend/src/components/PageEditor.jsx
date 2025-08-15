import React, { useState, useEffect, useRef } from "react";
import { createPage, updatePage, uploadPageImage, deletePageImage } from "../services/pages";
import { useTranslation } from "react-i18next";

const TITLE_MAP = {
  "presentation-generale": { fr: "Présentation Générale", ar: "عرض عام" },
  "apercu-historique": { fr: "Aperçu Historique", ar: "لمحة تاريخية" },
  "situation-geographique": { fr: "Situation Géographique", ar: "الموقع الجغرافي" }
};

export default function PageEditor({ slug, page, onSaved, allowMap=false, allowGallery=true }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const creating = !page;

  const fixedTitleFr = page?.title_fr || TITLE_MAP[slug]?.fr || "";
  const fixedTitleAr = page?.title_ar || TITLE_MAP[slug]?.ar || "";

  const [tab,setTab]=useState(lang==="ar"?"ar":"fr");
  const [contentFr,setContentFr]=useState(page?.content_fr ?? "");
  const [contentAr,setContentAr]=useState(page?.content_ar ?? "");
  const [mapUrl,setMapUrl]=useState(page?.extra?.map_url ?? "");
  const initialGallery = page?.extra?.gallery || [];
  const [gallery,setGallery]=useState(initialGallery);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [preview,setPreview]=useState(false);
  const [cleared,setCleared]=useState(false);
  const [uploading,setUploading]=useState(false);
  const fileInputRef = useRef(null);

  // Si page change 
  useEffect(()=>{
    if(page){
      setContentFr(page.content_fr ?? "");
      setContentAr(page.content_ar ?? "");
      setMapUrl(page.extra?.map_url ?? "");
      setGallery(page.extra?.gallery || []);
      setCleared(false);
    }
  },[page]);

  const clearAll = ()=>{
    if(!window.confirm(lang==="ar"?"هل تريد بالتأكيد مسح المحتوى؟":"Effacer tout le contenu ?")) return;
    setContentFr("");
    setContentAr("");
    setCleared(true);
    setMsg("");
  };

  const save = async ()=>{
    setSaving(true); setMsg("");
    try {
      // Construire payload intelligemment
      const payload = {
        title_fr: fixedTitleFr,
        title_ar: fixedTitleAr
      };

      // Map (si activé)
      if(allowMap){
        // Mettre à jour seulement si changé ou création
        if(creating || mapUrl !== (page?.extra?.map_url ?? "")){
          payload.extra = { ...(page?.extra||{}), map_url: mapUrl, gallery };
        } else {
          payload.extra = { ...(page?.extra||{}), gallery };
        }
      } else {
        payload.extra = { ...(page?.extra||{}), gallery };
      }

      // GESTION contenus:
      // - Si création: toujours inclure (même vide)
      // - Si mise à jour, ne pas écraser par vide NON intentionnel
      //   (vide intentionnel signalé par cleared)
      if(creating){
        payload.content_fr = contentFr;
        payload.content_ar = contentAr;
      } else {
        if(cleared){
          payload.content_fr = "";
          payload.content_ar = "";
        } else {
          if(contentFr.trim() !== "" && contentFr !== (page?.content_fr ?? "")){
            payload.content_fr = contentFr;
          }
          if(contentAr.trim() !== "" && contentAr !== (page?.content_ar ?? "")){
            payload.content_ar = contentAr;
          }
          // si champ resté vide et différent (cas page vide initialement) => laisser vide
          if((page?.content_fr ?? "") === "" && contentFr === ""){
            // rien: évite overwrite inutile
          }
          if((page?.content_ar ?? "") === "" && contentAr === ""){
            // rien
          }
        }
      }

      const res = creating
        ? await createPage({ slug, ...payload })
        : await updatePage(slug, payload);

      onSaved && onSaved(res);
      setMsg(lang==="ar"?"تم الحفظ":"Enregistré");
      if(cleared) setCleared(false);
    } catch {
      setMsg(lang==="ar"?"خطأ":"Erreur");
    } finally {
      setSaving(false);
    }
  };

  const onFilesSelected = async (e)=>{
    const files = Array.from(e.target.files||[]);
    if(!files.length) return;
    setUploading(true); setMsg("");
    try{
      let newGallery = gallery.slice();
      for(const f of files){
        const { gallery: g } = await uploadPageImage(slug,f);
        newGallery = g;
        setGallery(g);
      }
      // Mettre à jour extra local sans sauvegarder tout de suite (g déjà stocké côté serveur)
      onSaved && onSaved({...page, extra:{...(page?.extra||{}), gallery:newGallery}});
    }catch{
      setMsg(lang==="ar"?"فشل رفع صورة":"Échec téléversement");
    }finally{
      setUploading(false);
      if(fileInputRef.current) fileInputRef.current.value="";
    }
  };

  const removeImage = async (index)=>{
    if(!window.confirm(lang==="ar"?"حذف هذه الصورة؟":"Supprimer cette image ?")) return;
    try{
      const { gallery: g } = await deletePageImage(slug,index);
      setGallery(g);
      onSaved && onSaved({...page, extra:{...(page?.extra||{}), gallery:g}});
    }catch{
      setMsg(lang==="ar"?"خطأ حذف":"Erreur suppression");
    }
  };

  const tabBtn = (k,label)=>(
    <button
      onClick={()=>setTab(k)}
      className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
        tab===k
          ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow"
          : "bg-green-100 text-green-700 hover:bg-green-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="relative rounded-4xl bg-white/85 backdrop-blur ring-1 ring-green-200 shadow-sm overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_15%_20%,#10b981,transparent_60%),radial-gradient(circle_at_85%_80%,#047857,transparent_55%)]" />
      <div className="relative p-6 md:p-8 space-y-8">

        {/* Titres Fixes */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <TitleBadge label={fixedTitleFr}/>
            <TitleBadge rtl label={fixedTitleAr}/>
            <StatusChip creating={creating}/>
          </div>
          <p className="text-[11px] text-gray-500">
            {lang==="ar"
              ? "العناوين ثابتة. يمكنك تعديل المحتوى والوسائط فقط."
              : "Titres fixés. Vous pouvez modifier le contenu et les médias uniquement."}
          </p>
        </div>

        {/* Onglets & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {tabBtn("fr","FR")}
            {tabBtn("ar","AR")}
            {allowMap && <button
              onClick={()=>setTab("map")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                tab==="map"
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {lang==="ar"?"الخريطة":"Carte"}
            </button>}
            {allowGallery && <button
              onClick={()=>setTab("gallery")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                tab==="gallery"
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {lang==="ar"?"معرض":"Galerie"}
            </button>}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200"
            >
              {lang==="ar"?"مسح الكل":"Effacer tout"}
            </button>
            <button
              onClick={()=>setPreview(p=>!p)}
              className={`px-4 py-2 rounded-full text-xs font-semibold ${
                preview
                  ? "bg-green-700 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {preview ? (lang==="ar"?"تحرير":"Édition") : (lang==="ar"?"معاينة":"Prévisualiser")}
            </button>
            <button
              disabled={saving}
              onClick={save}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs font-semibold shadow hover:from-green-500 hover:to-emerald-400 disabled:opacity-60"
            >
              {saving ? (lang==="ar"?"جارٍ الحفظ...":"Enregistrement...") : (lang==="ar"?"حفظ":"Enregistrer")}
            </button>
          </div>
        </div>

        {/* Zones selon onglet */}
        { (tab==="fr" || tab==="ar") && (
          <div className="grid md:grid-cols-2 gap-6">
            {tab==="fr" && (
              <LangEditor
                dir="ltr"
                label="Contenu (FR)"
                value={contentFr}
                onChange={setContentFr}
                preview={preview}
              />
            )}
            {tab==="ar" && (
              <LangEditor
                dir="rtl"
                label="المحتوى (AR)"
                value={contentAr}
                onChange={setContentAr}
                preview={preview}
              />
            )}
          </div>
        )}

        {tab==="map" && allowMap && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-green-700">
              Google Maps Embed URL
            </label>
            <input
              value={mapUrl}
              onChange={e=>setMapUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full rounded-2xl border border-green-200 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/40"
            />
            <p className="text-[11px] text-gray-500">
              {lang==="ar"?"ضع رابط تضمين الخريطة (src).":"Collez l’URL (attribut src) d’intégration."}
            </p>
            {mapUrl && (
              <div className="rounded-2xl overflow-hidden ring-1 ring-green-200">
                <iframe
                  title="Map Preview"
                  src={mapUrl}
                  className="w-full h-[320px] border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {tab==="gallery" && allowGallery && (
          <GalleryManager
            lang={lang}
            gallery={gallery}
            uploading={uploading}
            onSelectFiles={onFilesSelected}
            onRemove={removeImage}
            fileInputRef={fileInputRef}
          />
        )}

        {msg && (
          <div className="text-xs font-semibold text-green-700">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

/* Sous‑composants */

function LangEditor({label,value,onChange,dir,preview}) {
  return (
    <div className="space-y-2" dir={dir}>
      <label className="text-xs font-semibold text-green-700">{label}</label>
      {preview
        ? <div className="rounded-2xl border border-green-200 bg-green-50/40 p-5 text-[1rem] leading-relaxed prose-preview"
            dangerouslySetInnerHTML={{__html:value}}/>
        : <textarea
            rows={16}
            value={value}
            onChange={e=>onChange(e.target.value)}
            className="w-full rounded-2xl border border-green-200 bg-white/70 px-4 py-3 text-[1rem] leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-green-400/40 min-h-[360px]"
            placeholder={dir==="rtl"?"أدخل المحتوى بالعربية":"Saisir le contenu (HTML ou texte)"} />}
    </div>
  );
}

function GalleryManager({lang,gallery,uploading,onSelectFiles,onRemove,fileInputRef}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onSelectFiles}
            className="hidden"
            id="pgGalleryInput"
          />
          <label
            htmlFor="pgGalleryInput"
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs font-semibold shadow hover:from-green-500 hover:to-emerald-400"
          >
            {uploading
              ? (lang==="ar"?"جارٍ الرفع...":"Téléversement...")
              : (lang==="ar"?"إضافة صور":"Ajouter des images")}
          </label>
        </div>
        <p className="text-[11px] text-gray-500">
          {lang==="ar"?"اختر عدة صور (حد أقصى 4MB لكل صورة).":"Sélectionnez plusieurs images (max 4MB chacune)."}
        </p>
      </div>
      {gallery.length === 0 && (
        <div className="text-xs text-gray-500 rounded-2xl border border-dashed border-green-200 p-8 text-center">
          {lang==="ar"?"لا توجد صور بعد.":"Aucune image pour le moment."}
        </div>
      )}
      {gallery.length>0 && (
        <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-5">
          {gallery.map((src,idx)=>(
            <div key={idx} className="group relative rounded-2xl overflow-hidden ring-1 ring-green-200 bg-white shadow-sm">
              <img
                src={buildImageSrc(src, gallery, idx)}
                alt={"img-"+idx}
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button
                onClick={()=>onRemove(idx)}
                className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                {lang==="ar"?"حذف":"Suppr"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TitleBadge({label,rtl}) {
  return (
    <span
      dir={rtl?"rtl":"ltr"}
      className="px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-xs font-semibold shadow-sm"
    >
      {label || (rtl ? "—" : "—")}
    </span>
  );
}

function StatusChip({creating}) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
      creating ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
    }`}>
      {creating ? "NOUVELLE" : "EXISTANTE"}
    </span>
  );
}

function buildImageSrc(src){
  if(/^https?:\/\//i.test(src)) return src;
  const base = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${base.replace(/\/$/,'')}/storage/${src.replace(/^storage\//,'')}`;
}