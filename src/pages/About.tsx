import { useTranslation } from 'react-i18next';
import { catalog } from '../catalog';

export function About() {
  const { t } = useTranslation();
  const own = catalog.skills.filter((s) => s.origin === 'own').length;
  const marble = catalog.skills.length - own;
  return (
    <div className="page narrow">
      <h1>{t('about.title')}</h1>
      <p>{t('about.intro')}</p>
      <p className="callout">{t('about.notMedical')}</p>

      <section className="card">
        <h2>{t('about.thanks')}</h2>
        <p>{t('about.marble', { count: marble })}</p>
        <p className="small">
          Marble Skill Taxonomy (v1) · © Generative Spark, Inc. (Marble) ·{' '}
          <a href="https://withmarble.com" target="_blank" rel="noreferrer">
            withmarble.com
          </a>{' '}
          ·{' '}
          <a href="https://github.com/withmarbleapp/os-taxonomy" target="_blank" rel="noreferrer">
            github.com/withmarbleapp/os-taxonomy
          </a>{' '}
          · licensed under ODbL 1.0 (database) and CC BY-SA 4.0 (content).
        </p>
      </section>

      <section className="card">
        <h2>{t('about.sources')}</h2>
        <p>{t('about.ownCatalog', { count: own })}</p>
        <ul className="small">
          <li>CDC / AAP, “Learn the Signs. Act Early.” milestone checklists (2022 revision; and 2004–2021 edition)</li>
          <li>WHO Multicentre Growth Reference Study Group (2006). WHO Motor Development Study: windows of achievement for six gross motor development milestones. Acta Paediatrica Suppl. 450: 86–95</li>
          <li>Ministère de l’Éducation nationale, programme de l’école maternelle (cycle 1, 2021) et programme du CP (cycle 2)</li>
          <li>Clements, D. H. &amp; Sarama, J., Learning and Teaching Early Math: The Learning Trajectories Approach</li>
          <li>American Academy of Pediatrics, HealthyChildren.org (toilet training, tooth brushing)</li>
        </ul>
        <p className="muted small">{t('about.estimates')}</p>
      </section>

      <section className="card">
        <h2>{t('about.licence')}</h2>
        <p className="small">{t('about.mit')}</p>
        <p className="muted small">Catalogue {catalog.version}</p>
      </section>
    </div>
  );
}
