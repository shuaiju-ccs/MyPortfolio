import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { apiRequest } from '../lib/api';
import type { ContactRecord } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { FIELD_CONTROL, FIELD_ERROR, FIELD_LABEL, FORM_ALERT, FORM_SUCCESS } from '../components/formStyles';

type EditValues = { firstname: string; lastname: string; email: string; phone: string; message: string };
type EditErrors = Partial<Record<keyof EditValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: EditValues): EditErrors {
  const errors: EditErrors = {};
  if (!values.firstname.trim()) errors.firstname = 'First name is required.';
  if (!values.lastname.trim()) errors.lastname = 'Last name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  return errors;
}

const METHOD_LABEL: Record<string, string> = { email: 'Email', phone: 'Phone', either: 'Either' };

export default function Messages() {
  const { token, isAdmin } = useAuth();

  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({ firstname: '', lastname: '', email: '', phone: '', message: '' });
  const [editErrors, setEditErrors] = useState<EditErrors>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    apiRequest<ContactRecord[]>('/api/contacts', 'GET', undefined, token)
      .then((data) => !ignore && setContacts(data))
      .catch((err: Error) => !ignore && setError(err.message))
      .finally(() => !ignore && setIsLoading(false));
    return () => {
      ignore = true;
    };
  }, [token]);

  const startEdit = (contact: ContactRecord) => {
    setEditingId(contact._id);
    setEditValues({
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email,
      phone: contact.phone ?? '',
      message: contact.message ?? ''
    });
    setEditErrors({});
    setNotice('');
    setError('');
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditValues((previous) => ({ ...previous, [name]: value }));
    setEditErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(editValues);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !editingId) return;
    try {
      const updated = await apiRequest<ContactRecord>(`/api/contacts/${editingId}`, 'PUT', editValues, token);
      setContacts((previous) => previous.map((c) => (c._id === updated._id ? updated : c)));
      setEditingId(null);
      setNotice(`Message from ${updated.firstname} ${updated.lastname} updated.`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (contact: ContactRecord) => {
    if (confirmDeleteId !== contact._id) {
      setConfirmDeleteId(contact._id);
      return;
    }
    try {
      await apiRequest(`/api/contacts/${contact._id}`, 'DELETE', undefined, token);
      setContacts((previous) => previous.filter((c) => c._id !== contact._id));
      setNotice(`Message from ${contact.firstname} ${contact.lastname} deleted.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const sorted = [...contacts].sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''));

  return (
    <section>
      <h1 className="section-title">Messages</h1>
      <p className="lead">
        Messages sent through the Contact Me form.{' '}
        {isAdmin ? 'As admin you can edit or delete them.' : 'Your account can view them only.'}
      </p>

      <div className="grid gap-4 mt-6">
        {notice && <p role="status" className={FORM_SUCCESS}>{notice}</p>}
        {error && <p role="alert" className={FORM_ALERT}>{error}</p>}
        {isLoading && <p>Loading…</p>}
        {!isLoading && !error && sorted.length === 0 && <p>No messages yet.</p>}

        {sorted.map((contact) =>
          isAdmin && editingId === contact._id ? (
            <form key={contact._id} onSubmit={saveEdit} noValidate className="card grid gap-4">
              <h2 className="m-0 text-xl">Edit message</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {(['firstname', 'lastname', 'email', 'phone'] as const).map((name) => (
                  <label key={name} className={FIELD_LABEL}>
                    <span>{{ firstname: 'First name', lastname: 'Last name', email: 'Email', phone: 'Phone' }[name]}</span>
                    <input
                      type={name === 'email' ? 'email' : 'text'}
                      name={name}
                      value={editValues[name]}
                      onChange={handleEditChange}
                      aria-invalid={Boolean(editErrors[name])}
                      className={FIELD_CONTROL}
                    />
                    {editErrors[name] && <p role="alert" className={FIELD_ERROR}>{editErrors[name]}</p>}
                  </label>
                ))}
              </div>
              <label className={FIELD_LABEL}>
                <span>Message</span>
                <textarea name="message" rows={4} value={editValues.message} onChange={handleEditChange} className={`${FIELD_CONTROL} resize-y`} />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn">Save changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <article key={contact._id} className="card grid gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="m-0">{contact.firstname} {contact.lastname}</h3>
                {contact.created && (
                  <span className="text-sm text-muted">
                    {new Date(contact.created).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                )}
              </div>
              <p className="m-0 text-text">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                {contact.phone && <> · {contact.phone}</>}
                {contact.preferredContactMethod && <> · prefers {METHOD_LABEL[contact.preferredContactMethod]}</>}
              </p>
              {contact.message && <p className="m-0 whitespace-pre-line">{contact.message}</p>}

              {isAdmin && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => startEdit(contact)}>Edit</button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(contact)}
                    onBlur={() => setConfirmDeleteId(null)}
                  >
                    {confirmDeleteId === contact._id ? 'Click again to delete' : 'Delete'}
                  </button>
                </div>
              )}
            </article>
          )
        )}
      </div>
    </section>
  );
}