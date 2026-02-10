'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => {
                localStorage.removeItem('user');
                router.push('/api/auth/logout');
            }}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
        >
            <LogOut size={16} className="mr-2" /> Logout
        </button>
    );
}
