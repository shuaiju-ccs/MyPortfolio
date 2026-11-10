import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FIELD_CONTROL, FIELD_ERROR, FIELD_LABEL, FORM_ALERT } from '../components/formStyles';

type SignupValues = { name: string; email: string; password: string; confirmPassword: string };
type SignupErrors = Partial<Record<keyof SignupValues, string>>;

const EMPTY: SignupValues = { name: '', email: '', password: '', confirmPassword: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6; // same rule as user.model.js

function validate(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  else if (values.password.length < PASSWORD_MIN)
    errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

const FIELDS: { name: keyof SignupValues; label: string; type: string; autoComplete: string }[] = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' }
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<SignupValues>(EMPTY);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await signup(values.name.trim(), values.email.trim(), values.password);
      navigate('/signin', { state: { justSignedUp: true, email: values.email.trim() } });
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <h1 className="section-title">Sign Up</h1>
      <p className="lead">Create an account to view saved messages. New accounts can view content only.</p>

      <form onSubmit={handleSubmit} noValidate className="card grid gap-4 mt-6">
        {serverError && <p role="alert" className={FORM_ALERT}>{serverError}</p>}

        {FIELDS.map((field) => (
          <label key={field.name} className={FIELD_LABEL}>
            <span>{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[field.name])}
              className={FIELD_CONTROL}
            />
            {errors[field.name] && <p role="alert" className={FIELD_ERROR}>{errors[field.name]}</p>}
          </label>
        ))}

        <button type="submit" className="btn justify-self-start" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Sign Up'}
        </button>
        <p className="m-0 text-sm">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </section>
  );
}