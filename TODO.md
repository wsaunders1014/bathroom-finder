# TODO

- [ ] Load bathrooms within the map viewport instead of fetching the entire table. Request on initial map load and `moveend`, include a small bounds margin, validate bounds in a Next Route Handler, cap results, and ignore stale responses. Account for date-line crossings; consider clustering at broad zoom levels and PostGIS indexing as data grows.

- [ ] Before enabling public contributions: add server-side submission and voting rate limits using an anonymous browser cookie and IP signals, backed by shared persistent storage. Handle shared IPs and reset cookies without treating either as reliable person identity.
- [ ] Check nearby bathroom records for possible duplicate submissions, and enforce one current vote per anonymous browser identity per access code in the database. Keep editing and deleting existing records unavailable until explicit access rules are implemented.

- [x] Update the user's location marker as they move using `navigator.geolocation.watchPosition()`. Center the map only on the initial location, and stop watching with `clearWatch()` when the component unmounts.
- [x] Add a “Center on my location” button that moves the map to the latest known user position when clicked, allowing users to freely pan between clicks.
- [ ] Long term: look up businesses near the selected bathroom location and let the user confirm a venue or enter one manually. Keep venue identity separate from the bathroom's precise coordinates, and evaluate provider compatibility and data-storage requirements before integrating a lookup service.
  - Reverse geocode the draft location and prefill the form ("Are you at Starbucks, 5th & West?"), offering a few nearby venues to pick from plus manual entry.
  - Stadia Maps (already used for tiles) has reverse geocoding that can return nearby venues. Update the privacy policy, since locations would be sent to it.
- [x] Replace the centered form dialog with a desktop side panel, remove backdrop blur, and account for the panel when positioning the map.
- [ ] Mobile bottom panel instead of the side panel on small screens (the side panel is 384px, wider than most phones).
- [ ] Let the user click or drag the draft dot to fine-tune the location before saving. The map is currently `inert` while the form is open, which also blocks dragging the dot, so lock map panning differently (e.g. disable Leaflet's drag/zoom handlers) or keep the dot's area interactive.
- [ ] Zoom in when panning to the draft dot (without zooming out if already closer), still centering it in the visible area beside the panel.
- [ ] Style the bathroom form.
- [ ] Move the Sign Out button out of the header and into the map controls (or otherwise keep it from overlapping the side panel).
