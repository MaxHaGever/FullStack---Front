import apiClient, {CanceledError} from "./api-client";

export { CanceledError };
export interface User {
    _id?: string;
    Username: string;
    Password: string;
    Email: string;
    avatar: string;
  }

const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register',
      user,
       { signal: abortController.signal })
    return {request, abort: () => abortController.abort()};
}

const uploadImage = (img: File) => {
  const formData = new FormData();
  if (img) {
    formData.append("file", img);
    const request = apiClient.post('/file?file=' +img.name, formData, {
        headers: {
            'Content-Type': 'image/jpeg'
        }
})
    return {request};
  }
}

export default {register, uploadImage}