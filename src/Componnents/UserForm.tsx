import { FC, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import pngegg from '../assets/pngegg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import userService from '../Services/user_service';

const UserSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    age: z.number({ invalid_type_error: 'Age is required' }).min(18, { message: 'Age must be at least 18 years old' }),
    email: z.string().email({ message: 'Invalid email' }),
});

type FormData = z.infer<typeof UserSchema>;

const UserForm: FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const inputFile: {current: HTMLInputElement | null} = useRef(null);

    const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(UserSchema),
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        const {request} = userService.uploadImage(selectedImage!);
        request.then((response) => {
            console.log(response);
        }
        );
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <form onSubmit={handleSubmit(onSubmit)}
                style={{
                    width: '75%',
                    border: '2px solid black',
                    padding: '10px',
                    margin: '10px',
                    backgroundColor: 'lightgray',
                    borderRadius: '5px'
                }}>
                <h1 style={{ textAlign: 'center' }}>Registration Form</h1>

                <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input {...register('name')} type='text' className='form-control' id='name' />
                    {errors.name && <p className='text-danger'>{errors.name.message}</p>}
                </div>

                <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>Email</label>
                    <input {...register('email')} type='text' className='form-control' id='email' />
                    {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                </div>

                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <input {...register('password')} type='password' className='form-control' id='password' />
                    {errors.password && <p className='text-danger'>{errors.password.message}</p>}
                </div>

                <div className='mb-3'>
                    <label htmlFor='age' className='form-label'>Age</label>
                    <input {...register('age', { valueAsNumber: true })} type='number' className='form-control' id='age' />
                    {errors.age && <p className='text-danger'>{errors.age.message}</p>}
                </div>

                {/* File input */}
                <input 
                    ref={(item) => {
                        inputFile.current = item;
                    }} 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    style={{ display: 'none' }} 
                    onChange={onFileSelected} 
                />

                {/* Image Preview */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '200px',
                    height: '200px',
                    margin: 'auto'
                }}>
                    <img src={selectedImage ? URL.createObjectURL(selectedImage) : pngegg} alt="placeholder" />
                </div>

                {/* Image Upload Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px'
                }}>
                    <FontAwesomeIcon icon={faImage} size='2x' onClick={() => inputFile.current?.click()} />
                </div>

                {/* Submit Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px'
                }}>
                    <button type='submit' className='btn btn-primary'>Register</button>
                </div>
            </form>
        </div>
    );
}

export default UserForm;
