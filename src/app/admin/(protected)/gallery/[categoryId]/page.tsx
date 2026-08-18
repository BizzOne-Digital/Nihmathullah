"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AdminPage } from "@/components/admin/AdminShell";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import type { MediaItem } from "@/types";
import {
  adminButtonDanger,
  adminButtonPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface GalleryImage {
  _id: string;
  title?: string;
  alt: string;
  url: string;
  categoryId: string;
  published: boolean;
  order: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function GalleryCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const { success, error } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<{
    alt: string;
    media?: MediaItem;
  }>({ alt: "" });

  const load = () => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        const cat = data.categories?.find((c: Category) => c._id === categoryId);
        setCategory(cat ?? null);
        setImages(
          (data.images ?? []).filter(
            (img: GalleryImage) => img.categoryId === categoryId
          )
        );
      })
      .catch(() => error("Failed to load"));
  };

  useEffect(() => { load(); }, [categoryId, error]);

  const addImage = async () => {
    if (!newImage.media || !newImage.alt) {
      error("Image and alt text required");
      return;
    }
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "image",
        categoryId,
        url: newImage.media.url,
        alt: newImage.alt,
        title: newImage.alt,
        published: false,
        order: images.length,
      }),
    });
    if (res.ok) {
      success("Image added");
      setNewImage({ alt: "" });
      load();
    } else error("Failed to add image");
  };

  const togglePublish = async (img: GalleryImage) => {
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "image",
        id: img._id,
        published: !img.published,
      }),
    });
    load();
  };

  return (
    <AdminPage
      title={category?.name ?? "Gallery"}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Gallery", href: "/admin/gallery" },
        { label: category?.name ?? "Category" },
      ]}
    >
      <div className={`mb-6 ${adminCardClass}`}>
        <h2 className="mb-4 font-display text-lg text-ivory">Add image</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaUpload
            directory="gallery"
            value={newImage.media}
            onChange={(media) => setNewImage({ ...newImage, media })}
          />
          <div>
            <label className={adminLabelClass}>Alt text</label>
            <input
              className={adminInputClass}
              value={newImage.alt}
              onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            />
            <button className={`${adminButtonPrimary} mt-4`} onClick={addImage}>
              Add to gallery
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <div key={img._id} className={adminCardClass}>
            <div className="relative mb-3 aspect-video overflow-hidden rounded-md bg-rich-black">
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="300px" />
            </div>
            <p className="text-sm text-ivory">{img.alt}</p>
            <div className="mt-3 flex gap-2">
              <button
                className={adminButtonPrimary}
                onClick={() => togglePublish(img)}
              >
                {img.published ? "Unpublish" : "Publish"}
              </button>
              <button
                className={adminButtonDanger}
                onClick={() => setDeleteId(img._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete image"
        message="This will permanently remove the image."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          await fetch(`/api/admin/gallery?entity=image&id=${deleteId}`, {
            method: "DELETE",
          });
          success("Image deleted");
          load();
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </AdminPage>
  );
}
