export const optimizeCloudinaryUrl = (url, width) => {
    if (!url) return url;
    if (!url.includes('res.cloudinary.com')) return url;
    
    // If it already has transformations, just return it
    if (url.includes('/upload/f_auto')) return url;

    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto';
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
};
