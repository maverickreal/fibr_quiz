FROM node
WORKDIR .
COPY . .
EXPOSE 5000
ENV AUTHAPIURL=http://auth-api/3000/auth \
    USERAPIPORT=5000 \
    MONGO_URI=mongodb://mongo/users
CMD npm install ; npm run start