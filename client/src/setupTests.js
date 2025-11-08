// Mock TextEncoder and TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ReadableStream for Node.js environment
const { ReadableStream, WritableStream, TransformStream } = require('stream/web');
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

// Mock AbortController
global.AbortController = class AbortController {
  constructor() {
    this.signal = {
      aborted: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  }
  abort() {
    this.signal.aborted = true;
  }
};

// Mock URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this.params = new Map();
    if (init) {
      if (typeof init === 'string') {
        init.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) this.params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
        });
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.params.set(key, value));
      } else if (init && typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => this.params.set(key, value));
      }
    }
  }
  get(name) { return this.params.get(name); }
  set(name, value) { this.params.set(name, value); }
  has(name) { return this.params.has(name); }
  delete(name) { this.params.delete(name); }
  toString() {
    return Array.from(this.params.entries())
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
};

// Mock browser APIs
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.URL.createObjectURL and revokeObjectURL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock clearImmediate and setImmediate
global.clearImmediate = jest.fn();
global.setImmediate = jest.fn((callback) => setTimeout(callback, 0));

// Mock matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

// Mock ResizeObserver
class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

window.IntersectionObserver = IntersectionObserver;

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
window.requestAnimationFrame = callback => setTimeout(callback, 0);

// Mock cancelAnimationFrame
window.cancelAnimationFrame = id => clearTimeout(id);

// Mock fetch
global.fetch = jest.fn();

// Mock document.createRange
const createRange = () => ({
  setStart: jest.fn(),
  setEnd: jest.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

document.createRange = createRange;

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock FileReader
class MockFileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.result = null;
  }
  readAsText() {
    this.result = 'test';
    this.onload && this.onload({ target: { result: this.result } });
  }
  readAsDataURL() {
    this.result = 'data:test';
    this.onload && this.onload({ target: { result: this.result } });
  }
}

global.FileReader = MockFileReader;

// Mock Notification API
const mockNotification = {
  requestPermission: jest.fn(),
  permission: 'default',
};

global.Notification = mockNotification;

// Mock navigator.mediaDevices
global.navigator.mediaDevices = {
  getUserMedia: jest.fn(() => Promise.resolve('stream')),
};

// Mock navigator.clipboard
global.navigator.clipboard = {
  writeText: jest.fn(),
  readText: jest.fn(),
};

// Mock navigator.geolocation
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: true,
});

// Mock document.hidden
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true,
});

// Mock document.hasFocus
document.hasFocus = jest.fn().mockReturnValue(true);

// Add custom matchers
import '@testing-library/jest-dom';

// Set test timeout
jest.setTimeout(30000);

// Configure test environment
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
});
