import React, {useState, useEffect} from 'react';
import {Layout} from '../../components/layout/Layout';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Table, TableRow, TableCell} from '../../components/ui/Table';
import {Pagination} from '../../components/ui/Pagination';
import {Alert} from '../../components/ui/Alert';
import {Modal} from '../../components/ui/Modal';
import {useAuth} from '../../context/AuthContext';
import {permissionService} from '../../services/permissionService';
import {ShowPermission, SavePermission} from '../../types/permission';
import {Settings, Plus} from 'lucide-react';

export const PermissionsPage: React.FC = () => {
    const {isAdmin} = useAuth();
    const [permissions, setPermissions] = useState<ShowPermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<SavePermission>({
        role: '',
        operation: ''
    });

    const roles = ['ADMINISTRATOR', 'ASSISTANT_ADMINISTRATOR', 'CUSTOMER'];
    const operations = [
        'READ_ALL_PRODUCTS',
        'READ_ONE_PRODUCT',
        'CREATE_ONE_PRODUCT',
        'UPDATE_ONE_PRODUCT',
        'DISABLE_ONE_PRODUCT',
        'READ_ALL_CATEGORIES',
        'READ_ONE_CATEGORY',
        'CREATE_ONE_CATEGORY',
        'UPDATE_ONE_CATEGORY',
        'DISABLE_ONE_CATEGORY',
        'READ_MY_PROFILE'
    ];

    useEffect(() => {
        if (isAdmin()) {
            loadPermissions();
        }
    }, [currentPage, isAdmin]);

    const loadPermissions = async () => {
        try {
            setLoading(true);
            const response = await permissionService.getPermissions(currentPage, 10);
            setPermissions(response.content);
            setTotalPages(response.totalPages);
            setError('');
        } catch (error: any) {
            setError(error.message || 'No se pudieron cargar los permisos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setFormData({role: '', operation: ''});
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await permissionService.createPermission(formData);
            setShowModal(false);
            await loadPermissions();
        } catch (error: any) {
            setError(error.message || 'No se pudo crear el permiso');
        }
    };

    // const handleDelete = async (permission: ShowPermission) => {
    //     if (!confirm(`Are you sure you want to delete this permission?`)) return;
    //
    //     try {
    //         await permissionService.deletePermission(permission.id);
    //         await loadPermissions();
    //     } catch (error: any) {
    //         setError(error.message || 'No se pudo eliminar el permiso');
    //     }
    // };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isAdmin()) {
        return (
            <Layout>
                <Alert type="error">

                    Debes ser administrador para acceder a esta página.
                </Alert>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Permisos</h1>
                        <p className="text-gray-600 mt-1">Gestion de roles y permisos</p>
                    </div>

                    <Button
                        onClick={handleCreate}
                        icon={Plus}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        Agregar permiso
                    </Button>
                </div>

                {error && (
                    <Alert type="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}


                <Card>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                            <span className="ml-3 text-gray-600">Cargando permisos...</span>
                        </div>
                    ) : permissions.length === 0 ? (
                        <div className="text-center py-12">
                            <Settings className="mx-auto h-12 w-12 text-gray-400"/>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay permiso</h3>
                            <p className="mt-1 text-sm text-gray-500">Empieza creando un permiso nuevo</p>
                            <div className="mt-6">
                                <Button onClick={handleCreate} icon={Plus}>
                                    Crear permiso
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Table headers={['Operacion', 'HTTP Metodo', 'Modulo', 'Rol']}>
                                {permissions.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{permission.operation}</div>
                                        </TableCell>
                                        <TableCell>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                        {permission.httpMethod}
                      </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-gray-900">{permission.module}</div>
                                        </TableCell>
                                        <TableCell>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {permission.role}
                      </span>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </Table>

                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </Card>

                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Crear nuevos permisos"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Rol
                            </label>
                            <select
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Operacion
                            </label>
                            <select
                                name="operation"
                                required
                                value={formData.operation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Selecciona una operacion</option>
                                {operations.map((operation) => (
                                    <option key={operation} value={operation}>
                                        {operation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Crear Permiso
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};