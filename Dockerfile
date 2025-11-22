# Dockerfile

# === Stage 1: Build Stage (Optional for a purely static site, but safe to include) ===
# Use a minimal base image just to ensure all files are in place.
FROM alpine AS builder

# Copy your static files from the host into the builder image
WORKDIR /app
COPY public/ .


# === Stage 2: Final Nginx Web Server Stage ===
# Use the official Nginx lightweight image as the final base
FROM nginx:alpine

# 1. Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copy the static files from the builder stage into Nginx's default web root
COPY --from=builder /app /usr/share/nginx/html

# The Nginx image is configured to run the Nginx server on start
CMD ["nginx", "-g", "daemon off;"]