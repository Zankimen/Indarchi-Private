import React from "react";

import { Head, useForm, Link } from "@inertiajs/react";

import { Loader2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";

export default function LoginForm() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  console.log(errors);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login", {
      onError: () => {},
    });
  };

  return (
    <>
      <Head title="Login" />

      <div className="flex flex-col gap-6 w-full overflow-hidden h-screen">
        <div className="grid p-0 md:grid-cols-2 h-full">
          <div className="relative bg-amber-200">
            <img
              src="/logo-cbn.png"
              alt="Background Image"
              className="absolute h-96 w-96 object-contain object-center mx-auto"
            />
          </div>
          <form onSubmit={handleSubmit} className="p-16 h-full flex justify-center items-center">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex gap-2 flex-col justify-center items-center">
                <div className="flex items-center gap-2 font-bold text-3xl">
                  <img src="/storage/logo.png" alt="Indarchi Logo" className="h-10" />
                  Indarchi
                </div>
                <h1 className="text-2xl">Nice to see you again</h1>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full border border-border rounded-lg px-4 py-3 h-12 text-foreground placeholder:text-border focus:ring-2 focus:ring-secondary focus:border-transparent text-base"
                  required
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="w-full border border-border rounded-lg px-4 py-3 h-12 text-foreground placeholder:text-border focus:ring-2 focus:ring-secondary focus:border-transparent text-base"
                  required
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter Password"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) => setData("remember", checked ? true : false)}
                  className="cursor-pointer border-border"
                />
                <Label htmlFor="remember">Remember me?</Label>
              </div>

              <div className="grid gap-2">
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-4 cursor-pointer font-bold bg-primary text-primary-foreground p-6"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Please wait
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                {errors.errors && <span className="text-sm text-red-500">{errors.errors}</span>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
