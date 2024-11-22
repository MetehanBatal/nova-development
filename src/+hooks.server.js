import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    // Initialize user details in locals object for server-side access
    event.locals.userDetails = {
        loggedIn: false
    };

    // Check for existing user session cookie and authenticate if found
    if (event.cookies.get('novaUser')) {
        // Extract email from the user cookie
        const emailAddress = JSON.parse(event.cookies.get('novaUser')).emailAddress;
        event.locals.userDetails['loggedIn'] = true;
        
        // Fetch user details from the Nova API
        const userReq = await fetch(`https://mve.novus.studio/prod/users/view?emailAddress=${emailAddress}`);
        const userRes = await userReq.json();
        event.locals.userDetails['user'] = userRes.msg;
    };

    // Redirect to login page if user is not authenticated (except for login route)
    if (!event.locals.userDetails.loggedIn && !event.route.id.includes('/login')) {
        throw redirect(303, '/login')
    }

    // Authentication check for general settings page - Admin only access
    if (event.url.pathname.includes('/settings') && event.locals.userDetails['user']['role'] !== 'Admin') {
        throw redirect(303, '/dashboard')
    }

    // Process the request and return the response
    const response = await resolve(event);
    return response;
}