import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@qwik.dev/core";
import { Link, routeLoader$ } from "@qwik.dev/router";
import {
  formAction$,
  FormError,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import { getSlamById } from "~/db/queries/slams";
import { db } from "~/db";
import { slamEntries } from "~/db/schema/slamEntries";
import { supabaseClient } from "~/lib/supabase";
import * as v from "valibot";
import type { FieldElementProps } from "@modular-forms/qwik";
import { useCurrentUser } from "~/loaders/auth";

const JoinSlamSchema = v.object({
  itchIoLink: v.pipe(
    v.string(),
    v.nonEmpty("Itch.io link is required"),
    v.url("Must be a valid URL"),
    v.custom((input) => {
      if (typeof input !== "string") return false;
      return input.includes("itch.io");
    }, "Must be an itch.io URL"),
  ),
});

type TJoinSlamForm = v.InferInput<typeof JoinSlamSchema>;

async function getItchIoData(url: string) {
  const response = await fetch(`${url}/data.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch itch.io data");
  }
  const data = await response.json();
  return {
    assetName: data.title,
    description: data.description,
  };
}

export const useFormLoader = routeLoader$<InitialValues<TJoinSlamForm>>(() => ({
  itchIoLink: "",
}));

export const useJoinSlamAction = formAction$<TJoinSlamForm>(
  async (values: TJoinSlamForm, requestEvent) => {
    const supabase = supabaseClient(requestEvent);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      throw new FormError<TJoinSlamForm>(
        "You must be logged in to join a slam",
      );
    }

    try {
      // Fetch itch.io data
      const itchData = await getItchIoData(values.itchIoLink);

      console.log({
        slamId: requestEvent.params.id,
        userId: user.id,
        linkToEntry: values.itchIoLink,
        name: itchData.assetName,
        description: itchData.description || "No description provided",
      });

      // Create the entry
      await db.insert(slamEntries).values({
        slamId: requestEvent.params.id,
        userId: user.id,
        linkToEntry: values.itchIoLink,
        name: itchData.assetName,
        description: itchData.description || "No description provided",
      });

      return {
        status: "success",
        message: "Entry submitted successfully",
      };
    } catch (error) {
      console.error("Error joining slam:", error);
      throw new FormError<TJoinSlamForm>(
        error instanceof Error
          ? error.message
          : "Failed to join slam. Please try again.",
      );
    }
  },
  valiForm$(JoinSlamSchema),
);

export const useGetSlam = routeLoader$(async ({ params }) => {
  return await getSlamById(params.id);
});

export default component$(() => {
  const slam = useGetSlam();
  const user = useCurrentUser();
  const isLoggedIn = user.value != null;
  const isModalOpen = useSignal(false);
  const dialogRef = useSignal<HTMLDialogElement>();
  const currentUrl = useSignal("");
  const [form, { Form, Field }] = useForm<TJoinSlamForm>({
    loader: useFormLoader(),
    action: useJoinSlamAction(),
    validate: valiForm$(JoinSlamSchema),
  });

  useTask$(({ track }) => {
    track(() => form.response);
    if (form.response.status === "success") {
      isModalOpen.value = false;
    }
  });

  useTask$(({ track }) => {
    track(() => isModalOpen.value);
    if (isModalOpen.value) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  });

  useVisibleTask$(() => {
    // Set the current URL when component becomes visible on client
    currentUrl.value = window.location.href;
  });

  return (
    <div class="bg-base-200 min-h-screen">
      <main class="mx-auto max-w-6xl px-6 py-8">
        {/* Back Navigation */}
        <div class="mb-8">
          <Link
            href="/slams"
            class="btn btn-ghost text-white hover:bg-white/10"
          >
            <svg
              class="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Slams
          </Link>
        </div>

        {/* Hero Section */}
        <div class="mb-12 text-center">
          <h1 class="mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent text-white md:text-6xl">
            {slam.value.slam.name}
          </h1>
          <p class="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300">
            {slam.value.slam.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div class="mb-12 grid gap-8 lg:grid-cols-3">
          {/* Left Column - Slam Info */}
          <div class="space-y-6 lg:col-span-2">
            {/* Stats Cards */}
            <div class="grid gap-4 md:grid-cols-2">
              <div class="card border border-white/20 bg-white/10 backdrop-blur-sm">
                <div class="card-body">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <svg
                        class="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-400">Entries</p>
                      <Link
                        href={`/slams/show/${slam.value.slam.id}/entries`}
                        class="text-lg font-semibold text-white transition duration-300 hover:opacity-80"
                      >
                        <span>
                          {
                            slam.value.entries.filter((entry) => entry !== null)
                              .length
                          }
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card border border-white/20 bg-white/10 backdrop-blur-sm">
                <div class="card-body">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                      <svg
                        class="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-400">Created by</p>
                      <Link
                        href={`/${slam.value.createdBy?.name}`}
                        class="text-lg font-semibold text-white transition duration-300 hover:opacity-80"
                      >
                        {slam.value.createdBy?.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Info Card */}
            <div class="card border border-white/20 bg-white/10 backdrop-blur-sm">
              <div class="card-body">
                <h3 class="card-title mb-4 text-white">Asset Information</h3>
                <div class="flex items-center space-x-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-sm font-bold text-white">
                    {slam.value.artist?.name
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p class="text-sm text-gray-400">Asset by</p>
                    <Link
                      href={`/artists/${slam.value.artist?.name}`}
                      class="text-lg font-semibold text-white transition duration-300 hover:opacity-80"
                    >
                      {slam.value.artist?.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div class="space-y-6">
            {/* Action Cards */}
            <div class="card bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <div class="card-body text-center">
                <h3 class="card-title mb-4 justify-center">Join the Slam</h3>
                <p class="mb-6 text-purple-100">
                  Ready to showcase your skills? Join this game slam and compete
                  with other talented creators.
                </p>
                {isLoggedIn ? (
                  <button
                    onClick$={() => (isModalOpen.value = true)}
                    class="btn btn-lg w-full border-none bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <svg
                      class="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Join Slam
                  </button>
                ) : (
                  <Link
                    href="/sign-up"
                    class="btn btn-lg w-full border-none bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <svg
                      class="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Sign Up to Join
                  </Link>
                )}
              </div>
            </div>

            <div class="card border border-white/20 bg-white/10 backdrop-blur-sm">
              <div class="card-body text-center">
                <h3 class="card-title mb-4 justify-center text-white">
                  View Asset
                </h3>
                <p class="mb-6 text-gray-300">
                  Check out the asset that inspired this game slam challenge.
                </p>
                <Link
                  href={slam.value.asset?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-primary w-full"
                >
                  <svg
                    class="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                  Go to Asset
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div class="card border border-white/10 bg-white/5 backdrop-blur-sm">
              <div class="card-body">
                <h4 class="mb-3 font-semibold text-white">Slam Details</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Status:</span>
                    <span class="badge badge-success">Active</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Entries:</span>
                    <span class="text-white">
                      {
                        slam.value.entries.filter((entry) => entry !== null)
                          .length
                      }
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Prize:</span>
                    <span class="text-white">TBD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div class="text-center">
          <div class="divider divider-neutral">
            <span class="text-gray-400">Share this slam</span>
          </div>
          <div class="mt-6 flex justify-center space-x-4">
            {/* X (Twitter) Share */}
            <a
              class="btn btn-circle btn-outline btn-primary"
              title="Share on X"
              href={
                currentUrl.value
                  ? `https://twitter.com/intent/tweet?text=${encodeURIComponent("Look at this cool Game Slam")}&url=${encodeURIComponent(currentUrl.value)}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* BlueSky Share */}
            <a
              class="btn btn-circle btn-outline btn-primary"
              title="Share on BlueSky"
              href={
                currentUrl.value
                  ? `https://bsky.app/intent/compose?text=${encodeURIComponent(`Look at this cool Game Slam ${currentUrl.value}`)}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-2.67-.296-5.568.628-6.383 3.364C.378 17.703 0 22.661 0 23.349c0 .688.139 1.86.902 2.202.659.299 1.664.621 4.3-1.24 2.752-1.942 5.711-5.881 6.798-7.995 1.087 2.114 4.046 6.053 6.798 7.995 2.636 1.861 3.641 1.539 4.3 1.24.763-.342.902-1.514.902-2.202 0-.688-.378-5.646-.624-6.475-.815-2.736-3.713-3.66-6.383-3.364-.139.016-.277.034-.415.056.138-.017.276-.036.415-.056 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.202-.659-.299-1.664-.621-4.3 1.24-2.752 1.942-5.711 5.881-6.798 7.995z" />
              </svg>
            </a>

            {/* Copy Link */}
            <button
              class="btn btn-circle btn-outline btn-primary"
              title="Copy link"
              onClick$={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here if desired
                } catch (err) {
                  console.error("Failed to copy URL:", err);
                }
              }}
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Modal remains the same */}
      <dialog
        ref={dialogRef}
        class="bg-transparent p-0 [&::backdrop]:bg-black/50"
        onClick$={(e) => {
          const rect = e.target as HTMLElement;
          if (rect.tagName === "DIALOG") {
            isModalOpen.value = false;
          }
        }}
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold">Join Slam</h2>
            <button
              onClick$={() => (isModalOpen.value = false)}
              class="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {form.response.status === "success" ? (
            <div class="text-center">
              <h3 class="mb-4 text-lg font-semibold text-green-600">
                Success!
              </h3>
              <p class="mb-6">{form.response.message}</p>
              <button
                onClick$={() => (isModalOpen.value = false)}
                class="btn btn-primary"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {form.response.message && (
                <div class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                  {form.response.message}
                </div>
              )}

              <Form class="space-y-4">
                <div class="form-control">
                  <Field name="itchIoLink">
                    {(
                      field,
                      props: FieldElementProps<TJoinSlamForm, "itchIoLink">,
                    ) => (
                      <>
                        <label class="label" for="itchIoLink">
                          <span class="label-text">Itch.io Entry Link</span>
                        </label>
                        <input
                          {...props}
                          type="url"
                          id="itchIoLink"
                          required
                          class="input input-bordered w-full"
                          placeholder="https://example.itch.io/game"
                        />
                        <label class="label">
                          <span class="label-text-alt">
                            Paste the URL of your itch.io game entry
                          </span>
                        </label>
                        {field.error && (
                          <div class="mt-1 text-sm text-red-600">
                            {field.error}
                          </div>
                        )}
                      </>
                    )}
                  </Field>
                </div>

                <div class="form-control">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    disabled={form.submitting}
                  >
                    {form.submitting ? (
                      <>
                        <span class="loading loading-spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Entry"
                    )}
                  </button>
                </div>
              </Form>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
});
