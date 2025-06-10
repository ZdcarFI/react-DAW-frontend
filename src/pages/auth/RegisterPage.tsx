import React, {useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';
import {Card} from '../../components/ui/Card';
import {Alert} from '../../components/ui/Alert';
import {Lock, User, UserPlus, Mail, Eye, EyeOff, Check, X} from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const {register} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        repeatedPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // Validaciones en tiempo real
    const passwordValidations = {
        length: formData.password.length >= 6,

    };

    const passwordsMatch: boolean =
        !!formData.password &&
        !!formData.repeatedPassword &&
        formData.password === formData.repeatedPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre completo es requerido');
            setLoading(false);
            return;
        }

        if (formData.name.trim().length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            setLoading(false);
            return;
        }

        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido');
            setLoading(false);
            return;
        }

        if (formData.username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            setLoading(false);
            return;
        }

        if (!formData.password) {
            setError('La contraseña es requerida');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }


        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
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

    const ValidationIcon = ({isValid}: { isValid: boolean }) => (
        isValid ? (
            <Check className="h-3 w-3 text-emerald-500"/>
        ) : (
            <X className="h-3 w-3 text-slate-400"/>
        )
    );

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div
                        className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                        <UserPlus className="h-8 w-8 text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Crear cuenta
                    </h1>
                    <p className="text-slate-600 font-medium">
                        Únete hoy mismo
                    </p>
                </div>

                {/* Form Card */}
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
                                    label="Nombre completo"
                                    name="name"
                                    type="text"
                                    required
                                    icon={User}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre completo"
                                    className="bg-slate-50/50 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                                    helperText="Mínimo 2 caracteres"
                                />

                                <Input
                                    label="Nombre de usuario"
                                    name="username"
                                    type="text"
                                    required
                                    icon={Mail}
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Elige un nombre de usuario único"
                                    className="bg-slate-50/50 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
                                    helperText="Mínimo 3 caracteres, sin espacios"
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
                                        placeholder="Crea una contraseña segura"
                                        className="bg-slate-50/50 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
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

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                                        <p className="text-xs font-medium text-slate-700 mb-2">
                                            Requisitos de contraseña:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center space-x-2">
                                                <ValidationIcon isValid={passwordValidations.length}/>
                                                <span
                                                    className={passwordValidations.length ? 'text-emerald-600' : 'text-slate-500'}>
                                                    8+ caracteres
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <Input
                                        label="Confirmar contraseña"
                                        name="repeatedPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        icon={Lock}
                                        value={formData.repeatedPassword}
                                        onChange={handleChange}
                                        placeholder="Confirma tu contraseña"
                                        className={`bg-slate-50/50 border-slate-200 focus:ring-emerald-400/20 ${
                                            formData.repeatedPassword && !passwordsMatch
                                                ? 'focus:border-red-400 border-red-300'
                                                : 'focus:border-emerald-400'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-9 text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4"/>
                                        ) : (
                                            <Eye className="h-4 w-4"/>
                                        )}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {formData.repeatedPassword && (
                                    <div className="flex items-center space-x-2 text-xs">
                                        <ValidationIcon isValid={passwordsMatch}/>
                                        <span className={passwordsMatch ? 'text-emerald-600' : 'text-red-500'}>
                                            {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                                        </span>
                                    </div>
                                )}
                            </div>


                            <Button
                                type="submit"
                                loading={loading}
                                icon={UserPlus}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                size="lg"

                            >
                                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="my-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"/>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">
                                        ¿Ya tienes una cuenta?
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </Card>


            </div>
        </div>
    );
};