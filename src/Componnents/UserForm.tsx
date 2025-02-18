import { FC } from 'react';
import {useForm} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const UserSchema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    age: z.number({invalid_type_error: 'Age is required'}).min(18, {message: 'Age must be at least 18 years old'})
});

type FormData = z.infer<typeof UserSchema>;

const UserForm:FC = () => {

    const {register,handleSubmit, formState: {errors}} = useForm<FormData>({ resolver: zodResolver(UserSchema) });
    const onSubmit = (data: FormData) => {
        console.log(data);
    } 
    return (
        <form onSubmit={handleSubmit(onSubmit)}
        style={{
            width: '70%',
            border: '2px solid black',
            padding: '10px',
            margin: '10px',
            backgroundColor: 'lightgray',
            borderRadius: '5px'
            }}>
            <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input {...register('name')} type='text' className='form-control' id='name' />
                {errors.name&& <p className='text-danger'>{errors.name.message}</p>}
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input {...register('password')} type='text' className='form-control' id='password' />
                {errors.password&& <p className='text-danger'>{errors.password.message}</p>}
            </div>
            <div className='mb-3'>
                <label htmlFor='age' className='form-label'>Age</label>
                <input {...register('age',{valueAsNumber: true})} type='number' className='form-control' id='pass' />
                {errors.age&& <p className='text-danger'>{errors.age.message}</p>}
            </div>
            <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
    );
}

export default UserForm;


