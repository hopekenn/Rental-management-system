import React from 'react'
import Link from 'next/link'

const Button = () => {
  return (
          <div className="text-center">
          <Link 
            href="/bookings"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
          >
            Book Any Room
            <span className="text-xl">→</span>
          </Link>
          <p className="text-gray-500 mt-4">
            All applications are processed within 24-48 hours
          </p>
        </div>
  )
}

export default Button