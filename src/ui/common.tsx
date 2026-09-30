// Small shared UI pieces.

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { domainById, isFallback, subjectById, subjectColor, tr } from '../catalog';
import { calendarAge } from '../domain/age';
import type { Skill } from '../domain/types';
import { useLocale } from '../i18n';
import type { StatusInfo } from '../store/useProgress';

export function useDark(): boolean {
  const q = '(prefers-color-scheme: dark)';
  const [dark, setDark] = useState(() => window.matchMedia?.(q).matches ?? false);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return;
    const on = (e: MediaQueryListEvent) => setDark(e.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return dark;
}

const ICON: Record<StatusInfo['tone'], string> = {
  good: '✓',
  implied: '✓',
  progress: '◐',
  serious: '!',
  critical: '!!',
  neutral: '○',
};

export function StatusBadge({ status }: { status: StatusInfo }) {
  const { t } = useTranslation();
  return (
    <span className={`badge tone-${status.tone}`}>
      <span aria-hidden>{ICON[status.tone]}</span> {t(`status.${status.code}`)}
    </span>
  );
}

export function SubjectDot({ subjectId }: { subjectId: string }) {
  const dark = useDark();
  return <span className="dot" style={{ background: subjectColor(subjectId, dark) }} aria-hidden />;
}

export function SubjectLabel({ subjectId }: { subjectId: string }) {
  const locale = useLocale();
  return (
    <span className="subject-label">
      <SubjectDot subjectId={subjectId} /> {tr(subjectById.get(subjectId)?.name, locale)}
    </span>
  );
}

export function typicalAgeText(skill: Skill, t: (k: string, o?: Record<string, unknown>) => string): string {
  if (skill.percentiles) {
    const p = skill.percentiles;
    return t('skill.window', { from: monthsText(p.p25, t), to: monthsText(p.p90, t) });
  }
  if (skill.ageStart !== undefined) return t('skill.ageRange', { from: skill.ageStart, to: skill.ageEnd ?? skill.ageStart });
  return '';
}

export function monthsText(m: number, t: (k: string, o?: Record<string, unknown>) => string): string {
  if (m < 24) return t('age.months', { count: Math.round(m) });
  const y = Math.floor(m / 12);
  const rest = Math.round(m - y * 12);
  return rest ? t('age.yearsMonths', { y, m: rest }) : t('age.years', { count: y });
}

export function AgeText({ birthDate, at }: { birthDate: string; at: string }) {
  const { t } = useTranslation();
  const a = calendarAge(birthDate, at);
  return <>{t('age.full', { y: a.years, m: a.months, d: a.days })}</>;
}

export function SkillRow({ skill, status, extra }: { skill: Skill; status?: StatusInfo; extra?: ReactNode }) {
  const locale = useLocale();
  const { t } = useTranslation();
  return (
    <Link to={`/skill/${encodeURIComponent(skill.id)}`} className="skill-row">
      <SubjectDot subjectId={skill.subjectId} />
      <span className="skill-row-main">
        <span className="skill-name">
          {tr(skill.name, locale)}
          {isFallback(skill.name, locale) && <span className="en-tag" title={t('common.notTranslated')}>EN</span>}
        </span>
        {status && (
          <span>
            <StatusBadge status={status} />
          </span>
        )}
        <span className="muted small">
          {tr(domainById.get(skill.domainId)?.name, locale)} · {typicalAgeText(skill, t)}
        </span>
        {extra}
      </span>
    </Link>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const { t } = useTranslation();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function downloadFile(name: string, content: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
