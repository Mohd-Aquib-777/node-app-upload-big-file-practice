# Node.js Load Balancing Example Application

A comprehensive example demonstrating load balancing in Node.js using multiple approaches: Docker Compose with multiple instances, Nginx reverse proxy, and Node.js Cluster module for multi-core processing.

## 🚀 Features

- **Multi-instance Load Balancing**: Multiple Node.js application instances running in Docker containers
- **Nginx Reverse Proxy**: Nginx configured as a load balancer distributing traffic across Node.js instances
- **Node.js Cluster Module**: Utilizes Node.js cluster module to leverage multiple CPU cores
- **File Upload/Download**: RESTful API endpoints for uploading and downloading files with progress tracking
- **Health Checks**: Docker health checks configured for all services
- **CORS Enabled**: Cross-origin resource sharing enabled for frontend integration

## 📁 Project Structure

```
nodejsLoadBalancingExampleApp/
├── nodeApp/
│   ├── app.js                          # Basic Express server
│   ├── nodejsClusterLoadBalancing.js   # Cluster-based load balancing implementation
│   └── fileData/                       # Directory for uploaded files
├── frontEnd/
│   └── uploadFile.html                 # Frontend UI for file operations
├── nginx/
│   └── nginx.conf                      # Nginx load balancer configuration
├── docker-compose.yaml                 # Docker Compose orchestration
├── dockerfile                          # Docker image definition
└── package.json                        # Node.js dependencies

```

## 🛠️ Technologies Used

- **Node.js** (v24-alpine)
- **Express.js** - Web framework
- **Nginx** - Load balancer and reverse proxy
- **Docker & Docker Compose** - Containerization and orchestration
- **Node.js Cluster Module** - Multi-core processing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Docker and Docker Compose installed
- Node.js (if running locally without Docker)
- Basic understanding of load balancing concepts

## 🚀 Getting Started

### Using Docker Compose (Recommended)

1. **Clone or navigate to the project directory**
   ```bash
   cd nodejsLoadBalancingExampleApp
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services**
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the application**
   ```bash
   # Basic Express server
   npm start
   
   # With cluster load balancing
   npm run cluster
   ```

## 🌐 Services & Ports

The application consists of the following services:

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| Node App 1 | `node_app_1` | 3000 | First Node.js instance |
| Node App 2 | `node_app_2` | 3001 | Second Node.js instance |
| Node App 3 | `node_app_3` | 3002 | Third Node.js instance |
| Node App 4 | `node_app_4` | 3004 | Fourth Node.js instance (with cluster) |
| Nginx LB | `nginx-load-balancer` | 80 | Load balancer entry point |

## 📡 API Endpoints

### Base URL
- **Via Nginx Load Balancer**: `http://localhost`
- **Direct Node Instance**: `http://localhost:3000`, `http://localhost:3001`, etc.

### Available Endpoints

#### 1. Health Check
```
GET /
```
Returns a simple OK response with the process ID.

**Response:**
```json
"Ok ######### ------- <process_id>"
```

#### 2. Upload File
```
POST /upload-file
Headers:
  x-filename: <filename>
Body: File stream
```
Uploads a file to the server. The file is saved with a timestamp prefix.

**Response:**
```json
{
  "message": "file uplaoded",
  "filename": "<timestamp>_<original_filename>"
}
```

#### 3. Download File
```
GET /download-file/:filename
```
Downloads a file by filename.

**Response:** File stream (application/octet-stream)

#### 4. Post Data
```
POST /post-data
Body: JSON data
```
Accepts JSON data and returns request information.

#### 5. Get Data
```
GET /get-data
```
Returns detailed request information including client, server, and connection details.

## 🔧 Configuration

### Docker Compose Services

The `docker-compose.yaml` defines:
- **4 Node.js instances** running on different ports
- **1 Nginx load balancer** distributing traffic
- **Health checks** for all services
- **Volume mounts** for hot-reloading during development

### Nginx Load Balancing

The Nginx configuration (`nginx/nginx.conf`) uses:
- **Round-robin** load balancing algorithm (default)
- **Upstream servers**: node1:3000, node2:3001, node3:3002
- **Proxy headers** for proper request forwarding
- **Health check endpoint** at `/nginx-health`

### Node.js Cluster

The `nodejsClusterLoadBalancing.js` file implements:
- **Master process** that forks worker processes
- **Worker processes** equal to CPU count minus 2
- **Automatic worker restart** on failure
- **Express server** running in each worker

## 🎯 Load Balancing Strategies

This project demonstrates three load balancing approaches:

1. **Docker Compose Multi-Instance**: Multiple separate Node.js containers
2. **Nginx Reverse Proxy**: Nginx distributing requests across instances
3. **Node.js Cluster Module**: Single process managing multiple workers

## 🧪 Testing

### Using the Frontend

1. Open `frontEnd/uploadFile.html` in a browser
2. Upload files using the upload interface
3. Download files by entering the filename

### Using cURL

**Test load balancing:**
```bash
# Multiple requests to see different process IDs
curl http://localhost/
curl http://localhost/
curl http://localhost/
```

**Upload a file:**
```bash
curl -X POST http://localhost:3004/upload-file \
  -H "x-filename: test.txt" \
  --data-binary @test.txt
```

**Download a file:**
```bash
curl http://localhost:3004/download-file/<filename> -o downloaded_file
```

## 📝 Environment Variables

Create a `docker.local.props.env` file (or use environment variables):

```env
PORT=3000
```

## 🔍 Monitoring

### Check Service Status
```bash
docker-compose ps
```

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f node1
docker-compose logs -f nginx
```

### Health Checks
```bash
# Nginx health
curl http://localhost/nginx-health

# Node instance health
curl http://localhost:3000/
```

## 🐛 Troubleshooting

### Port Already in Use
If ports are already in use, modify the port mappings in `docker-compose.yaml`.

### File Upload Issues
- Ensure the `nodeApp/fileData/` directory exists and has write permissions
- Check Docker volume mounts are configured correctly

### Nginx Not Routing
- Verify all Node.js instances are running: `docker-compose ps`
- Check Nginx logs: `docker-compose logs nginx`
- Ensure upstream servers are accessible from Nginx container

## 📚 Key Concepts Demonstrated

- **Load Balancing**: Distributing incoming requests across multiple servers
- **Reverse Proxy**: Nginx acting as an intermediary between clients and servers
- **Cluster Module**: Node.js built-in module for multi-core processing
- **Docker Orchestration**: Managing multiple containers with Docker Compose
- **Health Checks**: Monitoring service availability
- **Streaming**: File upload/download using Node.js streams

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

## 📄 License

This is an example project for educational purposes.

## 👤 Author

Created as a learning project to understand load balancing concepts in Node.js.

---

**Note**: This is a demonstration project. For production use, consider:
- Implementing proper authentication
- Adding rate limiting
- Using HTTPS/TLS
- Implementing proper error handling
- Adding logging and monitoring
- Using environment-specific configurations



