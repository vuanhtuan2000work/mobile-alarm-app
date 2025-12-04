describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display empty state when no alarms exist', async () => {
    await expect(element(by.id('empty-state'))).toBeVisible();
    await expect(element(by.text('No alarms yet'))).toBeVisible();
    await expect(element(by.text('Tap + to create your first alarm'))).toBeVisible();
  });

  it('should navigate to add alarm screen when plus button is tapped', async () => {
    await element(by.id('add-alarm-button')).tap();
    await expect(element(by.id('add-alarm-screen'))).toBeVisible();
    await expect(element(by.text('Create Alarm'))).toBeVisible();
  });

  it('should navigate to settings screen', async () => {
    await element(by.id('settings-button')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
    await expect(element(by.text('Settings'))).toBeVisible();
    
    // Go back
    await element(by.id('back-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});