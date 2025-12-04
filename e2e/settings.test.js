describe('Settings Screen', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display all settings options', async () => {
    await element(by.id('settings-button')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();

    // Check all settings are visible
    await expect(element(by.text('Notifications'))).toBeVisible();
    await expect(element(by.text('Sound & Vibration'))).toBeVisible();
    await expect(element(by.text('Language'))).toBeVisible();
    await expect(element(by.text('About'))).toBeVisible();
  });

  it('should change language', async () => {
    await element(by.id('settings-button')).tap();
    
    // Tap language option
    await element(by.id('language-option')).tap();
    await expect(element(by.id('language-picker'))).toBeVisible();
    
    // Select Vietnamese
    await element(by.text('Tiếng Việt')).tap();
    
    // Verify language changed
    await expect(element(by.text('Cài đặt'))).toBeVisible();
    
    // Change back to English
    await element(by.id('language-option')).tap();
    await element(by.text('English')).tap();
    await expect(element(by.text('Settings'))).toBeVisible();
  });

  it('should navigate to GitHub repository', async () => {
    await element(by.id('settings-button')).tap();
    
    // This would open external browser
    // We just verify button exists
    await expect(element(by.id('github-link'))).toBeVisible();
  });
});