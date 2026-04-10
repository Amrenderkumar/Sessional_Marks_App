import React, { useState } from 'react'

const Login = () => {
    const [role, setRole] = useState('Student')

    return (
        <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10'>
            <div className='w-full max-w-xl'>
                <div className='mb-10 text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-2xl text-yellow-300'>
                        <span>📘</span>
                    </div>
                    <h1 className='text-3xl font-bold text-slate-900'>BRCMportal</h1>
                    <p className='mt-2 text-sm text-slate-500'>Sessional Result Management System</p>
                </div>
                <div className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl'>
                    <div className='border-b border-yellow-400 bg-white p-8'>
                        <h2 className='text-2xl font-semibold text-center text-slate-900'>Sign In</h2>
                        <p className='mt-2 text-center text-sm text-slate-500'>Select your role to access your portal</p>
                        <div className='mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1'>
                            <button
                                type='button'
                                onClick={() => setRole('Student')}
                                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium ${role === 'Student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                            >
                                Student
                            </button>
                            <button
                                type='button'
                                onClick={() => setRole('Teacher')}
                                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-medium ${role === 'Teacher' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                            >
                                Teacher
                            </button>
                        </div>
                        <form className='mt-6 space-y-4'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-slate-700'>Username / Roll Number</label>
                                <input
                                    type='text'
                                    placeholder='Username / Roll Number'
                                    className='w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-slate-700'>Password</label>
                                <input
                                    type='password'
                                    placeholder='Password'
                                    className='w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                    <div className='border-t border-slate-200 bg-slate-50 px-8 py-4 text-center text-sm text-slate-500'>
                        For demo: Use tabs to autofill credentials
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
