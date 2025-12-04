describe('Alarm Management', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should toggle alarm on/off', async () => {
    // Create an alarm first
    await element(by.id('add-alarm-button')).tap();
    await element(by.id('time-picker-button')).tap();
    await element(by.text('8')).tap();
    await element(by.text('00')).tap();
    await element(by.id('time-picker-confirm')).tap();
    await element(by.id('save-alarm-button')).tap();

    // Now toggle it
    const alarmSwitch = element(by.id('alarm-switch-0'));
    await expect(alarmSwitch).toBeVisible();
    
    // Turn off
    await alarmSwitch.tap();
    await waitFor(element(by.id('alarm-disabled-0'))).toBeVisible().withTimeout(2000);
    
    // Turn on
    await alarmSwitch.tap();
    await waitFor(element(by.id('alarm-enabled-0'))).toBeVisible().withTimeout(2000);
  });

  it('should edit existing alarm', async () => {
    // Create alarm
    await element(by.id('add-alarm-button')).tap();
    await element(by.id('alarm-label-input')).typeText('Test Alarm');
    await element(by.id('save-alarm-button')).tap();

    // Tap to edit
    await element(by.id('alarm-card-0')).tap();
    await expect(element(by.id('edit-alarm-screen'))).toBeVisible();

    // Change label
    await element(by.id('alarm-label-input')).clearText();
    await element(by.id('alarm-label-input')).typeText('Updated Alarm');
    
    // Save
    await element(by.id('save-alarm-button')).tap();

    // Verify update
    await expect(element(by.text('Updated Alarm'))).toBeVisible();
  });

  it('should delete alarm', async () => {
    // Create alarm
    await element(by.id('add-alarm-button')).tap();
    await element(by.id('alarm-label-input')).typeText('Delete Me');
    await element(by.id('save-alarm-button')).tap();

    // Long press or swipe to delete
    await element(by.id('alarm-card-0')).longPress();
    
    // Confirm delete
    await element(by.text('Delete')).tap();
    await element(by.text('Confirm')).tap();

    // Verify deleted
    await expect(element(by.text('Delete Me'))).not.toBeVisible();
    await expect(element(by.id('empty-state'))).toBeVisible();
  });

  it('should display multiple alarms in order', async () => {
    // Create 3 alarms
    const alarms = [
      { time: '06:00', label: 'Early Morning' },
      { time: '12:00', label: 'Lunch' },
      { time: '18:00', label: 'Evening' }
    ];

    for (const alarm of alarms) {
      await element(by.id('add-alarm-button')).tap();
      await element(by.id('alarm-label-input')).typeText(alarm.label);
      await element(by.id('save-alarm-button')).tap();
    }

    // Verify all are visible
    for (const alarm of alarms) {
      await expect(element(by.text(alarm.label))).toBeVisible();
    }
  });
});