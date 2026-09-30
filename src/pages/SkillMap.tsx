// Skill map (APP_SPEC §4.1): focus view, subject view and whole map.

import dagre from '@dagrejs/dagre';
import { Background, Controls, MarkerType, Position, ReactFlow, type Edge as FlowEdge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { catalog, graph, searchSkills, skillById, subjectColor, subjectsOrdered, tr } from '../catalog';
import { typicalAgeMonths } from '../domain/cdf';
import { neighbourhood, transitiveReduction, type Edge } from '../domain/graph';
import type { Skill } from '../domain/types';
import { useLocale } from '../i18n';
import { useProgress, type Progress } from '../store/useProgress';
import { StatusBadge, SubjectDot, useDark } from '../ui/common';

const WholeMap = lazy(() => import('../ui/WholeMap'));

type View = 'focus' | 'subject' | 'whole';
const NODE_W = 190;
const NODE_H = 54;

export function SkillMap() {
  const { t } = useTranslation();
  const progress = useProgress();
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as View) || 'focus';
  const focus = params.get('focus') || progress?.upNext[0]?.skill.id || catalog.skills[0].id;
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    p.set(k, v);
    setParams(p, { replace: true });
  };
  if (!progress) return null;

  return (
    <div className="page wide">
      <h1>{t('map.title')}</h1>
      <div className="tabs" role="tablist">
        {(['focus', 'subject', 'whole'] as View[]).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'tab on' : 'tab'} onClick={() => set('view', v)}>
            {t(`map.${v}`)}
          </button>
        ))}
      </div>
      <Legend />
      {view === 'focus' && <FocusView focus={focus} progress={progress} onFocus={(id) => set('focus', id)} />}
      {view === 'subject' && <SubjectView progress={progress} onFocus={(id) => { set('focus', id); set('view', 'focus'); }} />}
      {view === 'whole' && (
        <Suspense fallback={<p>{t('common.loading')}</p>}>
          <WholeMap progress={progress} onFocus={(id) => { const p = new URLSearchParams(params); p.set('focus', id); p.set('view', 'focus'); setParams(p); }} />
        </Suspense>
      )}
    </div>
  );
}

function Legend() {
  const { t } = useTranslation();
  return (
    <p className="legend muted small">
      <span className="badge tone-good">✓ {t('map.legendDone')}</span> <span className="badge tone-implied">✓ {t('status.implied')}</span>{' '}
      <span className="badge tone-progress">◐ {t('map.legendProgress')}</span> <span className="badge tone-neutral">○ {t('status.not_yet')}</span> ·{' '}
      <span className="line-solid" /> {t('link.hard')} <span className="line-dashed" /> {t('link.soft')}
    </p>
  );
}

function SkillNode({ skill, progress, focus }: { skill: Skill; progress: Progress; focus?: boolean }) {
  const locale = useLocale();
  const dark = useDark();
  const st = progress.statusOf(skill);
  return (
    <div className={`map-node tone-${st.tone} ${focus ? 'focus' : ''}`} style={{ borderLeftColor: subjectColor(skill.subjectId, dark) }}>
      <span className="map-node-name">{tr(skill.name, locale)}</span>
    </div>
  );
}

/** Layered layout (dagre): prerequisites above, dependents below. */
function layout(ids: string[], edges: Edge[], dir: 'TB' | 'LR' = 'TB'): Map<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: dir, nodesep: 12, ranksep: dir === 'LR' ? 70 : 46 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const id of ids) g.setNode(id, { width: NODE_W, height: NODE_H });
  for (const e of edges) g.setEdge(e.from, e.to);
  dagre.layout(g);
  return new Map(ids.map((id) => [id, { x: g.node(id).x - NODE_W / 2, y: g.node(id).y - NODE_H / 2 }]));
}

function toFlow(
  skills: Skill[],
  edges: Edge[],
  progress: Progress,
  positions: Map<string, { x: number; y: number }>,
  focus?: string,
  dir: 'TB' | 'LR' = 'TB',
) {
  const nodes: Node[] = skills.map((s) => ({
    id: s.id,
    position: positions.get(s.id) ?? { x: 0, y: 0 },
    data: { label: <SkillNode skill={s} progress={progress} focus={s.id === focus} /> },
    style: { width: NODE_W, padding: 0, border: 'none', background: 'transparent' },
    sourcePosition: dir === 'LR' ? Position.Right : Position.Bottom,
    targetPosition: dir === 'LR' ? Position.Left : Position.Top,
  }));
  const flowEdges: FlowEdge[] = edges.map((e) => ({
    id: `${e.from}>${e.to}`,
    source: e.from,
    target: e.to,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: e.strength === 'soft' ? { strokeDasharray: '5 4' } : { strokeWidth: 2 },
  }));
  return { nodes, flowEdges };
}

function FocusView({ focus, progress, onFocus }: { focus: string; progress: Progress; onFocus: (id: string) => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const skill = skillById.get(focus);

  const { nodes, flowEdges } = useMemo(() => {
    // Upstream: 2 levels. Downstream: 1 level, the 10 closest in age (a skill can unlock dozens).
    const up = neighbourhood(graph, focus, 2);
    const upIds = new Set<string>([focus]);
    const upEdges = up.edges.filter((e) => {
      const isUp = e.to === focus || graph.in[graph.index.get(focus)!].some((x) => x.from === e.to);
      if (isUp) upIds.add(e.from).add(e.to);
      return isUp;
    });
    const focusAge = typicalAgeMonths(skillById.get(focus)!) ?? 0;
    const down = [...graph.out[graph.index.get(focus)!]]
      .sort((a, b) => Math.abs((typicalAgeMonths(skillById.get(a.to)!) ?? 0) - focusAge) - Math.abs((typicalAgeMonths(skillById.get(b.to)!) ?? 0) - focusAge))
      .slice(0, 10);
    const ids = new Set([...upIds, ...down.map((e) => e.to)]);
    const reduced = transitiveReduction([...upEdges, ...down]);
    const list = [...ids];
    return toFlow(list.map((id) => skillById.get(id)!), reduced, progress, layout(list, reduced), focus);
  }, [focus, progress]);

  const results = searchSkills(query, locale, 8);
  return (
    <>
      <div className="map-toolbar">
        <input className="input" placeholder={t('map.searchFocus')} value={query} onChange={(e) => setQuery(e.target.value)} />
        {query && (
          <div className="dropdown">
            {results.map((s) => (
              <button key={s.id} className="list-btn" onClick={() => { onFocus(s.id); setQuery(''); }}>
                <SubjectDot subjectId={s.subjectId} /> {tr(s.name, locale)}
              </button>
            ))}
          </div>
        )}
      </div>
      {skill && (
        <p>
          <strong>{tr(skill.name, locale)}</strong> <StatusBadge status={progress.statusOf(skill)} />{' '}
          <Link to={`/skill/${encodeURIComponent(skill.id)}`}>{t('map.openSkill')}</Link>
        </p>
      )}
      <p className="muted small">{t('map.focusHelp')}</p>
      <div className="flow">
        <ReactFlow nodes={nodes} edges={flowEdges} fitView fitViewOptions={{ maxZoom: 1 }} onNodeClick={(_, n) => onFocus(n.id)} nodesDraggable={false} minZoom={0.2}>
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </>
  );
}

function SubjectView({ progress, onFocus }: { progress: Progress; onFocus: (id: string) => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [subject, setSubject] = useState('mathematics');
  const [ahead, setAhead] = useState(12);

  const { nodes, flowEdges, shown, total } = useMemo(() => {
    const all = catalog.skills.filter((s) => {
      if (s.subjectId !== subject || s.kind === 'behaviour') return false;
      const ta = typicalAgeMonths(s);
      return ta !== undefined && ta <= progress.ageMonths + ahead;
    });
    // Keep the map readable: at most MAX skills, the ones closest to the current age.
    const MAX = 60;
    const skills = [...all]
      .sort((a, b) => Math.abs(typicalAgeMonths(a)! - progress.ageMonths) - Math.abs(typicalAgeMonths(b)! - progress.ageMonths))
      .slice(0, MAX);
    const ids = new Set(skills.map((s) => s.id));
    const edges: Edge[] = [];
    for (const s of skills) for (const e of graph.in[graph.index.get(s.id)!]) if (ids.has(e.from)) edges.push(e);
    const reduced = transitiveReduction(edges);
    // Wide screens: left to right; phones: top to bottom.
    const dir = window.innerWidth > 700 ? 'LR' : 'TB';
    const { nodes, flowEdges } = toFlow(skills, reduced, progress, layout([...ids], reduced, dir), undefined, dir);
    return { nodes, flowEdges, shown: skills.length, total: all.length };
  }, [subject, ahead, progress]);

  return (
    <>
      <div className="filters">
        <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label={t('map.subject')}>
          {subjectsOrdered.map((s) => (
            <option key={s.id} value={s.id}>
              {tr(s.name, locale)}
            </option>
          ))}
        </select>
        <select className="input" value={ahead} onChange={(e) => setAhead(Number(e.target.value))} aria-label={t('map.ahead')}>
          {[12, 24, 48, 96].map((m) => (
            <option key={m} value={m}>
              {t('map.aheadN', { count: m / 12 })}
            </option>
          ))}
        </select>
      </div>
      <p className="muted small">
        {t('map.subjectHelp')} {shown < total && t('map.tooMany', { shown, total })}
      </p>
      <div className="flow">
        <ReactFlow nodes={nodes} edges={flowEdges} fitView fitViewOptions={{ maxZoom: 1 }} onNodeClick={(_, n) => onFocus(n.id)} nodesDraggable={false} minZoom={0.05}>
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </>
  );
}
