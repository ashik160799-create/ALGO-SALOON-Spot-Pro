import { supabase } from '../supabaseALGOClient';

export const BUCKET_NAME = 'APP.FILES';

export interface StorageUploadResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
  path?: string;
}

export const SupabaseStorage = {
  /**
   * Helper to parse and extract the bucket storage path from a Supabase URL
   * Returns null if the URL is external (e.g. Unsplash, placeholder) or invalid
   */
  extractPathFromUrl(url?: string | null): string | null {
    if (!url || typeof url !== 'string') return null;

    // Check if it's already a relative path inside APP.FILES
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
      const clean = url.replace(/^\/+/, '');
      return clean.includes('/') ? clean : null;
    }

    // Match Supabase storage URL patterns:
    // .../storage/v1/object/public/APP.FILES/<path>
    // .../storage/v1/object/sign/APP.FILES/<path>
    // .../storage/v1/object/authenticated/APP.FILES/<path>
    const match = url.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/APP\.FILES\/(.+?)(?:\?.*)?$/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    return null;
  },

  /**
   * Generic file/blob/base64 upload to APP.FILES bucket
   */
  async uploadFile(path: string, file: File | Blob | string, contentType?: string): Promise<StorageUploadResponse> {
    try {
      let uploadPayload: any = file;

      // If base64 data URL string, convert to Blob
      if (typeof file === 'string') {
        if (file.startsWith('data:')) {
          const parts = file.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : (contentType || 'image/jpeg');
          const byteString = atob(parts[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          uploadPayload = new Blob([ab], { type: mime });
          contentType = mime;
        } else {
          return { success: false, error: 'Invalid file format' };
        }
      }

      const cleanPath = path.replace(/^\/+/, '');
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(cleanPath, uploadPayload, {
          contentType: contentType || (uploadPayload instanceof File ? uploadPayload.type : 'image/jpeg'),
          upsert: true
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(cleanPath);

      return {
        success: true,
        publicUrl: urlData.publicUrl,
        path: cleanPath
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'File upload failed' };
    }
  },

  /**
   * Delete a file by raw storage path from APP.FILES
   */
  async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cleanPath = path.replace(/^\/+/, '');
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([cleanPath]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'File deletion failed' };
    }
  },

  /**
   * Delete a file from APP.FILES using its public or signed URL
   * Safely ignores external URLs (Unsplash, mock photos)
   */
  async deleteFileByUrl(url?: string | null): Promise<{ success: boolean; error?: string }> {
    const path = this.extractPathFromUrl(url);
    if (path) {
      return await this.deleteFile(path);
    }
    return { success: true };
  },

  /**
   * Delete an entire folder and all its contents recursively from APP.FILES
   */
  async deleteFolderRecursively(folder: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cleanFolder = folder.replace(/^\/+/, '').replace(/\/+$/, '');
      if (!cleanFolder) return { success: false, error: 'Invalid folder path' };

      const { data: fileList, error: listErr } = await supabase.storage.from(BUCKET_NAME).list(cleanFolder, {
        limit: 100,
        offset: 0
      });

      if (listErr) return { success: false, error: listErr.message };
      if (!fileList || fileList.length === 0) return { success: true };

      const filesToDelete: string[] = [];
      for (const item of fileList) {
        const itemPath = `${cleanFolder}/${item.name}`;
        if (item.id === null || !item.metadata) {
          // Subfolder -> recurse
          await this.deleteFolderRecursively(itemPath);
        } else {
          filesToDelete.push(itemPath);
        }
      }

      if (filesToDelete.length > 0) {
        const { error: removeErr } = await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
        if (removeErr) return { success: false, error: removeErr.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Folder deletion failed' };
    }
  },

  /**
   * Complete Customer Storage Cleanup:
   * Deletes all avatars, uploads, and media for customer
   */
  async deleteCustomerStorage(userId: string): Promise<{ success: boolean }> {
    if (!userId) return { success: false };
    await this.deleteFolderRecursively(`customers/${userId}`);
    return { success: true };
  },

  /**
   * Complete Salon / Shop Storage Cleanup:
   * Deletes all shop logos, cover banners, promo videos, gallery photos,
   * verification documents, service images, and stylist photos for the shop
   */
  async deleteShopStorage(shopId: string): Promise<{ success: boolean }> {
    if (!shopId) return { success: false };
    await Promise.allSettled([
      this.deleteFolderRecursively(`shops/${shopId}`),
      this.deleteFolderRecursively(`services/${shopId}`),
      this.deleteFolderRecursively(`stylists/${shopId}`)
    ]);
    return { success: true };
  },

  /**
   * Safe Replace Pattern:
   * 1. Upload new file to new unique path
   * 2. Execute DB update callback with new public URL
   * 3. If DB update succeeds -> delete old file from storage (if hosted in APP.FILES)
   * 4. If DB update fails -> delete newly uploaded file (rollback) and preserve old file
   */
  async safeReplaceFile(
    newPath: string,
    file: File | Blob | string,
    oldUrl?: string | null,
    onDbUpdate?: (newPublicUrl: string) => Promise<boolean | void>,
    contentType?: string
  ): Promise<StorageUploadResponse> {
    // 1. Upload new file
    const uploadRes = await this.uploadFile(newPath, file, contentType);
    if (!uploadRes.success || !uploadRes.publicUrl) {
      return uploadRes;
    }

    const newPublicUrl = uploadRes.publicUrl;

    // 2. Perform DB update if callback provided
    if (onDbUpdate) {
      try {
        const updateOk = await onDbUpdate(newPublicUrl);
        if (updateOk === false) {
          // Rollback newly uploaded file
          await this.deleteFile(uploadRes.path || newPath);
          return { success: false, error: 'Database update failed. Storage upload rolled back.' };
        }
      } catch (err: any) {
        // Rollback newly uploaded file
        await this.deleteFile(uploadRes.path || newPath);
        return { success: false, error: err.message || 'Database update failed during upload.' };
      }
    }

    // 3. Delete old file from storage (only after successful DB update)
    if (oldUrl && oldUrl !== newPublicUrl) {
      await this.deleteFileByUrl(oldUrl);
    }

    return uploadRes;
  },

  /**
   * 1. Customer Profile Avatar Upload
   */
  async uploadCustomerAvatar(userId: string, file: File | Blob | string, oldAvatarUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `customers/${userId}/avatar_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldAvatarUrl);
  },

  /**
   * 2. Shop / Salon Avatar (Logo) Upload
   */
  async uploadShopAvatar(shopId: string, file: File | Blob | string, oldImageUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `shops/${shopId}/avatar/logo_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldImageUrl);
  },

  /**
   * 3. Shop Cover Banner Upload
   */
  async uploadShopBanner(shopId: string, file: File | Blob | string, oldBannerUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `shops/${shopId}/banner/cover_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldBannerUrl);
  },

  /**
   * 4. Shop Banner Video Upload (MP4, WebM)
   */
  async uploadShopBannerVideo(shopId: string, file: File | Blob, mimeType: string = 'video/mp4', oldVideoUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = (file as File).name?.split('.').pop() || 'mp4';
    const filePath = `shops/${shopId}/videos/banner_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldVideoUrl, undefined, mimeType);
  },

  /**
   * 5. Shop Gallery Showcase Photo Upload (Max 5 photos, slot indexed 0..4 with safe replace)
   */
  async uploadShopGalleryPhoto(shopId: string, file: File | Blob | string, slotIndex: number = 0, oldImageUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `shops/${shopId}/gallery/slot_${slotIndex}_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldImageUrl);
  },

  /**
   * 6. Salon Service Avatar / Image Upload
   */
  async uploadServiceImage(shopId: string, serviceId: string, file: File | Blob | string, oldImageUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `services/${shopId}/${serviceId}_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldImageUrl);
  },

  /**
   * 7. Stylist / Staff Avatar Upload
   */
  async uploadStylistAvatar(shopId: string, stylistId: string, file: File | Blob | string, oldAvatarUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `stylists/${shopId}/${stylistId}_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldAvatarUrl);
  },

  /**
   * 8. Trade License Certificate Document Upload (PDF / Image)
   */
  async uploadTradeLicenseDocument(shopId: string, file: File | Blob | string, mimeType?: string, oldDocUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'pdf';
    const filePath = `shops/${shopId}/documents/trade_license_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldDocUrl, undefined, mimeType || (typeof file !== 'string' ? (file as File).type : 'application/pdf'));
  },

  /**
   * 9. Tax / GST Certificate Document Upload (PDF / Image)
   */
  async uploadTaxDocument(shopId: string, file: File | Blob | string, mimeType?: string, oldDocUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'pdf';
    const filePath = `shops/${shopId}/documents/tax_vat_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldDocUrl, undefined, mimeType || (typeof file !== 'string' ? (file as File).type : 'application/pdf'));
  },

  /**
   * 10. Offer / Coupon Banner Upload
   */
  async uploadOfferBanner(offerId: string, file: File | Blob | string, oldBannerUrl?: string | null): Promise<StorageUploadResponse> {
    const ext = typeof file === 'string' ? 'jpg' : (file as File).name?.split('.').pop() || 'jpg';
    const filePath = `offers/banner_${offerId}_${Date.now()}.${ext}`;
    return await this.safeReplaceFile(filePath, file, oldBannerUrl);
  },

  /**
   * Storage Cleanup Job:
   * Scans APP.FILES storage and identifies files that are no longer referenced in the database,
   * then purges the orphaned objects.
   */
  async cleanupOrphanedFiles(): Promise<{ success: boolean; scannedCount: number; deletedCount: number; errors: string[] }> {
    const errors: string[] = [];
    let deletedCount = 0;
    let scannedCount = 0;

    try {
      // 1. Gather all active referenced URLs from database tables
      const [profilesRes, shopsRes, servicesRes, stylistsRes, offersRes] = await Promise.allSettled([
        supabase.from('profiles').select('avatar_url'),
        supabase.from('shops').select('image, banner_image, banner_video_url, gallery_images, promo_videos, trade_license_doc_url, tax_doc_url'),
        supabase.from('services').select('image'),
        supabase.from('stylists').select('avatar'),
        supabase.from('offers').select('image')
      ]);

      const activePaths = new Set<string>();

      // Extract from profiles
      if (profilesRes.status === 'fulfilled' && profilesRes.value.data) {
        profilesRes.value.data.forEach(p => {
          const path = this.extractPathFromUrl(p.avatar_url);
          if (path) activePaths.add(path);
        });
      }

      // Extract from shops
      if (shopsRes.status === 'fulfilled' && shopsRes.value.data) {
        shopsRes.value.data.forEach(s => {
          [s.image, s.banner_image, s.banner_video_url, s.trade_license_doc_url, s.tax_doc_url].forEach(u => {
            const path = this.extractPathFromUrl(u);
            if (path) activePaths.add(path);
          });
          if (Array.isArray(s.gallery_images)) {
            s.gallery_images.forEach((u: string) => {
              const path = this.extractPathFromUrl(u);
              if (path) activePaths.add(path);
            });
          }
          if (Array.isArray(s.promo_videos)) {
            s.promo_videos.forEach((u: string) => {
              const path = this.extractPathFromUrl(u);
              if (path) activePaths.add(path);
            });
          }
        });
      }

      // Extract from services
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data) {
        servicesRes.value.data.forEach(s => {
          const path = this.extractPathFromUrl(s.image);
          if (path) activePaths.add(path);
        });
      }

      // Extract from stylists
      if (stylistsRes.status === 'fulfilled' && stylistsRes.value.data) {
        stylistsRes.value.data.forEach(st => {
          const path = this.extractPathFromUrl(st.avatar);
          if (path) activePaths.add(path);
        });
      }

      // Extract from offers
      if (offersRes.status === 'fulfilled' && offersRes.value.data) {
        offersRes.value.data.forEach(o => {
          const path = this.extractPathFromUrl(o.image);
          if (path) activePaths.add(path);
        });
      }

      // 2. Helper to list and clean folder recursively
      const scanAndCleanFolder = async (folder: string) => {
        const { data: fileList, error } = await supabase.storage.from(BUCKET_NAME).list(folder, {
          limit: 100,
          offset: 0
        });

        if (error) {
          errors.push(`Error listing ${folder}: ${error.message}`);
          return;
        }

        if (!fileList) return;

        for (const item of fileList) {
          const itemPath = folder ? `${folder}/${item.name}` : item.name;

          // If placeholder file, keep it
          if (item.name === '.emptyFolderPlaceholder') continue;

          // If subdirectory (no id on item in some versions, or metadata is null)
          if (item.id === null || !item.metadata) {
            await scanAndCleanFolder(itemPath);
          } else {
            scannedCount++;
            if (!activePaths.has(itemPath)) {
              const delRes = await this.deleteFile(itemPath);
              if (delRes.success) {
                deletedCount++;
              } else {
                errors.push(`Failed to delete orphaned file ${itemPath}: ${delRes.error}`);
              }
            }
          }
        }
      };

      // 3. Scan main prefixes
      await Promise.allSettled([
        scanAndCleanFolder('customers'),
        scanAndCleanFolder('shops'),
        scanAndCleanFolder('services'),
        scanAndCleanFolder('stylists'),
        scanAndCleanFolder('offers')
      ]);

      return {
        success: errors.length === 0,
        scannedCount,
        deletedCount,
        errors
      };
    } catch (err: any) {
      return {
        success: false,
        scannedCount,
        deletedCount,
        errors: [err.message || 'Cleanup job failed']
      };
    }
  }
};

export default SupabaseStorage;
