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
import { useDispatch } from "react-redux";
import { sendResetPassowrdOTP } from "@/Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordForm = () => {
  const [verificationType] = useState("EMAIL");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(sendResetPassowrdOTP({
      sendTo: data.email,
      navigate,
      verificationType
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-neutral-400 text-sm font-medium mb-1">Forgot your password?</h2>
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-neutral-500 text-sm">Enter your email to receive a reset code</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="text-neutral-400 text-xs mb-1 ml-1">Email address</div>
                <FormControl>
                  <Input
                    {...field}
                    className="h-12 bg-neutral-900/50 border-neutral-800 focus:border-violet-500/50 rounded-xl placeholder:text-neutral-600 text-white transition-all ring-offset-black"
                    placeholder="Hello@example.com"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white hover:opacity-90 font-medium rounded-xl border border-neutral-800 shadow-lg shadow-black/50"
          >
            Send Reset Code
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
