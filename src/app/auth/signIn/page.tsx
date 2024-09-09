'use client'
import { Login } from '@/types/Login';
import { signIn } from '@/utils/auth';
import { ChangeEvent, FC, useState } from 'react';

const LoginProps: FC<Login> = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  })

  const handlerChange = (e : ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setInput((prev) => ({...prev, [name]: value}))
  }

  // const [isSucceed, setIsSucceed] = useState(false);

  const handleSignIn = async () => {
    const result = await signIn({ email: input.email, password: input.password });
    // setIsSucceed(result);
  }

  return (
    <div>
      {/* {isSucceed && <h1 className='text-sn text-red-500'>Error</h1>} */}
      <input placeholder="email" type="text" name="email" value={input.email} onChange={handlerChange} />
      <input placeholder="password" type="password" name="password" value={input.password} onChange={handlerChange} />
      <button type="button" onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default LoginProps;