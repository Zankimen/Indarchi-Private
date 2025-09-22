import React from "react";

import { Head, useForm, Link } from "@inertiajs/react";

import { Loader2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox"; // Assuming you have a shadcn/ui checkbox

export default function LoginForm({ errors }) {
  const { data, setData, post, processing, error, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

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
              alt="Image"
              className="absolute h-96 w-96 object-contain object-center mx-auto"
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-18 h-full flex justify-center items-center"
          >
            <div className="flex flex-col gap-6 w-full">
              <div className="font-bold">Indarchi</div>
              <div className="flex flex-col items-start text-center">
                <h1 className="text-2xl font-bold">Nice to see you again</h1>
              </div>

              <div className="grid gap-2">
                {error && (
                  <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
                    {error}
                  </div>
                )}
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-slate-200 p-6"
                  required
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email}</span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-slate-200 p-6"
                  required
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter Password"
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) =>
                    setData("remember", checked ? true : false)
                  }
                />
                <Label htmlFor="remember">Remember me</Label>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
