import { AppLayoutComponent } from '../layout/default/default.component';

import { HomeComponent } from './home/home.component';

export const routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'activities', loadChildren: './activities/activities.module#ActivitiesModule' },
    //{ path: 'buy', loadChildren: './buy/buy.module#BuyModule' },
    //{ path: 'center', loadChildren: './personal-center/personal-center.module#PersonalCenterModule' },
    { path: 'members', loadChildren: './personal-center/member-card/member-card.module#MemberCardModule'  },
    { path: 'personals', loadChildren: './personal-center/personal/personal.module#PersonalModule' },
    { path: 'shops', loadChildren: './personal-center/shop/shop.module#ShopModule' },
    { path: 'scans', loadChildren: './personal-center/scan/scan.module#ScanModule' },
    { path: 'nearbies', loadChildren: './buy/nearby-shop/nearby-shop.module#NearbyShopModule' },
    // Not found
    { path: '**', redirectTo: '' }
];
