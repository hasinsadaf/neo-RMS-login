import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import AuthCard from '../components/AuthCard';
import AuthForm from '../components/AuthForm';

export default function OwnerRegister() {
  const navigate = useNavigate();

  const portal = 'management'; // backend portal
  const role = 'owner';        // only owner can register

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent registration if someone changes role (safety)
  if (portal === 'management' && role !== 'owner') {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Only owner can self-register for management portal.
      </div>
    );
  }

  const handleRegister = async ({ fullName, email, password, phone }) => {
    setLoading(true);
    setError('');

    try {
      await api.post(`/user/signup/${portal}`, {
        fullName,
        email,
        password,
        phone,
        role, // explicitly send role
      });

      navigate('/login', { replace: true });
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
      title="Create an Owner account"
      description="Register as the Owner to manage the restaurant system."
    >
      <AuthForm
        type="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        submitLabel="Create account"
        footer={
          <span>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-500 hover:underline">
              Sign in
            </Link>
          </span>
        }
      />

      <p className="mt-4 text-xs text-neutral-400">
        Only customers and the owner can self-register. Staff accounts are created internally.
      </p>
    </AuthCard>
  );
}