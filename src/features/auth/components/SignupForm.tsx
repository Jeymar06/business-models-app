import { type FormEvent, useState } from 'react';

import { Button, Input } from '@/components/ui';
import { isValidEmail } from '@/utils/validators';

import { authService } from '../authService';

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Ingresa un email valido.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.signUp({ email, fullName: fullName || email, password });
      onSuccess?.();
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : 'No fue posible crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input label="Nombre completo" name="signup-name" onChange={(event) => setFullName(event.target.value)} value={fullName} />
      <Input label="Email" name="signup-email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
      <Input
        label="Password"
        name="signup-password"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        value={password}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Creando...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
