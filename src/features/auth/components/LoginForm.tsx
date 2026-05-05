import { type FormEvent, useState } from 'react';

import { Button, Input } from '@/components/ui';
import { isValidEmail } from '@/utils/validators';

import { authService } from '../authService';

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
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
      await authService.signIn({ email, password });
      onSuccess?.();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'No fue posible iniciar sesion.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input label="Email" name="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
      <Input
        label="Password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        value={password}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
