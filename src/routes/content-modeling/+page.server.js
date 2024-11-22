// import { SECRET_PROD_API_ENDPOINT } from '$env/static/private';

export async function load({ fetch }) {
    const [pagesRes, componentsRes, stylesRes] = await Promise.all([
        fetch(`https://preconvert.novus.studio/staging/pages/view?limit=100&offset=0`).then(res => res.json()),
        fetch(`https://preconvert.novus.studio/staging/components/view?limit=100&offset=0`).then(res => res.json()),
        fetch(`https://preconvert.novus.studio/staging/style/view?limit=100&offset=0`).then(res => res.json())
    ]);

    return { pagesRes, componentsRes, stylesRes };
}
