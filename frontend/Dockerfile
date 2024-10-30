# Step 1: Build the Vite app
FROM node:23-slim AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force

# Copy other necessary files and build the app
COPY . ./
RUN npm run build



# Stage 2: Setup the Nginx Server to serve the React Application
FROM nginx:1.25.0-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]