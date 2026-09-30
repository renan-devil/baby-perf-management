// Progress dashboards (APP_SPEC §4.1): cumulative curve with normal band, developmental age
// per subject, and learning goals achieved per subject.

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { catalog, subjectsOrdered, tr } from '../catalog';
import { ageInMonths } from '../domain/age';
import { cumulativeCurve, developmentalAge, expectedCount } from '../domain/progress';
import { useLocale } from '../i18n';
import { useData } from '../store/DataContext';
import { useProgress } from '../store/useProgress';
import { monthsText, useDark } from '../ui/common';

const milestones = catalog.skills.filter((s) => s.kind === 'milestone' && s.percentiles);

export function ProgressPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const dark = useDark();
  const { child } = useData();
  const progress = useProgress();
  const [table, setTable] = useState(false);

  const ink = dark ? { text: '#c3c2b7', grid: '#3a3a37', series: '#3987e5', band: '#3987e5' } : { text: '#52514e', grid: '#e4e3df', series: '#2a78d6', band: '#2a78d6' };

  const data = useMemo(() => {
    if (!child || !progress) return null;
    const achievedAges = new Map<string, number>();
    for (const m of milestones) {
      const st = progress.states.get(m.id);
      if (st?.achievedOn && st.status !== 'lost') achievedAges.set(m.id, ageInMonths(child.birthDate, st.achievedOn));
    }
    const maxAge = Math.min(78, Math.ceil(progress.ageMonths + 12));
    // The child's line stops at the last dated milestone: after that we simply don't know.
    const lastLogged = Math.max(0, ...achievedAges.values());
    const curve = cumulativeCurve(milestones, achievedAges, maxAge, Math.min(progress.ageMonths, lastLogged + 0.5), 1);

    const dev = subjectsOrdered
      .map((s) => {
        const ms = milestones.filter((m) => m.subjectId === s.id);
        const count = ms.filter((m) => progress.done(m.id)).length;
        const d = developmentalAge(ms, count, 96);
        return { id: s.id, name: tr(s.name, locale), n: ms.length, count, dev: d };
      })
      .filter((x) => x.dev !== undefined);

    const years = Math.floor(progress.ageMonths / 12);
    const goals = subjectsOrdered
      .map((s) => {
        const gs = catalog.skills.filter((k) => k.subjectId === s.id && k.kind === 'learning_goal' && (k.ageStart ?? 99) <= years);
        const doneN = gs.filter((k) => progress.done(k.id)).length;
        return { id: s.id, name: tr(s.name, locale), total: gs.length, done: doneN, pct: gs.length ? Math.round((doneN / gs.length) * 100) : 0 };
      })
      .filter((x) => x.total > 0);

    const doneNow = milestones.filter((m) => progress.done(m.id)).length;
    const expectedNow = expectedCount(milestones, progress.ageMonths);
    return { curve, dev, goals, doneNow, expectedNow, dated: achievedAges.size };
  }, [child, progress, locale]);

  if (!data || !progress) return null;
  const age = Math.round(progress.ageMonths * 10) / 10;

  return (
    <div className="page wide">
      <h1>{t('progress.title')}</h1>
      <div className="tiles">
        <div className="tile">
          <span className="tile-value">{data.doneNow}</span>
          <span className="tile-label">{t('progress.milestonesDone', { total: milestones.length })}</span>
        </div>
        <div className="tile">
          <span className="tile-value">{Math.round(data.expectedNow)}</span>
          <span className="tile-label">{t('progress.expectedNow')}</span>
        </div>
        <div className="tile">
          <span className="tile-value">{progress.alerts.length}</span>
          <span className="tile-label">{t('progress.toDiscuss')}</span>
        </div>
      </div>

      <section className="chart-card">
        <h2>{t('progress.curveTitle')}</h2>
        <p className="muted small">{t('progress.curveHelp')}</p>
        <div className="chart">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.curve} margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid stroke={ink.grid} vertical={false} />
              <XAxis dataKey="age" type="number" domain={[0, 'dataMax']} tick={{ fill: ink.text, fontSize: 12 }} tickFormatter={(m) => `${m}`} label={{ value: t('progress.ageMonths'), position: 'insideBottom', offset: -4, fill: ink.text, fontSize: 12 }} height={40} />
              <YAxis tick={{ fill: ink.text, fontSize: 12 }} width={40} />
              <Tooltip
                formatter={(v, name) => [Array.isArray(v) ? `${v[0]}–${v[1]}` : String(v), String(name)]}
                labelFormatter={(m) => monthsText(Number(m), t)}
              />
              <Legend verticalAlign="top" height={28} />
              <Area dataKey={(d: { low: number; high: number }) => [d.low, d.high]} name={t('progress.band')} fill={ink.band} fillOpacity={0.14} stroke="none" isAnimationActive={false} />
              <Line dataKey="expected" name={t('progress.expected')} stroke={ink.text} strokeDasharray="5 4" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line dataKey="child" name={child!.firstName} stroke={ink.series} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
              <ReferenceLine x={age} stroke={ink.text} strokeDasharray="2 3" label={{ value: t('progress.today'), fill: ink.text, fontSize: 12, position: 'top' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="muted small">{t('progress.curveNote', { dated: data.dated })}</p>
        <button className="link-btn" onClick={() => setTable((x) => !x)}>
          {table ? t('progress.hideTable') : t('progress.showTable')}
        </button>
        {table && (
          <table className="table">
            <thead>
              <tr>
                <th>{t('progress.ageMonths')}</th>
                <th>{child!.firstName}</th>
                <th>{t('progress.expected')}</th>
                <th>{t('progress.band')}</th>
              </tr>
            </thead>
            <tbody>
              {data.curve.filter((p) => p.age % 3 === 0).map((p) => (
                <tr key={p.age}>
                  <td>{p.age}</td>
                  <td>{p.child ?? '–'}</td>
                  <td>{p.expected}</td>
                  <td>
                    {p.low}–{p.high}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="chart-card">
        <h2>{t('progress.devTitle')}</h2>
        <p className="muted small">{t('progress.devHelp', { age: monthsText(Math.floor(progress.ageMonths), t) })}</p>
        <div className="chart">
          <ResponsiveContainer width="100%" height={Math.max(160, data.dev.length * 40)}>
            <BarChart data={data.dev} layout="vertical" margin={{ top: 24, right: 48, bottom: 8, left: 8 }}>
              <CartesianGrid stroke={ink.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: ink.text, fontSize: 12 }} domain={[0, (max: number) => Math.ceil(Math.max(max, progress.ageMonths + 6) / 12) * 12]} allowDecimals={false} tickFormatter={(v) => String(Math.round(Number(v)))} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fill: ink.text, fontSize: 12 }} />
              <Tooltip formatter={(v) => [monthsText(Number(v), t), t('progress.devAge')]} />
              <Bar dataKey="dev" name={t('progress.devAge')} fill={ink.series} radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
                <LabelList dataKey="dev" position="right" fill={ink.text} fontSize={12} formatter={(v) => `${Math.round(Number(v))} m`} />
              </Bar>
              <ReferenceLine x={age} stroke={ink.text} strokeDasharray="4 3" label={{ value: t('progress.actualAge'), fill: ink.text, fontSize: 12, position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="muted small">{t('progress.devNote')}</p>
      </section>

      <section className="chart-card">
        <h2>{t('progress.goalsTitle')}</h2>
        <p className="muted small">{t('progress.goalsHelp')}</p>
        <div className="chart">
          <ResponsiveContainer width="100%" height={Math.max(160, data.goals.length * 40)}>
            <BarChart data={data.goals} layout="vertical" margin={{ top: 8, right: 64, bottom: 8, left: 8 }}>
              <CartesianGrid stroke={ink.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: ink.text, fontSize: 12 }} unit="%" />
              <YAxis type="category" dataKey="name" width={150} tick={{ fill: ink.text, fontSize: 12 }} />
              <Tooltip formatter={(v, _n, item) => [`${v}% (${(item.payload as { done: number }).done}/${(item.payload as { total: number }).total})`, t('progress.goalsDone')]} />
              <Bar dataKey="pct" name={t('progress.goalsDone')} fill={ink.series} radius={[0, 4, 4, 0]} barSize={18} isAnimationActive={false}>
                <LabelList dataKey="pct" position="right" fill={ink.text} fontSize={12} formatter={(v) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
