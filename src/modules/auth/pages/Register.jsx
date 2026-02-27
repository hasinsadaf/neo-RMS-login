import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';
import AuthCard from '../components/AuthCard';
import AuthForm from '../components/AuthForm';

const ALLOWED_PORTALS = ['customer', 'owner'];

export default function Register() {
  const navigate = useNavigate();
  const { portal } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🚨 Block invalid roles
  if (!ALLOWED_PORTALS.includes(portal)) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Registration not allowed for this role.
      </div>
    );
  }

  const handleRegister = async ({ fullName, email, password, phone }) => {
    setLoading(true);
    setError('');

    try {
      await api.post(`/auth/register/${portal}`, {
        fullName,
        email,
        password,
        phone,
      });

      navigate(`/${portal}/login`, { replace: true });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to register. Please review your information and try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={`Create a ${portal} account`}
      description={`Register as a ${portal} to access the system.`}
    >
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        submitLabel="Create account"
        footer={
          <>
            <span>Already have an account? </span>
            <Link
              to={`/${portal}/login`}
              className="font-medium text-red-500 hover:underline"
            >
              Sign in
            </Link>
          </>
        }
      />

      <p className="mt-4 text-xs text-neutral-400">
        Only customers and owners can self-register. Staff accounts are
        created internally.
      </p>
    </AuthCard>
  );
}