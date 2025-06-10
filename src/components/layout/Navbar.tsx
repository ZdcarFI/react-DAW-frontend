import React, {useState} from 'react';
import {useAuth} from '../../context/AuthContext';

import {
    LogOut,
    User,
    Menu,
    X,
    ShoppingBag,
    Package,
    Settings,
    Home,
    ChevronDown,

} from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';

export const Navbar: React.FC = () => {
    const {user, logout, hasPermission} = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    const navigation = [
        {name: 'Dashboard', href: '/dashboard', icon: Home, show: true},
        {
            name: 'Productos',
            href: '/products',
            icon: Package,
            show: hasPermission('READ_ALL_PRODUCTS')
        },
        {
            name: 'Categorías',
            href: '/categories',
            icon: ShoppingBag,
            show: hasPermission('READ_ALL_CATEGORIES')
        },
        {
            name: 'Permisos',
            href: '/permissions',
            icon: Settings,
            show: user?.role?.name === 'ADMINISTRATOR' // Only admin can see permissions
        },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    const getRoleColor = (roleName: string) => {
        switch (roleName) {
            case 'ADMINISTRATOR':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'MANAGER':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'USER':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getRoleLabel = (roleName: string) => {
        switch (roleName) {
            case 'ADMINISTRATOR':
                return 'Administrador';
            case 'MANAGER':
                return 'Gerente';
            case 'USER':
                return 'Usuario';
            default:
                return roleName;
        }
    };

    return (
        <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/dashboard" className="flex items-center space-x-2 group">
                                <div
                                    className="h-8 w-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center group-hover:from-slate-700 group-hover:to-slate-900 transition-all duration-200">
                                    <Home className="h-4 w-4 text-white"/>
                                </div>
                                <span
                                    className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                 Panel
                </span>
                            </Link>
                        </div>


                        <div className="hidden md:ml-8 md:flex md:space-x-1">
                            {navigation.map((item) =>
                                    item.show && (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 ${
                                                isActive(item.href)
                                                    ? 'bg-slate-100 text-slate-800 shadow-sm'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                            }`}
                                        >
                                            <item.icon className="w-4 h-4"/>
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">


                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-800">
                                    Bienvenido, {user?.name}
                                </p>

                            </div>

                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user?.role?.name || '')}`}>
                {getRoleLabel(user?.role?.name || '')}
              </span>

                            {/* User dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                                >
                                    <div
                                        className="h-8 w-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white"/>
                                    </div>
                                    <ChevronDown className="w-4 h-4"/>
                                </button>

                                {/* Dropdown menu */}
                                {userMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4"/>
                                            <span>Mi perfil</span>
                                        </Link>

                                        <hr className="my-1 border-slate-200"/>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4"/>
                                            <span>Cerrar sesión</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5"/>
                                ) : (
                                    <Menu className="w-5 h-5"/>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-slate-200/60">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navigation.map((item) =>
                                item.show && (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                                            isActive(item.href)
                                                ? 'bg-slate-100 text-slate-800 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5"/>
                                        <span>{item.name}</span>
                                    </Link>
                                )
                        )}

                        {/* Mobile User Section */}
                        <div className="border-t border-slate-200 pt-4 pb-3 mt-4">
                            <div className="px-4 space-y-4">
                                {/* User Info */}
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="h-10 w-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-white"/>
                                    </div>
                                    <div>
                                        <p className="text-base font-medium text-slate-800">{user?.name}</p>
                                        <p className="text-sm text-slate-500">@{user?.username}</p>
                                    </div>
                                </div>


                                <div className="flex justify-start">
                  <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user?.role?.name || '')}`}>
                    {getRoleLabel(user?.role?.name || '')}
                  </span>
                                </div>

                                {/* Mobile Actions */}
                                <div className="space-y-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5"/>
                                        <span>Mi perfil</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5"/>
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};