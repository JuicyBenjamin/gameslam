import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  formAction$,
  FormError,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import { supabaseClient } from "~/lib/supabase";
import type { TAuthForm } from "~/schemas/auth";
import { AuthSchema } from "~/schemas/auth";

export { useRedirectIfLoggedIn } from "~/loaders/auth";

export const useFormLoader = routeLoader$<InitialValues<TAuthForm>>(() => ({
  email: "",
  password: "",
}));

export const useFormAction = formAction$<TAuthForm>(
  async (values, requestEvent) => {
    const supabase = supabaseClient(requestEvent);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      throw new FormError<TAuthForm>(error.message, { email: error.message });
    }

    throw requestEvent.redirect(302, "/");
  },
  valiForm$(AuthSchema),
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<TAuthForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(AuthSchema),
  });

  return (
    <div class="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div class="w-full max-w-md">
        {/* Main Login Card */}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            {/* Header */}
            <div class="mb-6 text-center">
              <h1 class="text-base-content mb-2 text-3xl font-bold">
                Ready to slam? 🎮
              </h1>
              <p class="text-base-content/70">
                Jump back into your game dev adventures and crush some
                challenges!
              </p>
            </div>

            {/* Login Form */}
            <Form class="space-y-4">
              {/* Email Field */}
              <div class="form-control">
                <Field name="email">
                  {(field, props) => (
                    <>
                      <label class="label">
                        <span class="label-text">Email</span>
                      </label>
                      <input
                        {...props}
                        type="email"
                        placeholder="Enter your email"
                        class="input input-bordered focus:input-primary w-full"
                        required
                      />
                      {field.error && (
                        <div class="text-error mt-1 text-sm">{field.error}</div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              {/* Password Field */}
              <div class="form-control">
                <Field name="password">
                  {(field, props) => (
                    <>
                      <label class="label">
                        <span class="label-text">Password</span>
                      </label>
                      <input
                        {...props}
                        type="password"
                        placeholder="Enter your password"
                        class="input input-bordered focus:input-primary w-full"
                        required
                      />
                      {field.error && (
                        <div class="text-error mt-1 text-sm">{field.error}</div>
                      )}
                      <label class="label">
                        <a
                          href="#"
                          class="label-text-alt link link-hover link-primary"
                        >
                          Forgot your password?
                        </a>
                      </label>
                    </>
                  )}
                </Field>
              </div>

              {/* Login Button */}
              <div class="form-control mt-6">
                <button
                  disabled={loginForm.submitting || loginForm.invalid}
                  type="submit"
                  class="btn btn-primary w-full"
                >
                  Let's Go!
                </button>
              </div>
            </Form>

            {/* Sign Up Link */}
            <div class="mt-6 text-center">
              <p class="text-base-content/70">
                New to the slam scene?{" "}
                <a href="/sign-up" class="link link-primary font-medium">
                  Join the party!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
