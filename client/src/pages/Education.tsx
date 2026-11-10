import RecordManager from '../components/RecordManager';

export default function Education() {
  return (
    <section>
      <h1 className="section-title">Education</h1>
      <p className="lead">Formal qualifications and certifications, most recent first.</p>

      <RecordManager
        endpoint="/api/educations"
        itemLabel="Qualification"
        titleLabel="Program / diploma"
        emptyText="No qualifications have been added yet."
      />
    </section>
  );
}