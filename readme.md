# Short URL Backend

This is a simple shortlink / shorturl project. This can shorten your long url to be very short.

This project written in javascript, built using expressjs framework and some library.

## Usage

rename .env.example to .env

set mongodb uri and port in env file

### create shortlink

#### request

```bash
Method: post
Content-Type: application/json
Url: host:port/api/shorturl
```

```json
{
    "url": "https://www.tkjpedia.com"
}
```

#### response 

```json
{
    "original_url": "https://www.tkjpedia.com",
    "short_url": "E_KXV77"
}
```

access using web browser http://host:port/E_KXV77 will be redirect to https://www.tkjpedia.com


## Docker

### build with dockerfile

clone this repository

```bash
git clone https://github.com/man20820/shorturl-backend.git
```

build docker image and run the container

```bash
docker build . -t man20820/shorturl-backend
```
run container

```bash
docker run -e MONGO_URI=[mongo_uri] -e PORT=80 -p 0.0.0.0:80:80/tcp man20820/shorturl-backend
```

or run via docker compose, rename docker-compose.yml.example to docker-compose.yml and modify MONGO_URI & PORT inside it. 

```bash
docker compose up -d
```

### download from registry

```bash
docker pull man20820/shorturl-backend
```
run container

```bash
docker run -e MONGO_URI=[mongo_uri] -e PORT=80 -p 0.0.0.0:80:80/tcp man20820/shorturl-backend
```

or run via docker compose, rename docker-compose.yml.example to docker-compose.yml and modify MONGO_URI & PORT inside it. 

```bash
docker compose up -d
```

# Test

```bash
npm install -g k6
```

```bash
k6 run shorturl.test.js
```
