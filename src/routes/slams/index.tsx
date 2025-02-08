import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getAllSlams } from "~/db/queries/slams";

export const useSlams = routeLoader$(() => {
  return getAllSlams();
});

export default component$(() => {
  const slams = useSlams();
  return (
    <>
      <div class="flex items-end justify-between">
        <div class="prose-xl prose">
          <h1>Slams</h1>
        </div>
        <a class="btn btn-primary" href="/slams/create">
          Create your own Slam
        </a>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,_300px)]">
        {slams.value.map((slam) => (
          <Link key={slam.id} href={`/slams/show/${slam.id}`}>
            <div class="card bg-base-300 shadow-xl">
              <div class="card-body">
                <div class="card-title">{slam.name}</div>
                <p>{slam.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
});
