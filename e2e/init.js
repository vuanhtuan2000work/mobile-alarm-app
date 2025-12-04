const detox = require('detox');
const config = require('../.detoxrc');
const adapter = require('detox/runners/jest/adapter');

jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config, { launchApp: false });
  await device.launchApp({
    permissions: {
      notifications: 'YES',
      calendar: 'YES'
    },
    delete: true // Clear app data
  });
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});