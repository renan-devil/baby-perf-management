// A shared folder of documents (administrative papers, school papers), stored in a
// private Vercel Blob store behind the site password. See api/docs.ts, api/file.ts, api/upload.ts.

import { upload } from '@vercel/blob/client';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Space = 'administrative' | 'school';

interface Doc {
  pathname: string;
  size: number;
  uploadedAt: string;
}

/** "school/1761200000000-Certificat.pdf" → "Certificat.pdf" */
const displayName = (pathname: string) => pathname.split('/')[1].replace(/^\d+-/, '');

const safeName = (name: string) => name.replace(/[\\/:*?"<>|#%]+/g, '_').replace(/^\.+/, '_');

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const fileUrl = (pathname: string, download = false) =>
  `/api/file?pathname=${encodeURIComponent(pathname)}${download ? '&download=1' : ''}`;

export function Documents({ space }: { space: Space }) {
  const { t, i18n } = useTranslation();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [query, setQuery] = useState('');

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/docs?space=${space}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const list = (await res.json()) as Doc[];
      setDocs(list.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
    } catch (e) {
      setError(t('docs.loadError', { message: (e as Error).message }));
      setDocs([]);
    }
  }, [space, t]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = async (files: FileList) => {
    setError('');
    try {
      for (const [i, file] of [...files].entries()) {
        setBusy(t('docs.uploading', { name: file.name, n: i + 1, total: files.length }));
        await upload(`${space}/${Date.now()}-${safeName(file.name)}`, file, {
          access: 'private',
          handleUploadUrl: '/api/upload',
          multipart: file.size > 20 * 1024 * 1024,
        });
      }
    } catch (e) {
      setError(t('docs.uploadError', { message: (e as Error).message }));
    } finally {
      setBusy('');
      await refresh();
    }
  };

  const remove = async (doc: Doc) => {
    if (!confirm(t('docs.confirmDelete', { name: displayName(doc.pathname) }))) return;
    const res = await fetch(`/api/docs?pathname=${encodeURIComponent(doc.pathname)}`, { method: 'DELETE' });
    if (!res.ok) setError(t('docs.deleteError', { message: res.status }));
    await refresh();
  };

  const q = query.trim().toLowerCase();
  const shown = (docs ?? []).filter((d) => !q || displayName(d.pathname).toLowerCase().includes(q));

  return (
    <>
      <header className="topbar">
        <a href="#/" className="icon-btn" aria-label={t('hub.title')}>
          ⌂
        </a>
        <span className="brand">{t(`hub.${space}.name`)}</span>
      </header>
      <main className="page narrow">
        <section className="card stack">
          <label className={`btn primary${busy ? ' disabled' : ''}`}>
            {t('docs.add')}
            <input
              type="file"
              multiple
              hidden
              disabled={!!busy}
              onChange={(e) => {
                if (e.target.files?.length) void add(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          {busy && <p className="muted small">{busy}</p>}
          {error && <p className="callout serious">{error}</p>}
        </section>

        {docs && docs.length > 0 && <input className="input" type="search" placeholder={t('docs.search')} value={query} onChange={(e) => setQuery(e.target.value)} />}

        {docs === null ? (
          <p className="muted">{t('common.loading')}</p>
        ) : docs.length === 0 ? (
          <p className="muted center">{t('docs.empty')}</p>
        ) : (
          <div className="cards">
            {shown.map((d) => (
              <div key={d.pathname} className="doc-row">
                <a className="doc-main" href={fileUrl(d.pathname)} target="_blank" rel="noreferrer">
                  <span className="doc-name">{displayName(d.pathname)}</span>
                  <span className="muted small">
                    {new Date(d.uploadedAt).toLocaleDateString(i18n.language)} · {formatSize(d.size)}
                  </span>
                </a>
                <a className="icon-btn" href={fileUrl(d.pathname, true)} aria-label={t('docs.download')} title={t('docs.download')}>
                  ⤓
                </a>
                <button className="icon-btn" onClick={() => void remove(d)} aria-label={t('common.delete')} title={t('common.delete')}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
