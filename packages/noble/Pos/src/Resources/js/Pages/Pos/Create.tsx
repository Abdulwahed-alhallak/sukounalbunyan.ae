import { Head, router, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    ShoppingCart,
    Search,
    CreditCard,
    Plus,
    Minus,
    Trash2,
    X,
    Home,
    Printer,
    FileText,
    Image,
    Package,
    Barcode,
} from 'lucide-react';
import { getImagePath, formatCurrency, formatDate } from '@/utils/helpers';
import { useFavicon } from '@/hooks/use-favicon';
import { useFormFields } from '@/hooks/useFormFields';
import { BrandProvider } from '@/contexts/brand-context';
import ReceiptModal from './ReceiptModal';

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface WarehouseType {
    id: number;
    name: string;
    address: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
    taxes?: Array<{
        id: number;
        name: string;
        rate: number;
    }>;
}

interface CartItem extends Product {
    quantity: number;
}

interface CreateProps {
    customers: Customer[];
    warehouses: WarehouseType[];
    categories: Category[];
}

function CreateContent({ customers = [], warehouses = [], categories = [] }: CreateProps) {
    const { t } = useTranslation();
    const { adminAllSetting, companyAllSetting, auth } = usePage().props as any;
    useFavicon();

    const isSuperAdmin = auth?.user?.roles?.includes('superadmin');
    const globalSettings = isSuperAdmin ? adminAllSetting : companyAllSetting;

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState(() => {
        const saved = sessionStorage.getItem('pos_selected_warehouse');
        return saved || (warehouses.length > 0 ? warehouses[0].id.toString() : '');
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [skuInput, setSkuInput] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedWarehouse) {
            setLoading(true);
            const params = new URLSearchParams({ warehouse_id: selectedWarehouse });
            if (selectedCategory && selectedCategory !== 'all') {
                params.append('category_id', selectedCategory);
            }
            fetch(`${route('pos.products')}?${params}`)
                .then((response) => response.json())
                .then((data) => setProducts(data))
                .catch((error) => console.error('Error:', error))
                .finally(() => setLoading(false));
        }
    }, [selectedWarehouse, selectedCategory]);

    // Clear cart only when warehouse changes
    useEffect(() => {
        setCart([]);
    }, [selectedWarehouse]);

    const handleSkuInput = (value: string) => {
        setSkuInput(value);
        if (value.trim() && selectedWarehouse) {
            const matchedProduct = products.find((product) => product.sku === value);
            if (matchedProduct) {
                addToCart(matchedProduct);
                setSkuInput('');
            }
        }
    };

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev?.map((item) =>
                    item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            setCart((prev) => prev.filter((item) => item.id !== id));
        } else {
            setCart((prev) => prev?.map((item) => (item.id === id ? { ...item, quantity } : item)));
        }
    };

    const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const getTaxAmount = () => {
        let totalTax = 0;
        cart.forEach((item) => {
            const itemSubtotal = item.price * item.quantity;
            if (item.taxes && item.taxes.length > 0) {
                item.taxes.forEach((tax) => {
                    totalTax += (itemSubtotal * tax.rate) / 100;
                });
            }
        });
        return totalTax;
    };

    const getTaxBreakdown = () => {
        const taxBreakdown: { [key: string]: { name: string; amount: number } } = {};
        cart.forEach((item) => {
            const itemSubtotal = item.price * item.quantity;
            if (item.taxes && item.taxes.length > 0) {
                item.taxes.forEach((tax) => {
                    const taxAmount = (itemSubtotal * tax.rate) / 100;
                    const taxKey = `${tax.name}_${tax.rate}`;
                    if (taxBreakdown[taxKey]) {
                        taxBreakdown[taxKey].amount += taxAmount;
                    } else {
                        taxBreakdown[taxKey] = {
                            name: `${tax.name} (${tax.rate}%)`,
                            amount: taxAmount,
                        };
                    }
                });
            }
        });
        return Object.values(taxBreakdown);
    };
    const getTotal = () => getSubtotal() + getTaxAmount() - discountAmount;

    const [discountAmount, setDiscountAmount] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [completedSale, setCompletedSale] = useState<any>(null);
    const [paidAmount, setPaidAmount] = useState('0');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [nextPosNumber, setNextPosNumber] = useState('');
    const [data, setData] = useState(() => {
        const savedBankAccount = sessionStorage.getItem('pos_selected_bank_account');
        return {
            bank_account_id: savedBankAccount || '',
        };
    });
    const [errors, setErrors] = useState({});

    // Custom setData function to persist bank account selection
    const handleSetData = (key: string, value: any) => {
        if (key === 'bank_account_id') {
            sessionStorage.setItem('pos_selected_bank_account', value);
        }
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const bankAccountField = useFormFields('bankAccountField', data, handleSetData, errors);

    useEffect(() => {
        // Fetch next POS number from backend
        fetch(route('pos.pos-number'))
            .then((response) => response.json())
            .then((data) => setNextPosNumber(data.pos_number))
            .catch((error) => {
                // Fallback to generated number
                const randomCount = Math.floor(Math.random() * 100) + 1;
                setNextPosNumber('#POS' + String(randomCount).padStart(5, '0'));
            });
    }, []);

    const handlePayment = () => {
        // Get fresh POS number before processing
        fetch(route('pos.pos-number'))
            .then((response) => response.json())
            .then((data) => {
                const freshPosNumber = data.pos_number;
                setNextPosNumber(freshPosNumber);

                // Get current bank account ID from sessionStorage as backup
                const currentBankAccountId =
                    data.bank_account_id || sessionStorage.getItem('pos_selected_bank_account');

                const formData = {
                    customer_id: selectedCustomer || null,
                    warehouse_id: selectedWarehouse,
                    bank_account_id: currentBankAccountId || null,
                    items: cart?.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    discount: discountAmount,
                    tax_amount: getTaxAmount(),
                    payment_method: paymentMethod,
                    paid_amount: parseFloat(paidAmount || '0'),
                    pos_number: freshPosNumber,
                };

                setProcessing(true);

                router.post(route('pos.store'), formData, {
                    onSuccess: (response: any) => {
                        setProcessing(false);
                        setCompletedSale({
                            pos_number: response.props?.pos_number || nextPosNumber,
                            items: cart,
                            subtotal: getSubtotal(),
                            tax: getTaxAmount(),
                            discount: discountAmount,
                            total: getTotal(),
                            customer: selectedCustomer
                                ? customers.find((c) => c.id.toString() === selectedCustomer)
                                : null,
                            warehouse: warehouses.find((w) => w.id.toString() === selectedWarehouse),
                            payment_method: paymentMethod,
                            paid_amount: parseFloat(paidAmount || '0'),
                        });
                        // Close payment modal first, then show receipt
                        setShowPaymentModal(false);
                        setTimeout(() => {
                            setShowReceiptModal(true);
                        }, 100);
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        console.error('Payment failed:', errors);
                    },
                    preserveState: true,
                    preserveScroll: true,
                });
            })
            .catch((error) => {
                console.error('Error fetching fresh POS number:', error);
                setProcessing(false);
            });
    };

    const handlePaymentComplete = () => {
        setShowReceiptModal(false);
        setCart([]);
        setSelectedCustomer('');
        setDiscountAmount(0);
        setCompletedSale(null);
        // Refresh POS number for next transaction
        fetch(route('pos.pos-number'))
            .then((response) => response.json())
            .then((data) => setNextPosNumber(data.pos_number))
            .catch((error) => console.error('Error fetching new POS number:', error));
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title={t('POS')} />

            <div className="flex h-screen flex-col bg-muted/50">
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2 sm:gap-4 sm:p-4 lg:flex-row">
                    {/* Products Section Card */}
                    <Card className="order-2 flex min-w-0 flex-1 flex-col lg:order-1">
                        <CardContent className="flex h-full flex-col overflow-hidden p-3 sm:p-6">
                            {/* Controls */}
                            <div className="mb-4 flex-shrink-0 space-y-2 sm:mb-6 sm:space-y-4">
                                <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={route('pos.index')}>
                                                    <Button variant="outline" className="h-10 w-full px-3 lg:w-auto">
                                                        <Home className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('Home')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <div className="relative flex-1 lg:w-80">
                                        <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={t('Search products...')}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-10 ps-10"
                                        />
                                    </div>

                                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                                        <SelectTrigger className="h-10 w-full lg:w-80">
                                            <SelectValue placeholder={t('Walk-in Customer')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers?.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name} - {customer.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={selectedWarehouse}
                                        onValueChange={(value) => {
                                            setSelectedWarehouse(value);
                                            sessionStorage.setItem('pos_selected_warehouse', value);
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full lg:w-96">
                                            <SelectValue placeholder={t('Select Warehouse')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses?.map((warehouse) => (
                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                    {warehouse.name} - {warehouse.address}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative lg:w-72">
                                                    <Barcode className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder={t('Add To Cart by SKU')}
                                                        className="h-10 ps-10"
                                                        value={skuInput}
                                                        onChange={(e) => handleSkuInput(e.target.value)}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('Enter SKU to add product to cart.')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex max-h-24 flex-wrap gap-2 overflow-y-auto">
                                    <Button
                                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                        onClick={() => setSelectedCategory('all')}
                                    >
                                        {t('All')}
                                    </Button>
                                    {categories?.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={
                                                selectedCategory === category.id.toString() ? 'default' : 'outline'
                                            }
                                            onClick={() => setSelectedCategory(category.id.toString())}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
                                        <p className="mt-2 text-muted-foreground">{t('Loading products...')}</p>
                                    </div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                                        {filteredProducts?.map((product) => (
                                            <Card
                                                key={product.id}
                                                className="cursor-pointer hover:shadow-md"
                                                onClick={() => addToCart(product)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="mb-3 flex aspect-square items-center justify-center rounded bg-muted">
                                                        {product.image ? (
                                                            <img
                                                                src={getImagePath(product.image)}
                                                                alt={product.name}
                                                                className="h-full w-full rounded object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const parent = target.parentElement;
                                                                    if (parent) {
                                                                        parent.innerHTML =
                                                                            '<div class="flex items-center justify-center w-full h-full"><svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image className="h-8 w-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <h3 className="truncate font-medium">{product.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="font-bold text-foreground">
                                                            {formatCurrency(product.price)}
                                                        </span>
                                                        <Badge
                                                            variant={product.stock > 0 ? 'secondary' : 'destructive'}
                                                        >
                                                            {Math.floor(product.stock)}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <Package className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">{t('No products available')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cart Sidebar Card */}
                    <Card className="order-1 flex max-h-[40vh] min-h-0 w-full flex-shrink-0 flex-col lg:order-2 lg:max-h-none lg:w-80 xl:w-96">
                        <CardContent className="flex-shrink-0 border-b p-3 sm:p-4 xl:p-6">
                            {bankAccountField?.map((field) => (
                                <div key={field.id}>{field.component}</div>
                            ))}
                            <div className="mt-4 flex items-center justify-between">
                                <h3 className="flex items-center text-lg font-bold text-foreground">
                                    <ShoppingCart className="me-2 h-5 w-5 text-muted-foreground" />
                                    {t('Shopping Cart')}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">{cart.length}</Badge>
                                    {cart.length > 0 && (
                                        <X
                                            className="h-4 w-4 cursor-pointer text-destructive hover:text-destructive"
                                            onClick={() => setCart([])}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>

                        <CardContent className="min-h-0 flex-1 overflow-auto p-2 sm:p-3 xl:p-4">
                            {cart.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                        <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                                        {t('Your cart is empty')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{t('Add products to get started')}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-lg border border-border bg-muted/50 p-4 transition-shadow hover:shadow-md"
                                        >
                                            <div className="mb-3 flex items-center space-x-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-muted">
                                                    {item.image ? (
                                                        <img
                                                            src={getImagePath(item.image)}
                                                            alt={item.name}
                                                            className="h-full w-full rounded object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML =
                                                                        '<svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-semibold text-foreground">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {formatCurrency(item.price)} {t('each')}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, 0)}
                                                    className="p-2 text-destructive hover:bg-muted/50 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="h-7 w-7 border-border p-0"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="h-7 w-7 border-border p-0"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-lg font-bold text-foreground">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>

                        {cart.length > 0 && (
                            <CardContent className="flex-shrink-0 border-t p-2 sm:p-3 xl:p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-0.5">
                                        <span className="text-xs text-muted-foreground">{t('Subtotal')}</span>
                                        <span className="text-xs text-foreground">{formatCurrency(getSubtotal())}</span>
                                    </div>
                                    {getTaxBreakdown().length > 0 ? (
                                        getTaxBreakdown()?.map((tax, index) => (
                                            <div key={index} className="flex items-center justify-between py-0.5">
                                                <span className="text-xs text-muted-foreground">{tax.name}</span>
                                                <span className="text-xs text-foreground">
                                                    {formatCurrency(tax.amount)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-between py-0.5">
                                            <span className="text-xs text-muted-foreground">{t('Tax')}</span>
                                            <span className="text-xs text-foreground">
                                                {formatCurrency(getTaxAmount())}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between py-0.5">
                                        <span className="text-xs text-muted-foreground">{t('Discount')}</span>
                                        <Input
                                            type="number"
                                            value={discountAmount}
                                            onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                                            className="h-6 w-16 text-end text-xs"
                                            min="0"
                                            max={getSubtotal() + getTaxAmount()}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border py-1">
                                        <span className="text-lg font-bold text-foreground">{t('Total')}</span>
                                        <span className="text-xl font-bold text-foreground">
                                            {formatCurrency(getTotal())}
                                        </span>
                                    </div>
                                    <Button
                                        className="h-10 w-full bg-foreground text-sm font-semibold hover:bg-foreground/80"
                                        onClick={() => {
                                            setPaidAmount(getTotal().toString());
                                            setShowPaymentModal(true);
                                        }}
                                        disabled={cart.length === 0 || !selectedWarehouse}
                                    >
                                        <CreditCard className="me-2 h-4 w-4" />
                                        {t('Checkout')}
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>

            {/* Payment Modal */}
            <Dialog open={showPaymentModal} onOpenChange={(open) => !processing && setShowPaymentModal(open)}>
                <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto backdrop-blur-none sm:max-w-2xl">
                    <DialogHeader className="border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-foreground/10 p-2">
                                <CreditCard className="h-5 w-5 text-foreground" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold">{t('Process Payment')}</DialogTitle>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Header Info */}
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                            {/* Left Side - POS Details */}
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">{t('POS Number')}: </span>
                                    <span>{nextPosNumber}</span>
                                </div>
                                <div>
                                    <span className="font-medium">{t('Date')}: </span>
                                    <span>{formatDate(new Date())}</span>
                                </div>
                                <div>
                                    <span className="font-medium">{t('Customer')}: </span>
                                    <span>
                                        {selectedCustomer
                                            ? customers.find((c) => c.id.toString() === selectedCustomer)?.name
                                            : t('Walk-in Customer')}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">{t('Warehouse')}: </span>
                                    <span>{warehouses.find((w) => w.id.toString() === selectedWarehouse)?.name}</span>
                                </div>
                            </div>

                            {/* Right Side - Company Details */}
                            <div className="space-y-1 text-end text-sm">
                                <h2 className="text-lg font-bold">{globalSettings?.company_name || 'Company Name'}</h2>
                                <p>{globalSettings?.company_address || 'Company Address'}</p>
                                <p>
                                    {globalSettings?.company_city || 'City'}, {globalSettings?.company_state || 'State'}
                                </p>
                                <p>
                                    {globalSettings?.company_country || 'Country'} -{' '}
                                    {globalSettings?.company_zipcode || 'Zipcode'}
                                </p>
                            </div>
                        </div>

                        {/* Products Table */}
                        <Card className="mb-4">
                            <CardContent className="overflow-x-auto p-0">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-start text-xs font-medium uppercase text-muted-foreground">
                                                {t('Product')}
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                                                {t('Qty')}
                                            </th>
                                            <th className="px-4 py-3 text-end text-xs font-medium uppercase text-muted-foreground">
                                                {t('Price')}
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                                                {t('Taxes')}
                                            </th>
                                            <th className="px-4 py-3 text-end text-xs font-medium uppercase text-muted-foreground">
                                                {t('Tax Amount')}
                                            </th>
                                            <th className="px-4 py-3 text-end text-xs font-medium uppercase text-muted-foreground">
                                                {t('Total')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {cart?.map((item) => {
                                            const itemSubtotal = item.price * item.quantity;
                                            let itemTaxAmount = 0;
                                            let taxDisplay = '';
                                            if (item.taxes && item.taxes.length > 0) {
                                                const taxNames = item.taxes?.map((tax) => {
                                                    itemTaxAmount += (itemSubtotal * tax.rate) / 100;
                                                    return `${tax.name} (${tax.rate}%)`;
                                                });
                                                taxDisplay = taxNames.join(', ');
                                            } else {
                                                taxDisplay = 'No Tax';
                                            }
                                            return (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-end text-sm">
                                                        {formatCurrency(item.price)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm">
                                                        <div className="text-xs">{taxDisplay}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-end text-sm">
                                                        {formatCurrency(itemTaxAmount)}
                                                    </td>
                                                    <td className="px-4 py-3 text-end text-sm font-medium">
                                                        {formatCurrency(itemSubtotal + itemTaxAmount)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {/* Totals */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{t('Subtotal')}:</span>
                                        <span>{formatCurrency(getSubtotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>{t('Tax')}:</span>
                                        <span>{formatCurrency(getTaxAmount())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>{t('Discount')}:</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>{t('Total')}:</span>
                                        <span className="text-foreground">{formatCurrency(getTotal())}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button onClick={handlePayment} disabled={processing}>
                                {processing ? t('Processing...') : t('Complete Sale')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ReceiptModal
                isOpen={showReceiptModal}
                onClose={handlePaymentComplete}
                completedSale={completedSale}
                globalSettings={globalSettings}
            />
        </>
    );
}

export default function Create(props: CreateProps) {
    return (
        <BrandProvider>
            <CreateContent {...props} />
        </BrandProvider>
    );
}
