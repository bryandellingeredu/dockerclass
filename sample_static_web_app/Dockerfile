FROM node:alpine

WORKDIR /app

# Install live-server globally
RUN npm install -g live-server

# Expose port for the dev server
EXPOSE 8080

# Start live-server, watching the mounted volume
CMD ["live-server", "--host=0.0.0.0", "--port=8080", "--watch=.", "--no-browser"]


