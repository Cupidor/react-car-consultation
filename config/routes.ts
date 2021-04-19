export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './User/login/register',
          }
        ],

      },
    ],
  },
  {
    path: '/home',
    name: 'home',
    icon: 'Home',
    component: './Buyer/Buyer',
    access: 'isBuyer'
  },
  {
    path: '/cardetail/:carId',
    name: 'cardetail',
    component: './Buyer/CarDetail',
    hideInMenu: true,
    access: 'isBuyer'
  },
  {
    path: '/shoppingcart',
    name: 'shoppingcart',
    icon: 'ShoppingCart',
    component: './Buyer/ShoppingCart',
    access: 'isBuyer'
  },
  {
    path: '/history',
    name: 'history',
    icon: 'FieldTime',
    component: './Buyer/History',
    access: 'isBuyer'
  },
  {
    path: '/focus',
    name: 'focus',
    icon: 'Heart',
    component: './Buyer/Attention',
    access: 'isBuyer'
  },
  {
    path: '/order',
    name: 'order',
    icon: 'AccountBook',
    component: './Buyer/Order',
    access: 'isBuyer'
  },
  {
    path: '/shop',
    name: 'shop',
    icon: 'Shop',
    component: './Seller/Shop',
    access: 'isSeller'
  },
  {
    path: '/sellerOrder',
    name: 'sellerOrder',
    icon: 'AccountBook',
    component: './Seller/SellerOrder',
    access: 'isSeller'
  },
  {
    path: '/shopManagement',
    name: 'shopManagement',
    icon: 'Shop',
    component: './System/ShopManagement',
    access: 'isAdministrator'
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    icon: 'Team',
    component: './System/UserManagement',
    access: 'isAdministrator'
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
