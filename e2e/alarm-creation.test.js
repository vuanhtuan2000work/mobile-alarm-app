describe('Alarm Creation Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a new alarm successfully', async () => {
    // Step 1: Navigate to Add Alarm screen
    await element(by.id('add-alarm-button')).tap();
    await expect(element(by.id('add-alarm-screen'))).toBeVisible();

    // Step 2: Set alarm time
    await element(by.id('time-picker-button')).tap();
    await expect(element(by.id('time-picker-modal'))).toBeVisible();
    
    // Set hour to 7
    await element(by.id('hour-picker')).swipe('up', 'slow', 0.5);
    await element(by.text('7')).tap();
    
    // Set minute to 30
    await element(by.id('minute-picker')).swipe('up', 'slow', 0.5);
    await element(by.text('30')).tap();
    
    // Confirm time
    await element(by.id('time-picker-confirm')).tap();
    await expect(element(by.id('time-picker-modal'))).not.toBeVisible();

    // Step 3: Set alarm label
    await element(by.id('alarm-label-input')).tap();
    await element(by.id('alarm-label-input')).typeText('Morning Alarm');
    await element(by.id('alarm-label-input')).tapReturnKey();

    // Step 4: Toggle repeat days
    await element(by.id('repeat-day-monday')).tap();
    await element(by.id('repeat-day-wednesday')).tap();
    await element(by.id('repeat-day-friday')).tap();

    // Step 5: Enable vibration
    await element(by.id('vibrate-switch')).tap();

    // Step 6: Save alarm
    await element(by.id('save-alarm-button')).tap();

    // Step 7: Verify alarm was created
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.text('Morning Alarm'))).toBeVisible();
    await expect(element(by.text('07:30'))).toBeVisible();
    await expect(element(by.id('alarm-card-0'))).toBeVisible();
  });

  it('should validate required fields', async () => {
    await element(by.id('add-alarm-button')).tap();
    
    // Try to save without setting time
    await element(by.id('save-alarm-button')).tap();
    
    // Should show error or stay on screen
    await expect(element(by.id('add-alarm-screen'))).toBeVisible();
  });

  it('should cancel alarm creation', async () => {
    await element(by.id('add-alarm-button')).tap();
    await expect(element(by.id('add-alarm-screen'))).toBeVisible();
    
    // Tap cancel button
    await element(by.id('cancel-button')).tap();
    
    // Should return to home
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});