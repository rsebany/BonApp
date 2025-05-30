import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types/index';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
        label: undefined
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Category Chips - matches the photo style */}
                <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
                    {['All', 'Salads', 'Noodles', 'Special', 'Curry', 'Fresh'].map((category) => (
                        <Button
                            key={category}
                            variant={category === 'All' ? 'default' : 'outline'}
                            size="sm"
                            className={`rounded-full whitespace-nowrap ${
                                category === 'All' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                            }`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                
                {/* Main content area - 70/30 split */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left side - 70% width - Menu items */}
                    <div className="w-full md:w-[70%]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            {/* Menu items would go here */}
                            {[
                                { name: 'Fresh Basil Salad', price: '$1.57', available: '18 bowt + available' },
                                { name: 'Salad with Berries', price: '$2.00', available: '18 bowt + available' },
                                { name: 'Green Linguine Noodles', price: '$2.82', available: '18 bowt + available' },
                                { name: 'Curry Garlic Noodles', price: '$3.62', available: '18 bowt + available' },
                                { name: 'Summer Siltion Special', price: '$3.20', available: '18 bowt + available' },
                                { name: 'Limplang Sarwa', price: '$2.65', available: '18 bowt + available' },
                            ].map((item, index) => (
                                <div key={index} className="border p-4 rounded-lg">
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.available}</p>
                                    <p className="font-semibold mt-2">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right side - 30% width - Order summary */}
                    <div className="w-full md:w-[30%]">
                        <div className="border p-4 rounded-lg sticky top-4">
                            <h2 className="font-bold text-lg mb-4">Creams Orders #569124</h2>
                            
                            {/* Order items */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between">
                                        <span>Fresh Basil Salad x 22</span>
                                        <span>$3.14</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Mow: 5picy L-5</p>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between">
                                        <span>Curry Garlic Noodles</span>
                                        <span>$3.62</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Green Linguine Noodles x 22</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Mow: 5picy L-3</p>
                                </div>
                            </div>
                            
                            {/* Payment summary */}
                            <div className="mt-6 pt-4 border-t">
                                <div className="flex justify-between mb-2">
                                    <span>Salt: Fruit</span>
                                    <span>Tan</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Payment</span>
                                    <span>$14.44</span>
                                </div>
                                
                                {/* Place Order button */}
                                <Button className="w-full mt-4 bg-gray-800 text-white">
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}