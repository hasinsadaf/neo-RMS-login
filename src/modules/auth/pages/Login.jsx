import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import AuthCard from "../components/AuthCard";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const { portal } = useParams(); // get portal from URL

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      // Validate portal
      if (!portal) throw new Error("Invalid login route");

      const response = await api.post(`/auth/login/${portal}`, { email, password });

      const { accessToken, user } = response.data || {};

      if (!accessToken || !user?.role) throw new Error("Invalid response from server");

      // Store token + role
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
    <AuthCard
      title={`Welcome back ${portal ? `(${portal})` : ""}`}
      description="Sign in to manage your restaurant operations."
    >
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        submitLabel="Sign in"
        footer={
          portal === "customer" && (
            <>
              <span>Don&apos;t have an account? </span>
              <Link
                to="/customer/register"
                className="font-medium text-[#C3110C] hover:underline"
              >
                Sign up as customer
              </Link>
            </>
          )
        }
      />

      <p className="mt-4 text-xs text-neutral-400">
        Only customers can register. Staff (waiter, chef, manager, owner)
        should use their assigned credentials to login.
      </p>
    </AuthCard>
  );
}