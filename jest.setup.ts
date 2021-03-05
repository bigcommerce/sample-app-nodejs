import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@test/utils';

afterEach(() => {
  jest.clearAllMocks();

  cleanup();
});
