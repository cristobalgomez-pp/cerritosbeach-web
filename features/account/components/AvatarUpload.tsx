'use client';

import { useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/image-compress';
import { uploadAvatar } from '../lib/actions';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type Props = {
  currentAvatarUrl?: string | null;
  displayName?: string | null;
  email: string;
};

function getInitials(displayName: string | null | undefined, email: string): string {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
  }
  return email.charAt(0).toUpperCase();
}

export function AvatarUpload({ currentAvatarUrl, displayName, email }: Props) {
  const t = useTranslations('cuenta.settings');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentUrl = preview ?? currentAvatarUrl ?? null;
  const initials = getInitials(displayName, email);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('avatarErrorInvalidType'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t('avatarErrorTooLarge'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPendingFile(file);
    e.target.value = '';
  }

  function handleCancel() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPendingFile(null);
    setError(null);
  }

  function handleConfirm() {
    if (!pendingFile) return;

    startTransition(async () => {
      const compressed = await compressImage(pendingFile, { maxSizeMB: 0.3, maxWidthOrHeight: 400 });

      const fd = new FormData();
      fd.append('file', compressed, compressed.type === 'image/webp' ? 'avatar.webp' : pendingFile.name);

      const result = await uploadAvatar(fd);

      if (result.status === 'error') {
        const msg =
          result.code === 'FILE_TOO_LARGE'
            ? t('avatarErrorTooLarge')
            : result.code === 'INVALID_TYPE'
              ? t('avatarErrorInvalidType')
              : t('avatarErrorSupabase');
        setError(msg);
        setPreview(null);
        setPendingFile(null);
        return;
      }

      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setPendingFile(null);
      setError(null);
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-ink">{t('avatarSection')}</h2>

      <div className="flex items-center gap-5">
        <div className="size-20 shrink-0 overflow-hidden rounded-full border border-border bg-ocean">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-2xl font-medium text-foam">
              {initials}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {pendingFile ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={cn(
                  'inline-flex items-center justify-center rounded-full text-sm font-medium px-4 py-2',
                  'bg-ocean text-foam hover:bg-ocean/90 transition-colors',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                {isPending ? t('avatarUploadingButton') : t('avatarConfirmButton')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className={cn(
                  'inline-flex items-center justify-center rounded-full text-sm font-medium px-4 py-2',
                  'border border-border bg-foam text-ink hover:bg-surface-warm transition-colors',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                {t('avatarCancelButton')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={cn(
                'inline-flex items-center justify-center rounded-full text-sm font-medium px-4 py-2',
                'border border-border bg-foam text-ink hover:bg-surface-warm transition-colors'
              )}
            >
              {t('avatarChangeButton')}
            </button>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && !error && <p className="text-xs text-green-600">{t('avatarSuccess')}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
