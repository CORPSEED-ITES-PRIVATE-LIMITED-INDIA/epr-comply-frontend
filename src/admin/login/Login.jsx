import React from "react";
import logo from "../../assets/logo1.webp";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useToast } from "../../components/ToastProvider";
import { loginUser } from "../../toolkit/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "User logged in successfully !.",
            status: "success",
          });
          reset({
            email: "",
            password: "",
          });
          navigate(`/${resp?.payload?.user?.id}/admin/dashboard`)
        } else {
          showToast({
            title: "Error!",
            description: resp.payload || "Logout failed",
            status: "error",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong !.",
          description: "Failed to login.",
          status: "error",
        });
      });
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      {/* Card */}
      <div className="w-[420px] bg-white p-10 shadow-xl rounded-xl border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Company Logo" className="w-32 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="text"
              {...register("email", { required: "email is required" })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
            transition font-semibold cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
