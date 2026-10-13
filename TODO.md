# TODO

- [ ] Load bathrooms within the map viewport instead of fetching the entire table. Request on initial map load and `moveend`, include a small bounds margin, validate bounds in a Next Route Handler, cap results, and ignore stale responses. Account for date-line crossings; consider clustering at broad zoom levels and PostGIS indexing as data grows.

- [ ] Before enabling public contributions: add server-side submission and voting rate limits using an anonymous browser cookie and IP signals, backed by shared persistent storage. Handle shared IPs and reset cookies without treating either as reliable person identity.
- [ ] Check nearby bathroom records for possible duplicate submissions, and enforce one current vote per anonymous browser identity per access code in the database. Keep editing and deleting existing records unavailable until explicit access rules are implemented.

- [ ] Update the user's location marker as they move using `navigator.geolocation.watchPosition()`. Center the map only on the initial location, and stop watching with `clearWatch()` when the component unmounts.
- [ ] Add a “Center on my location” button that moves the map to the latest known user position when clicked, allowing users to freely pan between clicks.
- [ ] Long term: look up businesses near the selected bathroom location and let the user confirm a venue or enter one manually. Keep venue identity separate from the bathroom's precise coordinates, and evaluate provider compatibility and data-storage requirements before integrating a lookup service.
- [ ] After bathroom creation and database persistence work: replace the centered form dialog with a desktop side panel and mobile bottom panel, remove backdrop blur, and keep the selected marker visible. Zoom in on selection without zooming out if already closer, account for the panel when positioning the map, and allow location adjustment before saving.
