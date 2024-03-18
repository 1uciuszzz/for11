import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({ Component: (await import("./layout")).default }),
    children: [
      {
        path: "/",
        lazy: async () => ({
          Component: (await import("./pages/home/layout")).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("./pages/home/index")).default,
            }),
          },
        ],
      },
      {
        path: "auth",
        lazy: async () => ({
          Component: (await import("./pages/auth/layout")).default,
        }),
        children: [
          {
            path: "signup",
            lazy: async () => ({
              Component: (await import("./pages/auth/signup")).default,
            }),
          },
          {
            path: "signin",
            lazy: async () => ({
              Component: (await import("./pages/auth/signin")).default,
            }),
          },
        ],
      },
      {
        path: "profile",
        lazy: async () => ({
          Component: (await import("./pages/profile/layout")).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("./pages/profile/index")).default,
            }),
          },
          {
            path: "settleAccounts",
            lazy: async () => ({
              Component: (await import("./pages/profile/settleAccounts"))
                .default,
            }),
          },
          {
            path: "periodRecord",
            lazy: async () => ({
              Component: (await import("./pages/profile/periodRecord")).default,
            }),
          },
          {
            path: "bucketList",
            lazy: async () => ({
              Component: (await import("./pages/profile/bucketList")).default,
            }),
          },
          {
            path: "shoppingCart",
            lazy: async () => ({
              Component: (await import("./pages/profile/shoppingCart")).default,
            }),
          },
        ],
      },
      {
        path: "about",
        lazy: async () => ({
          Component: (await import("./pages/about/layout")).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("./pages/about/index")).default,
            }),
          },
        ],
      },
    ],
  },
]);
