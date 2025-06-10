import React, {useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';
import {Card} from '../../components/ui/Card';
import {Alert} from '../../components/ui/Alert';
import {Lock, User, LogIn, Eye, EyeOff} from 'lucide-react';

export const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones básicas
        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido');
            setLoading(false);
            return;
        }

        if (!formData.password) {
            setError('La contraseña es requerida');
            setLoading(false);
            return;
        }

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <div className="text-center">
                    <div
                        className="mx-auto h-16 w-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                        <LogIn className="h-8 w-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Bienvenido de nuevo
                    </h1>
                    <p className="text-slate-600 font-medium">
                        Inicia sesión en tu cuenta
                    </p>
                </div>


                <Card className="mt-8 bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert type="error" className="bg-red-50 border-red-200 text-red-800">
                                    {error}
                                </Alert>
                            )}

                            <div className="space-y-5">
                                <Input
                                    label="Nombre de usuario"
                                    name="username"
                                    type="text"
                                    required
                                    icon={User}
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre de usuario"
                                    className="bg-slate-50/50 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                                />

                                <div className="relative">
                                    <Input
                                        label="Contraseña"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        icon={Lock}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu contraseña"
                                        className="bg-slate-50/50 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-9 text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4"/>
                                        ) : (
                                            <Eye className="h-4 w-4"/>
                                        )}
                                    </button>
                                </div>
                            </div>


                            <Button
                                type="submit"
                                loading={loading}
                                icon={LogIn}
                                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                size="lg"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Button>
                        </form>


                        <div className="my-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"/>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">
                                        ¿No tienes cuenta?
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="text-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md"
                            >
                                Crear nueva cuenta
                            </Link>
                        </div>
                    </div>
                </Card>


            </div>
        </div>
    );
};