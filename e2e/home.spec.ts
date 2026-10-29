import { test, expect } from '@playwright/test'
test.use({
  geolocation: { latitude: 34.0211, longitude: -118.3965 },
  permissions: ['geolocation'],
})
test('homepage shows the map controls', async ({page}) => {
    await page.goto('/');
    const centerButton = page.getByRole('button', {name: 'Center on my location'});
    const addButton = page.getByRole('button', {name: 'Add Bathroom'});
    await expect(centerButton).toBeVisible();
    await expect(addButton).toBeVisible();
})