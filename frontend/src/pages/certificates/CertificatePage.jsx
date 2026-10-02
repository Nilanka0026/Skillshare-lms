import { useEffect, useState } from 'react';
import { Award, Printer } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { certificateApi } from '../../services/api.js';

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

export function CertificatePage({ publicVerification = false }) {
  const { certificateId } = useParams();
  const [searchParams] = useSearchParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const printOnLoad = searchParams.get('print') === '1';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCertificate(null);
    setNotFound(false);
    setError('');

    const request = publicVerification
      ? certificateApi.verify(certificateId)
      : certificateApi.get(certificateId);

    request
      .then((data) => {
        if (active) setCertificate(data);
      })
      .catch((apiError) => {
        if (!active) return;
        if (/certificate not found/i.test(apiError.message)) {
          setNotFound(true);
        } else {
          setError(apiError.message || 'The certificate could not be loaded.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [certificateId, publicVerification]);

  useEffect(() => {
    if (!certificate || !printOnLoad) return undefined;
    const printTimer = window.setTimeout(() => window.print(), 300);
    return () => window.clearTimeout(printTimer);
  }, [certificate, printOnLoad]);

  if (loading) {
    return <main className="mx-auto max-w-5xl px-5 py-20 text-center font-semibold text-gray-600">Loading certificate...</main>;
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Award className="mx-auto text-gray-400" size={36} />
        <h1 className="mt-5 text-3xl font-black text-gray-950">Certificate Not Found</h1>
        <p className="mt-3 text-gray-600">This certificate ID is invalid or is not in our records.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-teal-800 px-4 py-2.5 font-bold text-white hover:bg-teal-900">Return home</Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-2xl font-black text-gray-950">Certificate unavailable</h1>
        <p role="alert" className="mt-3 text-gray-600">{error}</p>
      </main>
    );
  }

  if (!certificate) return null;

  return (
    <main className="certificate-page mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="certificate-actions mb-6 flex flex-wrap items-center justify-between gap-4">
        {publicVerification ? (
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" /> Valid Certificate
          </div>
        ) : (
          <Link to="/dashboard/student/certificates" className="text-sm font-bold text-teal-800 hover:underline">Back to My Certificates</Link>
        )}
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50">
          <Printer size={17} /> Print / Save as PDF
        </button>
      </div>

      <section className="certificate-print" aria-label="Course completion certificate">
        <Award className="mb-5 text-teal-800" size={42} strokeWidth={1.5} />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">SkillShare Learning</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">Certificate of Completion</h1>
        <p className="mt-8 text-sm text-gray-600">This certificate is proudly presented to</p>
        <p className="mt-2 max-w-full break-words text-2xl font-bold sm:text-4xl">{certificate.studentName}</p>
        <p className="mt-7 text-sm text-gray-600">for successfully completing</p>
        <p className="mt-2 max-w-full break-words text-xl font-black text-teal-900 sm:text-3xl">{certificate.courseName}</p>
        <p className="mt-5 text-sm text-gray-600">Instructor: <span className="font-bold text-gray-800">{certificate.instructorName}</span></p>
        <p className="mt-2 text-sm text-gray-600">Completed on {formatDate(certificate.completionDate)}</p>
        <div className="mt-9 border-t border-gray-200 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Certificate ID</p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-gray-800">{certificate.certificateId}</p>
          {certificate.issueDate && <p className="mt-1 text-xs text-gray-500">Issued {formatDate(certificate.issueDate)}</p>}
        </div>
      </section>
    </main>
  );
}
