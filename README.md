# Ansh Jetli's portfolio

React port of the original HTML, CSS and JavaScript portfolio.

## Development

Use Node 24. Run `npm ci` once after cloning, then `npm run dev`.
Keep the development server running while working. Run `npm run lint` to check the code.

## Static build

Run `npm run build`. Publish the contents of `dist`, not the source files.
Run `npm run preview` to preview that build locally.

The build creates entry files for `/projects/`, `/resume/` and the original
`projects.html` and `resume.html` URLs. All load the same React app.
This handles direct visits and refreshes on GitHub Pages without server rewrites.

## GitHub Pages

Publish manually: build here, copy `dist/` contents into the separate
`portfolio-live` checkout, then commit and push from that checkout.
In the hosting repository, select **Deploy from a branch**, `main`, `/(root)`
under **Settings > Pages**. Keep the custom domain set to `ajetli.com`.

The current root-relative asset paths target that custom domain.
Hosting under `username.github.io/repository/` would require adjusting Vite's
base, the router basename and public asset URLs.

## Code to read

- `src/App.jsx`: shared state, preference effects and routes.
- `src/ThemeControls.jsx`: menu state and a controlled color-picker form.
- `src/Dialog.jsx`: reusable native dialog with children.
- `src/EmailDialog.jsx`: clipboard feedback, refs and timer cleanup.
- `src/BackgroundEffects.jsx`: mouse listener setup and cleanup.
- `src/ProjectCard.jsx`: shared rendering with display variants.
- `src/projects.js`: canonical project content and Projects page grouping.
- `src/homeProjects.js`: Home selection, order and optional content overrides.

## Editing projects

Edit titles, links, descriptions and stacks in `src/projects.js`.
Its array order controls the Projects page order within each `section` (`main` or `other`).

In `src/homeProjects.js`, move entries to reorder Home, add an entry with a
`projectId` to feature a project, or remove an entry to hide it from Home only.
An entry's `description` and `stack` override the canonical values on Home.
Remove either override to use its canonical value instead.
Paragraphs are single strings; use editor word wrap for readability.

`HomePage` resolves these entries and passes copies to `ProjectCard`.
`ProjectsPage` passes canonical projects to the same component.

The category filter is retained from the learning project.
Page changes keep the sidebar mounted and fade in the new content.
The original analytics script is not included.
