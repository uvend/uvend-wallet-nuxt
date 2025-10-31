export default defineNuxtRouteMiddleware((to, from) => {
    
    //console.log('middleware', APP_ENV)
    const path = to.path.split('/');
    const layoutName: string | undefined = typeof to.meta.layout === 'string' ? (to.meta.layout as string) : undefined
    const isNoauthLayout = to.meta.layout === false || layoutName === 'noauth'
    if (!isNoauthLayout) {
        const { public: { APP_ENV: appEnv } } = useRuntimeConfig()
        let redirect = false;
        const auth = localStorage.getItem('token')
        const walletAuth = localStorage.getItem('wallet-access-token');
        if (!auth && appEnv == '') {
            console.error('You are not logged in to app')
            return navigateTo('/login')
        }else if(!walletAuth && appEnv == 'wallet'){
            console.error('You are not logged in to wallet')
            return navigateTo('/login')
        }
    }
    const { public: { APP_ENV: appEnv } } = useRuntimeConfig()
    if(['wallet'].includes(appEnv)){
        return;
    }

    var customer = localStorage.getItem('customer') ?? ''
    //console.log('fullPath', to.fullPath);
    if(customer != 'admin' && (to.path.startsWith('/admin') || to.fullPath == '/')){
        customer = customer?.slice(1);
        return navigateTo(`/my/${customer}/transaction`)
    }


})