/* eslint-disable no-unused-vars */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/Redux/Auth/AuthSlice";
import { Mail, Lock, User } from "lucide-react";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import LoginWithGoogle from "../LoginWithGoogle";

const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
});

const SignupForm = () => {
  const { auth } = useSelector(store => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(register(data));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-neutral-400 text-sm font-medium mb-1">Start for free</h2>
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-neutral-500 text-sm">Join Cartezi Trade and start creating</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="text-neutral-400 text-xs mb-1 ml-1">Full Name</div>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                    <Input
                      {...field}
                      type="text"
                      className="h-12 pl-10 bg-neutral-900/50 border-neutral-800 focus:border-violet-500/50 rounded-xl placeholder:text-neutral-600 text-white transition-all ring-offset-black"
                      placeholder="Your full name"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="text-neutral-400 text-xs mb-1 ml-1">Email address</div>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                    <Input
                      {...field}
                      className="h-12 pl-10 bg-neutral-900/50 border-neutral-800 focus:border-violet-500/50 rounded-xl placeholder:text-neutral-600 text-white transition-all ring-offset-black"
                      placeholder="Hello@example.com"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="text-neutral-400 text-xs mb-1 ml-1">Password</div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-neutral-500" />
                    <Input
                      {...field}
                      type="password"
                      className="h-12 pl-10 bg-neutral-900/50 border-neutral-800 focus:border-violet-500/50 rounded-xl placeholder:text-neutral-600 text-white transition-all ring-offset-black"
                      placeholder="Create a password"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          {!auth.loading ? (
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white hover:opacity-90 font-medium rounded-xl border border-neutral-800 shadow-lg shadow-black/50"
            >
              Create Account
            </Button>
          ) : (
            <Button
              disabled
              className="w-full h-12 bg-neutral-900 text-neutral-400 font-medium rounded-xl border border-neutral-800"
            >
              <SpinnerBackdrop show={true} />
              Creating account...
            </Button>
          )}
        </form>
      </Form>
      <div className="flex flex-col gap-3 items-center justify-center mt-5">
        <span>or</span>
        <div className="w-full">
          <LoginWithGoogle />
        </div>
      </div>

    </div>
  );
};

export default SignupForm;
