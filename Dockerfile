FROM nginx:1.11-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html

CMD set -o xtrace errexit;\
    nginx -t -c /etc/nginx/nginx.conf;\
    exec nginx -g 'daemon off;'
