export default defineNuxtRouteMiddleware((to, from) => {
    
    //console.log('middleware', APP_ENV)
    const path = to.path.split('/');
    if (to.meta.layout !== 'noauth') {
        let redirect = false;
        const auth = localStorage.getItem('token')
        const walletAuth = localStorage.getItem('wallet-access-token');
        if (!auth && APP_ENV == '') {
            console.error('You are not logged in to app')
            return navigateTo('/login')
        }else if(!walletAuth && APP_ENV == 'wallet'){
            console.error('You are not logged in to wallet')
            return navigateTo('/login')
        }
    }

    if(['wallet'].includes(APP_ENV)){
        return;
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }


})