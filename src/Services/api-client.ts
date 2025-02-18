import axios, { CanceledError } from 'axios';

export { CanceledError };
const apiClient = axios.create({
  baseURL: 'http://localhost:3004',
});

export default apiClient;