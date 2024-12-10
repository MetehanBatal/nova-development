import type { Writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'promise';

export type Toast = {
  id: string;
  title: string;
  content: string | Promise<string>;
  duration?: number;
  type?: ToastType;
  progressColor?: string;
  progress?: Writable<number>;
};

export type PromiseToast = {
  id?: string;
  title: string;
  content: Promise<unknown>;
  type?: 'promise';
  progressColor?: string;
};

export type ToastStore = Writable<Toast[]>;
