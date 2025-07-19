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
    <div class="hero bg-base-200 min-h-screen">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Login now!</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <Form class="card-body">
            <div class="form-control">
              <Field name="email">
                {(field, props) => (
                  <>
                    <label class="label">
                      <span class="label-text">Email</span>
                    </label>
                    <input
                      {...props}
                      placeholder="email"
                      class="input input-bordered"
                      required
                      type="email"
                    />
                    {field.error && <div>{field.error}</div>}
                  </>
                )}
              </Field>
            </div>
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
                      placeholder="password"
                      class="input input-bordered"
                      required
                    />
                    {field.error && <div>{field.error}</div>}
                  </>
                )}
              </Field>
              <label class="label">
                <a href="#" class="link-hover link label-text-alt">
                  Forgot password?
                </a>
              </label>
            </div>
            <div class="form-control mt-6">
              <button
                disabled={loginForm.submitting || loginForm.invalid}
                type="submit"
                class="btn btn-primary"
              >
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
});
