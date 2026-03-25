/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPassword";
import { useSelector } from "react-redux";
import CustomeToast from "@/components/custome/CustomeToast";
import authBg from "@/assets/auth_background_waves.png";
import { useTranslation } from "react-i18next";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useSelector((store) => store);

    const isSignup = location.pathname === "/signup";
    const isForgot = location.pathname === "/forgot-password";
    const { t } = useTranslation();

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#000000]">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-neutral-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={authBg}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 p-12 text-white max-w-xl">
                    <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Trade Crypto<br />
                        <span className="text-white">Secure & Fast</span>
                    </h1>
                    <p className="text-xl text-neutral-300 font-light">
                        {t("auth.joinPlatform")}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#000000] relative">
                {/* Mobile Background (visible only on small screens) */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-black"></div>
                </div>

                <div className="w-full max-w-[420px] relative z-10">

                    <CustomeToast show={auth.error} message={auth.error?.error} />

                    {/* Forms */}
                    {isSignup ? (
                        <div className="animate-fadeIn">
                            <SignupForm />
                        </div>
                    ) : isForgot ? (
                        <div className="animate-fadeIn">
                            <ForgotPasswordForm />
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            <LoginForm />
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-8">
                        {isSignup ? (
                            <p className="text-neutral-500 text-sm">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/signin")}
                                    className="text-white font-medium hover:text-violet-400 transition-colors ml-1"
                                >
                                    Sign in
                                </button>
                            </p>
                        ) : isForgot ? (
                            <button
                                onClick={() => navigate("/signin")}
                                className="text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-2"
                            >
                                ← Back to sign in
                            </button>
                        ) : (
                            <div className="mt-6 flex flex-col gap-4">
                                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }} className="text-neutral-400 hover:text-white text-sm transition-colors w-fit">
                                    Forgot Password?
                                </a>
                            </div>
                        )}
                        {!isSignup && !isForgot && (
                            <div className="mt-8">
                                <Button
                                    onClick={() => navigate("/signup")}
                                    variant="outline"
                                    className="w-full h-12 border-neutral-800 text-white hover:bg-neutral-900 hover:text-white"
                                >
                                    Create new account
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
