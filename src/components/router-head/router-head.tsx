// TODO: Migrate from Qwik component$ to React functional component
// TODO: Replace Qwik useDocumentHead with React Helmet or similar
// TODO: Replace Qwik useLocation with TanStack Router location

// Original Qwik code (commented out for reference):
// import { component$ } from "@builder.io/qwik";
// import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

// /**
//  * The RouterHead component is placed inside of the document `<head>` element.
//  */
// export const RouterHead = component$(() => {
//   const head = useDocumentHead();
//   const loc = useLocation();

//   return (
//     <>
//       <title>{head.title}</title>

//       <link rel="canonical" href={loc.url.href} />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

//       {head.meta.map((m) => (
//         <meta key={m.key} {...m} />
//       ))}

//       {head.links.map((l) => (
//         <link key={l.key} {...l} />
//       ))}

//       {head.styles.map((s) => (
//         <style
//           key={s.key}
//           {...s.props}
//           {...(s.props?.dangerouslySetInnerHTML
//             ? {}
//             : { dangerouslySetInnerHTML: s.style })}
//         />
//       ))}

//       {head.scripts.map((s) => (
//         <script
//           key={s.key}
//           {...s.props}
//           {...(s.props?.dangerouslySetInnerHTML
//             ? {}
//             : { dangerouslySetInnerHTML: s.script })}
//         />
//       ))}
//     </>
//   );
// });

import React from 'react';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 * TODO: Implement with React Helmet or similar for TanStack Router
 */
export const RouterHead = () => {
  // TODO: Replace with TanStack Router equivalents
  // const head = useDocumentHead();
  // const loc = useLocation();

  return (
    <>
      <title>Game Slam</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      {/* TODO: Implement dynamic meta tags, links, styles, and scripts */}
    </>
  );
};