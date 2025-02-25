import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getSlamById } from "~/db/queries/slams";

export const useGetSlam = routeLoader$(async ({ params }) => {
  return await getSlamById(params.id);
});

export default component$(() => {
  const slam = useGetSlam();
  return (
    <div class="min-h-screen bg-base-200">
      <div class="relative h-64 bg-gray-900">
        {/* <img
          // src={slam.value.coverImage || "/placeholder.svg"}
          // alt={slam.value.name}
          // layout="fill"
          // objectFit="cover"
          class="h-full w-full object-cover opacity-50"
        /> */}
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="px-4 text-center text-4xl font-bold text-white">
            {slam.value.slam.name}
          </h1>
        </div>
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
              <button class="w-full rounded-full bg-blue-500 px-6 py-2 text-white transition duration-300 hover:bg-blue-600 sm:w-auto">
                Join Slam
              </button>
              <Link
                href={slam.value.asset?.link}
                class="flex w-full items-center justify-center text-blue-500 transition duration-300 hover:text-blue-600 sm:w-auto"
              >
                {/* <Download class="mr-2" /> */}
                Go to asset
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
