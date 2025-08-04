// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Modular Forms with React Hook Form or similar
// TODO: Replace Qwik routeLoader$ with TanStack Router loader
// TODO: Replace Qwik formAction$ with TanStack Router action
// TODO: Replace Qwik useForm with React form handling

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { routeLoader$ } from "@builder.io/qwik-city";
// import {
//   formAction$,
//   FormError,
//   useForm,
//   valiForm$,
//   type InitialValues,
// } from "@modular-forms/qwik";
// import { supabaseClient } from "~/lib/supabase";
// import type { TAuthForm } from "~/schemas/auth";
// import { AuthSchema } from "~/schemas/auth";

// export { useRedirectIfLoggedIn } from "~/loaders/auth";

// export const useFormLoader = routeLoader$<InitialValues<TAuthForm>>(() => ({
//   email: "",
//   password: "",
// }));

// export const useFormAction = formAction$<TAuthForm>(
//   async (values, requestEvent) => {
//     const supabase = supabaseClient(requestEvent);

//     const { error } = await supabase.auth.signInWithPassword({
//       email: values.email,
//       password: values.password,
//     });

//     if (error) {
//       throw new FormError<TAuthForm>(error.message, { email: error.message });
//     }

//     throw requestEvent.redirect(302, "/");
//   },
//   valiForm$(AuthSchema),
// );

// export default component$(() => {
//   const [loginForm, { Form, Field }] = useForm<TAuthForm>({
//     loader: useFormLoader(),
//     action: useFormAction(),
//     validate: valiForm$(AuthSchema),
//   });

//   return (
//     <div class="bg-base-200 flex min-h-screen items-center justify-center p-4">
//       <div class="w-full max-w-md">
//         {/* Main Login Card */}
//         <div class="card bg-base-100 shadow-xl">
//           <div class="card-body">
//             {/* Header */}
//             <div class="mb-6 text-center">
//               <h1 class="text-base-content mb-2 text-3xl font-bold">
//                 Ready to slam? 🎮
//               </h1>
//               <p class="text-base-content/70">
//                 Jump back into your game dev adventures and crush some
//                 challenges!
//               </p>
//             </div>

//             {/* Login Form */}
//             <Form class="space-y-4">
//               {/* Email Field */}
//               <div class="form-control">
//                 <Field name="email">
//                   {(field, props) => (
//                     <>
//                       <label class="label">
//                         <span class="label-text">Email</span>
//                       </label>
//                       <input
//                         {...props}
//                         type="email"
//                         placeholder="Enter your email"
//                         class="input input-bordered focus:input-primary w-full"
//                         required
//                       />
//                       {field.error && (
//                         <div class="text-error mt-1 text-sm">{field.error}</div>
//                       )}
//                     </>
//                   )}
//                 </Field>
//               </div>

//               {/* Password Field */}
//               <div class="form-control">
//                 <Field name="password">
//                   {(field, props) => (
//                     <>
//                       <label class="label">
//                         <span class="label-text">Password</span>
//                       </label>
//                       <input
//                         {...props}
//                         type="password"
//                         placeholder="Enter your password"
//                         class="input input-bordered focus:input-primary w-full"
//                         required
//                       />
//                       {field.error && (
//                         <div class="text-error mt-1 text-sm">{field.error}</div>
//                       )}
//                       <label class="label">
//                         <a
//                           href="#"
//                           class="label-text-alt link link-hover link-primary"
//                         >
//                           Forgot your password?
//                         </a>
//                       </label>
//                     </>
//                   )}
//                 </Field>
//               </div>

//               {/* Login Button */}
//               <div class="form-control mt-6">
//                 <button
//                   disabled={loginForm.submitting || loginForm.invalid}
//                   type="submit"
//                   class="btn btn-primary w-full"
//                 >
//                   Let's Go!
//                 </button>
//               </div>
//             </Form>

//             {/* Sign Up Link */}
//             <div class="mt-6 text-center">
//               <p class="text-base-content/70">
//                 New to the slam scene?{" "}
//                 <a href="/sign-up" class="link link-primary font-medium">
//                   Join the party!
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

import React, { useState } from 'react';
import type { TAuthForm } from "~/schemas/auth";
import { AuthSchema } from "~/schemas/auth";

// TODO: Export TanStack Router equivalent of useRedirectIfLoggedIn
// export { useRedirectIfLoggedIn } from "~/loaders/auth";

export default function Login() {
  const [formData, setFormData] = useState<TAuthForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<TAuthForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement form validation with Valibot
      // TODO: Implement Supabase authentication
      // TODO: Implement TanStack Router redirect
      console.log('Login attempt:', formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof TAuthForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-base-content mb-2 text-3xl font-bold">
                Ready to slam? 🎮
              </h1>
              <p className="text-base-content/70">
                Jump back into your game dev adventures and crush some
                challenges!
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered focus:input-primary w-full"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-error mt-1 text-sm">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered focus:input-primary w-full"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-error mt-1 text-sm">{errors.password}</div>
                )}
                <label className="label">
                  <a
                    href="#"
                    className="label-text-alt link link-hover link-primary"
                  >
                    Forgot your password?
                  </a>
                </label>
              </div>

              {/* Login Button */}
              <div className="form-control mt-6">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Let's Go!
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-base-content/70">
                New to the slam scene?{" "}
                <a href="/sign-up" className="link link-primary font-medium">
                  Join the party!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}