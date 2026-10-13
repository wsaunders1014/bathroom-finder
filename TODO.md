# TODO

- [ ] Update the user's location marker as they move using `navigator.geolocation.watchPosition()`. Center the map only on the initial location, and stop watching with `clearWatch()` when the component unmounts.
- [ ] Add a “Center on my location” button that moves the map to the latest known user position when clicked, allowing users to freely pan between clicks.
- [ ] Long term: look up businesses near the selected bathroom location and let the user confirm a venue or enter one manually. Keep venue identity separate from the bathroom's precise coordinates, and evaluate provider compatibility and data-storage requirements before integrating a lookup service.
