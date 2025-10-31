export default function useLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigateTo('/login');
}