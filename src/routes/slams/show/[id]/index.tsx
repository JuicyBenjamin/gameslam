import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getSlamById } from "~/db/queries/slams";

export const useGetSlam = routeLoader$(({ params }) => {
  return getSlamById(params.id);
});

export default component$(() => {
  const slam = useGetSlam();
  return (
    <div>
      <h1>{slam.value[0].name}</h1>
      <p>{slam.value[0].description}</p>
    </div>
  );
});
