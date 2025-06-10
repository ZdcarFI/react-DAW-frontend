import React from 'react';
import {useAuth} from '../context/AuthContext';
import {Layout} from '../components/layout/Layout';
import {Card} from '../components/ui/Card';
import {User, Mail, Shield, Calendar} from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const {user} = useAuth();

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">Perfil del Usuario</h1>
                    <p className="text-gray-600 mt-2">Administra tu información personal y permisos</p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <Card className="p-6">

                            <div className="flex items-center space-x-4 mb-6">
                                <div
                                    className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
                                    <p className="text-sm text-gray-500">ID: #{user?.id}</p>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="space-y-5">
                                <InfoItem icon={<User className="text-blue-500"/>} label="Nombre Completo"
                                          value={user?.name}/>
                                <InfoItem icon={<Mail className="text-purple-500"/>} label="Usuario"
                                          value={user?.username}/>
                                <InfoItem icon={<Shield className="text-red-500"/>} label="Rol"
                                          value={user?.role?.name}/>
                                <InfoItem icon={<Calendar className="text-green-500"/>} label="User ID"
                                          value={`#${user?.id}`}/>
                            </div>
                        </Card>
                    </div>

                    {/* Permissions Section */}
                    <div>
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Permisos</h2>
                            {user?.role?.permissions && user.role.permissions.length > 0 ? (
                                <div className="space-y-2">
                                    {user.role.permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="px-3 py-2 bg-green-100 hover:bg-green-200 transition text-green-800 rounded-lg text-sm font-medium"
                                        >
                                            {permission.operation.name}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No tiene permisos asignados</p>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({icon, label, value}) => (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="shrink-0">{icon}</div>
        <div>
            <label className="block text-sm text-gray-600">{label}</label>
            <p className="text-gray-900 font-medium">{value || '—'}</p>
        </div>
    </div>
);
