import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FIELD_CONTROL, FIELD_ERROR, FIELD_LABEL, FORM_ALERT, FORM_SUCCESS } from '../components/formStyles';

type SigninValues = { email: string; password: string };
type SigninErrors = Partial<Record<keyof SigninValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: SigninValues): SigninErrors {
  const errors: SigninErrors = {};
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  return errors;
}

type SigninLocationState = { from?: string; justSignedUp?: boolean; email?: string } | null;

export default function Signin() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as SigninLocationState;

  const [values, setValues] = useState<SigninValues>({
    email: routerState?.email ?? '',
    password: ''
  });
  const [errors, setErrors] = useState<SigninErrors>({});
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
      await signin(values.email.trim(), values.password);
      navigate(routerState?.from || '/', { replace: true });
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <h1 className="section-title">Sign In</h1>
      <p className="lead">Sign in to view saved messages. The admin account can also add, edit and delete portfolio entries.</p>

      <form onSubmit={handleSubmit} noValidate className="card grid gap-4 mt-6">
        {routerState?.justSignedUp && (
          <p role="status" className={FORM_SUCCESS}>Account created. Sign in with your new password.</p>
        )}
        {serverError && <p role="alert" className={FORM_ALERT}>{serverError}</p>}

        <label className={FIELD_LABEL}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            className={FIELD_CONTROL}
          />
          {errors.email && <p role="alert" className={FIELD_ERROR}>{errors.email}</p>}
        </label>

        <label className={FIELD_LABEL}>
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            className={FIELD_CONTROL}
          />
          {errors.password && <p role="alert" className={FIELD_ERROR}>{errors.password}</p>}
        </label>

        <button type="submit" className="btn justify-self-start" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="m-0 text-sm">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </section>
  );
}