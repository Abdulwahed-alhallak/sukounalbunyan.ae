import { useState, useEffect, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, QrCode, Package, Search } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { DataTable } from '@/components/ui/data-table';
import NoRecordsFound from '@/components/no-records-found';
import JsBarcode from 'jsbarcode';

interface Warehouse {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface IndexProps {
    warehouses: Warehouse[];
}

export default function Index() {
    const { t } = useTranslation();
    const { warehouses } = usePage<IndexProps>().props;

    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const barcodeField = 'sku';
    const [productCopies, setProductCopies] = useState<{ [key: number]: number }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [barcodeDataUrls, setBarcodeDataUrls] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        if (warehouses.length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(warehouses[0].id.toString());
        }
    }, [warehouses]);

    useEffect(() => {
        if (selectedWarehouse) {
            fetch(`${route('pos.products')}?warehouse_id=${selectedWarehouse}`)
                .then((response) => response.json())
                .then((data) => {
                    setProducts(data);
                    setTimeout(() => generateBarcodes(data), 100);
                })
                .catch((error) => console.error('Error:', error));
        }
    }, [selectedWarehouse]);

    const generateBarcodes = useCallback((productList: Product[]) => {
        const newBarcodeUrls: { [key: number]: string } = {};

        productList.forEach((product) => {
            try {
                if (product.sku) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 400;
                    canvas.height = 150;
                    JsBarcode(canvas, product.sku, {
                        format: 'CODE128',
                        width: 4,
                        height: 80,
                        displayValue: false,
                        margin: 10,
                        background: '#ffffff',
                        lineColor: '#000000',
                    });
                    newBarcodeUrls[product.id] = canvas.toDataURL('image/png', 1.0);
                }
            } catch (error) {
                console.error('Barcode generation failed:', error);
            }
        });

        setBarcodeDataUrls(newBarcodeUrls);
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            generateBarcodes(products);
        }
    }, [products, generateBarcodes]);

    const handleProductSelect = (productId: number, checked: boolean) => {
        if (checked) {
            setSelectedProducts([...selectedProducts, productId]);
            setProductCopies({ ...productCopies, [productId]: 1 });
        } else {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
            const newCopies = { ...productCopies };
            delete newCopies[productId];
            setProductCopies(newCopies);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const productIds = filteredProducts?.map((p) => p.id);
            setSelectedProducts(productIds);
            const newCopies: { [key: number]: number } = {};
            productIds.forEach((id) => (newCopies[id] = 1));
            setProductCopies(newCopies);
        } else {
            setSelectedProducts([]);
            setProductCopies({});
        }
    };

    const handleDownloadBarcodes = () => {
        if (selectedProducts.length === 0) return;

        const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id));
        const params = new URLSearchParams({
            products: JSON.stringify(selectedProductsData),
            copies: JSON.stringify(productCopies),
            field: barcodeField,
        });

        const printUrl = route('pos.barcode.print', 'bulk') + '?' + params.toString() + '&download=pdf';
        window.open(printUrl, '_blank');
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (filteredProducts.length > 0) {
            generateBarcodes(filteredProducts);
        }
    }, [filteredProducts, generateBarcodes]);

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('POS'), url: route('pos.index') }, { label: t('Product Barcod') }]}
            pageTitle={t('Manage Product Barcode')}
            pageActions={null}
        >
            <Head title={t('Product Barcode')} />

            <div className="space-y-6">
                {/* Header Section */}
                <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="rounded-lg bg-muted p-2">
                                <QrCode className="h-6 w-6 text-muted-foreground" />
                            </div>
                            {t('Product Barcode Generator')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Warehouse')}
                                </Label>
                                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                                    <SelectTrigger className="border-border bg-card">
                                        <SelectValue placeholder={t('Select Warehouse')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses?.map((warehouse) => (
                                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                {warehouse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Search Products')}
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder={t('Search by name or SKU...')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-border bg-card pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                {selectedProducts.length > 0 && (
                                    <Button
                                        onClick={handleDownloadBarcodes}
                                        variant="outline"
                                        size="sm"
                                        className="border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/50"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        {t('Download PDF')} ({selectedProducts.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Section */}
                <Card>
                    <CardHeader className="border-b bg-muted/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                {t('Available Products')}
                                <Badge variant="secondary" className="ml-2">
                                    {filteredProducts.length}
                                </Badge>
                            </CardTitle>
                            {selectedProducts.length > 0 && (
                                <Badge variant="default" className="bg-foreground">
                                    {selectedProducts.length} {t('Selected')}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {selectedWarehouse ? (
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                                <div className="min-w-[800px]">
                                    {filteredProducts.length > 0 ? (
                                        <DataTable
                                            data={filteredProducts}
                                            columns={[
                                                {
                                                    key: 'select',
                                                    header: (
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedProducts.length === filteredProducts.length &&
                                                                filteredProducts.length > 0
                                                            }
                                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                                            className="rounded border-border text-foreground focus:ring-foreground"
                                                        />
                                                    ),
                                                    render: (_: any, product: Product) => (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            onChange={() =>
                                                                handleProductSelect(
                                                                    product.id,
                                                                    !selectedProducts.includes(product.id)
                                                                )
                                                            }
                                                            className="rounded border-border text-foreground focus:ring-foreground"
                                                        />
                                                    ),
                                                },
                                                {
                                                    key: 'name',
                                                    header: t('Product Name'),
                                                },
                                                {
                                                    key: 'sku',
                                                    header: t('SKU'),
                                                },
                                                {
                                                    key: 'price',
                                                    header: t('Price'),
                                                    render: (value: number) => (
                                                        <span className="font-semibold text-foreground">
                                                            {formatCurrency(value || 0)}
                                                        </span>
                                                    ),
                                                },
                                                {
                                                    key: 'barcode',
                                                    header: t('Barcode'),
                                                    render: (_: any, product: Product) =>
                                                        barcodeDataUrls[product.id] ? (
                                                            <img
                                                                src={barcodeDataUrls[product.id]}
                                                                alt="Barcode"
                                                                className="h-20 w-48 object-contain"
                                                                style={{ imageRendering: 'crisp-edges' }}
                                                            />
                                                        ) : (
                                                            <div className="flex h-16 w-32 items-center justify-center bg-muted text-xs text-muted-foreground">
                                                                {t('Generating...')}
                                                            </div>
                                                        ),
                                                },
                                                {
                                                    key: 'copies',
                                                    header: t('Copies'),
                                                    render: (_: any, product: Product) => (
                                                        <div className="flex justify-center">
                                                            {selectedProducts.includes(product.id) ? (
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    max="50"
                                                                    value={productCopies[product.id] || 1}
                                                                    onChange={(e) => {
                                                                        setProductCopies({
                                                                            ...productCopies,
                                                                            [product.id]: Number(e.target.value) || 1,
                                                                        });
                                                                    }}
                                                                    className="h-8 w-16 text-center"
                                                                />
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                            ]}
                                            className="rounded-none"
                                            emptyState={
                                                <NoRecordsFound
                                                    icon={Package}
                                                    title={t('No products found')}
                                                    description={t(
                                                        'Try adjusting your search terms or add products to this warehouse.'
                                                    )}
                                                    hasFilters={!!searchTerm}
                                                    onClearFilters={() => setSearchTerm('')}
                                                    className="h-auto py-8"
                                                />
                                            }
                                        />
                                    ) : (
                                        <NoRecordsFound
                                            icon={Package}
                                            title={searchTerm ? t('No products found') : t('No products available')}
                                            description={
                                                searchTerm
                                                    ? t('Try adjusting your search terms')
                                                    : t('Add products to this warehouse to generate barcodes')
                                            }
                                            hasFilters={!!searchTerm}
                                            onClearFilters={() => setSearchTerm('')}
                                            className="h-auto py-8"
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                    <QrCode className="h-10 w-10 text-foreground" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-foreground">{t('Select Warehouse')}</h3>
                                <p className="mx-auto max-w-md text-muted-foreground">
                                    {t(
                                        'Choose a warehouse from the dropdown above to view available products and generate barcodes'
                                    )}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
