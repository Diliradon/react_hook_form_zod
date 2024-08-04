/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import { FieldValues, useForm } from 'react-hook-form';
import { LoginInput } from './components/LoginInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { twMerge } from 'tailwind-merge';

const invalid_type_error = 'Invalid type provided for this field';
const required_error = 'This field cannot be blank';

const signUpSchema = z
  .object({
    username: z
      .string({ invalid_type_error, required_error })
      .min(1, 'Value is too short'),
    email: z
      .string({ invalid_type_error, required_error })
      .email('Please provide a valid email')
      .min(1, 'Value is too short'),
    githubUrl: z
      .string()
      .url()
      .includes('github.com', { message: 'Invalid GitHub URL' }),
    password: z
      .string()
      .min(8, { message: 'Password is too short' })
      .max(20, { message: 'Password is too long' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: FieldValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(data);

    reset();
  };

  return (
    <main className="m-16 flex justify-center">
      <div
        className={`
          flex max-w-3xl flex-1 flex-col
          justify-center border-2 bg-slate-300 p-4`}
      >
        <h1>React Hook Form with Zod</h1>

        <form
          className="m-2 flex flex-col gap-4 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <LoginInput
            title="Username"
            type="text"
            errorMessage={errors.username?.message || ''}
            {...register('username')}
          />

          <LoginInput
            title="Email"
            type="email"
            errorMessage={errors.email?.message || ''}
            {...register('email')}
          />

          <LoginInput
            title="githubUrl"
            type="text"
            errorMessage={errors.githubUrl?.message || ''}
            {...register('githubUrl')}
          />

          <LoginInput
            title="password"
            type="password"
            errorMessage={errors.password?.message || ''}
            {...register('password')}
          />

          <LoginInput
            title="confirmPassword"
            type="confirmPassword"
            errorMessage={errors.confirmPassword?.message || ''}
            {...register('confirmPassword')}
          />

          <button
            type="submit"
            className={twMerge(
              `
            mb-2 me-2 flex-1 rounded-full bg-yellow-400 px-5 py-2.5 text-center
            text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none
            focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900`,
              isSubmitting && 'disabled:bg-slate-500',
            )}
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};
