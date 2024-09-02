import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname:'utfs.io',
                protocol:'https'
            }          
        ]
    }
};

export default nextConfig;
