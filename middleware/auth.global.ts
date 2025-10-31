export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    // Public wallet routes
    const isLoginRoute = to.path === '/wallet/login'
    const isHandlerRoute = to.path.startsWith('/wallet/handler/')
    if (isLoginRoute || isHandlerRoute) return

    // Accept either token key to be safe
    const token = localStorage.getItem('wallet-access-token') || localStorage.getItem('token')
    if (!token) {
        return navigateTo('/wallet/login')
    }
})