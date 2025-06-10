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
import {productService} from '../../services/productService';
import {categoryService} from '../../services/categoryService';
import {Product, SaveProduct, Category} from '../../types/product';
import {Package, Plus, Edit, Trash2, Eye, CheckCircle, XCircle} from 'lucide-react';

export const ProductsPage: React.FC = () => {
    const {hasPermission} = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<SaveProduct>({
        name: '',
        price: 0,
        categoryId: 0
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [currentPage]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts(currentPage, 10);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setError('');
        } catch (error: any) {
            setError(error.message || 'Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await categoryService.getCategories(0, 100);
            setCategories(response.content);
        } catch (error: any) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({name: '', price: 0, categoryId: 0});
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            categoryId: product.category.id
        });
        setShowModal(true);
    };

    const handleView = (product: Product) => {
        setViewingProduct(product);
        setShowViewModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
            } else {
                await productService.createProduct(formData);
            }

            setShowModal(false);
            await loadProducts();
        } catch (error: any) {
            setError(error.message || 'Error al guardar el producto');
        }
    };

    const handleDisable = async (product: Product) => {
        if (!confirm(`¿Estás seguro de que deseas deshabilitar ${product.name}?`)) return;

        try {
            await productService.disableProduct(product.id);
            await loadProducts();
        } catch (error: any) {
            setError(error.message || 'Error al deshabilitar el product');
        }
    };

    const handleEnable = async (product: Product) => {
        if (!confirm(`¿Estás seguro de que deseas habilitar ${product.name}?`)) return;

        try {
            await productService.enableProduct(product.id);
            await loadProducts();
        } catch (error: any) {
            setError(error.message || 'Error al habilitar el producto');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : name === 'categoryId' ? parseInt(value) || 0 : value
        }));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
    };


    return (
        <ProtectedRoute permission="READ_ALL_PRODUCTS">
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                            <p className="text-gray-600 mt-1">Gestionar el catalogo de productos</p>
                        </div>

                        {hasPermission('CREATE_ONE_PRODUCT') && (
                            <Button
                                onClick={handleCreate}
                                icon={Plus}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Agregar Producto
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
                                    className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                <span className="ml-3 text-gray-600">Cargando productos...</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="mx-auto h-12 w-12 text-gray-400"/>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                                <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo producto.</p>
                                {hasPermission('CREATE_ONE_PRODUCT') && (
                                    <div className="mt-6">
                                        <Button onClick={handleCreate} icon={Plus}>
                                            Agregar producto
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Table headers={['Nombre', 'Precio', 'Categoria', 'Status', 'Acciones']}>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    className="text-gray-900 font-semibold">{formatPrice(product.price)}</div>
                                            </TableCell>
                                            <TableCell>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                          {product.category.name}
                        </span>
                                            </TableCell>
                                            <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${
                            product.status === 'ENABLED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'ENABLED' ? (
                              <CheckCircle className="w-3 h-3 mr-1"/>
                          ) : (
                              <XCircle className="w-3 h-3 mr-1"/>
                          )}
                            {product.status === 'ENABLED' ? 'HABILITADO' : 'DESHABILITADO'}

                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {hasPermission('READ_ONE_PRODUCT') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            icon={Eye}
                                                            onClick={() => handleView(product)}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        />
                                                    )}
                                                    {hasPermission('UPDATE_ONE_PRODUCT') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            icon={Edit}
                                                            onClick={() => handleEdit(product)}
                                                            className="text-yellow-600 hover:text-yellow-700"
                                                        />
                                                    )}
                                                    {hasPermission('DISABLE_ONE_PRODUCT') && product.status === 'ENABLED' && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            icon={Trash2}
                                                            onClick={() => handleDisable(product)}
                                                        />
                                                    )}
                                                    {hasPermission('ENABLE_ONE_PRODUCT') && product.status === 'DISABLED' && (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            icon={CheckCircle}
                                                            onClick={() => handleEnable(product)}
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
                        title={editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nombre de producto"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingresa el nombre del producto"
                            />

                            <Input
                                label="Precio"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={formData.price.toString()}
                                onChange={handleChange}
                                placeholder="0.00"
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Categoria
                                </label>
                                <select
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione una categoria</option>
                                    {categories.filter(cat => cat.status === 'ENABLED').map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
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
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                                </Button>
                            </div>
                        </form>
                    </Modal>

                    <Modal
                        isOpen={showViewModal}
                        onClose={() => setShowViewModal(false)}
                        title="Detalles del producto"
                        size="lg"
                    >
                        {viewingProduct && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre del producto
                                            </label>
                                            <p className="text-lg font-semibold text-gray-900">{viewingProduct.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Precio
                                            </label>
                                            <p className="text-2xl font-bold text-green-600">{formatPrice(viewingProduct.price)}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Categoria
                                            </label>
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {viewingProduct.category.name}
                      </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Id Producto
                                            </label>
                                            <p className="text-gray-900 font-mono">#{viewingProduct.id}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estado
                                            </label>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                                viewingProduct.status === 'ENABLED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                        {viewingProduct.status === 'ENABLED' ? (
                            <CheckCircle className="w-4 h-4 mr-1"/>
                        ) : (
                            <XCircle className="w-4 h-4 mr-1"/>
                        )}
                                                {viewingProduct.status === 'ENABLED' ? 'HABILITADO' : 'DESHABILITADO'}

                      </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estado de Categoria
                                            </label>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                                viewingProduct.category.status === 'ENABLED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                        {viewingProduct.category.status === 'ENABLED' ? (
                            <CheckCircle className="w-4 h-4 mr-1"/>
                        ) : (
                            <XCircle className="w-4 h-4 mr-1"/>
                        )}

                                                {viewingProduct.category.status === 'ENABLED' ? 'HABILITADO' : 'DESHABILITADO'}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Informacion de Producto
                                        </div>
                                        <div className="flex space-x-2">
                                            {hasPermission('UPDATE_ONE_PRODUCT') && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={Edit}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleEdit(viewingProduct);
                                                    }}
                                                >
                                                    Editar Producto
                                                </Button>
                                            )}
                                            {hasPermission('DISABLE_ONE_PRODUCT') && viewingProduct.status === 'ENABLED' && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleDisable(viewingProduct);
                                                    }}
                                                >
                                                    Desabilitar
                                                </Button>
                                            )}
                                            {hasPermission('ENABLE_ONE_PRODUCT') && viewingProduct.status === 'DISABLED' && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={CheckCircle}
                                                    onClick={() => {
                                                        setShowViewModal(false);
                                                        handleEnable(viewingProduct);
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