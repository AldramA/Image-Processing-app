export const appConfig = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '24h',
    uploadLimits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
};
