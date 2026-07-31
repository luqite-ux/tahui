'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-slate-900">塔汇网站管理后台</h1>
        <p className="mt-2 text-center text-sm text-slate-600">请输入管理账号登录</p>
        {params.get('reason') === 'unauthorized' && <p className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-800">请先登录后再访问管理后台</p>}
        {params.get('error') && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{params.get('error')}</p>}
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4" onSubmit={() => setPending(true)}>
          <label className="block text-sm font-medium text-slate-700">邮箱<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900" /></label>
          <label className="block text-sm font-medium text-slate-700">密码<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900" /></label>
          <button disabled={pending} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700 disabled:opacity-60">{pending ? '登录中…' : '登录'}</button>
        </form>
      </section>
    </main>
  )
}

export default function AdminLoginPage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center">加载中…</div>}><LoginForm /></Suspense>
}
