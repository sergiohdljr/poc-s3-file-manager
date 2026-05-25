import { useState } from 'react';
import { useCreateUser } from '../../application/use-users.hook';

export function CreateUserForm() {
  const { mutate, isPending, isError } = useCreateUser();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating…' : 'Create user'}
      </button>
      {isError && <p>Something went wrong.</p>}
    </form>
  );
}
