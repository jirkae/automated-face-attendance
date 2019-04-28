FROM nikolaik/python-nodejs:latest
MAINTAINER Jiri Endrst <xendj00@vse>

WORKDIR /app

COPY package.json .
#COPY package-lock.json .
RUN npm install --quiet

# copy required app files
COPY .babelrc .
COPY src/ .
COPY dist/ .
COPY index.html .

# start app
CMD [ "npm", "server" ]

# expose port for Node
EXPOSE 8080
