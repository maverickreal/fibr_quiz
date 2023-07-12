FROM node
WORKDIR .
COPY . .
EXPOSE 4000
ENV AUTHAPIPORT=3000 \
    QUIZAPIURL=http://quiz-api:4000 \
    USERAPIURL=http://user-api:5000/user \
    QUIZAPIPORT=4000 \
    AUTHAPIURL=http://auth-api:3000/auth \
    MONGO_URI=mongodb://mongo/quiz \
    JWTSECRETKEY=maverick
CMD npm install ; npm run start