import { html } from "https://deno.land/x/html@v1.2.0/mod.ts";

export const welcome: string = html`<html>
  <head>
    <style>
      body {
        color: black;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
        font-size: 14px;
        line-height: 18px;
      }
    </style>
  </head>
  <body>
    <p>Hi there,</p>

    <p>
      I&#39;m <a href="https://twitter.com/rbkayz">Bharat</a>, the co-founder
      and CTO of <a href="https://hashdocs.org">Hashdocs</a>
    </p>

    <p>
      Thank you for signing up. If you face any issues while using our platform,
      please don&#39;t hesitate to ping me here and I&#39;ll get back to you
      within 6 hrs (on the dot)
    </p>

    <p>
      We would also love to understand what are you looking for, and how can we
      solve it better for you.
    </p>

    <p>
      If you are open to a short 15 min call, we would really appreciate your
      feeback.
      <a href="https://calendar.app.google/C1LzVh3U7MhHad939"
        >Here&#39;s a link to my calendar</a
      >, in case you find it convenient
    </p>

    <p>Hope you find hashdocs useful!</p>

    <p>
      Warm regards,<br />
      Bharat<br />
      CTO, Hashdocs<br />
      <em
        >P.S. We just hit a 100 stars on
        <a href="https://github.com/hashdocs/hashdocs">Github</a> :)</em
      >
    </p>
  </body>
</html>`;
