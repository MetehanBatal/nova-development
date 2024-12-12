import { writable } from 'svelte/store';

export const user = writable({
  firstName: '',
  lastName: '',
  emailAddress: '',
  role: '',
  phone: '',
  country: '',
  thumbnail: '',
  dialCode: '',
  notifications: []
});
