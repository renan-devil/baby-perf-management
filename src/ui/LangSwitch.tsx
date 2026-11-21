// The FR · EN · PT switch in the top bar of Stories, Memory and the bucket list. It changes only
// that application's content (the stories, the voice, the list), not the interface language.

import { LANGS, type Lang } from '../../api/_stories';

export function LangSwitch({ lang, onChange, label }: { lang: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <span className="lang-switch" role="group" aria-label={label} title={label}>
      {LANGS.map((l) => (
        <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => onChange(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </span>
  );
}
