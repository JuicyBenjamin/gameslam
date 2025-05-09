import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
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
import type { RequestEventAction } from "@builder.io/qwik-city";
import type { FieldElementProps } from "@modular-forms/qwik";

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
  async (values: TJoinSlamForm, requestEvent: RequestEventAction) => {
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
  const isModalOpen = useSignal(false);
  const dialogRef = useSignal<HTMLDialogElement>();
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

  useVisibleTask$(({ track }) => {
    track(() => isModalOpen.value);
    if (isModalOpen.value) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  });

  return (
    <div class="min-h-screen bg-base-200">
      <div class="relative h-64 bg-gray-900">
        <div class="grid h-full grid-cols-1 grid-rows-1 p-4 [grid-template-areas:'header']">
          <div class="flex items-center justify-center [grid-area:header]">
            <h1 class="px-4 text-center text-4xl font-bold text-white">
              {slam.value.slam.name}
            </h1>
          </div>
          <Link
            href="/slams"
            class="self-start justify-self-start rounded-full bg-white/10 px-4 py-2 text-white transition duration-300 [grid-area:header] hover:bg-white/20"
          >
            ← Back to Slams
          </Link>
        </div>
        {/* <img
          // src={slam.value.coverImage || "/placeholder.svg"}
          // alt={slam.value.name}
          // layout="fill"
          // objectFit="cover"
          class="h-full w-full object-cover opacity-50"
        /> */}
      </div>

      <div class="mx-auto max-w-4xl px-4 py-8">
        <div class="bg-base overflow-hidden rounded-lg shadow-lg">
          <div class="p-6">
            <p class="mb-6 text-gray-600">{slam.value.slam.description}</p>
            <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <div class="flex items-center">
                <Clock class="text-blue-500 mr-2" />
                <div>
                  <p class="text-sm text-gray-600">Starts</p>
                  <p class="font-semibold">{formatDate(slam.value.startDate)}</p>
                </div>
               </div> */}
              {/* <div class="flex items-center">
                {/* <Clock class="text-red-500 mr-2" />
                <div>
                  <p class="text-sm text-gray-600">Ends</p>
                  <p class="font-semibold">{formatDate(slam.value.endDate)}</p>
                </div>
              </div> */}
              <div class="flex items-center">
                {/* <Users class="text-green-500 mr-2" /> */}
                <div>
                  <p class="text-sm text-gray-600">Entries</p>
                  <p class="font-semibold">
                    {
                      slam.value.entries.filter((entry) => Boolean(entry))
                        .length
                    }
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                {/* <Award class="text-purple-500 mr-2" /> */}
                <div>
                  <p class="text-sm text-gray-600">Created by</p>
                  <p class="font-semibold">{slam.value.createdBy?.name}</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <button
                onClick$={() => (isModalOpen.value = true)}
                class="w-full rounded-full bg-blue-500 px-6 py-2 text-white transition duration-300 hover:bg-blue-600 sm:w-auto"
              >
                Join Slam
              </button>
              <Link
                href={slam.value.asset?.link}
                target="_blank"
                rel="noopener noreferrer"
                class="flex w-full items-center justify-center text-blue-500 transition duration-300 hover:text-blue-600 sm:w-auto"
              >
                {/* <Download class="mr-2" /> */}
                Go to asset
              </Link>
            </div>
          </div>
        </div>
      </div>

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
