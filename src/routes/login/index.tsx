import type { QRL } from "@builder.io/qwik";
import { component$, $, useTask$ } from "@builder.io/qwik";
import type { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { SubmitHandler } from "@modular-forms/qwik";
import {
  formAction$,
  FormError,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import * as v from "valibot";
import { supabaseClient } from "~/lib/supabase";

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ),
});

type LoginForm = v.InferInput<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export const useRedirectIfLoggedIn = routeLoader$(
  async (requestEvent: RequestEventLoader) => {
    console.log("cookies from login page", requestEvent.cookie.getAll());
    const supabase = supabaseClient(requestEvent);
    const { data } = await supabase.auth.getUser();
    console.log(data);
    console.log("cookies from login page", requestEvent.cookie.getAll());
    if (data.user) {
      throw requestEvent.redirect(302, "/");
    }
  },
);

export const useFormAction = formAction$<LoginForm>(
  async (values, requestEvent) => {
    const supabase = supabaseClient(requestEvent);
    console.log(values);

    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      throw new FormError<LoginForm>(error.message, { email: error.message });
    }

    throw requestEvent.redirect(302, "/");
    // Runs on server
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  // useTask$(({ track }) => {
  //   if (loginForm.response.status === "success") {
  //     // Runs on
  //     console.log("Form submitted successfully!");
  //   }
  //   track(() => loginForm.response);
  // });

  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $((values, event) => {
    // Runs on client
    console.log(values);
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
          <Form onSubmit$={handleSubmit} class="card-body">
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
                      value={field.value}
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
                      value={field.value}
                      placeholder="password"
                      class="input input-bordered"
                      required
                    />
                    {field.error && <div>{field.error}</div>}
                  </>
                )}
              </Field>
              <label class="label">
                <a href="#" class="label-text-alt link link-hover">
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
