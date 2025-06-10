import React from 'react';
import {useAuth} from '../context/AuthContext';
import {Layout} from '../components/layout/Layout';
import {Card} from '../components/ui/Card';
import {Package, ShoppingBag, Settings} from 'lucide-react';
import {Link} from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const {user, hasPermission, isAdmin} = useAuth();

    const stats = [
        {
            name: 'Productos',
            icon: Package,
            color: 'bg-blue-500',
            permission: 'READ_ALL_PRODUCTS',
            link: '/products'
        },
        {
            name: 'Categorias',
            icon: ShoppingBag,
            color: 'bg-green-500',
            permission: 'READ_ALL_CATEGORIES',
            link: '/categories'
        },
        {
            name: 'Permisos',
            icon: Settings,
            color: 'bg-purple-500',
            permission: null, // Admin only
            link: '/permissions',
            adminOnly: true
        },

    ];
    const quickActions = [
        {
            title: 'Agregar Nuevo Producto',
            description: 'Crear un nuevo producto en el catálogo',
            icon: Package,
            link: '/products',
            permission: 'CREATE_ONE_PRODUCT',
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Agregar Nueva Categoría',
            description: 'Crear una nueva categoría de productos',
            icon: ShoppingBag,
            link: '/categories',
            permission: 'CREATE_ONE_CATEGORY',
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Gestionar Permisos',
            description: 'Configurar permisos de usuarios',
            icon: Settings,
            link: '/permissions',
            permission: null,
            adminOnly: true,
            color: 'text-purple-600 bg-purple-100'
        }
    ];


    return (
        <Layout>
            <div className="space-y-6">
                {/* Sección de Bienvenida */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        ¡Bienvenido de nuevo, {user?.name}!
                    </h1>
                    <p className="text-blue-100">
                        Has iniciado sesión como <span className="font-semibold">{user?.role?.name}</span>
                    </p>
                    <div className="mt-2 text-sm text-blue-200">
                        Usuario: {user?.username}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat) => {
                        const canAccess = stat.adminOnly
                            ? isAdmin()
                            : !stat.permission || hasPermission(stat.permission);

                        if (!canAccess) return null;

                        const StatIcon = stat.icon;

                        return (
                            <Link key={stat.name} to={stat.link}>
                                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="flex items-center">
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <StatIcon className="h-6 w-6 text-white"/>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {stat.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Gestionar {stat.name.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quickActions.map((action) => {
                            const canAccess = action.adminOnly
                                ? isAdmin()
                                : !action.permission || hasPermission(action.permission);

                            if (!canAccess) return null;

                            const ActionIcon = action.icon;

                            return (
                                <Link key={action.title} to={action.link}>
                                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-2 rounded-lg ${action.color}`}>
                                                <ActionIcon className="h-6 w-6"/>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Información del Rol */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tus Permisos</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Rol</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user?.role?.name}
              </span>
                        </div>

                        {user?.role?.permissions && user.role.permissions.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Operaciones Disponibles:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {user.role.permissions.map((permission) => (
                                        <span
                                            key={permission.id}
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                                        >
                      {permission.operation.name}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

            </div>
        </Layout>
    );
};