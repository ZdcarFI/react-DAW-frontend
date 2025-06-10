import React, {useState, useEffect} from 'react';
import {Layout} from '../../components/layout/Layout';
import {ProtectedRoute} from '../../components/auth/ProtectedRoute';
import {Button} from '../../components/ui/Button';
import {Card} from '../../components/ui/Card';
import {Table, TableRow, TableCell} from '../../components/ui/Table';
import {Pagination} from '../../components/ui/Pagination';
import {Alert} from '../../components/ui/Alert';
import {Modal} from '../../components/ui/Modal';
import {Input} from '../../components/ui/Input';
import {useAuth} from '../../context/AuthContext';
import {categoryService} from '../../services/categoryService';
import {Category, SaveCategory} from '../../types/product';
import {ShoppingBag, Plus, Edit, Trash2, Eye, CheckCircle, XCircle} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
    const {hasPermission} = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<SaveCategory>({
        name: ''
    });

    useEffect(() => {
        loadCategories();
    }, [currentPage]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getCategories(currentPage, 10);
            setCategories(response.content);
            setTotalPages(response.totalPages);
            setError('');
        } catch (error: any) {
            setError(error.message || 'Error al cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({name: ''});
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({name: category.name});
        setShowModal(true);
    };

    const handleView = (category: Category) => {
        setViewingCategory(category);
        setShowViewModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
            } else {
                await categoryService.createCategory(formData);
            }

            setShowModal(false);
            await loadCategories();
        } catch (error: any) {
            setError(error.message || 'Error al guardar la categoría');
        }
    };

    const handleDisable = async (category: Category) => {
        if (!confirm(`¿Estás seguro de que deseas deshabilitar ${category.name}?`)) return;

        try {
            await categoryService.disableCategory(category.id);
            await loadCategories();
        } catch (error: any) {
            setError(error.message || 'Error al deshabilitar la categoría');
        }
    };

    const handleEnable = async (category: Category) => {
        if (!confirm(`¿Estás seguro de que deseas habilitar ${category.name}?`)) return;

        try {
            await categoryService.enableCategory(category.id);
            await loadCategories();
        } catch (error: any) {
            setError(error.message || 'Error al habilitar la categoría');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <ProtectedRoute permission="READ_ALL_CATEGORIES">
            <Layout>
                <div className="space-y-6">
                    {/* Encabezado */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                            <p className="text-gray-600 mt-1">Gestionar categorías de productos</p>
                        </div>

                        {hasPermission('CREATE_ONE_CATEGORY') && (
                            <Button
                                onClick={handleCreate}
                                icon={Plus}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Agregar Categoría
                            </Button>
                        )}
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
                                    className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                                <span className="ml-3 text-gray-600">Cargando categorías...</span>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400"/>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
                                <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva categoría.</p>
                                {hasPermission('CREATE_ONE_CATEGORY') && (
                                    <div className="mt-6">
                                        <Button onClick={handleCreate} icon={Plus}>
                                            Agregar Categoría
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Table headers={['Nombre', 'Estado', 'Acciones']}>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </TableCell>
                                            <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${
                            category.status === 'ENABLED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {category.status === 'ENABLED' ? (
                              <CheckCircle className="w-3 h-3 mr-1"/>
                          ) : (
                              <XCircle className="w-3 h-3 mr-1"/>
                          )}
                            {category.status === 'ENABLED' ? 'HABILITADO' : 'DESHABILITADO'}
                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {hasPermission('READ_ONE_CATEGORY') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            icon={Eye}
                                                            onClick={() => handleView(category)}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        />
                                                    )}
                                                    {hasPermission('UPDATE_ONE_CATEGORY') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            icon={Edit}
                                                            onClick={() => handleEdit(category)}
                                                            className="text-yellow-600 hover:text-yellow-700"
                                                        />
                                                    )}
                                                    {hasPermission('DISABLE_ONE_CATEGORY') && category.status === 'ENABLED' && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            icon={Trash2}
                                                            onClick={() => handleDisable(category)}
                                                        />
                                                    )}
                                                    {hasPermission('ENABLE_ONE_CATEGORY') && category.status === 'DISABLED' && (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            icon={CheckCircle}
                                                            onClick={() => handleEnable(category)}
                                                        />
                                                    )}
                                                </div>
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
                        title={editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nombre de la Categoría"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingresa el nombre de la categoría"
                            />

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                                </Button>
                            </div>
                        </form>
                    </Modal>


                    <Modal
                        isOpen={showViewModal}
                        onClose={() => setShowViewModal(false)}
                        title="Detalles de la Categoría"
                        size="md"
                    >
                        {viewingCategory && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de la Categoría
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900">{viewingCategory.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ID de la Categoría
                                        </label>
                                        <p className="text-gray-900 font-mono">#{viewingCategory.id}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                            viewingCategory.status === 'ENABLED'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                      {viewingCategory.status === 'ENABLED' ? (
                          <CheckCircle className="w-4 h-4 mr-1"/>
                      ) : (
                          <XCircle className="w-4 h-4 mr-1"/>
                      )}
                                            {viewingCategory.status === 'ENABLED' ? 'HABILITADO' : 'DESHABILITADO'}
                    </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Información de la categoría
                                        </div>
                                        <div className="flex space-x-2">
                                            {hasPermission('UPDATE_ONE_CATEGORY') && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={Edit}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleEdit(viewingCategory);
                                                    }}
                                                >
                                                    Editar Categoría
                                                </Button>
                                            )}
                                            {hasPermission('DISABLE_ONE_CATEGORY') && viewingCategory.status === 'ENABLED' && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleDisable(viewingCategory);
                                                    }}
                                                >
                                                    Deshabilitar
                                                </Button>
                                            )}
                                            {hasPermission('UPDATE_ONE_CATEGORY') && viewingCategory.status === 'DISABLED' && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={CheckCircle}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleEnable(viewingCategory);
                                                    }}
                                                >
                                                    Habilitar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};