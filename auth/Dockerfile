FROM node
WORKDIR .
COPY . .
EXPOSE 3000
ENV AUTHAPIPORT=3000 \
	JWTSECRETKEY=maverick
CMD npm install ; npm run start