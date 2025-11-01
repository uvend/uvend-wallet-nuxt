export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    // Public wallet routes
    const isLoginRoute = to.path === '/login'
    const isHandlerRoute = to.path.startsWith('/handler/')
    if (isLoginRoute || isHandlerRoute) return

    // Accept either token key to be safe
    const token = localStorage.getItem('wallet-access-token') || localStorage.getItem('token')
    if (!token) {
        return navigateTo('/login')
    }
})