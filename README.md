![Hashdocs OG](https://github.com/rbkayz/hashdocs/assets/62215539/d8e3c2d6-dc36-46b6-be79-5d7758f68dc3)

---

[Hashdocs](https://hashdocs.org) is an open source Docsend alternative. We're building a more feature-rich secure document sharing and data room platform.

Sharing sensitive documents as attachments is risky and arcane. Attachments get forwarded all the time:

- You can't see and control who has access to your documents
- You can't track how long they spend on each page
- You can't revoke access to your documents
- You can't update your documents once they're sent


## Features

- [x] Powerful link controls - _control access to your documents with custom links_
  - [x] Capture user emails and details prior to view
  - [x] Verify emails with additional-factor authentication
  - [x] Restrict emails to select domains or email addresses (e.g. ONLY for hooli.com)
  - [x] Password authentication
  - [x] Expiry settings for links
  - [x] Enable / Disable downloads

- [x] Dataroom console
  - [x] Single document uploads (PDFs)
  - [x] Version control for documents
  - [ ] Support for additional document types (PPT, Word)
  - [ ] Support for media types (images, videos)
  - [ ] Folders & Multi-document uploads

- [x] Advanced tracking and analytics - _prevent unauthorized downloads, printing or saving as images_
  - [x] Track completion % and time spent across pages for each visit
  - [x] Prevent bot / document scraper access
  - [x] Geo location, device and IP address tracking
  - [ ] Domain blacklists
  - [ ] Aggregate view analytics 
  - [ ] Detailed access logs

- [x] Secure document viewer
  - [x] Secure PDF viewer to prevent unauthorized downloads, printing or saving as images
  - [ ] Contact author, book a meeting settings
  - [ ] Custom watermarks
  - [ ] White-labelled datarooms with organization branding and logo

- [ ] Integrations
  - [ ] Email notifications for new views, unauthorized visits
  - [ ] Slack / Teams integrations for notifications
  - [ ] Slack / Teams integrations to generate links
  - [ ] Gmail plugins

- [x] Misc settings
  - [x] Login with google
  - [ ] Team management
  - [ ] Organization branding for console and data rooms
  - [ ] Self-hosting options
  
![Hashdocs Link controls](https://github.com/rbkayz/hashdocs/assets/62215539/c4dcf6dd-99d2-4002-b628-5b7391e32f7f)

## Contributing & Support

We're building Hashdocs in the open. We'd love your help in making it better. To get started, please read our [contribution guide](./CONTRIBUTING.md)

- [Roadmap](https://github.com/users/rbkayz/projects/1). View our roadmap
- [Discussions Forum](https://github.com/rbkayz/hashdocs/discussions). Request features, suggest updates, discuss roadmap
- [GitHub Issues](https://github.com/rbkayz/hashdocs/issues). Bugs and errors you may have encountered
- [Email Support](mailto:support@hashlabs.dev). Please use this for rapid support

Star this repo and watch releases to get notified of any updates

## Status

- [x] Public Beta: Open for signups at [hashdocs](https://hashdocs.org/login). Still ironing out issues
- [ ] Public: General Availability

---

### Tech stack

Hashdocs is built entirely on open source tools. We’re deeply grateful to the contributors and maintainers of these tools for their incredible work. And we hope we can pay it forward

**Architecture**

- [Supabase](https://supabase.com/) is an open-source Firebase alternative with an incredible feature-rich backend-as-a-service. We use Supabase for our database, authentication, edge functions and storage
- [NextJS](https://nextjs.org) is a React framework that provides hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. We use NextJS 13 (App router) for our frontend, hosted on [Vercel](https://vercel.com)

**Packages**

You can access a full list of packages [here](./package.json). Shoutouts to a few packages and tools:

- [Tailwind](https://tailwindcss.com/), for building the best DX for css styling
- [Framer](https://github.com/framer/motion), for their beautiful animation and gesture libraries
- [Recharts](https://recharts.org/), for building such a feature-rich charting library for React
- [Posthog](https://posthog.com) for their amazing auto-capture analytics features
- [react-pdf](https://github.com/wojtekmaj/react-pdf) for making such a simple plug-and-play pdf viewer
- [Uppy](https://uppy.io/docs/uppy/) for their simple file uploader
- [Dub.sh] (https://github.com/steven-tey/dub) To Steven and Dub, for being an inspiration on Twitter, and for building the most elegant feature preview component I've seen
