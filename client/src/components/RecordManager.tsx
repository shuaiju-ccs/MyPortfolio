import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { apiRequest } from '../lib/api';
import type { PortfolioRecord } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { FIELD_CONTROL, FIELD_ERROR, FIELD_LABEL, FORM_ALERT, FORM_SUCCESS } from './formStyles';

type RecordFormValues = Omit<PortfolioRecord, '_id' | 'description'> & { description: string };
type RecordFormErrors = Partial<Record<keyof RecordFormValues, string>>;

const EMPTY_FORM: RecordFormValues = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: ''
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: RecordFormValues): RecordFormErrors {
  const errors: RecordFormErrors = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  if (!values.firstname.trim()) errors.firstname = 'First name is required.';
  if (!values.lastname.trim()) errors.lastname = 'Last name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.completion) errors.completion = 'Completion date is required.';
  return errors;
}

const toDateInput = (iso: string) => (iso ? iso.slice(0, 10) : '');
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', timeZone: 'UTC' });

type RecordManagerProps = {
  endpoint: string;
  itemLabel: string;
  titleLabel: string;
  emptyText: string;
};

export default function RecordManager({ endpoint, itemLabel, titleLabel, emptyText }: RecordManagerProps) {
  const { token, isAdmin } = useAuth();

  const [items, setItems] = useState<PortfolioRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<RecordFormValues>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<RecordFormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    apiRequest<PortfolioRecord[]>(endpoint)
      .then((data) => {
        if (!ignore) {
          setItems(data);
          setLoadError('');
        }
      })
      .catch((error: Error) => !ignore && setLoadError(error.message))
      .finally(() => !ignore && setIsLoading(false));
    return () => {
      ignore = true;
    };
  }, [endpoint]);

  const openCreateForm = () => {
    setEditingId('new');
    setFormValues(EMPTY_FORM);
    setFormErrors({});
    setServerError('');
    setNotice('');
  };

  const openEditForm = (item: PortfolioRecord) => {
    setEditingId(item._id);
    setFormValues({
      title: item.title,
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      completion: toDateInput(item.completion),
      description: item.description ?? ''
    });
    setFormErrors({});
    setServerError('');
    setNotice('');
  };

  const closeForm = () => {
    setEditingId(null);
    setFormValues(EMPTY_FORM);
    setFormErrors({});
    setServerError('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
    setFormErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(formValues);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    setServerError('');
    try {
      if (editingId === 'new') {
        const created = await apiRequest<PortfolioRecord>(endpoint, 'POST', formValues, token);
        setItems((previous) => [...previous, created]);
        setNotice(`${itemLabel} "${created.title}" added.`);
      } else {
        const updated = await apiRequest<PortfolioRecord>(`${endpoint}/${editingId}`, 'PUT', formValues, token);
        setItems((previous) => previous.map((item) => (item._id === updated._id ? updated : item)));
        setNotice(`${itemLabel} "${updated.title}" updated.`);
      }
      closeForm();
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: PortfolioRecord) => {
    if (confirmDeleteId !== item._id) {
      setConfirmDeleteId(item._id);
      return;
    }
    try {
      await apiRequest(`${endpoint}/${item._id}`, 'DELETE', undefined, token);
      setItems((previous) => previous.filter((x) => x._id !== item._id));
      setNotice(`${itemLabel} "${item.title}" deleted.`);
      if (editingId === item._id) closeForm();
    } catch (error) {
      setNotice('');
      setLoadError((error as Error).message);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const sortedItems = [...items].sort((a, b) => b.completion.localeCompare(a.completion));

  const textField = (name: keyof RecordFormValues, label: string, type = 'text') => (
    <label className={FIELD_LABEL}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={formValues[name]}
        onChange={handleChange}
        aria-invalid={Boolean(formErrors[name])}
        className={FIELD_CONTROL}
      />
      {formErrors[name] && <p role="alert" className={FIELD_ERROR}>{formErrors[name]}</p>}
    </label>
  );

  return (
    <div className="grid gap-4 mt-6">
      {isAdmin && editingId === null && (
        <button type="button" className="btn justify-self-start" onClick={openCreateForm}>
          + Add {itemLabel.toLowerCase()}
        </button>
      )}

      {notice && <p role="status" className={FORM_SUCCESS}>{notice}</p>}

      {isAdmin && editingId !== null && (
        <form onSubmit={handleSubmit} noValidate className="card grid gap-4">
          <h2 className="m-0 text-xl">{editingId === 'new' ? `New ${itemLabel.toLowerCase()}` : `Edit ${itemLabel.toLowerCase()}`}</h2>
          {serverError && <p role="alert" className={FORM_ALERT}>{serverError}</p>}
          {textField('title', titleLabel)}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {textField('firstname', 'First name')}
            {textField('lastname', 'Last name')}
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {textField('email', 'Email', 'email')}
            {textField('completion', 'Completion date', 'date')}
          </div>
          <label className={FIELD_LABEL}>
            <span>Description</span>
            <textarea
              name="description"
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              className={`${FIELD_CONTROL} resize-y`}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId === 'new' ? `Add ${itemLabel.toLowerCase()}` : 'Save changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <p>Loading…</p>}
      {loadError && <p role="alert" className={FORM_ALERT}>{loadError}</p>}
      {!isLoading && !loadError && sortedItems.length === 0 && <p>{emptyText}</p>}

      <ol className="list-none p-0 m-0 grid gap-4">
        {sortedItems.map((item) => (
          <li key={item._id} className="card grid gap-5 items-start grid-cols-1 sm:grid-cols-[140px_1fr]">
            <div className="font-bold text-accent-strong text-[1.05rem]">{formatDate(item.completion)}</div>
            <div>
              <h3 className="mb-1">{item.title}</h3>
              <p className="text-text mb-1">
                {item.firstname} {item.lastname} · <a href={`mailto:${item.email}`}>{item.email}</a>
              </p>
              {item.description && <p className="mb-0 whitespace-pre-line">{item.description}</p>}

              {isAdmin && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => openEditForm(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(item)}
                    onBlur={() => setConfirmDeleteId(null)}
                  >
                    {confirmDeleteId === item._id ? 'Click again to delete' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}