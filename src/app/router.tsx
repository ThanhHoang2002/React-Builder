import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import NotFoundPage from '@/components/errors/NotFoundPage';
import {MainLayout} from '@/components/layout/main-layout/MainLayout';
import {paths} from '@/config/paths';
const Products = React.lazy(() => import('@/app/page/product/Products'));
const ProductDetail = React.lazy(() => import('@/app/page/product/ProductDetail'));
const Cart = React.lazy(() => import('@/app/page/cart/Cart'));
export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
                {
                    path: paths.home,
                    element: <Products />,
                },
                {
                    path: '/products/:id',
                    element: <ProductDetail />,
                },
                {
                    path: '/cart',
                    element: <Cart />,
                },                     
            ],
            errorElement: <NotFoundPage/>,
        },
    
    ])
    return <RouterProvider router={router}/>
}