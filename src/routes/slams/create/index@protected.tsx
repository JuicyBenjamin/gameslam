import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  formAction$,
  FormError,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import { db } from "~/db";
import { artists } from "~/db/schema/artists";
import { assets } from "~/db/schema/assets";
import { slams } from "~/db/schema/slams";
import { supabaseClient } from "~/lib/supabase";
import * as v from "valibot";
import { eq, and } from "drizzle-orm";

const CreateSlamSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Name is required")),
  itchIoLink: v.pipe(
    v.string(),
    v.nonEmpty("Itch.io link is required"),
    v.url("Must be a valid URL"),
    v.custom((input) => {
      if (typeof input !== "string") return false;
      return input.includes("itch.io");
    }, "Must be an itch.io URL"),
  ),
  description: v.pipe(v.string(), v.nonEmpty("Description is required")),
});

type TCreateSlamForm = v.InferInput<typeof CreateSlamSchema>;

export const useFormLoader = routeLoader$<InitialValues<TCreateSlamForm>>(
  () => ({
    name: "",
    itchIoLink: "",
    description: "",
  }),
);

async function getItchIoData(url: string) {
  try {
    // Convert the URL to the data.json endpoint
    const jsonUrl = url.replace(/\/?$/, "/data.json");
    const response = await fetch(jsonUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch itch.io data");
    }

    const data = await response.json();

    if (!data.title || !data.authors?.[0]?.name) {
      throw new Error(
        "Could not extract required information from itch.io data",
      );
    }

    return {
      assetName: data.title,
      artistName: data.authors[0].name,
      assetLink: url,
      artistLink: data.authors[0].url,
    };
  } catch (error) {
    console.error("Error fetching itch.io data:", error);
    throw new Error("Failed to fetch itch.io data");
  }
}

export const useFormAction = formAction$<TCreateSlamForm>(
  async (values, requestEvent) => {
    const supabase = supabaseClient(requestEvent);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      throw new FormError<TCreateSlamForm>(
        "You must be logged in to create a slam",
      );
    }

    try {
      // Fetch itch.io data
      const itchData = await getItchIoData(values.itchIoLink);

      // Check if artist exists
      let artistId: string;
      const existingArtist = await db
        .select()
        .from(artists)
        .where(eq(artists.name, itchData.artistName))
        .limit(1);

      if (existingArtist.length > 0) {
        artistId = existingArtist[0].id;
      } else {
        // Create new artist
        const [newArtist] = await db
          .insert(artists)
          .values({
            name: itchData.artistName,
            link: itchData.artistLink,
          })
          .returning();
        artistId = newArtist.id;
      }

      // Check if asset exists
      let assetId: string;
      const existingAsset = await db
        .select()
        .from(assets)
        .where(
          and(
            eq(assets.name, itchData.assetName),
            eq(assets.link, itchData.assetLink),
          ),
        )
        .limit(1);

      if (existingAsset.length > 0) {
        assetId = existingAsset[0].id;
      } else {
        // Create new asset
        const [newAsset] = await db
          .insert(assets)
          .values({
            name: itchData.assetName,
            link: itchData.assetLink,
          })
          .returning();
        assetId = newAsset.id;
      }

      // Create the slam
      await db.insert(slams).values({
        name: values.name,
        artistId,
        assetId,
        description: values.description,
        createdBy: user.id,
      });

      throw requestEvent.redirect(302, "/slams");
    } catch (error) {
      console.error("Error creating slam:", error);
      throw new FormError<TCreateSlamForm>(
        error instanceof Error
          ? error.message
          : "Failed to create slam. Please try again.",
      );
    }
  },
  valiForm$(CreateSlamSchema),
);

export default component$(() => {
  const [form, { Form, Field }] = useForm<TCreateSlamForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(CreateSlamSchema),
  });

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="mb-8 text-3xl font-bold">Create a Slam</h1>

      {form.response.message && (
        <div class="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {form.response.message}
        </div>
      )}

      <Form class="max-w-2xl space-y-6">
        <div class="form-control">
          <Field name="name">
            {(field, props) => (
              <>
                <label class="label" for="name">
                  <span class="label-text">Slam Name</span>
                </label>
                <input
                  {...props}
                  type="text"
                  id="name"
                  required
                  class="input input-bordered w-full"
                  placeholder="Enter slam name"
                />
                {field.error && (
                  <div class="mt-1 text-sm text-red-600">{field.error}</div>
                )}
              </>
            )}
          </Field>
        </div>

        <div class="form-control">
          <Field name="itchIoLink">
            {(field, props) => (
              <>
                <label class="label" for="itchIoLink">
                  <span class="label-text">Itch.io Asset Pack Link</span>
                </label>
                <input
                  {...props}
                  type="url"
                  id="itchIoLink"
                  required
                  class="input input-bordered w-full"
                  placeholder="https://example.itch.io/asset-pack"
                />
                <label class="label">
                  <span class="label-text-alt">
                    Paste the URL of the itch.io asset pack you want to use
                  </span>
                </label>
                {field.error && (
                  <div class="mt-1 text-sm text-red-600">{field.error}</div>
                )}
              </>
            )}
          </Field>
        </div>

        <div class="form-control">
          <Field name="description">
            {(field, props) => (
              <>
                <label class="label" for="description">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  {...props}
                  id="description"
                  required
                  class="textarea textarea-bordered h-24 w-full"
                  placeholder="Enter slam description"
                />
                {field.error && (
                  <div class="mt-1 text-sm text-red-600">{field.error}</div>
                )}
              </>
            )}
          </Field>
        </div>

        <div class="form-control">
          <button type="submit" class="btn btn-primary">
            Create Slam
          </button>
        </div>
      </Form>
    </div>
  );
});
