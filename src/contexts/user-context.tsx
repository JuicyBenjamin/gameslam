import {
  component$,
  createContextId,
  useContext,
  useContextProvider,
  Slot,
  useStore,
} from "@builder.io/qwik";

export interface User {
  id: string;
  name: string;
  isVerified: boolean;
  avatarLink: string;
}

export const UserContext = createContextId<{
  user: User | null;
}>("user-context");

export const UserProvider = component$(() => {
  const store = useStore<{ user: User | null }>({ user: null });
  useContextProvider(UserContext, store);
  return <Slot />;
});

export const useUser = () => {
  const store = useContext(UserContext);
  return store.user;
};
