 # Use an image that supports both Python and Node.js
FROM nikolaik/python-nodejs:python3.8-nodejs18

# Set the working directory in the container
WORKDIR /app

RUN wget 'http://github.com/jgm/pandoc/releases/download/2.9.2.1/pandoc-2.9.2.1-1-amd64.deb'
RUN dpkg -i pandoc-2.9.2.1-1-amd64.deb

# Copy the Aptfile and install system dependencies
COPY Aptfile ./
RUN apt-get update && \
    cat Aptfile | xargs apt-get install -y && \
    apt-get clean

# Copy the Pipfile and Pipfile.lock, then install Python dependencies
COPY Pipfile Pipfile.lock ./
RUN pip install pipenv && \
    pipenv install --deploy --ignore-pipfile

# Copy the package.json and package-lock.json (or yarn.lock), then install Node.js dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy the rest of your application code
COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

# Use the command from Procfile to run your application
CMD ["sh", "-c", "$(cat Procfile | cut -d ':' -f 2-)"]