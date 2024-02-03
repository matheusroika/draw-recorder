import { ContextBridgeApi } from './types';

declare global {
  interface Window {
    api: ContextBridgeApi
  }
}