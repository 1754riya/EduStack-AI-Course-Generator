import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HiAcademicCap } from 'react-icons/hi2'
import React from 'react'

function Header() {
  return (
    <div className='flex justify-between items-center p-5 shadow-sm bg-white'>
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
          <HiAcademicCap size={17} className="text-white" />
        </div>
        <span className="font-bold text-gray-900">EduStack</span>
      </Link>
      <Button><a href="/dashboard">Get Started</a></Button>
    </div>
  )
}

export default Header
