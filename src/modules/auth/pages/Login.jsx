import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";

export default function ManagementLogin() {
  const navigate = useNavigate();
  const portal = "MANAGEMENT"; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post(`/auth/login/${portal}`, { email, password });
      const { accessToken, user } = response.data || {};

      if (!accessToken || !user?.role) throw new Error("Invalid response from server");

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("authRole", user.role);

      const roleRoutes = {
        OWNER: "/owner/dashboard",
        MANAGER: "/admin/dashboard",
        CHEF: "/chef/dashboard",
        WAITER: "/waiter/dashboard",
        CUSTOMER: "/customer/home",
      };

      navigate(roleRoutes[user.role] || "/login", { replace: true });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to login. Please check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" description="Sign in to manage your restaurant operations.">
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        submitLabel="Sign in"
        footer={
          <span>
            Don&apos;t have an account?{" "}
            <Link to="/customer/register" className="font-medium text-[#C3110C] hover:underline">
              Sign up as customer
            </Link>
          </span>
        }
      />

      <p className="mt-4 text-xs text-neutral-400">
        Only customers can register. Staff (waiter, chef, manager, owner) should use their assigned credentials.
      </p>
    </AuthCard>
  );
}