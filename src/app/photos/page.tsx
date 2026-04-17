"use client";

import { useState } from "react";
import Image from "next/image";
import { usePhotos, useAuth } from "@/lib/hooks";
import { getPhotoUrl, uploadPhoto, deletePhoto, type DbPhoto } from "@/lib/database";

const categories = [
  { key: "all", label: "All" },
  { key: "game", label: "Game Day" },
  { key: "practice", label: "Practice" },
  { key: "team", label: "Team" },
  { key: "dinner", label: "Team Dinners" },
  { key: "other", label: "Other" },
];

export default function PhotosPage() {
  const [category, setCategory] = useState("all");
  const { data: photos, loading, refetch } = usePhotos(category);
  const { isAdmin } = useAuth();
  const [lightbox, setLightbox] = useState<DbPhoto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Upload form state
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState<DbPhoto["category"]>("game");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadTeam, setUploadTeam] = useState<"varsity" | "jv" | "cteam" | "all">("all");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadPhoto(files[i], {
          caption: uploadCaption || undefined,
          category: uploadCategory,
          team: uploadTeam,
          date: new Date().toISOString().split("T")[0],
        });
      }
      setFiles(null);
      setUploadCaption("");
      setShowUpload(false);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: DbPhoto) {
    if (!confirm(`Delete "${photo.filename}"?`)) return;
    try {
      await deletePhoto(photo.id, photo.storage_path);
      setLightbox(null);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-navy">PHOTOS</h1>
          <div className="stitch-line mt-2 max-w-[200px]" />
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 rounded-lg bg-carolina hover:bg-carolina-dark text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            {showUpload ? "Close" : "Upload Photos"}
          </button>
        )}
      </div>

      {/* Upload form (admin only) */}
      {isAdmin && showUpload && (
        <div className="bg-white rounded-lg border border-navy/8 p-5 mb-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">
                Select Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="w-full text-sm font-heading text-navy file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy/5 file:text-navy/70 file:font-heading file:font-semibold file:text-xs file:uppercase file:tracking-wider hover:file:bg-navy/10 file:cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">Category</label>
                <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as DbPhoto["category"])}
                  className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white">
                  <option value="game">Game Day</option>
                  <option value="practice">Practice</option>
                  <option value="team">Team</option>
                  <option value="dinner">Team Dinners</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">Team</label>
                <select value={uploadTeam} onChange={(e) => setUploadTeam(e.target.value as typeof uploadTeam)}
                  className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white">
                  <option value="all">All Teams</option>
                  <option value="varsity">Varsity</option>
                  <option value="jv">JV</option>
                  <option value="cteam">C Team</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">Caption (optional)</label>
                <input type="text" value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g., Senior Night vs Peninsula"
                  className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white" />
              </div>
            </div>
            <button type="submit" disabled={uploading || !files?.length}
              className="px-6 py-2 rounded-lg bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors">
              {uploading ? "Uploading..." : `Upload ${files?.length ?? 0} Photo${files?.length !== 1 ? "s" : ""}`}
            </button>
          </form>
        </div>
      )}

      {/* Category filters */}
      <div className="flex gap-1 bg-navy/5 rounded-lg p-1 mb-8 w-fit">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${
              category === c.key
                ? "bg-navy text-white shadow-sm"
                : "text-navy/50 hover:text-navy hover:bg-white/60"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <p className="text-navy/40 font-heading py-12 text-center">Loading photos...</p>
      ) : !photos?.length ? (
        <div className="text-center py-16">
          <p className="font-display text-2xl text-navy/20 mb-2">NO PHOTOS YET</p>
          <p className="text-sm font-heading text-navy/40">
            {isAdmin ? "Click \"Upload Photos\" to add some." : "Check back soon for photos from the season."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="group relative aspect-square rounded-lg overflow-hidden bg-navy/5 card-lift"
            >
              <Image
                src={getPhotoUrl(photo.storage_path)}
                alt={photo.caption || photo.filename}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {photo.caption && (
                    <p className="text-white text-xs font-heading font-semibold truncate">{photo.caption}</p>
                  )}
                  <p className="text-white/60 text-[10px] font-heading uppercase tracking-wider">
                    {photo.category}{photo.date ? ` · ${new Date(photo.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" />
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white text-2xl z-10">&times;</button>

            {/* Image */}
            <div className="relative flex-1 min-h-0">
              <Image
                src={getPhotoUrl(lightbox.storage_path)}
                alt={lightbox.caption || lightbox.filename}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-t-lg"
              />
            </div>

            {/* Caption bar */}
            <div className="bg-navy rounded-b-lg px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                {lightbox.caption && (
                  <p className="text-white font-heading font-semibold text-sm truncate">{lightbox.caption}</p>
                )}
                <p className="text-white/40 text-xs font-heading uppercase tracking-wider">
                  {lightbox.category}
                  {lightbox.date ? ` · ${new Date(lightbox.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}` : ""}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(lightbox)}
                  className="px-3 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider border border-red-400/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Nav arrows */}
            {photos && photos.length > 1 && (() => {
              const idx = photos.findIndex((p) => p.id === lightbox.id);
              const prev = idx > 0 ? photos[idx - 1] : null;
              const next = idx < photos.length - 1 ? photos[idx + 1] : null;
              return (
                <>
                  {prev && (
                    <button onClick={(e) => { e.stopPropagation(); setLightbox(prev); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/50 hover:bg-navy/80 text-white flex items-center justify-center transition-colors text-lg">
                      &#8249;
                    </button>
                  )}
                  {next && (
                    <button onClick={(e) => { e.stopPropagation(); setLightbox(next); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/50 hover:bg-navy/80 text-white flex items-center justify-center transition-colors text-lg">
                      &#8250;
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
