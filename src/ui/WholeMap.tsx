// Whole map: all skills as a force-directed network (canvas/WebGL-friendly), coloured by
// subject, with the child's achieved skills lit up.

import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';
import { useTranslation } from 'react-i18next';
import { catalog, subjectColor, subjectsOrdered, tr } from '../catalog';
import { useLocale } from '../i18n';
import type { Progress } from '../store/useProgress';
import { SubjectDot, useDark } from './common';

interface GNode {
  id: string;
  name: string;
  color: string;
  done: boolean;
}

export default function WholeMap({ progress, onFocus }: { progress: Progress; onFocus: (id: string) => void }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const dark = useDark();
  const box = useRef<HTMLDivElement>(null);
  const fg = useRef<ForceGraphMethods | undefined>(undefined);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => {
    const nodes: GNode[] = catalog.skills
      .filter((s) => s.kind !== 'behaviour')
      .map((s) => ({ id: s.id, name: tr(s.name, locale), color: subjectColor(s.subjectId, dark), done: progress.done(s.id) }));
    const ids = new Set(nodes.map((n) => n.id));
    const links = catalog.dependencies
      .filter((d) => ids.has(d.skillId) && ids.has(d.prerequisiteId))
      .map((d) => ({ source: d.prerequisiteId, target: d.skillId }));
    return { nodes, links };
  }, [locale, dark, progress]);

  const doneCount = data.nodes.filter((n) => n.done).length;
  return (
    <>
      <p className="muted small">{t('map.wholeHelp', { done: doneCount, total: data.nodes.length })}</p>
      <p className="legend small">
        {subjectsOrdered.map((s) => (
          <span key={s.id} className="legend-item">
            <SubjectDot subjectId={s.id} /> {tr(s.name, locale)}
          </span>
        ))}
      </p>
      <div className="flow whole" ref={box}>
        <ForceGraph2D
          ref={fg}
          onEngineStop={() => fg.current?.zoomToFit(300, 20)}
          graphData={data}
          width={width}
          height={560}
          backgroundColor={dark ? '#1a1a19' : '#fcfcfb'}
          nodeLabel={(n) => (n as GNode).name}
          nodeRelSize={6}
          nodeVal={(n) => ((n as GNode).done ? 2 : 1)}
          nodeColor={(n) => ((n as GNode).done ? (n as GNode).color : (n as GNode).color + '66')}
          linkColor={() => (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)')}
          linkDirectionalArrowLength={0}
          cooldownTicks={120}
          onNodeClick={(n) => onFocus((n as GNode).id)}
        />
      </div>
    </>
  );
}
