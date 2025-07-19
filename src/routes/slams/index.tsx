import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getAllSlams } from "~/db/queries/slams";

export const useSlams = routeLoader$(() => {
  return getAllSlams();
});

export default component$(() => {
  const slams = useSlams();
  return (
    <div class="flex flex-col gap-8 p-8">
      <div class="flex items-end justify-between">
        <div class="prose prose-xl">
          <h1>Slams</h1>
        </div>
        <Link class="btn btn-primary" href="/slams/create">
          Create your own Slam
        </Link>
      </div>
      <div class="grid w-full gap-4 self-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {slams.value.map((slam) => (
          <Link key={slam.id} href={`/slams/show/${slam.id}`} class="h-full">
            <div class="card bg-base-300 h-full shadow-xl">
              <div class="card-body">
                <div class="card-title">{slam.name}</div>
                <p>{slam.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
